import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const tutorialCardSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  level: true,
  readTime: true,
  createdAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.TutorialSelect;

const tutorialDetailSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  content: true,
  level: true,
  readTime: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
  },
} satisfies Prisma.TutorialSelect;

const categoryListSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  tutorials: {
    where: {
      published: true,
    },
    select: {
      id: true,
    },
  },
} satisfies Prisma.CategorySelect;

export type TutorialCard = Prisma.TutorialGetPayload<{
  select: typeof tutorialCardSelect;
}>;

export type TutorialDetail = Prisma.TutorialGetPayload<{
  select: typeof tutorialDetailSelect;
}>;

export type TutorialCategory = Prisma.CategoryGetPayload<{
  select: typeof categoryListSelect;
}>;

export async function getLatestPublishedTutorials(
  limit = 4,
): Promise<TutorialCard[]> {
  return prisma.tutorial.findMany({
    where: {
      published: true,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit,
    select: tutorialCardSelect,
  });
}

export async function getPublishedTutorials(): Promise<TutorialCard[]> {
  return prisma.tutorial.findMany({
    where: {
      published: true,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: tutorialCardSelect,
  });
}

export async function getPublishedTutorialBySlug(
  slug: string,
): Promise<null | TutorialDetail> {
  return prisma.tutorial.findFirst({
    where: {
      slug,
      published: true,
    },
    select: tutorialDetailSelect,
  });
}

export async function getTutorialCategories(): Promise<TutorialCategory[]> {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: categoryListSelect,
  });
}
