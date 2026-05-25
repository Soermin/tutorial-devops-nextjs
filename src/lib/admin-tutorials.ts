import type { Prisma } from "@prisma/client";
import { getPrismaClient } from "@/lib/prisma";

const adminTutorialListSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  coverImageUrl: true,
  level: true,
  readTime: true,
  published: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.TutorialSelect;

const adminTutorialEditorSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  content: true,
  contentBlocks: true,
  coverImageUrl: true,
  level: true,
  readTime: true,
  published: true,
  categoryId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TutorialSelect;

const adminCategorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
} satisfies Prisma.CategorySelect;

export type AdminTutorialListItem = Prisma.TutorialGetPayload<{
  select: typeof adminTutorialListSelect;
}>;

export type AdminTutorialEditorItem = Prisma.TutorialGetPayload<{
  select: typeof adminTutorialEditorSelect;
}>;

export type AdminCategoryOption = Prisma.CategoryGetPayload<{
  select: typeof adminCategorySelect;
}>;

export async function getAdminTutorials() {
  return getPrismaClient().tutorial.findMany({
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    select: adminTutorialListSelect,
  });
}

export async function getAdminTutorialById(id: number) {
  return getPrismaClient().tutorial.findUnique({
    where: {
      id,
    },
    select: adminTutorialEditorSelect,
  });
}

export async function getAdminCategories() {
  return getPrismaClient().category.findMany({
    orderBy: {
      name: "asc",
    },
    select: adminCategorySelect,
  });
}

export async function getAdminDashboardStats() {
  const prisma = getPrismaClient();
  const [totalTutorials, publishedTutorials, totalCategories] =
    await Promise.all([
      prisma.tutorial.count(),
      prisma.tutorial.count({
        where: {
          published: true,
        },
      }),
      prisma.category.count(),
    ]);

  return {
    totalTutorials,
    publishedTutorials,
    draftTutorials: totalTutorials - publishedTutorials,
    totalCategories,
  };
}
