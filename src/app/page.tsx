import { Fragment } from "react";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FiActivity,
  FiArrowDown,
  FiArrowRight,
  FiCloud,
  FiCpu,
  FiGithub,
  FiLayers,
  FiMonitor,
  FiRadio,
  FiServer,
  FiSettings,
  FiTerminal,
  FiTool,
} from "react-icons/fi";
import { getLatestPublishedTutorials } from "@/lib/tutorials";

export const dynamic = "force-dynamic";

type Topic = {
  title: string;
  description: string;
  icon: IconType;
};

type InfrastructureStep = {
  title: string;
  detail: string;
  icon: IconType;
};

const featuredTopics: Topic[] = [
  {
    title: "IoT Systems",
    description:
      "Hands-on device telemetry, MQTT workflows, edge integrations, and dashboard-ready data pipelines.",
    icon: FiCpu,
  },
  {
    title: "Cloud Computing",
    description:
      "Deploy application services with clean architecture, containerized workloads, and infrastructure-aware patterns.",
    icon: FiCloud,
  },
  {
    title: "DevOps Pipeline",
    description:
      "Automate testing, building, and deployment flows with practical CI/CD steps you can reproduce locally.",
    icon: FiSettings,
  },
  {
    title: "Monitoring",
    description:
      "Instrument systems with metrics, health checks, and observability dashboards for fast troubleshooting.",
    icon: FiActivity,
  },
  {
    title: "Networking",
    description:
      "Understand service routing, reverse proxies, local networking, and deployment traffic flows with confidence.",
    icon: FiRadio,
  },
];

const infrastructureFlow: InfrastructureStep[] = [
  {
    title: "Laptop Development",
    detail:
      "Prototype locally with Next.js, TypeScript, Prisma, and a container-first workflow.",
    icon: FiMonitor,
  },
  {
    title: "GitHub",
    detail:
      "Track changes, review iterations, and keep infrastructure and application code versioned together.",
    icon: FiGithub,
  },
  {
    title: "Jenkins CI/CD",
    detail:
      "Run automated builds and package repeatable deployment steps for every validated update.",
    icon: FiTool,
  },
  {
    title: "Docker Compose",
    detail:
      "Bring application services, networking, and runtime dependencies up in a predictable stack.",
    icon: FiLayers,
  },
  {
    title: "VM Staging Server",
    detail:
      "Promote the stack to a realistic staging environment before production rollout.",
    icon: FiServer,
  },
];

const learningHighlights = [
  "Real deployment scenarios instead of isolated toy examples.",
  "Infrastructure context for app, database, reverse proxy, and CI/CD layers.",
  "Technical notes written for engineers who want to build and troubleshoot.",
];

