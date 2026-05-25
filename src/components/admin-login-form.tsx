"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAdminAction } from "@/app/admin/actions";
import {
  initialAdminActionState,
  type AdminActionState,
} from "@/lib/admin-action-state";
import { FormSubmitButton } from "@/components/form-submit-button";

export function AdminLoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState<
    AdminActionState,
    FormData
  >(loginAdminAction, initialAdminActionState);

  useEffect(() => {
    if (state.status === "success" && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [router, state.redirectTo, state.status]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="text-sm font-medium text-slate-200"
        >
          Username admin
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
          placeholder="Masukkan username admin"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-200"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
          placeholder="Masukkan password admin"
        />
      </div>

      {state.status === "error" ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {state.message}
        </div>
      ) : null}

      <FormSubmitButton
        idleLabel="Masuk ke dashboard"
        pendingLabel="Memeriksa akses..."
        className="w-full"
      />
    </form>
  );
}
