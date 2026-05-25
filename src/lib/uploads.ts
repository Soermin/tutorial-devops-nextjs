import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_UPLOAD_SIZE = 4 * 1024 * 1024;

const mimeExtensionMap: Record<string, string> = {
  "image/gif": ".gif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export function hasUploadedFile(file: File | null | undefined) {
  return Boolean(file && file.size > 0);
}

function getFileExtension(file: File) {
  const normalizedName = file.name.toLowerCase();
  const extension = path.extname(normalizedName);

  if (extension) {
    return extension;
  }

  return mimeExtensionMap[file.type] ?? "";
}

export async function saveTutorialImageUpload(file: File) {
  if (!hasUploadedFile(file)) {
    throw new Error("No image file was provided.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are supported.");
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Image size must be smaller than 4 MB.");
  }

  const extension = getFileExtension(file);

  if (!extension || !Object.values(mimeExtensionMap).includes(extension)) {
    throw new Error("Unsupported image format. Use PNG, JPG, WEBP, or GIF.");
  }

  const uploadDirectory = path.join(
    process.cwd(),
    "public",
    "uploads",
    "tutorials",
  );

  await mkdir(uploadDirectory, { recursive: true });

  const fileName = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  const filePath = path.join(uploadDirectory, fileName);
  const bytes = await file.arrayBuffer();

  await writeFile(filePath, Buffer.from(bytes));

  return `/uploads/tutorials/${fileName}`;
}
