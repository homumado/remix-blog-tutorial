import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/node";
import { getPost } from "~/models/post.server";

export const loader: LoaderFunction = async ({ params }) => {
  const post = await getPost(params.slug);
  return json({ post });
};

export default function PostSlug() {
  const { post } = useLoaderData();

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
        {post.title}
      </h1>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{post.markdown}</div>
    </main>
  );
}
