import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Google Fonts: Inter（ハイブランド系で使用される高級感のあるフォント）
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

// ビューポート設定（スマホ最適化）
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
  colorScheme: 'light dark',
};

// サイト全体のメタデータ（ミニマルで高級感）
export const metadata: Metadata = {
  title: "WARICAN",
  description: "Minimalist bill splitting application",
  applicationName: "WARICAN",
  authors: [{ name: "WARICAN" }],
  keywords: [
    "bill splitting", "warikan", "minimalist", "app", "calculator"
  ],
  openGraph: {
    title: "WARICAN",
    description: "Minimalist bill splitting application",
    type: "website",
    locale: "ja_JP",
    url: "https://warica.vercel.app",
    siteName: "WARICAN",
  },
  robots: "index,follow",
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-white text-gray-900 font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
