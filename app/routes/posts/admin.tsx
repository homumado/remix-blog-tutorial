import { json } from "@remix-run/node";
import { useLoaderData, Link, Outlet } from "@remix-run/react";

import { getPosts } from "~/models/post.server";

type LoaderData = {
  // this is a handy way to say: "posts is whatever type getPosts resolves to"
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader = async () => {
  return json<LoaderData>({
    posts: await getPosts(),
  });
};

export default function Posts() {
  const { posts } = useLoaderData<LoaderData>();
  return (
    <main>
      <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
        Blog Admin
      </h1>
      <div>
        <Link to="" className="text-center text-red-600 underline ">
          Admin
        </Link>
      </div>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={`/posts/${post.slug}`}
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </main>
  );
}
