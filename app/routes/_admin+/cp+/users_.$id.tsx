import { createId } from "@paralleldrive/cuid2";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  unstable_parseMultipartFormData,
} from "@remix-run/cloudflare";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Icon } from "~/components/icon";
import { Button } from "~/components/ui/button";

import userDB from "~/db/user/user.server";
import { createToastHeaders } from "~/lib/toast.server";
import { UserCertificate } from "~/types/types";

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const userId = params.id;
  if (userId)
    return userDB
      .getUserWithCertificates(userId, context.cloudflare.env.DATABASE_URL)
      .then((res: any) => {
        console.log("response [getUserWithCertificates]: ",res.data);
        
        return res.data;
      })
      .catch((error) => {
        return error;
      });

  return null;
}

export async function action({ request, context, params }: ActionFunctionArgs) {
  const uploadHandler = async (props: any) => {
    console.log("upload handler:    ",props);
    
    const { name, data, filename, contentType, size } = props;
    const key = `${Date.now()}-${createId()}.${filename.split(".")[1]}`;
    const dataArray1 = [];

    for await (const x of data) {
      dataArray1.push(x);
    }

    const file1 = new File(dataArray1, filename, { type: contentType });
    const buffer = await file1.arrayBuffer();
    context.cloudflare.env.QYAM_BUCKET.put(key, buffer, {
      httpMetadata: {
        contentType,
      },
    })
      .then((res) => {
        console.log("upload done:   [cloudflare upload]: ",res);

        const userId = params.id;
        if (userId) {
          userDB
            .addCertificateToUser(
              {
                userId,
                certificateKey: key,
                size: file1.size,
                contentType,
                name: filename,
              },
              context.cloudflare.env.DATABASE_URL
            )
            .then((res) => {

              console.log("response:   [addCertificateToUser]: ",res);
              
            })
            .catch((err) => {
              console.log("error:   [addCertificateToUser]: ",err);

              throw new Error("FAILED_ADD_USER_CERTS");
            });
        }
      })
      .catch((err) => {
        console.log("error upload ", err);
      });

    return {
      key,
      filename,
      contentType,
    };
  };

  try {
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler as any
    );
    const results = formData.getAll("files");

    return Response.json(
      { success: true },
      {
        headers: await createToastHeaders({
          description: "",
          title: `تم رفع شهادات  المتدرب بنجاح`,
          type: "success",
        }),
      }
    );
  } catch (error) {
    console.error("Upload failed:", error);
    return Response.json(
      { success: false },
      {
        headers: await createToastHeaders({
          description: "",
          title: `فشلت عملية رفع شهادات  المتدرب`,
          type: "error",
        }),
      }
    );
  }
}
const User = () => {
  const user = useLoaderData<any>();
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const fetcher = useFetcher();

  const removeFileFromSelection = (file: any) => {
    setSelectedFiles(selectedFiles.filter((f) => file.path !== f.path));
  };

  const uploadCertificates = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    fetcher.submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
    });
  };

  const onDrop = useCallback((acceptedFiles: any[]) => {
    // Do something with the files
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {};
      reader.readAsArrayBuffer(file);
    });
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <section className="min-h-screen mb-12">
      <div className="flex flex-wrap justify-between mx-auto gap-x-12 gap-y-4 [&>p]:text-sm mb-12 ">
        <p className="text-[#475467] border border-[#D0D5DD] rounded-lg p-2 w-72 text-center">
          <span className="text-secondary">الاسم :</span>

          {user.name}
        </p>
        <p className="text-[#475467] border border-[#D0D5DD] rounded-lg p-2 w-72 text-center">
          <span className="text-secondary"> الإيميل :</span>

          {user.email}
        </p>

        <p className="text-[#475467] border border-[#D0D5DD] rounded-lg p-2 w-72 text-center">
          <span className="text-secondary"> ساعات التدريب :</span>

          {user.trainingHours}
        </p>

        <p className="text-[#475467] border border-[#D0D5DD] rounded-lg p-2 w-72 text-center">
          <span className="text-secondary"> عدد المتدربين :</span>

          {user.noStudents}
        </p>
      </div>

      <div>
        <h4 className="font-bold text-primary">شهادات التدريب</h4>

        <div className="border border-gray-100 rounded-lg p-4">
          {user.UserCertificate.length ? (
            <ul>
              <li className="flex  font-bold p-2 w-full my-2  items-center justify-between rounded-lg border border-gray-200 bg-gray-50">
                <span className="w-1/2">{"اسم الملف"}</span>
                <span>{"نوع الملف"}</span>
                <span>{"الحجم "} </span>

                <span>{"التحميل "} </span>
              </li>
              {user.UserCertificate.map((cert: UserCertificate, i: number) => (
                <li
                  key={i}
                  className="flex p-2 w-full my-2  items-center justify-between rounded-lg border border-gray-100 bg-gray-50"
                >
                  <span className="w-1/2">{cert.name}</span>
                  <span>{cert.contentType}</span>
                  <span>{cert.size} بايت</span>

                  <Link
                    className="ml-2 p-2 hover:bg-gray-200 rounded-md transition-all"
                    to={`/download/${cert.certificateKey}`}
                    reloadDocument
                    download={cert.certificateKey}
                  >
                    <Icon name="download" size={"lg"} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>لا توجد شهادات لهذا المستخدم</p>
          )}
        </div>

        <h4 className="font-bold mt-12  text-primary">رفع شهادات التدريب </h4>
        <div
          className="rounded-lg border cursor-pointer border-[#E4E7EC] w-2/3 mt-12 mx-auto p-5 text-center"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div className="bg-gray-50 p-2 w-12 h-12 mx-auto rounded-full">
            <div className="bg-gray-100 p-1 rounded-full text-center">
              <Icon name="download" />
            </div>
          </div>
          {isDragActive ? (
            <p>أفلت الملفات هنا</p>
          ) : (
            <p className="text-sm mt-4">
              <span className="ml-1 text-secondary"> قم بالضغط للتحميل</span> أو
              قم بالسحب والإفلات{" "}
            </p>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <div className="border border-[#E4E7EC] mt-6 rounded-lg p-4">
            <p className="mb-2">الملفات المختارة ({selectedFiles.length})</p>
            <ul>
              {selectedFiles.map((file, i) => (
                <li
                  key={i}
                  className="flex p-2 w-full my-2  items-center justify-between rounded-lg border border-gray-100 bg-gray-50"
                >
                  <span className="w-1/2">
                    {file.relativePath.split("/")[1]}
                  </span>
                  <span className="w-1/3">{file.size} بايت</span>

                  <Button
                    onClick={() => removeFileFromSelection(file)}
                    className="p-1  bg-transparent hover:bg-gray-100 ml-2 px-2"
                  >
                    <Icon name="remove" size="md" />
                  </Button>
                </li>
              ))}
            </ul>

            <Button onClick={uploadCertificates} className="mt-4">
              رفع الملفات
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default User;
