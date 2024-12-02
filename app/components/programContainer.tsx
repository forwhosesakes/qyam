import { Link } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
import { Input } from "~/components/ui/input";
import ImageZoom from "~/assets/images/zoom.png";
import { Program } from "~/types/types";
import { useState } from "react";
type Props = {
  role: "admin" | "user";
  programs: any[];
  onAddNewProgram: (program: Program) => void;
};

const ProgramContainer = ({
  role = "admin",
  programs,
  onAddNewProgram,
}: Props) => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  return (
    <div className="flex mx-auto  flex-wrap justify-around gap-y-6">
      {role === "admin" && (
        <Card className="max-w-[300px]">
          <CardHeader>
            <img
              className="opacity-50"
              src={ImageZoom}
              alt="image-placeholder"
            />
            <CardTitle className="mt-2">برنامج جديد</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>أضف رابط البرنامج هنا.</CardDescription>
          </CardContent>
          <CardFooter className="flex w-full justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button>جديد</Button>
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
                    onClick={() =>
                      onAddNewProgram({ title, link, description: "" })
                    }
                  >
                    إضافة{" "}
                  </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      )}
      {programs.length ? 
     
          programs.map((program: any) => (
            <Card key={program.id} className="max-w-[300px]">
              <CardHeader>
                <img
                  className="opacity-50"
                  src={ImageZoom}
                  alt="image-placeholder"
                />
                <CardTitle className="mt-2"> {program.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{program.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex w-full justify-end">
                <a target="_blank" rel="noopener noreferrer" className="text-blue-900" href={program.link}>
                  {"اضغط هنا"}
                </a>
              </CardFooter>
            </Card>
          ))
       
       : (
        <></>
      )}
    </div>
  );
};

export default ProgramContainer;
