import {
    ActionFunctionArgs,
    LoaderFunctionArgs,
    redirect,
    json,
  } from "@remix-run/cloudflare";
  import {
    Form,
    useActionData,
    useNavigation,
  } from "@remix-run/react";
  import { useEffect, useState } from "react";
  import { Button } from "~/components/ui/button";
  import { Input } from "~/components/ui/input";
  import { Textarea } from "~/components/ui/textarea";
  import { Label } from "~/components/ui/label";
  import { createId } from "@paralleldrive/cuid2";
  import "react-quill/dist/quill.snow.css";
  import type { QuillOptions } from "quill";
  import { getAuthenticated } from "~/lib/get-authenticated.server";
import articleDB from "~/db/articles/articles.server"
  
  export async function loader({ context, request }: LoaderFunctionArgs) {
    await getAuthenticated({ request, context });
    return json({});
  }
  
  export async function action({ request, context }: ActionFunctionArgs) {
    const user = await getAuthenticated({ request, context });
    const formData = await request.formData();
  
    try {
      const title = formData.get("title");
      const description = formData.get("description");
      const content = formData.get("content");
      const imageFile = formData.get("image");
  
      if (!title || !description || !content) {
        return json({ error: "All fields are required" }, { status: 400 });
      }
  
      let imageKey = null;
      if (imageFile instanceof File && imageFile.size > 0) {
        const extension = imageFile.name.split(".").pop();
        imageKey = `${Date.now()}-${createId()}.${extension}`;
        console.log("imageKey is :: ", imageKey);
        const buffer = await imageFile.arrayBuffer();
        const uploadResult = await context.cloudflare.env.QYAM_BUCKET.put(imageKey, buffer, {
          httpMetadata: {
            contentType: imageFile.type,
          },
        });

        console.log("uploadResult :: ", uploadResult);
        
      }
      const article = await articleDB.createArticle({
        title: title.toString(),
        description: description.toString(),
        content: content.toString(),
        image: imageKey,
      },context.cloudflare.env.DATABASE_URL)
      console.log("article is :: ", article);
      
    //   const article = await prisma(context).article.create({
    //     data: {
    //       title: title.toString(),
    //       description: description.toString(),
    //       content: content.toString(),
    //       image: imageKey,
    //       authorId: user.id,
    //     },
    //   });
  
      return redirect(`/articles/${article.id}`);
    } catch (error) {
      console.error("Error creating article:", error);
      return json(
        { error: "Failed to create article. Please try again." },
        { status: 500 }
      );
    }
  }
  
  export default function NewArticle() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const [ReactQuill, setReactQuill] = useState<any>(null);
    const [content, setContent] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
  
    useEffect(() => {
      import("react-quill").then((module) => {
        setReactQuill(() => module.default);
      });
    }, []);
  
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
  
    const modules: QuillOptions["modules"] = {
      toolbar: [
        [{ color: [] }],
        ["bold", "italic", "underline"],
        [{ align: ["", "center", "right", "justify"] }],
        ["link"],
        ["clean"],
      ],
    };
  
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Article</h1>
        
        <Form
          method="post"
          encType="multipart/form-data"
          className="space-y-6"
          replace
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              className="bg-background"
            />
          </div>
  
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              className="bg-background min-h-[100px]"
            />
          </div>
  
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            {ReactQuill && (
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                className="bg-background rounded-b"
                placeholder="Write your article content here..."
              />
            )}
            <input type="hidden" name="content" value={content} />
          </div>
  
          <div className="space-y-2">
            <Label htmlFor="image">Featured Image</Label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mb-4 rounded-lg border w-64 aspect-video object-cover"
              />
            )}
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="bg-background"
            />
          </div>
  
          {actionData?.error && (
            <p className="text-red-500 text-sm">{actionData.error}</p>
          )}
  
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={navigation.state === "submitting"}
            >
              {navigation.state === "submitting"
                ? "Publishing..."
                : "Publish Article"}
            </Button>
          </div>
        </Form>
      </div>
    );
  }