import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FiArrowRight,
  FiBookOpen,
  FiClock,
  FiCompass,
  FiFolder,
  FiLayers,
  FiTerminal,
  FiTrendingUp,
} from "react-icons/fi";
import {
  getLatestPublishedTutorials,
  getTutorialCategories,
} from "@/lib/tutorials";

export const dynamic = "force-dynamic";

type SummaryCard = {
  label: string;
  value: string;
  detail: string;
  icon: IconType;
};

type HomepageSignal = {
  title: string;
  description: string;
  icon: IconType;
};

const homepageSignals: HomepageSignal[] = [
  {
    title: "Publish and surface",
    description:
      "Every tutorial you publish is ready to appear in the homepage feed without editing static sections.",
    icon: FiCompass,
  },
  {
    title: "Categories stay visible",
    description:
      "Category cards reflect the topics that already have published tutorials, keeping the homepage grounded in real content.",
    icon: FiLayers,
  },
  {
    title: "Latest stays current",
    description:
      "The newest published entries rise to the top, so the homepage always points visitors to fresh material first.",
    icon: FiClock,
  },
];

function formatTutorialCount(count: number) {
  return `${count} tutorial${count === 1 ? "" : "s"}`;
}

export default async function Home() {
  const [latestTutorials, categories] = await Promise.all([
    getLatestPublishedTutorials(6),
    getTutorialCategories(),
  ]);

  const activeCategories = categories.filter(
    (category) => category.tutorials.length > 0,
  );
  const totalTutorials = activeCategories.reduce(
    (count, category) => count + category.tutorials.length,
    0,
  );
  const highlightedTutorial = latestTutorials[0] ?? null;
  const featuredCategory =
    [...activeCategories].sort(
      (left, right) =>
        right.tutorials.length - left.tutorials.length ||
        left.name.localeCompare(right.name),
    )[0] ?? null;
  const visibleCategories = [...activeCategories]
    .sort(
      (left, right) =>
        right.tutorials.length - left.tutorials.length ||
        left.name.localeCompare(right.name),
    )
    .slice(0, 6);

  const summaryCards: SummaryCard[] = [
    {
      label: "Published now",
      value: String(totalTutorials),
      detail:
        totalTutorials > 0
          ? "Entries already visible on the homepage"
          : "Homepage is waiting for the first published tutorial",
      icon: FiBookOpen,
    },
    {
      label: "Active categories",
      value: String(activeCategories.length),
      detail:
        activeCategories.length > 0
          ? "Categories with published material"
          : "No category has published content yet",
      icon: FiFolder,
    },
    {
      label: "Leading category",
      value: featuredCategory?.name ?? "None yet",
      detail: featuredCategory
        ? formatTutorialCount(featuredCategory.tutorials.length)
        : "Publish content to surface category trends",
      icon: FiTrendingUp,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.94),rgba(15,23,42,0.98)),linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[length:100%_100%,72px_72px,72px_72px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-8 lg:px-12 lg:pb-24">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 text-sm font-medium tracking-[0.18em] text-slate-200 uppercase"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/25 bg-slate-900/80 text-cyan-300 shadow-[0_0_35px_rgba(34,211,238,0.15)]">
                <FiTerminal className="h-4 w-4" />
              </span>
              <span>Tutorial Library</span>
            </Link>

            <div className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs font-medium tracking-[0.2em] text-slate-300 uppercase">
              Content-led homepage
            </div>
          </header>

          <section className="grid gap-12 pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start lg:pt-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium tracking-[0.24em] text-cyan-300 uppercase">
                Built around the tutorials you publish
              </div>

              <h1 className="mt-8 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                A homepage that follows your content, not a fixed topic pitch
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Published tutorials now shape the homepage directly. The newest
                articles, active categories, and library signals update from the
                content you add instead of relying on static showcase sections.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/tutorials"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Explore library
                </Link>
                <a
                  href="#categories"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:text-cyan-200"
                >
                  Browse categories
                </a>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {summaryCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <article
                      key={card.label}
                      className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="mt-4 text-sm text-slate-400">{card.label}</p>
                      <p className="mt-2 text-xl font-semibold text-white">
                        {card.value}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {card.detail}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>

            <aside className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-[0_25px_80px_rgba(2,8,23,0.45)] backdrop-blur lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-cyan-300">
                    Library spotlight
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {highlightedTutorial
                      ? "Freshly published tutorial"
                      : "Waiting for the first published entry"}
                  </h2>
                </div>
                <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-medium tracking-[0.2em] text-teal-300 uppercase">
                  Auto-updated
                </span>
              </div>

              {highlightedTutorial ? (
                <div className="mt-8">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                      {highlightedTutorial.category.name}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs font-medium text-slate-300">
                      {highlightedTutorial.level}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs font-medium text-slate-300">
                      {highlightedTutorial.readTime}
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-semibold text-white">
                    {highlightedTutorial.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {highlightedTutorial.description}
                  </p>

                  <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                    <p className="text-xs font-medium tracking-[0.22em] text-slate-400 uppercase">
                      Why it matters here
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      The homepage now highlights your newest published
                      tutorial first, so visitors immediately land on content
                      that actually exists in the library.
                    </p>
                  </div>

                  <Link
                    href={`/tutorials/${highlightedTutorial.slug}`}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                  >
                    Read this tutorial
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-700 bg-slate-950/60 p-5">
                  <p className="text-lg font-semibold text-white">
                    No published tutorials yet
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    Once a tutorial is published, the homepage will start
                    surfacing it here and in the sections below automatically.
                  </p>
                </div>
              )}
            </aside>
          </section>
        </div>
      </div>

      <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-[0.22em] text-cyan-300 uppercase">
              Latest Tutorials
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              The newest published entries lead the homepage
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              The feed below is pulled from published tutorial records and
              sorted by the newest entries first.
            </p>
            <Link
              href="/tutorials"
              className="hidden text-sm font-medium text-cyan-300 transition hover:text-cyan-200 sm:inline-flex"
            >
              View all tutorials
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {latestTutorials.length > 0 ? (
            latestTutorials.map((tutorial, index) => (
              <article
                key={tutorial.slug}
                className="group rounded-[1.85rem] border border-slate-800 bg-slate-900/70 p-6 transition hover:border-cyan-400/30 hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-sm font-semibold text-cyan-300">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="flex flex-wrap justify-end gap-2">
                    <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                      {tutorial.category.name}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs font-medium text-slate-300">
                      {tutorial.level}
                    </span>
                  </div>
                </div>

                <h3 className="mt-6 text-2xl font-semibold text-white">
                  <Link
                    href={`/tutorials/${tutorial.slug}`}
                    className="transition group-hover:text-cyan-200"
                  >
                    {tutorial.title}
                  </Link>
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {tutorial.description}
                </p>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 text-sm text-slate-300">
                    <FiClock className="h-4 w-4 text-cyan-300" />
                    {tutorial.readTime}
                  </span>

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
            <div className="rounded-[1.85rem] border border-dashed border-slate-700 bg-slate-900/50 p-6 md:col-span-2 xl:col-span-3">
              <p className="text-xl font-semibold text-white">
                No published tutorials available yet
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                Publish your first tutorial and the homepage will start filling
                this latest section automatically.
              </p>
            </div>
          )}
        </div>
      </section>

      <section
        id="categories"
        className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-12"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-[0.22em] text-teal-300 uppercase">
              Browse by Category
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Categories only show up when they have published content
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            This keeps the homepage aligned with your real library instead of
            advertising empty sections that have nothing to open yet.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleCategories.length > 0 ? (
              visibleCategories.map((category) => (
                <article
                  key={category.slug}
                  className="rounded-[1.75rem] border border-slate-800 bg-slate-900/70 p-6 transition hover:border-teal-400/30 hover:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300">
                      <FiFolder className="h-4 w-4" />
                    </span>
                    <span className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs font-medium text-slate-300">
                      {formatTutorialCount(category.tutorials.length)}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-white">
                    {category.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {category.description ??
                      "This category will expand as more tutorials are published."}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-slate-700 bg-slate-900/50 p-6 md:col-span-2 xl:col-span-3">
                <p className="text-xl font-semibold text-white">
                  No active categories yet
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                  Categories will appear here after published tutorials start
                  filling the library.
                </p>
              </div>
            )}
          </div>

          <aside className="rounded-[1.9rem] border border-slate-800 bg-slate-900/70 p-6 lg:p-7">
            <p className="text-sm font-medium tracking-[0.22em] text-cyan-300 uppercase">
              Library signals
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Why this homepage stays relevant
            </h3>

            <div className="mt-8 space-y-4">
              {homepageSignals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <article
                    key={signal.title}
                    className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {signal.title}
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {signal.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 rounded-3xl border border-cyan-400/15 bg-cyan-400/10 p-5">
              <p className="text-sm font-medium text-cyan-200">
                Library snapshot
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {totalTutorials > 0
                  ? `${formatTutorialCount(totalTutorials)} across ${activeCategories.length} active categor${
                      activeCategories.length === 1 ? "y" : "ies"
                    }.`
                  : "Publish content to turn this homepage into a live tutorial hub."}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <footer className="border-t border-slate-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-400 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <p className="font-medium text-slate-300">Tutorial Library</p>
          <p>
            A content-first homepage that reflects the tutorials you publish.
          </p>
        </div>
      </footer>
    </main>
  );
}
