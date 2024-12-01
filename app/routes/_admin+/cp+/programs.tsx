import ProgramContainer from "~/components/programContainer";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import programDB from "~/db/program/program.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Program } from "~/types/types";
export async function loader({ context }: LoaderFunctionArgs) {
    try {
      const programs = programDB.getAllPrograms(
        context.cloudflare.env.DATABASE_URL
      );
      console.log("programs: ", programs);
  
      return Response.json({ success: true, programs });
    } catch (error) {
      console.error("Loader error:", error);
      return Response.json({ success: false, error });
    }
  }


  export async function action({ request,context }: ActionFunctionArgs) {
    try {
      const formData = await request.formData() 
      const program = programDB.createProgram(
        {title:formData.get("title") as string, link:formData.get("link") as string, description:formData.get("description") as string },
        context.cloudflare.env.DATABASE_URL
      );
  
  
      return Response.json({ success: true, program });
    } catch (error) {
      console.error("Loader error:", error);
      return Response.json({ success: false, error });
    }
  }
const Programs = () => {
const fetcher = useFetcher()
    const programs = useLoaderData<any[]>()
  return (
    <div>
    
    <ProgramContainer onAddNewProgram={(program:Program)=>{fetcher.submit( {title:program.title, link:program.link, description:program.description}, { method: "POST" });}} programs={programs} role={"admin"} />
    </div>
  );
};

export default Programs;
