import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Google Fonts: Geist Sans / Mono をCSS変数として定義
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// サイト全体のメタデータ（SEO・OGPにも利用可）
export const metadata: Metadata = {
  title: "warica - シンプル割り勘アプリ",
  description: "イベント名・メンバー・支払いを入力するだけで、簡単に割り勘計算！",
  applicationName: "シンプル割り勘アプリ",
  authors: [{ name: "WarikanApp Project" }],
  keywords: [
    "割り勘", "Warikan", "精算", "飲み会", "グループ", "計算", "Webアプリ", "シンプル", "無料"
  ],
  openGraph: {
    title: "シンプル割り勘アプリ",
    description: "すぐに始められる割り勘計算。誰でも手軽に、正確に。ローカル保存で個人利用にも安心。",
    type: "website",
    locale: "ja_JP",
    url: "https://your-domain.example", // 公開URLに応じて変更
    siteName: "シンプル割り勘アプリ",
  },
  robots: "index,follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
