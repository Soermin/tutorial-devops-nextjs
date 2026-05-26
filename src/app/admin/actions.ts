"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getPrismaClient } from "@/lib/prisma";
import {
  clearAdminSession,
  createAdminSession,
  isValidAdminCredentials,
  requireAdminSession,
} from "@/lib/admin-auth";
import {
  blocksToPlainText,
  estimateReadTimeFromBlocks,
  hasTutorialContent,
  sanitizeTutorialBlocks,
  serializeTutorialBlocks,
} from "@/lib/tutorial-content";
import {
  hasUploadedFile,
  saveTutorialImageUpload,
} from "@/lib/uploads";
import type { AdminActionState } from "@/lib/admin-action-state";
import { createSlug } from "@/lib/slugify";

type TutorialPayloadData = {
  blocks: ReturnType<typeof sanitizeTutorialBlocks>;
  categoryId: number;
  content: string;
  contentBlocks: string;
  coverImageUrl: null | string;
  description: string;
  level: string;
  published: boolean;
  readTime: string;
  slug: string;
  title: string;
};

type TutorialPayloadResult =
  | {
      data: TutorialPayloadData;
    }
  | {
      error: AdminActionState;
    };

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function buildExcerpt(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (normalized.length <= 180) {
    return normalized;
  }

  return `${normalized.slice(0, 177).trimEnd()}...`;
}

async function ensureCategoryExists(categoryId: number) {
  const category = await getPrismaClient().category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
    },
  });

  return Boolean(category);
}

function invalidState(message: string): AdminActionState {
  return {
    message,
    status: "error",
  };
}

async function parseTutorialPayload(
  formData: FormData,
): Promise<TutorialPayloadResult> {
  const title = asString(formData.get("title"));
  const slug = createSlug(asString(formData.get("slug")) || title);
  const categoryId = Number(asString(formData.get("categoryId")));
  const level = asString(formData.get("level")) || "Beginner";
  const published = formData.get("published") === "on";
  const existingCoverImageUrl = asString(formData.get("existingCoverImageUrl"));
  const coverImageFile = formData.get("coverImageFile");
  const rawBlocks = asString(formData.get("blocks"));

  let blocks = [];

  try {
    blocks = sanitizeTutorialBlocks(JSON.parse(rawBlocks));
  } catch {
    return {
      error: invalidState("Konten tutorial tidak valid. Silakan coba lagi."),
    };
  }

  if (!title || title.length < 6) {
    return {
      error: invalidState("Judul tutorial minimal harus berisi 6 karakter."),
    };
  }

  if (!slug) {
    return {
      error: invalidState("Slug tutorial belum valid."),
    };
  }

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return {
      error: invalidState("Pilih kategori tutorial yang valid."),
    };
  }

  if (!(await ensureCategoryExists(categoryId))) {
    return {
      error: invalidState("Kategori tutorial tidak ditemukan di database."),
    };
  }

  if (!hasTutorialContent(blocks)) {
    return {
      error: invalidState(
        "Tambahkan minimal satu blok konten yang berisi teks atau gambar.",
      ),
    };
  }

  const plainTextContent = blocksToPlainText(blocks);

  let coverImageUrl = existingCoverImageUrl || null;

  if (coverImageFile instanceof File && hasUploadedFile(coverImageFile)) {
    try {
      coverImageUrl = await saveTutorialImageUpload(coverImageFile);
    } catch (error) {
      return {
        error: invalidState(
          error instanceof Error ? error.message : "Upload cover gagal.",
        ),
      };
    }
  }

  return {
    data: {
      blocks,
      categoryId,
      content: plainTextContent,
      contentBlocks: serializeTutorialBlocks(blocks),
      coverImageUrl,
      description:
        asString(formData.get("description")) || buildExcerpt(plainTextContent),
      level,
      published,
      readTime:
        asString(formData.get("readTime")) || estimateReadTimeFromBlocks(blocks),
      slug,
      title,
    },
  };
}

