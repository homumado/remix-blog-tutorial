import { prisma } from "~/db.server";

import type { Newsletter } from "@prisma/client";
export type { Newsletter };

// create endpoints for newsletter

export async function addEmail(email: string) {
  return prisma.newsletter.upsert({ where: { email },  update: { email }, create: { email } });
}

export async function getEmails() {
  return prisma.newsletter.findMany();
}