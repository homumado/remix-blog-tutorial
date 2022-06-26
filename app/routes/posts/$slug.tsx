import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPost } from "~/models/post.server";

import { marked } from "marked";
import invariant from "tiny-invariant";

import type { LoaderFunction } from "@remix-run/node";
import type { Post } from "~/models/post.server";
type LoaderData = { post: Post | null; html: string };

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, `params.slug is required.`);

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  const html = post ? marked(post.markdown) : "";

  return json<LoaderData>({ post, html });
};

export default function PostSlug() {
  const { post, html } = useLoaderData() as LoaderData;

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
        {post?.title}
      </h1>
      <div
        className="mx-auto max-w-7xl sm:px-6 lg:px-8"
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </main>
  );
}
