import ProgramContainer from "~/components/programContainer";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import programDB from "~/db/program/program.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Program } from "~/types/types";
import { createToastHeaders } from "~/lib/toast.server";
import glossary from "~/lib/glossary";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useState } from "react";
import { Input } from "~/components/ui/input";
export async function loader({ context }: LoaderFunctionArgs) {
  try {
    const programs = await programDB.getAllPrograms(
      context.cloudflare.env.DATABASE_URL
    );
    return Response.json({ success: true, programs });
  } catch (error) {
    console.error("Loader error:", error);
    return Response.json({ success: false, error });
  }
}

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    await programDB.createProgram(
      {
        title: formData.get("title") as string,
        link: formData.get("link") as string,
        description: formData.get("description") as string,
      },
      context.cloudflare.env.DATABASE_URL
    );

    return Response.json(
      { success: true },
      {
        headers: await createToastHeaders({
          description: "",
          title: "تمت إضافة البرنامج بنجاح",
          type: "success",
        }),
      }
    );
  } catch (error) {
    console.error("Loader error:", error);
    Response.json(
      { success: true },
      {
        headers: await createToastHeaders({
          description: "",
          title: glossary.contact.toasts.error,
          type: "error",
        }),
      }
    );
  }
}
const Programs = () => {
  const fetcher = useFetcher();
  const { programs } = useLoaderData<any>();

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  return (
    <div>
      <div className="flex sm:flex-row flex-col justify-between items-center px-12 mb-8">
        <h5 className="text-primary font-bold">البرامج</h5>
        <Dialog>
          <DialogTrigger asChild>
            <Button>إضافة برنامج جديد</Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="text-right w-full">
            <DialogHeader className=" mt-4  ml-auto">
              <DialogTitle className="text-right">
                إضافة برنامج جديد{" "}
              </DialogTitle>
              <DialogDescription>
                أضف برنامجًا جديدًا إلى مركز المعرفة
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  عنوان البرنامج
                </label>
                <Input
                  id="name"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="username" className="text-right">
                  رابط البرنامج
                </label>
                <Input
                  id="username"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  disabled={!title || !link}
                  onClick={() => {
                    fetcher.submit(
                      {
                        title,
                        link,
                        description:"" ,
                      },
                      { method: "POST" }
                    );
                  }}
                >
                  إضافة{" "}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ProgramContainer
    
        programs={programs.data}
     
      />
    </div>
  );
};

export default Programs;
