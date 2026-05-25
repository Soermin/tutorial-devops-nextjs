import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pingnode",
  description:
    "Pingnode adalah website tutorial yang menampilkan materi terbaru dan kategori aktif dalam satu tempat.",
  icons: {
    icon: "/Logo.png",
    shortcut: "/Logo.png",
    apple: "/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
