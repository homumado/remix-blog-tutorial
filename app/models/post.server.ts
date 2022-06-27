import { prisma } from "~/db.server";

import type { Post } from "@prisma/client";
export type { Post };

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPost(id: string) {
  return prisma.post.findUnique({ where: { slug: id } });
}

export async function createPost(post: Post) {
  return prisma.post.create({ data: post });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { slug: id } });
}

export async function updatePost(post: Post) {
  return prisma.post.update({ where: { slug: post.slug }, data: post });
}