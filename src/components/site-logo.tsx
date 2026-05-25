import Image from "next/image";

type SiteLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SiteLogo({
  className,
  imageClassName,
  priority = false,
}: SiteLogoProps) {
  return (
    <span
      className={joinClasses(
        "relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-cyan-400/25 bg-slate-900/80 shadow-[0_0_35px_rgba(34,211,238,0.15)]",
        className,
      )}
    >
      <Image
        src="/Logo.png"
        alt="Logo Pingnode"
        fill
        priority={priority}
        sizes="40px"
        className={joinClasses("object-contain p-1.5", imageClassName)}
      />
    </span>
  );
}