export default async function Home() {
  const latestTutorials = await getLatestPublishedTutorials(4);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(45,212,191,0.12),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.95),rgba(15,23,42,0.98)),linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[length:100%_100%,68px_68px,68px_68px]" />

        <div className="relative">
          <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 pt-6 sm:px-8 lg:px-12">
            <Link
              href="/"
              className="flex items-center gap-3 text-sm font-medium tracking-[0.18em] text-slate-200 uppercase"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/25 bg-slate-900/80 text-cyan-300 shadow-[0_0_35px_rgba(34,211,238,0.15)]">
                <FiTerminal className="h-4 w-4" />
              </span>
              <span className="max-w-[14rem] leading-tight sm:max-w-none">
                IoT &amp; Cloud Engineering Notes
              </span>
            </Link>

            <div className="hidden rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs font-medium tracking-[0.2em] text-slate-300 uppercase md:block">
              IoT / Cloud / DevOps
            </div>
          </header>

          <section className="mx-auto grid w-full max-w-7xl gap-14 px-6 pb-20 pt-16 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:px-12 lg:pb-28 lg:pt-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium tracking-[0.24em] text-cyan-300 uppercase">
                Technical learning path for real infrastructure
              </div>

              <h1 className="mt-8 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Learn IoT, Cloud, and DevOps Through Real-World Projects
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Practical tutorials about IoT systems, cloud infrastructure,
                monitoring, automation, networking, and DevOps engineering.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/tutorials"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Explore Tutorials
                </Link>
                <a
                  href="#infrastructure"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:text-cyan-200"
                >
                  View Infrastructure
                </a>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-sm text-slate-400">Focus</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    End-to-end engineering
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-sm text-slate-400">Approach</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Practical implementation
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-sm text-slate-400">Audience</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Students &amp; junior engineers
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-[0_25px_80px_rgba(2,8,23,0.45)] backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-cyan-300">
                    Infrastructure-first learning
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Clean notes for modern engineering workflows
                  </h2>
                </div>
                <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-medium tracking-[0.2em] text-teal-300 uppercase">
                  Live Stack
                </span>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  "Next.js + TypeScript frontend with App Router structure.",
                  "Prisma and PostgreSQL for clean data access patterns.",
                  "Docker Compose, Nginx, and Jenkins for deployment flow.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                  >
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    <p className="text-sm leading-7 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between text-xs font-medium tracking-[0.22em] text-slate-400 uppercase">
                  <span>Workflow preview</span>
                  <span className="text-cyan-300">Validated path</span>
                </div>
                <div className="mt-5 flex flex-col gap-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                    <span>Source changes</span>
                    <span className="text-cyan-300">GitHub push</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                    <span>Pipeline automation</span>
                    <span className="text-cyan-300">Jenkins CI/CD</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                    <span>Service delivery</span>
                    <span className="text-cyan-300">Docker + Nginx</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-[0.22em] text-cyan-300 uppercase">
              Featured Topics
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Explore the core layers of modern infrastructure work
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Each topic is curated to connect concepts with practical delivery,
            deployment, troubleshooting, and system thinking.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {featuredTopics.map((topic) => {
            const Icon = topic.icon;

            return (
              <article
                key={topic.title}
                className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-cyan-400/30 hover:bg-slate-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">
                  {topic.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {topic.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:px-12">
        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium tracking-[0.22em] text-cyan-300 uppercase">
                Latest Tutorials
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                Start from real tutorial paths, not generic theory
              </h2>
            </div>

            <Link
              href="/tutorials"
              className="hidden text-sm font-medium text-cyan-300 transition hover:text-cyan-200 sm:inline-flex"
            >
              View all tutorials
            </Link>
          </div>

          <div className="mt-10 grid gap-4">
            {latestTutorials.length > 0 ? (
              latestTutorials.map((tutorial, index) => (
                <article
                  key={tutorial.slug}
                  className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-teal-400/30"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-sm font-semibold text-cyan-300">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <span className="text-xs font-medium tracking-[0.2em] text-slate-400 uppercase">
                          {tutorial.category.name}
                        </span>
                        <h3 className="mt-2 text-xl font-semibold text-white">
                          <Link
                            href={`/tutorials/${tutorial.slug}`}
                            className="transition hover:text-cyan-200"
                          >
                            {tutorial.title}
                          </Link>
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs font-medium text-slate-300">
                        {tutorial.level}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                        {tutorial.readTime}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-slate-400 sm:pl-16">
                    {tutorial.description}
                  </p>

                  <div className="mt-5 sm:pl-16">
                    <Link
                      href={`/tutorials/${tutorial.slug}`}
                      className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                    >
                      Read tutorial
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-6">
                <p className="text-lg font-semibold text-white">
                  No published tutorials yet
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Latest tutorials will appear here after the database has
                  content ready to publish.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 lg:p-8">
          <p className="text-sm font-medium tracking-[0.22em] text-teal-300 uppercase">
            Learning Direction
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            What you will practice in this platform
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            The homepage is designed to guide readers from application
            development into deployment, system operations, and infrastructure
            understanding without overwhelming the interface.
          </p>

          <div className="mt-8 space-y-4">
            {learningHighlights.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
              >
                <p className="text-sm leading-7 text-slate-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-cyan-400/15 bg-cyan-400/10 p-5">
            <p className="text-sm font-medium text-cyan-200">
              Main learning stack
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Next.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL, Docker
              Compose, Nginx, and Jenkins CI/CD.
            </p>
          </div>
        </aside>
      </section>

      <section
        id="infrastructure"
        className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-12"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-medium tracking-[0.22em] text-cyan-300 uppercase">
            DevOps Infrastructure Showcase
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            From development laptop to staging delivery
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
            A simple operational flow keeps the architecture readable while
            showing how code moves through version control, automation, and
            deployment.
          </p>
        </div>

        <div className="mt-10">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-6 lg:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-3">
              {infrastructureFlow.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === infrastructureFlow.length - 1;

                return (
                  <Fragment key={step.title}>
                    <article className="min-w-0 flex-1 rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10 text-teal-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold text-white">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-400">
                        {step.detail}
                      </p>
                    </article>

                    {!isLast && (
                      <div className="flex items-center justify-center text-cyan-300">
                        <FiArrowRight className="hidden h-5 w-5 lg:block" />
                        <FiArrowDown className="h-5 w-5 lg:hidden" />
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-400 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <p className="font-medium text-slate-300">
            IoT &amp; Cloud Engineering Notes
          </p>
          <p>
            Practical notes for IoT, Cloud, DevOps, Monitoring, and Networking
            projects.
          </p>
        </div>
      </footer>
    </main>
  );
}