async function revalidateTutorialPaths(
  slug: string,
  previousSlug?: string | null,
) {
  revalidatePath("/");
  revalidatePath("/tutorials");
  revalidatePath("/admin");
  revalidatePath("/admin/tutorials/new");
  revalidatePath(`/tutorials/${slug}`);

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/tutorials/${previousSlug}`);
  }
}

export async function loginAdminAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const username = asString(formData.get("username"));
  const password = asString(formData.get("password"));

  if (!username || !password) {
    return invalidState("Masukkan username dan password admin terlebih dahulu.");
  }

  if (!isValidAdminCredentials(username, password)) {
    return invalidState("Username atau password admin tidak sesuai.");
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createTutorialAction(
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminSession();

  const payload = await parseTutorialPayload(formData);

  if ("error" in payload) {
    return payload.error;
  }

  const existingTutorial = await getPrismaClient().tutorial.findUnique({
    where: {
      slug: payload.data.slug,
    },
    select: {
      id: true,
    },
  });

  if (existingTutorial) {
    return invalidState(
      "Slug tutorial sudah dipakai. Ubah slug agar tetap unik.",
    );
  }

  const tutorial = await getPrismaClient().tutorial.create({
    data: payload.data,
    select: {
      id: true,
      slug: true,
    },
  });

  await revalidateTutorialPaths(tutorial.slug);

  redirect(`/admin/tutorials/${tutorial.id}/edit?created=1`);
}

export async function updateTutorialAction(
  tutorialId: number,
  _state: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminSession();

  const tutorial = await getPrismaClient().tutorial.findUnique({
    where: {
      id: tutorialId,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!tutorial) {
    return invalidState("Tutorial yang ingin diubah tidak ditemukan.");
  }

  const payload = await parseTutorialPayload(formData);

  if ("error" in payload) {
    return payload.error;
  }

  const existingTutorial = await getPrismaClient().tutorial.findUnique({
    where: {
      slug: payload.data.slug,
    },
    select: {
      id: true,
    },
  });

  if (existingTutorial && existingTutorial.id !== tutorialId) {
    return invalidState(
      "Slug tutorial sudah dipakai oleh artikel lain. Silakan gunakan slug lain.",
    );
  }

  const updatedTutorial = await getPrismaClient().tutorial.update({
    where: {
      id: tutorialId,
    },
    data: payload.data,
    select: {
      id: true,
      slug: true,
    },
  });

  await revalidateTutorialPaths(updatedTutorial.slug, tutorial.slug);
  revalidatePath(`/admin/tutorials/${tutorialId}/edit`);

  redirect(`/admin/tutorials/${tutorialId}/edit?saved=1`);
}

export async function toggleTutorialPublishAction(formData: FormData) {
  await requireAdminSession();

  const tutorialId = Number(asString(formData.get("tutorialId")));
  const nextPublishedState = asString(formData.get("nextPublishedState")) === "true";

  if (!Number.isInteger(tutorialId) || tutorialId <= 0) {
    redirect("/admin?status=invalid");
  }

  const tutorial = await getPrismaClient().tutorial.update({
    where: {
      id: tutorialId,
    },
    data: {
      published: nextPublishedState,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  await revalidateTutorialPaths(tutorial.slug);

  redirect(
    `/admin?status=${nextPublishedState ? "published" : "draft"}&id=${tutorial.id}`,
  );
}

export async function deleteTutorialAction(formData: FormData) {
  await requireAdminSession();

  const tutorialId = Number(asString(formData.get("tutorialId")));

  if (!Number.isInteger(tutorialId) || tutorialId <= 0) {
    redirect("/admin?status=invalid");
  }

  const deletedTutorial = await getPrismaClient().tutorial.delete({
    where: {
      id: tutorialId,
    },
    select: {
      slug: true,
    },
  });

  await revalidateTutorialPaths(deletedTutorial.slug);

  redirect("/admin?status=deleted");
}
