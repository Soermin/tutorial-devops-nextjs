import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { hasUploadedFile, saveTutorialImageUpload } from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "Anda tidak memiliki akses upload admin." },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || !hasUploadedFile(file)) {
    return NextResponse.json(
      { error: "Pilih file gambar terlebih dahulu." },
      { status: 400 },
    );
  }

  try {
    const url = await saveTutorialImageUpload(file);

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Upload gambar admin gagal.",
      },
      { status: 400 },
    );
  }
}
