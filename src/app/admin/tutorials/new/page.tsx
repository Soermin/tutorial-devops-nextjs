import { createTutorialAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { TutorialEditorForm } from "@/components/tutorial-editor-form";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAdminCategories } from "@/lib/admin-tutorials";

export default async function NewTutorialPage() {
  await requireAdminSession();

  const categories = await getAdminCategories();

  return (
    <AdminShell
      currentPath="/admin/tutorials/new"
      title="Tulis tutorial baru"
      description="Susun artikel dari blok-blok konten yang fleksibel. Anda bisa menambah heading, paragraf, list, code block, quote, gambar, lalu langsung atur status publish dari editor yang sama."
    >
      <TutorialEditorForm
        action={createTutorialAction}
        categories={categories}
        mode="create"
      />
    </AdminShell>
  );
}
