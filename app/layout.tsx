import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

export const metadata: Metadata = {
  title: "ポケモン図鑑",
  description: "ポケモン図鑑アプリ",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-blue-100 min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
