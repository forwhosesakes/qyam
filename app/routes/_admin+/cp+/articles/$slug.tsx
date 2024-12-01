import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { slug } = params;
  return articleDB
    .getArticleBySlug(slug, context.cloudflare.env.DATABASE_URL)
    .then((res) => {
      return Response.json(res.data);
    });
}

export default function Article() {
  const article = useLoaderData<Article>();
  const Component = useMemo(() => getMDXComponent(article.content), [article.content]);

  return (
    <article className="prose prose-lg mx-auto py-10">
      <h1>{article.title}</h1>
      <Component />
    </article>
  );
}