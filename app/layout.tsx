import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Impor Analytics (Anda lupa di file Anda, tapi ini ada di proyek Anda sebelumnya)
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- SEO METADATA DIMULAI DI SINI ---
export const metadata: Metadata = {
  // 1. metadataBase: Wajib diisi dengan URL produksi Anda
  metadataBase: new URL("https://globe-3d-delta.vercel.app"),

  // 2. Title: Judul default dan template untuk halaman lain
  title: {
    default: "Global Data Explorer - Interactive 3D Globe",
    template: "%s | Global Data Explorer",
  },

  // 3. Description: Deskripsi yang jelas
  description:
    "Explore countries and their statistics on an interactive 3D globe. Built with Next.js, React Three Fiber, and Shadcn UI.",

  // 4. Keywords: Membantu orang menemukan proyek Anda
  keywords: [
    "3D globe",
    "React Three Fiber",
    "Next.js",
    "data visualization",
    "countries",
    "global explorer",
    "Shadcn UI",
    "Andre Wijaya",
  ],

  // 5. OpenGraph (OG) Tags: Untuk tampilan di media sosial (WA, FB, Twitter)
  openGraph: {
    title: "Global Data Explorer",
    description: "An interactive 3D globe to explore countries and their data.",
    url: "https://globe-3d-delta.vercel.app/",
    siteName: "Global Data Explorer",
    images: [
      {
        url: "/logo.png", // Anda HARUS membuat file ini
        width: 1200,
        height: 630,
        alt: "Interactive 3D Globe",
      },
    ],
    type: "website",
  },

  // 6. Twitter Tags
  twitter: {
    card: "summary_large_image",
    title: "Global Data Explorer",
    description: "An interactive 3D globe to explore countries and their data.",
    images: ["/logo.png"], // Menggunakan gambar yang sama
  },

  // 7. Favicon dan Ikon Lainnya
  icons: {
    icon: "/logo.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};
// --- SEO METADATA SELESAI ---

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Tambahkan Analytics kembali */}
        <Analytics />
      </body>
    </html>
  );
}
