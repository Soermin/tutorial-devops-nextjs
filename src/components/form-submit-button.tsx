"use client";

import { useFormStatus } from "react-dom";

type FormSubmitButtonProps = {
  className?: string;
  idleLabel: string;
  pendingLabel: string;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function FormSubmitButton({
  className,
  idleLabel,
  pendingLabel,
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={joinClasses(
        "inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-400/70",
        className,
      )}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
