import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/cloudflare";
import React from "react";

interface UploadResponse {
  success?: boolean;
  error?: string;
  key?: string;
  details?: any;
}

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const file = formData.get("my-file");

    // Debug log - check file
    console.log("File received:", {
      type: file?.constructor.name,
      name: file instanceof File ? file.name : 'not a file',
      size: file instanceof File ? file.size : 'unknown'
    });

    // Debug log - check context
    console.log("Context structure:", {
      hasCloudflare: !!context.cloudflare,
      hasEnv: !!context.cloudflare?.env,
      hasBucket: !!context.cloudflare?.env?.QYAM_BUCKET,
      bucketMethods: context.cloudflare?.env?.QYAM_BUCKET ? Object.keys(context.cloudflare.env.QYAM_BUCKET) : []
    });

    if (!file || !(file instanceof File)) {
      return json<UploadResponse>(
        { error: "Please select a valid file" },
        { status: 400 }
      );
    }

    const key = `${Date.now()}-${file.name}`;
    const buffer = await file.arrayBuffer();

    // Debug log - check buffer
    console.log("Buffer created:", {
      byteLength: buffer.byteLength,
      key: key
    });

    // Upload to R2 with explicit error handling
    try {
      const uploadResult = await context.cloudflare.env.QYAM_BUCKET.put(key, buffer, {
        httpMetadata: {
          contentType: file.type,
        },
      });

      // Debug log - check upload result
      console.log("Upload result:", uploadResult);

      // Verify the upload
      const checkUpload = await context.cloudflare.env.QYAM_BUCKET.head(key);
      console.log("Verification check:", checkUpload);

      return json<UploadResponse>({ 
        success: true, 
        key,
        details: {
          uploadResult,
          verification: checkUpload
        }
      });
    } catch (uploadError) {
      console.error("Specific upload error:", uploadError);
      throw uploadError; // Re-throw to be caught by outer try-catch
    }

  } catch (error) {
    console.error("Upload error:", error);
    return json<UploadResponse>(
      { 
        error: "Failed to upload file", 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

const ControlPanel = () => {
  const actionData = useActionData<UploadResponse>();
  const navigation = useNavigation();
  const isUploading = navigation.state === "submitting";

  return (
    <section dir="ltr" className="pt-48 h-screen">
      <h1>Control Panel</h1>

      <div className="border border-red-400 p-12">
        <h3>File Uploads</h3>
        <Form method="post" encType="multipart/form-data">
          <div className="space-y-4">
            <input 
              type="file" 
              name="my-file"
              className="block w-full"
              disabled={isUploading}
            />
            
            <button 
              type="submit"
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
              {actionData.details && (
                <pre className="text-xs mt-2 text-gray-500">
                  {JSON.stringify(actionData.details, null, 2)}
                </pre>
              )}
            </div>
          )}
        </Form>
      </div>

      <div className="border border-blue-400 p-12">
        <h3>File Downloads</h3>
      </div>
    </section>
  );
};

export default ControlPanel;