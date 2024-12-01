
import { Link } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import ImagePlaceholder from "~/assets/images/placeholder.png";
import { Button } from "~/components/ui/button";
import {
  Dialog,
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
  role: "admin" | "user", programs:any[] , 
  onAddNewProgram : (program:Program)=>void
}

const ProgramContainer = ({ role = "admin" , programs, onAddNewProgram}:Props) => {

  const [title, setTitle ]= useState("")
    const [link,setLink] = useState("")
  
  return (
    <div className="flex flex-wrap">
      {role === "admin" && (
        <Card className="w-[350px]">
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
            <Dialog >
              <DialogTrigger asChild>
                <Button>جديد</Button>
              </DialogTrigger>
              <DialogContent dir="rtl" className="text-right w-full">
                <DialogHeader  className=" mt-4  ml-auto">
                  <DialogTitle className="text-right">إضافة برنامج جديد </DialogTitle>
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
                      onChange={(e)=>setTitle(e.target.value)}
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
                      onChange={(e)=>setLink(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={()=>onAddNewProgram({title,link,description:""})}>إضافة </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      )}
      {programs.length ? (
        <div>
          {programs.map((program: any) => (
            <Card className="w-[350px]">
              <CardContent>
                <img src={ImagePlaceholder} alt="image-placeholder" />
              </CardContent>
              <CardHeader>
                <CardTitle>برنامج جديد</CardTitle>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Link className="text-blue-900" to={program.link}>
                  {"اضغط هنا"}
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>لا توجد أية برامج بعد</p>
      )}
    </div>
  );
};

export default ProgramContainer;
