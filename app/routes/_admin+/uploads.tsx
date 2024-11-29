import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { createId } from '@paralleldrive/cuid2';

import React, { useState } from "react";

interface UploadResponse {
  success?: boolean;
  error?: string;
  key?: string;
  details?: any;
}
interface FileObject {
  key: string;
  size: number;
  uploaded: string;
  httpMetadata: {
    contentType: string;
  };
}

interface LoaderData {
  files: FileObject[];
  error?: string;
}

export async function loader({ context }: LoaderFunctionArgs) {
  try {
    const objects: R2Objects = await context.cloudflare.env.QYAM_BUCKET.list();

    return {
      files: objects.objects.map((obj) => ({
        key: obj.key,
        size: obj.size,
        uploaded: obj.uploaded,
        httpMetadata: obj.httpMetadata,
      })),
    };
  } catch (error) {
    console.error("Loader error:", error);
    return { error: "Failed to load files", files: [] };
  }
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  console.log("formdata: ", formData);

  try {
    const file = formData.get("file");
    // Debug log - check file
    console.log("File received:", {
      type: file?.constructor.name,
      name: file instanceof File ? file.name : "not a file",
      size: file instanceof File ? file.size : "unknown",
    });

    if (!file || !(file instanceof File)) {
      return { error: "Please select a valid file", status: 400 };
    }
    //replace spaces

    const key = `${Date.now()}-${createId()}.${file.name.split(".")[1]}`;
    const buffer = await file.arrayBuffer();

    const uploadResult = await context.cloudflare.env.QYAM_BUCKET.put(
      key,
      buffer,
      {
        httpMetadata: {
          contentType: file.type,
        },
      }
    );

    // Debug log - check upload result
    console.log("Upload result:", uploadResult);

    // Verify the upload
    const checkUpload = await context.cloudflare.env.QYAM_BUCKET.head(key);
    console.log("Verification check:", checkUpload);

    return {
      success: true,
      key,
      details: {
        uploadResult,
        verification: checkUpload,
      },
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      error: "Failed to upload file",
      details: error instanceof Error ? error.message : String(error),
      status: 500,
    };
  }
}

const Uploads = () => {
  const actionData = useActionData<UploadResponse>();
  const { files, error } = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const isUploading =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "upload";
  const isDownloading =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "download";

  const handleUpload = () => {
    const formData = new FormData();
    formData.set("intent", "upload");
    formData.set("file", selectedFile);
    submit(formData, { method: "post" });
  };

  return (
    <section dir="ltr" className="pt-48 min-h-screen">
      <h1>Control Panel</h1>

      <div className="border border-red-400 p-12">
        <h3>File Uploads</h3>
        <Form method="post" encType="multipart/form-data">
          <div className="space-y-4">
            <input
              type="file"
              name="file"
              className="block w-full"
              onChange={(e: any) => {
                setSelectedFile(e.target.files[0]);
              }}
              disabled={isUploading}
            />

            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
            >
              {isUploading ? "Uploading..." : "Upload File"}
            </button>
          </div>

          {actionData?.error && (
            <div className="mt-4 text-red-500">
              <p>{actionData.error}</p>
              {actionData.details && (
                <p className="text-sm mt-1">Details: {actionData.details}</p>
              )}
            </div>
          )}

          {actionData?.success && (
            <div className="mt-4 text-green-500">
              <p>File uploaded successfully!</p>
              {actionData.key && (
                <p className="text-sm text-gray-600">
                  File key: {actionData.key}
                </p>
              )}
              {/* {actionData.details && (
                <pre className="text-xs mt-2 text-gray-500">
                  {JSON.stringify(actionData.details, null, 2)}
                </pre>
              )} */}
            </div>
          )}
        </Form>
      </div>

      <div className="border border-blue-400 p-12">
        <h3>File Downloads</h3>
        <ul>
          {files.map((file, i) => (
            <li key={i} className="p-5 border rounded-lg flex justify-between">
              <p>{file.key}</p>
              <button className="button p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
                <Link
                  to={`/download/${file.key}`}
                  reloadDocument
                  download={file.key}
                >
                  Download
                </Link>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Uploads;
