import { json, redirect } from "@remix-run/node";
import {
  useLoaderData,
  Form,
  useActionData,
  useTransition,
} from "@remix-run/react";
import { deletePost, getPost, updatePost } from "~/models/post.server";

import invariant from "tiny-invariant";

import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import type { Post } from "~/models/post.server";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, `params.slug is required.`);

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  return json({ post });
};

type ActionData =
  | {
      title: null | string;
      slug: null | string;
      markdown: null | string;
    }
  | undefined;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  //switch between update and delete
  switch (formData.get("action")) {
    case "delete":
      await deletePost(formData.get("slug"));
      break;
    case "update":
      let title = formData.get("title");
      let slug = formData.get("slug");
      let markdown = formData.get("markdown");

      const errors: ActionData = {
        title: title ? null : "Title is required",
        slug: slug ? null : "Slug is required",
        markdown: markdown ? null : "Markdown is required",
      };
      const hasErrors = Object.values(errors).some(
        (errorMessage) => errorMessage
      );
      if (hasErrors) {
        return json<ActionData>(errors);
      }

      await updatePost({ title, slug, markdown });
      break;
  }

  return redirect("/posts/admin");
};

export default function NewPost() {
  const { post } = useLoaderData();
  const errors = useActionData();

  const transition = useTransition();
  const isCreating = Boolean(transition.submission);

  return (
    <Form method="post">
      <p>
        <label>
          Post Title:
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
            defaultValue={post.title}
          />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          {errors?.slug ? (
            <em className="text-red-600">{errors.slug}</em>
          ) : null}
          <input
            type="text"
            name="slug"
            className={inputClassName}
            defaultValue={post.slug}
          />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">
          Markdown:
          {errors?.markdown ? (
            <em className="text-red-600">{errors.markdown}</em>
          ) : null}
        </label>
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
          defaultValue={post.markdown}
        />
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={isCreating}
          name="action"
          value="update"
        >
          {isCreating ? "Saving..." : "Save Post"}
        </button>
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
          // onClick={() => deleteThis(post.slug)}
          disabled={isCreating}
          name="action"
          value="delete"
        >
          Delete Post
        </button>
      </p>
    </Form>
  );
}

export const deleteThis = async (slug: string) => {
  console.log(slug);

  await deletePost(slug);

  return redirect("/posts/admin");
};
