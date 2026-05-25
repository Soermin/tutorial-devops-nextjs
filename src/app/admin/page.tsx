import Link from "next/link";
import { FiEdit3, FiExternalLink, FiEye, FiFileText, FiLayers, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import {
  deleteTutorialAction,
  toggleTutorialPublishAction,
} from "@/app/admin/actions";
import { AdminShell } from "@/components/admin-shell";
import { requireAdminSession } from "@/lib/admin-auth";
import {
  getAdminCategories,
  getAdminDashboardStats,
  getAdminTutorials,
} from "@/lib/admin-tutorials";

type AdminDashboardPageProps = {
  searchParams: Promise<{
    id?: string;
    status?: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function renderNotice(status?: string) {
  switch (status) {
    case "deleted":
      return "Tutorial berhasil dihapus dari dashboard.";
    case "published":
      return "Status tutorial berhasil diubah menjadi published.";
    case "draft":
      return "Tutorial telah dipindahkan kembali ke draft.";
    case "invalid":
      return "Aksi admin tidak valid. Silakan ulangi dari dashboard.";
    default:
      return "";
  }
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  await requireAdminSession();

  const [{ status }, stats, tutorials, categories] = await Promise.all([
    searchParams,
    getAdminDashboardStats(),
    getAdminTutorials(),
    getAdminCategories(),
  ]);
  const notice = renderNotice(status);

  return (
    <AdminShell
      currentPath="/admin"
      title="Kelola tutorial yang siap diposting"
      description="Dari dashboard ini Anda bisa melihat status publish, memperbarui artikel, menghapus tutorial, dan membuat konten baru tanpa keluar dari identitas visual Pingnode."
      action={
        <Link
          href="/admin/tutorials/new"
          className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          <FiPlusCircle className="h-4 w-4" />
          Buat tutorial
        </Link>
      }
    >
      <div className="space-y-8">
        {notice ? (
          <div className="rounded-[1.75rem] border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100">
            {notice}
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[1.75rem] border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Total tutorial</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.totalTutorials}
            </p>
          </article>
          <article className="rounded-[1.75rem] border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Published</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.publishedTutorials}
            </p>
          </article>
          <article className="rounded-[1.75rem] border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Draft</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.draftTutorials}
            </p>
          </article>
          <article className="rounded-[1.75rem] border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Kategori tersedia</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {stats.totalCategories}
            </p>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-white">
                  Daftar tutorial
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Semua artikel yang sudah dibuat admin, baik draft maupun yang
                  sudah dipublikasikan.
                </p>
              </div>

              <Link
                href="/tutorials"
                className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                Lihat halaman publik
                <FiExternalLink className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {tutorials.length > 0 ? (
                tutorials.map((tutorial) => (
                  <article
                    key={tutorial.id}
                    className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex min-w-0 gap-4">
                        {tutorial.coverImageUrl ? (
                          <div className="hidden h-24 w-32 shrink-0 overflow-hidden rounded-[1.25rem] border border-slate-800 bg-slate-900 sm:block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={tutorial.coverImageUrl}
                              alt={tutorial.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="hidden h-24 w-32 shrink-0 items-center justify-center rounded-[1.25rem] border border-dashed border-slate-700 bg-slate-900/70 text-slate-500 sm:flex">
                            <FiFileText className="h-6 w-6" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                              {tutorial.category.name}
                            </span>
                            <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300">
                              {tutorial.level}
                            </span>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                tutorial.published
                                  ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                                  : "border border-amber-400/20 bg-amber-400/10 text-amber-100"
                              }`}
                            >
                              {tutorial.published ? "Published" : "Draft"}
                            </span>
                          </div>

                          <h2 className="mt-4 text-2xl font-semibold text-white">
                            {tutorial.title}
                          </h2>
                          <p className="mt-3 text-sm leading-7 text-slate-400">
                            {tutorial.description}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
                            <span>Slug: {tutorial.slug}</span>
                            <span>Waktu baca: {tutorial.readTime}</span>
                            <span>Update: {formatDate(tutorial.updatedAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <Link
                          href={`/admin/tutorials/${tutorial.id}/edit`}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400/20 hover:text-cyan-200"
                        >
                          <FiEdit3 className="h-4 w-4" />
                          Edit
                        </Link>
                        <Link
                          href={`/tutorials/${tutorial.slug}`}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400/20 hover:text-cyan-200"
                        >
                          <FiEye className="h-4 w-4" />
                          Buka
                        </Link>
                        <form action={toggleTutorialPublishAction}>
                          <input type="hidden" name="tutorialId" value={tutorial.id} />
                          <input
                            type="hidden"
                            name="nextPublishedState"
                            value={tutorial.published ? "false" : "true"}
                          />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400/20 hover:text-cyan-200"
                          >
                            {tutorial.published ? "Jadikan draft" : "Publish"}
                          </button>
                        </form>
                        <form action={deleteTutorialAction}>
                          <input type="hidden" name="tutorialId" value={tutorial.id} />
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:border-rose-400/40 hover:text-rose-100"
                          >
                            <FiTrash2 className="h-4 w-4" />
                            Hapus
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[1.75rem] border border-dashed border-slate-700 bg-slate-950/70 p-6">
                  <p className="text-lg font-semibold text-white">
                    Belum ada tutorial di dashboard
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Mulai dengan membuat tutorial pertama dari tombol
                    {" "}
                    &quot;Buat tutorial&quot;.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6">
              <p className="text-lg font-semibold text-white">Ringkasan kategori</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Kategori yang tersedia akan langsung muncul di form editor admin.
              </p>

              <div className="mt-5 space-y-3">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-1 rounded-full border border-teal-400/20 bg-teal-400/10 p-2 text-teal-200">
                          <FiLayers className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {category.name}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {category.description || "Deskripsi kategori belum tersedia."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-4 text-sm leading-7 text-slate-400">
                    Belum ada kategori di database. Jalankan seed agar editor tutorial
                    memiliki pilihan kategori.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </AdminShell>
  );
}
