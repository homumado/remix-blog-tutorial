import { json, redirect } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";

import { getEmails, addEmail } from "~/models/newsletter.server";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const emails = await getEmails();

  return json<{ emails: string[] }>({
    emails: emails.map((email) => email.email),
  });
};

export default function Posts() {
  const { emails } = useLoaderData<{ emails: string[] }>();

  //a email submission form for newsletters
  return (
    <main>
      <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
        Newsletter
      </h1>
      <Form method="post">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
        />
        <button
          type="submit"
          className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
        >
          Subscribe
        </button>
      </Form>
      <ul>
        {emails.map((email) => (
          <li key={`email/ + ${email}`}>{email}</li>
        ))}
      </ul>
    </main>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");

  if (!email) {
    return redirect("/newsletter");
  }

  await addEmail(email);
  return redirect("newsletter");
};
