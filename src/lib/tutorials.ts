import type { Prisma, PrismaClient } from "@prisma/client";
import {
  getPrismaClient,
  hasDatabaseUrl,
  warnMissingDatabaseUrl,
} from "@/lib/prisma";

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

async function runTutorialQuery<T>(
  fallback: T,
  query: (prisma: PrismaClient) => Promise<T>,
): Promise<T> {
  if (!hasDatabaseUrl()) {
    warnMissingDatabaseUrl();
    return fallback;
  }

  try {
    return await query(getPrismaClient());
  } catch (error) {
    console.error("Tutorial query failed:", error);
    return fallback;
  }
}

export async function getLatestPublishedTutorials(
  limit = 4,
): Promise<TutorialCard[]> {
  return runTutorialQuery([], (prisma) =>
    prisma.tutorial.findMany({
      where: {
        published: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit,
      select: tutorialCardSelect,
    }),
  );
}

export async function getPublishedTutorials(): Promise<TutorialCard[]> {
  return runTutorialQuery([], (prisma) =>
    prisma.tutorial.findMany({
      where: {
        published: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: tutorialCardSelect,
    }),
  );
}

export async function getPublishedTutorialBySlug(
  slug: string,
): Promise<null | TutorialDetail> {
  return runTutorialQuery(null, (prisma) =>
    prisma.tutorial.findFirst({
      where: {
        slug,
        published: true,
      },
      select: tutorialDetailSelect,
    }),
  );
}

export async function getTutorialCategories(): Promise<TutorialCategory[]> {
  return runTutorialQuery([], (prisma) =>
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: categoryListSelect,
    }),
  );
}
