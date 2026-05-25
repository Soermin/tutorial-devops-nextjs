import Link from "next/link";
import { SiteLogo } from "@/components/site-logo";
import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_24%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.96),rgba(15,23,42,0.98))]" />

        <div className="relative w-full max-w-5xl rounded-[2.5rem] border border-slate-800 bg-slate-900/70 p-6 shadow-[0_30px_120px_rgba(2,8,23,0.5)] backdrop-blur sm:p-8 lg:grid lg:grid-cols-[minmax(0,0.95fr)_420px] lg:gap-8">
          <section className="rounded-[2rem] border border-slate-800 bg-slate-950/60 p-6">
            <Link
              href="/"
              className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-200"
            >
              <SiteLogo priority />
              <span>Pingnode</span>
            </Link>

            <div className="mt-10">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-300">
                Area admin
              </p>
              <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Kelola tutorial, gambar, dan struktur konten dari satu dashboard.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Login sebagai admin untuk membuat tutorial baru, mengatur heading,
                gambar, list, code block, dan menerbitkan konten ke website utama.
              </p>
            </div>
          </section>

          <section className="mt-6 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 lg:mt-0">
            <p className="text-2xl font-semibold text-white">Masuk ke dashboard</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Gunakan akun admin yang tersimpan pada environment proyek.
            </p>

            <div className="mt-8">
              <AdminLoginForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
