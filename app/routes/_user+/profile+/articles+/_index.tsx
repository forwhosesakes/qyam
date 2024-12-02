import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import articleDB from "~/db/articles/articles.server";
import UserArticleCard from "~/components/userArticleCard";
import { Article } from "~/types/types";

export async function loader({ context }: LoaderFunctionArgs) {
  return articleDB
    .getAllArticles(context.cloudflare.env.DATABASE_URL)
    .then((res) => {
      return Response.json(res.data);
    })
    .catch(() => {
      return [];
    });
}

export default function Articles() {
  const articles = useLoaderData<Article[]>();

  return (
    <div className="px-8 py-6">
      <h2 className="text-2xl font-bold mb-8">المقالات</h2>
      <div className="flex flex-wrap gap-6">
        {articles?.map((article) => (
          <UserArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}