import { notFound } from "next/navigation";
import { updateTutorialAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { TutorialEditorForm } from "@/components/tutorial-editor-form";
import { requireAdminSession } from "@/lib/admin-auth";
import {
  getAdminCategories,
  getAdminTutorialById,
} from "@/lib/admin-tutorials";
import { parseStoredTutorialBlocks } from "@/lib/tutorial-content";

type EditTutorialPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    created?: string;
    saved?: string;
  }>;
};

function renderNotice(searchParams: { created?: string; saved?: string }) {
  if (searchParams.created === "1") {
    return "Tutorial baru berhasil dibuat. Anda bisa lanjut menyempurnakan isinya di halaman ini.";
  }

  if (searchParams.saved === "1") {
    return "Perubahan tutorial berhasil disimpan.";
  }

  return "";
}

export default async function EditTutorialPage({
  params,
  searchParams,
}: EditTutorialPageProps) {
  await requireAdminSession();

  const [{ id }, query, categories] = await Promise.all([
    params,
    searchParams,
    getAdminCategories(),
  ]);
  const tutorialId = Number(id);

  if (!Number.isInteger(tutorialId) || tutorialId <= 0) {
    notFound();
  }

  const tutorial = await getAdminTutorialById(tutorialId);

  if (!tutorial) {
    notFound();
  }

  const notice = renderNotice(query);

  return (
    <AdminShell
      currentPath="/admin/tutorials/new"
      title="Edit tutorial"
      description="Perbarui struktur artikel, ganti gambar, sesuaikan heading, dan simpan perubahan tanpa keluar dari dashboard admin."
    >
      <div className="space-y-6">
        {notice ? (
          <div className="rounded-[1.75rem] border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100">
            {notice}
          </div>
        ) : null}

        <TutorialEditorForm
          action={updateTutorialAction.bind(null, tutorialId)}
          categories={categories}
          initialData={{
            blocks: parseStoredTutorialBlocks(
              tutorial.contentBlocks,
              tutorial.content,
            ),
            categoryId: tutorial.categoryId,
            coverImageUrl: tutorial.coverImageUrl,
            description: tutorial.description,
            level: tutorial.level,
            published: tutorial.published,
            readTime: tutorial.readTime,
            slug: tutorial.slug,
            title: tutorial.title,
          }}
          mode="edit"
        />
      </div>
    </AdminShell>
  );
}
