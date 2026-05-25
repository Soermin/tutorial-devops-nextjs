import Link from "next/link";
import { FiHome, FiLogOut, FiPlusCircle } from "react-icons/fi";
import { logoutAdminAction } from "@/app/admin/actions";
import { SiteLogo } from "@/components/site-logo";

type AdminShellProps = {
  action?: React.ReactNode;
  children: React.ReactNode;
  currentPath: "/admin" | "/admin/tutorials/new";
  description: string;
  title: string;
};

function navigationLinkClasses(
  currentPath: AdminShellProps["currentPath"],
  href: AdminShellProps["currentPath"],
) {
  if (currentPath === href) {
    return "border-cyan-400/30 bg-cyan-400/10 text-cyan-200";
  }

  return "border-slate-800 bg-slate-900/70 text-slate-300 hover:border-cyan-400/20 hover:text-cyan-200";
}

export function AdminShell({
  action,
  children,
  currentPath,
  description,
  title,
}: AdminShellProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.95),rgba(15,23,42,0.98))]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-6 sm:px-8 lg:px-12">
          <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="flex items-center gap-3 text-sm font-medium tracking-[0.18em] text-slate-200 uppercase"
              >
                <SiteLogo priority />
                <span>Pingnode</span>
              </Link>

              <nav className="flex flex-wrap items-center gap-3">
                <Link
                  href="/admin"
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${navigationLinkClasses(
                    currentPath,
                    "/admin",
                  )}`}
                >
                  <FiHome className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/admin/tutorials/new"
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${navigationLinkClasses(
                    currentPath,
                    "/admin/tutorials/new",
                  )}`}
                >
                  <FiPlusCircle className="h-4 w-4" />
                  Tutorial Baru
                </Link>
              </nav>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {action}
              <form action={logoutAdminAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400/20 hover:text-cyan-200"
                >
                  <FiLogOut className="h-4 w-4" />
                  Keluar
                </button>
              </form>
            </div>
          </header>

          <section className="pt-10">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-300">
              Admin dashboard
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              {description}
            </p>
          </section>
        </div>
      </div>

      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        {children}
      </section>
    </main>
  );
}
