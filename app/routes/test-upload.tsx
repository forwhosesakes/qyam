import type { ActionFunctionArgs } from "@remix-run/cloudflare";
// import type { ActionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";


type ActionData = {
  success?: boolean;
  fileName?: string;
  error?: string;
  allKeys?: string[];
};

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();

    // 1) Log all keys to see what the browser is actually sending
    const keys = Array.from(formData.keys());
    console.log("FormData keys:", keys);
    
    
    // 2) Try to retrieve the file
    const file = formData.get("file");
    console.log("TTTTTTTTTTTTTTTT");
    console.log("typeof file:", typeof file);
console.log("file toString:", Object.prototype.toString.call(file));

    if (!file || !(file instanceof File)) {
      // If we get here, "file" isn't present or isn't recognized as File
      return {
        error: "No valid file uploaded",
        allKeys: keys,
      } satisfies ActionData;
    }

    // 3) Log properties of the file
    console.log("---- FILE INFO ----");
    console.log("Name:", file.name);
    console.log("Type:", file.type);
    console.log("Size:", file.size);
    console.log("Last Modified:", file.lastModified);

    // If we reach here, we successfully got a File object
    return {
      success: true,
      fileName: file.name,
      allKeys: keys,
    } satisfies ActionData;
  } catch (error) {
    console.error("Error in test-upload action:", error);
    return {
      error: String(error),
    } satisfies ActionData;
  }
}

export default function TestUpload() {
  // Data returned from the action function
  const data = useActionData<ActionData>();

  return (
    <div style={{ margin: "2rem", fontFamily: "sans-serif" }}>
      <h1>Test File Upload (Safari + Arabic Filename)</h1>

      {/* A simple form with method POST and multipart encoding */}
      <Form method="post" encType="multipart/form-data">
        <p>Upload a file (try with Arabic name, e.g. سيرة_ذاتية.pdf):</p>
        <input type="file" name="file" />
        <button type="submit" style={{ marginLeft: "1rem" }}>
          Upload
        </button>
      </Form>

      {/* Display results */}
      {data?.error && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          <strong>Error:</strong> {data.error}
        </p>
      )}
      {data?.success && (
        <p style={{ color: "green", marginTop: "1rem" }}>
          <strong>Upload Success!</strong> <br />
          Uploaded File Name: <em>{data.fileName}</em>
        </p>
      )}
      {data?.allKeys?.length ? (
        <p style={{ marginTop: "1rem" }}>
          <strong>FormData keys received:</strong> {data.allKeys.join(", ")}
        </p>
      ) : null}
    </div>
  );
}
