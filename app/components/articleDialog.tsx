import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Article } from "~/types/types";
import { Form, useFetcher } from "@remix-run/react";
import {  useState } from "react";
import { Label } from "./ui/label";

interface ArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: Article | null;
}



export default function ArticleDialog({ open, onOpenChange, article }: ArticleDialogProps) {
  const fetcher = useFetcher();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const isEditing = !!article;
  const title = isEditing ? "تعديل المقال" : "إضافة مقال جديد";

    const onChange =async (file:File) => {
        if(!file)return
        const fileImage = await getBase64(file) as File
        setSelectedImage(fileImage)
        // let base64String = ""
        // let reader = new FileReader();

        // reader.onload = function () {
        //     base64String = reader.result.replace("data:", "")
        //         .replace(/^.+,/, "");
        //         setSelectedImage(base64String)
        //     console.log(base64String);
        // }
        // reader.readAsDataURL(file);
    }

    async function getBase64(file:File) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (selectedImage) {
      formData.set("image", selectedImage);
    } else if (article?.image) {
      formData.set("image", article.image);
    }
    
    if (isEditing) {
      formData.append("id", article.id);
    }

    fetcher.submit(formData, {
      method: isEditing ? "PUT" : "POST",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Form method="post" encType="multipart/form-data" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">العنوان</Label>
            <Input
              id="title"
              name="title"
              defaultValue={article?.title}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={article?.description}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">المحتوى</Label>
            <Textarea
              id="content"
              name="content"
              rows={10}
              defaultValue={article?.content}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">الصورة</Label>
            {article?.image && (
              <img 
                src={article.image} 
                alt="Current" 
                className="w-32 h-32 object-cover mb-2" 
              />
            )}
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => onChange(e.target.files[0])}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={fetcher.state === "submitting"}>
              {fetcher.state === "submitting" 
                ? "جاري المعالجة..." 
                : isEditing ? "تحديث" : "إضافة"
              }
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}