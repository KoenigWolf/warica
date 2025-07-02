/**
 * スマホファーストデザインシステム v3.0
 * - 軽量で必要最小限の機能
 * - スマホ最適化タイポグラフィ
 * - 実用的なユーティリティ
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// =============================================================================
// ユーティリティ関数
// =============================================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =============================================================================
// タイポグラフィシステム（スマホ最適化）
// =============================================================================

export const typography = {
  // ヘッダー階層（最小フォントサイズ16px以上保証）
  heading: {
    hero: 'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight',
    h1: 'text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight',
    h2: 'text-xl sm:text-2xl md:text-3xl font-bold tracking-tight',
    h3: 'text-lg sm:text-xl md:text-2xl font-semibold tracking-tight',
    h4: 'text-base sm:text-lg md:text-xl font-semibold tracking-tight',
    h5: 'text-base sm:text-lg font-medium tracking-tight',
    h6: 'text-base font-medium tracking-tight',
  },

  // ボディテキスト（16px以上保証）
  body: {
    large: 'text-lg sm:text-xl leading-relaxed',    // 18px+
    base: 'text-base sm:text-lg leading-relaxed',   // 16px+
    small: 'text-base leading-relaxed',             // 16px固定
  },

  // 特殊用途テキスト
  display: {
    large: 'text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight',
    base: 'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight',
    small: 'text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight',
  },

  // コンポーネント用
  caption: 'text-sm sm:text-base text-gray-600',
  code: 'font-mono text-sm sm:text-base bg-gray-100 px-2 py-1 rounded',
} as const;

// =============================================================================
// 型定義
// =============================================================================

export type TypographyHeading = keyof typeof typography.heading;
export type TypographyBody = keyof typeof typography.body;
export type TypographyDisplay = keyof typeof typography.display; 