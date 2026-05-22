import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiFolder,
  FiTerminal,
} from "react-icons/fi";
import {
  getPublishedTutorials,
  getTutorialCategories,
} from "@/lib/tutorials";

export const dynamic = "force-dynamic";

export default async function TutorialsPage() {
  const [tutorials, categories] = await Promise.all([
    getPublishedTutorials(),
    getTutorialCategories(),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),linear-gradient(rgba(15,23,42,0.95),rgba(15,23,42,0.98))]" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 text-sm font-medium tracking-[0.18em] text-slate-200 uppercase"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/25 bg-slate-900/80 text-cyan-300">
                <FiTerminal className="h-4 w-4" />
              </span>
              <span>IoT &amp; Cloud Engineering Notes</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-cyan-200"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back to homepage
            </Link>
          </header>

          <section className="py-14 sm:py-20">
            <p className="text-sm font-medium tracking-[0.22em] text-cyan-300 uppercase">
              Tutorials Library
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Database-driven tutorials for IoT, Cloud, and DevOps learning
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Browse published tutorials organized by category, with practical
              descriptions, learning level, and estimated reading time.
            </p>
          </section>
        </div>
      </div>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_320px] lg:px-12">
        <div className="space-y-4">
          {tutorials.length > 0 ? (
            tutorials.map((tutorial) => (
              <article
                key={tutorial.slug}
                className="rounded-[1.75rem] border border-slate-800 bg-slate-900/70 p-6 transition hover:border-cyan-400/25 hover:bg-slate-900"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-[0.2em] text-slate-400 uppercase">
                      <span>{tutorial.category.name}</span>
                      <span className="text-slate-600">/</span>
                      <span>{tutorial.level}</span>
                    </div>

                    <h2 className="mt-3 text-2xl font-semibold text-white">
                      <Link
                        href={`/tutorials/${tutorial.slug}`}
                        className="transition hover:text-cyan-200"
                      >
                        {tutorial.title}
                      </Link>
                    </h2>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    <FiClock className="h-3.5 w-3.5" />
                    {tutorial.readTime}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {tutorial.description}
                </p>

                <div className="mt-6">
                  <Link
                    href={`/tutorials/${tutorial.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                  >
                    Open tutorial
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-700 bg-slate-900/50 p-6">
              <p className="text-xl font-semibold text-white">
                No tutorials published yet
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Add and publish tutorial records in PostgreSQL to populate this
                page dynamically.
              </p>
            </div>
          )}
        </div>

        <aside className="rounded-[1.75rem] border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300">
              <FiFolder className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium tracking-[0.2em] text-teal-300 uppercase">
                Categories
              </p>
              <p className="text-sm text-slate-400">
                Seeded tutorial domains
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {categories.map((category) => (
              <div
                key={category.slug}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {category.name}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {category.description ?? "Category description coming soon."}
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300">
                    {category.tutorials.length}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-cyan-200">
              <FiBookOpen className="h-4 w-4" />
              Published tutorials
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {tutorials.length} article{tutorials.length === 1 ? "" : "s"} ready
              to explore from the database.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
