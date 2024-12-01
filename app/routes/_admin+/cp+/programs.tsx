import ProgramContainer from "~/components/programContainer";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare";
import programDB from "~/db/program/program.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Program } from "~/types/types";
import { createToastHeaders } from "~/lib/toast.server";
import glossary from "~/lib/glossary";
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
  return (
    <div>
      <ProgramContainer
        onAddNewProgram={(program: Program) => {
          fetcher.submit(
            {
              title: program.title,
              link: program.link,
              description: program.description,
            },
            { method: "POST" }
          );
        }}
        programs={programs.data}
        role={"admin"}
      />
    </div>
  );
};

export default Programs;
