import type { TutorialContentBlock } from "@/lib/tutorial-content";

type TutorialContentRendererProps = {
  blocks: TutorialContentBlock[];
  className?: string;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function renderListItems(text: string) {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function TutorialContentRenderer({
  blocks,
  className,
}: TutorialContentRendererProps) {
  return (
    <div className={joinClasses("space-y-6", className)}>
      {blocks.map((block) => {
        switch (block.type) {
          case "heading1":
            return (
              <h2
                key={block.id}
                className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"
              >
                {block.text}
              </h2>
            );
          case "heading2":
            return (
              <h3
                key={block.id}
                className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
              >
                {block.text}
              </h3>
            );
          case "heading3":
            return (
              <h4 key={block.id} className="text-xl font-semibold text-white">
                {block.text}
              </h4>
            );
          case "quote":
            return (
              <blockquote
                key={block.id}
                className="rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/10 px-6 py-5 text-base leading-8 text-cyan-50"
              >
                {block.text}
              </blockquote>
            );
          case "bulleted-list":
            return (
              <ul
                key={block.id}
                className="space-y-3 pl-6 text-base leading-8 text-slate-300"
              >
                {renderListItems(block.text).map((item, index) => (
                  <li key={`${block.id}-${index}`} className="list-disc marker:text-cyan-300">
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "numbered-list":
            return (
              <ol
                key={block.id}
                className="space-y-3 pl-6 text-base leading-8 text-slate-300"
              >
                {renderListItems(block.text).map((item, index) => (
                  <li key={`${block.id}-${index}`} className="list-decimal marker:text-cyan-300">
                    {item}
                  </li>
                ))}
              </ol>
            );
          case "code":
            return (
              <div
                key={block.id}
                className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950"
              >
                <div className="border-b border-slate-800 px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  {block.meta || "code"}
                </div>
                <pre className="overflow-x-auto px-5 py-4 text-sm leading-7 text-cyan-100">
                  <code>{block.text}</code>
                </pre>
              </div>
            );
          case "image":
            return (
              <figure key={block.id} className="space-y-3">
                <div className="overflow-hidden rounded-[1.85rem] border border-slate-800 bg-slate-950/80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.src}
                    alt={block.alt || "Tutorial illustration"}
                    className="max-h-[32rem] w-full object-contain"
                  />
                </div>
                {block.caption ? (
                  <figcaption className="text-sm leading-6 text-slate-400">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          case "paragraph":
          default:
            return (
              <p
                key={block.id}
                className="text-base leading-8 text-slate-300 sm:text-lg"
              >
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
