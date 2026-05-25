"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowDown, FiArrowUp, FiImage, FiPlus, FiTrash2 } from "react-icons/fi";
import {
  createTutorialBlock,
  formatTutorialBlockLabel,
  tutorialBlockTypes,
  type TutorialContentBlock,
  type TutorialBlockType,
} from "@/lib/tutorial-content";
import { createSlug } from "@/lib/slugify";
import {
  initialAdminActionState,
  type AdminActionState,
} from "@/lib/admin-action-state";
import { FormSubmitButton } from "@/components/form-submit-button";
import { TutorialContentRenderer } from "@/components/tutorial-content-renderer";

type TutorialCategoryOption = {
  id: number;
  name: string;
  slug: string;
  description: null | string;
};

type TutorialEditorInitialData = {
  blocks: TutorialContentBlock[];
  categoryId: number;
  coverImageUrl: null | string;
  description: string;
  level: string;
  published: boolean;
  readTime: string;
  slug: string;
  title: string;
};

type TutorialEditorFormProps = {
  action: (
    state: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  categories: TutorialCategoryOption[];
  initialData?: TutorialEditorInitialData;
  mode: "create" | "edit";
};

const levelOptions = ["Beginner", "Intermediate", "Advanced"];

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function hasVisibleBlockContent(block: TutorialContentBlock) {
  if (block.type === "image") {
    return Boolean(block.src);
  }

  return block.text.trim().length > 0;
}

export function TutorialEditorForm({
  action,
  categories,
  initialData,
  mode,
}: TutorialEditorFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState<
    AdminActionState,
    FormData
  >(action, initialAdminActionState);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [categoryId, setCategoryId] = useState(
    String(initialData?.categoryId ?? categories[0]?.id ?? ""),
  );
  const [level, setLevel] = useState(initialData?.level ?? "Beginner");
  const [readTime, setReadTime] = useState(initialData?.readTime ?? "");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [blocks, setBlocks] = useState<TutorialContentBlock[]>(
    initialData?.blocks?.length ? initialData.blocks : [createTutorialBlock("paragraph")],
  );
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialData?.coverImageUrl ?? "",
  );
  const [coverFilePreviewUrl, setCoverFilePreviewUrl] = useState<string | null>(
    null,
  );
  const [coverInputKey, setCoverInputKey] = useState(0);
  const [blockUploadMessage, setBlockUploadMessage] = useState<
    Record<string, string>
  >({});
  const [blockUploadPending, setBlockUploadPending] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (!slugTouched) {
      setSlug(createSlug(title));
    }
  }, [slugTouched, title]);

  useEffect(() => {
    if (state.status === "success" && state.redirectTo) {
      router.replace(state.redirectTo);
      router.refresh();
    }
  }, [router, state.redirectTo, state.status]);

  const previewCoverUrl = coverFilePreviewUrl || coverImageUrl || null;
  const previewBlocks = blocks.filter(hasVisibleBlockContent);
  const hasCategoryOptions = categories.length > 0;

  function addBlock(type: TutorialBlockType) {
    setBlocks((currentBlocks) => [...currentBlocks, createTutorialBlock(type)]);
  }

  function updateTextBlock(
    blockId: string,
    field: "meta" | "text",
    value: string,
  ) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId || block.type === "image") {
          return block;
        }

        return {
          ...block,
          [field]: value,
        };
      }),
    );
  }

  function updateImageBlock(
    blockId: string,
    patch: Partial<Extract<TutorialContentBlock, { type: "image" }>>,
  ) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId || block.type !== "image") {
          return block;
        }

        return {
          ...block,
          ...patch,
        };
      }),
    );
  }

  function moveBlock(blockId: string, direction: "down" | "up") {
    setBlocks((currentBlocks) => {
      const blockIndex = currentBlocks.findIndex((block) => block.id === blockId);

      if (blockIndex === -1) {
        return currentBlocks;
      }

      const targetIndex = direction === "up" ? blockIndex - 1 : blockIndex + 1;

      if (targetIndex < 0 || targetIndex >= currentBlocks.length) {
        return currentBlocks;
      }

      const nextBlocks = [...currentBlocks];
      const [movedBlock] = nextBlocks.splice(blockIndex, 1);

      nextBlocks.splice(targetIndex, 0, movedBlock);

      return nextBlocks;
    });
  }

  function removeBlock(blockId: string) {
    setBlocks((currentBlocks) => {
      const nextBlocks = currentBlocks.filter((block) => block.id !== blockId);

      return nextBlocks.length > 0
        ? nextBlocks
        : [createTutorialBlock("paragraph")];
    });
  }

  async function uploadImageBlock(blockId: string, file: File | null) {
    if (!file) {
      return;
    }

    setBlockUploadPending((currentState) => ({
      ...currentState,
      [blockId]: true,
    }));
    setBlockUploadMessage((currentState) => ({
      ...currentState,
      [blockId]: "",
    }));

    try {
      const uploadFormData = new FormData();

      uploadFormData.set("file", file);

      const response = await fetch("/api/admin/uploads", {
        body: uploadFormData,
        method: "POST",
      });
      const payload = (await response.json()) as {
        error?: string;
        url?: string;
      };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Upload gambar gagal.");
      }

      updateImageBlock(blockId, { src: payload.url });
      setBlockUploadMessage((currentState) => ({
        ...currentState,
        [blockId]: "Gambar berhasil diunggah.",
      }));
    } catch (error) {
      setBlockUploadMessage((currentState) => ({
        ...currentState,
        [blockId]:
          error instanceof Error ? error.message : "Upload gambar gagal.",
      }));
    } finally {
      setBlockUploadPending((currentState) => ({
        ...currentState,
        [blockId]: false,
      }));
    }
  }

  function handleCoverFileChange(file: File | null) {
    if (coverFilePreviewUrl) {
      URL.revokeObjectURL(coverFilePreviewUrl);
    }

    if (!file) {
      setCoverFilePreviewUrl(null);
      return;
    }

    setCoverFilePreviewUrl(URL.createObjectURL(file));
  }

  function removeCoverImage() {
    if (coverFilePreviewUrl) {
      URL.revokeObjectURL(coverFilePreviewUrl);
    }

    setCoverImageUrl("");
    setCoverFilePreviewUrl(null);
    setCoverInputKey((currentKey) => currentKey + 1);
  }

  return (
    <form action={formAction} className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_380px]">
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-[0_25px_80px_rgba(2,8,23,0.35)]">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-200" htmlFor="title">
                Judul tutorial
              </label>
              <input
                id="title"
                name="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Contoh: Membangun pipeline CI/CD untuk Next.js"
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-200" htmlFor="slug">
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(event.target.value);
                }}
                placeholder="slug-otomatis-akan-muncul-di-sini"
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                className="text-sm font-medium text-slate-200"
                htmlFor="description"
              >
                Deskripsi singkat
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Ringkas isi dan manfaat tutorial ini untuk pembaca."
                rows={4}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-200"
                htmlFor="categoryId"
              >
                Kategori
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40"
              >
                {hasCategoryOptions ? (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="">Belum ada kategori</option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200" htmlFor="level">
                Level
              </label>
              <select
                id="level"
                name="level"
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/40"
              >
                {levelOptions.map((levelOption) => (
                  <option key={levelOption} value={levelOption}>
                    {levelOption}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-200"
                htmlFor="readTime"
              >
                Waktu baca
              </label>
              <input
                id="readTime"
                name="readTime"
                value={readTime}
                onChange={(event) => setReadTime(event.target.value)}
                placeholder="Otomatis dihitung jika dikosongkan"
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
              />
            </div>

            <div className="flex items-end">
              <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
                <input
                  type="checkbox"
                  name="published"
                  checked={published}
                  onChange={(event) => setPublished(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-cyan-400/40"
                />
                Publish setelah disimpan
              </label>
            </div>

            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-200">Cover tutorial</p>
                  <p className="text-sm leading-6 text-slate-400">
                    Gambar ini akan tampil di kartu tutorial dan hero detail jika tersedia.
                  </p>
                </div>
                {previewCoverUrl ? (
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className="text-sm font-medium text-rose-300 transition hover:text-rose-200"
                  >
                    Hapus cover
                  </button>
                ) : null}
              </div>

              <input
                key={coverInputKey}
                type="file"
                name="coverImageFile"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(event) =>
                  handleCoverFileChange(event.target.files?.[0] ?? null)
                }
                className="block w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-4 py-4 text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-cyan-300"
              />
              <input type="hidden" name="existingCoverImageUrl" value={coverImageUrl} />
            </div>
          </div>

          {!hasCategoryOptions ? (
            <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              Belum ada kategori di database. Jalankan seed atau tambahkan kategori
              terlebih dahulu sebelum membuat tutorial baru.
            </div>
          ) : null}
        </section>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-[0_25px_80px_rgba(2,8,23,0.35)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold text-white">Konten tutorial</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Tambahkan paragraf, heading, list, code block, quote, dan gambar
                sesuai urutan materi yang ingin diposting.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tutorialBlockTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-300 transition hover:border-cyan-400/20 hover:text-cyan-200"
                >
                  <FiPlus className="h-3.5 w-3.5" />
                  {formatTutorialBlockLabel(type)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {blocks.map((block, index) => (
              <article
                key={block.id}
                className="rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {formatTutorialBlockLabel(block.type)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Blok #{String(index + 1).padStart(2, "0")}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveBlock(block.id, "up")}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400/20 hover:text-cyan-200"
                    >
                      <FiArrowUp className="h-4 w-4" />
                      Naik
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlock(block.id, "down")}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400/20 hover:text-cyan-200"
                    >
                      <FiArrowDown className="h-4 w-4" />
                      Turun
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBlock(block.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-200 transition hover:border-rose-400/40 hover:text-rose-100"
                    >
                      <FiTrash2 className="h-4 w-4" />
                      Hapus
                    </button>
                  </div>
                </div>

                {block.type === "image" ? (
                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 p-4">
                      <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-200">
                        <FiImage className="h-4 w-4 text-cyan-300" />
                        Unggah gambar untuk blok ini
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          className="hidden"
                          onChange={(event) =>
                            uploadImageBlock(
                              block.id,
                              event.target.files?.[0] ?? null,
                            )
                          }
                        />
                      </label>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Format yang didukung: PNG, JPG, WEBP, dan GIF.
                      </p>
                    </div>

                    {block.src ? (
                      <div className="overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={block.src}
                          alt={block.alt || "Uploaded tutorial image"}
                          className="max-h-80 w-full object-contain"
                        />
                      </div>
                    ) : null}

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">
                          Alt text
                        </label>
                        <input
                          type="text"
                          value={block.alt}
                          onChange={(event) =>
                            updateImageBlock(block.id, { alt: event.target.value })
                          }
                          placeholder="Deskripsi singkat gambar"
                          className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">
                          Caption
                        </label>
                        <input
                          type="text"
                          value={block.caption ?? ""}
                          onChange={(event) =>
                            updateImageBlock(block.id, {
                              caption: event.target.value,
                            })
                          }
                          placeholder="Keterangan gambar"
                          className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
                        />
                      </div>
                    </div>

                    {blockUploadMessage[block.id] ? (
                      <div
                        className={joinClasses(
                          "rounded-2xl px-4 py-3 text-sm",
                          blockUploadPending[block.id]
                            ? "border border-cyan-400/20 bg-cyan-400/10 text-cyan-100"
                            : block.src
                              ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                              : "border border-rose-400/20 bg-rose-400/10 text-rose-100",
                        )}
                      >
                        {blockUploadMessage[block.id]}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    {block.type === "code" ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">
                          Bahasa / label code
                        </label>
                        <input
                          type="text"
                          value={block.meta ?? ""}
                          onChange={(event) =>
                            updateTextBlock(block.id, "meta", event.target.value)
                          }
                          placeholder="bash, yaml, javascript, dockerfile"
                          className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
                        />
                      </div>
                    ) : null}

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">
                        {block.type === "bulleted-list" ||
                        block.type === "numbered-list"
                          ? "Masukkan satu item per baris"
                          : "Isi konten"}
                      </label>
                      <textarea
                        value={block.text}
                        onChange={(event) =>
                          updateTextBlock(block.id, "text", event.target.value)
                        }
                        rows={block.type === "code" ? 9 : 5}
                        placeholder={
                          block.type === "code"
                            ? "Tuliskan potongan kode di sini..."
                            : block.type === "quote"
                              ? "Tulis kutipan penting untuk pembaca..."
                              : "Tulis konten blok ini..."
                        }
                        className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
                      />
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <input type="hidden" name="blocks" value={JSON.stringify(blocks)} />

        <div className="flex flex-col gap-3 rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              {mode === "create" ? "Siap membuat tutorial baru" : "Siap menyimpan perubahan"}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Tutorial akan tetap mengikuti identitas visual Pingnode saat ditampilkan di halaman publik.
            </p>
          </div>

          <FormSubmitButton
            idleLabel={mode === "create" ? "Simpan tutorial" : "Simpan perubahan"}
            pendingLabel={mode === "create" ? "Membuat tutorial..." : "Menyimpan perubahan..."}
          />
        </div>

        {state.status === "error" ? (
          <div className="rounded-[1.75rem] border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-100">
            {state.message}
          </div>
        ) : null}
      </div>

      <aside className="space-y-6 xl:sticky xl:top-8 xl:self-start">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 shadow-[0_25px_80px_rgba(2,8,23,0.35)]">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-300">
            Preview
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            {title || "Judul tutorial akan muncul di sini"}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {description || "Deskripsi tutorial akan membantu pembaca memahami isi materi sebelum membuka detail lengkapnya."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {categoryId ? (
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                {categories.find((category) => String(category.id) === categoryId)?.name ??
                  "Kategori"}
              </span>
            ) : null}
            <span className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs font-medium text-slate-300">
              {level}
            </span>
            <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-200">
              {readTime || "Otomatis dihitung saat disimpan"}
            </span>
          </div>

          {previewCoverUrl ? (
            <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950/80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewCoverUrl}
                alt={title || "Preview cover tutorial"}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          ) : null}

          <div className="mt-6 rounded-[1.75rem] border border-slate-800 bg-slate-950/70 p-5">
            {previewBlocks.length > 0 ? (
              <TutorialContentRenderer blocks={previewBlocks} className="space-y-5" />
            ) : (
              <p className="text-sm leading-7 text-slate-400">
                Tambahkan minimal satu blok konten agar preview artikel muncul di sini.
              </p>
            )}
          </div>
        </section>
      </aside>
    </form>
  );
}
