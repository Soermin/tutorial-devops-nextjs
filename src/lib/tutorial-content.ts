export const tutorialBlockTypes = [
  "heading1",
  "heading2",
  "heading3",
  "paragraph",
  "quote",
  "bulleted-list",
  "numbered-list",
  "code",
  "image",
] as const;

export type TutorialBlockType = (typeof tutorialBlockTypes)[number];
type TutorialTextBlockType = Exclude<TutorialBlockType, "image">;

export type TutorialContentBlock =
  | {
      id: string;
      type: TutorialTextBlockType;
      text: string;
      meta?: string;
    }
  | {
      id: string;
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    };

const textBlockTypeSet = new Set<TutorialBlockType>(tutorialBlockTypes);

function createBlockId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `block-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.replace(/\r\n/g, "\n").trim() : "";
}

function normalizeBlockText(type: TutorialBlockType, value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.replace(/\r\n/g, "\n");

  if (type === "code") {
    return normalized.trimEnd();
  }

  return normalized.trim();
}

export function createTutorialBlock(
  type: TutorialBlockType,
): TutorialContentBlock {
  if (type === "image") {
    return {
      id: createBlockId(),
      type,
      src: "",
      alt: "",
      caption: "",
    };
  }

  return {
    id: createBlockId(),
    type,
    text: "",
    meta: type === "code" ? "bash" : "",
  };
}

export function sanitizeTutorialBlocks(
  input: unknown,
): TutorialContentBlock[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const sanitizedBlocks: TutorialContentBlock[] = [];

  for (const item of input) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const candidate = item as Record<string, unknown>;
    const type = candidate.type;

    if (typeof type !== "string" || !textBlockTypeSet.has(type as TutorialBlockType)) {
      continue;
    }

    if (type === "image") {
      const src = normalizeText(candidate.src);

      if (!src) {
        continue;
      }

      sanitizedBlocks.push({
        id: typeof candidate.id === "string" && candidate.id ? candidate.id : createBlockId(),
        type,
        src,
        alt: normalizeText(candidate.alt),
        caption: normalizeText(candidate.caption),
      });

      continue;
    }

    const text = normalizeBlockText(type as TutorialTextBlockType, candidate.text);

    if (!text) {
      continue;
    }

    sanitizedBlocks.push({
      id: typeof candidate.id === "string" && candidate.id ? candidate.id : createBlockId(),
      type: type as TutorialTextBlockType,
      text,
      meta: normalizeText(candidate.meta),
    });
  }

  return sanitizedBlocks;
}

export function parseStoredTutorialBlocks(
  contentBlocks: null | string | undefined,
  fallbackContent = "",
): TutorialContentBlock[] {
  if (contentBlocks) {
    try {
      const parsed = JSON.parse(contentBlocks);
      const sanitized = sanitizeTutorialBlocks(parsed);

      if (sanitized.length > 0) {
        return sanitized;
      }
    } catch {
      // Ignore invalid stored JSON and fall back to plain paragraphs.
    }
  }

  return fallbackContent
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => ({
      id: createBlockId(),
      type: "paragraph" as const,
      text: paragraph,
      meta: "",
    }));
}

export function serializeTutorialBlocks(blocks: TutorialContentBlock[]) {
  return JSON.stringify(sanitizeTutorialBlocks(blocks));
}

export function hasTutorialContent(blocks: TutorialContentBlock[]) {
  return sanitizeTutorialBlocks(blocks).length > 0;
}

export function blocksToPlainText(blocks: TutorialContentBlock[]) {
  return sanitizeTutorialBlocks(blocks)
    .map((block) => {
      if (block.type === "image") {
        return [block.alt, block.caption].filter(Boolean).join(" ");
      }

      if (
        block.type === "bulleted-list" ||
        block.type === "numbered-list"
      ) {
        return block.text
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean)
          .join(" ");
      }

      return block.text;
    })
    .filter(Boolean)
    .join("\n\n");
}

export function estimateReadTimeFromBlocks(blocks: TutorialContentBlock[]) {
  const wordCount = blocksToPlainText(blocks)
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean).length;

  return `${Math.max(1, Math.ceil(wordCount / 180))} min read`;
}

export function formatTutorialBlockLabel(type: TutorialBlockType) {
  switch (type) {
    case "heading1":
      return "Heading 1";
    case "heading2":
      return "Heading 2";
    case "heading3":
      return "Heading 3";
    case "paragraph":
      return "Paragraph";
    case "quote":
      return "Quote";
    case "bulleted-list":
      return "Bullet List";
    case "numbered-list":
      return "Numbered List";
    case "code":
      return "Code";
    case "image":
      return "Image";
    default:
      return type;
  }
}
