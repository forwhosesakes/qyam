import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import materialDB from "~/db/material/material.server";
import { useLoaderData } from "@remix-run/react";
import { Category } from "~/types/types";
export async function loader({ request, context, params }: LoaderFunctionArgs) {
  return materialDB
    .getAllCategoriesWithLinkedMaterials(context.cloudflare.env.DATABASE_URL)
    .then((res: any) => {
      console.log("responseee:  ", res);

      return Response.json(res.data);
    })
    .catch((err: any) => {
      console.log("error:  ", err);
    });
}
const Materials = () => {
  const categories = useLoaderData<Category[]>();

  return (
    <section className=" px-12 min-h-screen">
      {categories.map((category: Category) => (
        <div>
          <h4>{category.title}</h4>

          {category.Material.length ? (
            category.Material.map((material) => <div>{material.title}</div>)
          ) : (
            <p>لا توجد مقررات في هذا التصنيف</p>
          )}
        </div>
      ))}

      <button className="button p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700">
        اضافة مقرر{" "}
      </button>
    </section>
  );
};

export default Materials;
