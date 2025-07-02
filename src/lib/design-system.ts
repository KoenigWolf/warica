/**
 * ハイブランド モノトーン デザインシステム v4.0
 * - ミニマルで洗練されたタイポグラフィ
 * - モノトーンカラーパレット
 * - 高級感のあるスペーシング
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
// ハイブランド タイポグラフィシステム
// =============================================================================

export const typography = {
  // ヘッダー階層（ミニマル・高級感）
  heading: {
    hero: 'text-4xl sm:text-5xl md:text-6xl font-light tracking-wide',
    h1: 'text-3xl sm:text-4xl md:text-5xl font-light tracking-wide',
    h2: 'text-2xl sm:text-3xl md:text-4xl font-light tracking-wide',
    h3: 'text-xl sm:text-2xl md:text-3xl font-normal tracking-wide',
    h4: 'text-lg sm:text-xl md:text-2xl font-normal tracking-wide',
    h5: 'text-base sm:text-lg font-medium tracking-wide',
    h6: 'text-base font-medium tracking-wide',
  },

  // ボディテキスト（読みやすさ重視）
  body: {
    large: 'text-lg sm:text-xl leading-relaxed font-light',
    base: 'text-base sm:text-lg leading-relaxed font-light',
    small: 'text-sm sm:text-base leading-relaxed font-light',
  },

  // ディスプレイテキスト（ブランド表現）
  display: {
    large: 'text-5xl sm:text-6xl md:text-7xl font-extralight tracking-widest',
    base: 'text-4xl sm:text-5xl md:text-6xl font-extralight tracking-widest',
    small: 'text-3xl sm:text-4xl md:text-5xl font-extralight tracking-widest',
  },

  // UI要素
  label: 'text-sm font-medium tracking-wide uppercase text-muted-foreground',
  caption: 'text-xs sm:text-sm text-muted-foreground font-light',
  code: 'font-mono text-sm bg-muted px-2 py-1 rounded-sm',
} as const;

// =============================================================================
// モノトーン カラーシステム
// =============================================================================

export const colors = {
  surface: {
    primary: 'bg-background border-border',
    secondary: 'bg-muted/30 border-border',
    elevated: 'bg-card border-border shadow-sm',
  },
  text: {
    primary: 'text-foreground',
    secondary: 'text-muted-foreground',
    tertiary: 'text-muted-foreground/60',
  },
  interactive: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-muted/50 text-foreground',
  }
} as const;

// =============================================================================
// ハイブランド スペーシング
// =============================================================================

export const spacing = {
  section: 'space-y-12 sm:space-y-16 md:space-y-20',
  component: 'space-y-6 sm:space-y-8',
  element: 'space-y-3 sm:space-y-4',
  tight: 'space-y-2',
} as const;

// =============================================================================
// 型定義
// =============================================================================

export type TypographyHeading = keyof typeof typography.heading;
export type TypographyBody = keyof typeof typography.body;
export type TypographyDisplay = keyof typeof typography.display; 