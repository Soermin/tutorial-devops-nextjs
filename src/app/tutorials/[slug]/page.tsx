import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiBookOpen,
  FiClock,
  FiFolder,
  FiTerminal,
} from "react-icons/fi";
import { getPublishedTutorialBySlug } from "@/lib/tutorials";

export const dynamic = "force-dynamic";

type TutorialDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function renderContent(content: string) {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default async function TutorialDetailPage({
  params,
}: TutorialDetailPageProps) {
  const { slug } = await params;
  const tutorial = await getPublishedTutorialBySlug(slug);

  if (!tutorial) {
    notFound();
  }

  const contentBlocks = renderContent(tutorial.content);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),linear-gradient(rgba(15,23,42,0.95),rgba(15,23,42,0.98))]" />

        <div className="relative mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 text-sm font-medium tracking-[0.18em] text-slate-200 uppercase"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/25 bg-slate-900/80 text-cyan-300">
                <FiTerminal className="h-4 w-4" />
              </span>
              <span>Tutorial Library</span>
            </Link>

            <Link
              href="/tutorials"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-cyan-200"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back to tutorials
            </Link>
          </header>

          <section className="py-14 sm:py-20">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                <FiFolder className="h-3.5 w-3.5" />
                {tutorial.category.name}
              </span>
              <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300">
                {tutorial.level}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-200">
                <FiClock className="h-3.5 w-3.5" />
                {tutorial.readTime}
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {tutorial.title}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              {tutorial.description}
            </p>
          </section>
        </div>
      </div>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-12">
        <article className="rounded-[1.75rem] border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
              <FiBookOpen className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium tracking-[0.2em] text-cyan-300 uppercase">
                Tutorial Content
              </p>
              <p className="text-sm text-slate-400">
                Stored and delivered from PostgreSQL through Prisma
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {contentBlocks.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-8 text-slate-300"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        <aside className="rounded-[1.75rem] border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm font-medium tracking-[0.2em] text-teal-300 uppercase">
            Tutorial Info
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs font-medium tracking-[0.18em] text-slate-400 uppercase">
                Category
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {tutorial.category.name}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {tutorial.category.description ??
                  "Category description is not available yet."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs font-medium tracking-[0.18em] text-slate-400 uppercase">
                Level
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {tutorial.level}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs font-medium tracking-[0.18em] text-slate-400 uppercase">
                Reading time
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {tutorial.readTime}
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
