/**
 * 実用的なデザインシステム
 * - Tailwind CSS完全統合
 * - 簡潔で保守しやすい設計
 * - 型安全性とIntelliSense対応
 */

// =============================================================================
// デザイントークン
// =============================================================================

export const designTokens = {
  // スペーシング（Tailwindクラス名ベース）
  spacing: {
    xs: 'gap-1 p-1',      // 4px
    sm: 'gap-2 p-2',      // 8px  
    base: 'gap-3 p-3',    // 12px
    md: 'gap-4 p-4',      // 16px
    lg: 'gap-6 p-6',      // 24px
    xl: 'gap-8 p-8',      // 32px
  },

  // フォントサイズ
  fontSize: {
    xs: 'text-xs',        // 12px
    sm: 'text-sm',        // 14px
    base: 'text-base',    // 16px
    lg: 'text-lg',        // 18px
    xl: 'text-xl',        // 20px
    '2xl': 'text-2xl',    // 24px
    '3xl': 'text-3xl',    // 30px
  },

  // コンポーネントサイズ
  componentSize: {
    sm: {
      height: 'h-8',
      padding: 'px-3 py-1.5',
      text: 'text-sm',
    },
    base: {
      height: 'h-9', 
      padding: 'px-4 py-2',
      text: 'text-base',
    },
    lg: {
      height: 'h-10',
      padding: 'px-6 py-2.5', 
      text: 'text-lg',
    },
  },

  // カラーパレット
  colors: {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    success: 'bg-green-600 text-white hover:bg-green-700', 
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  },

  // 状態カラー
  stateColors: {
    positive: 'text-green-600',  // 受け取り
    negative: 'text-red-600',    // 支払い
    neutral: 'text-gray-500',    // 精算不要
  },

  // シャドウ
  shadow: {
    none: 'shadow-none',
    sm: 'shadow-sm',
    base: 'shadow',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  },

  // ボーダー半径
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    base: 'rounded',
    md: 'rounded-md', 
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  },

  // レスポンシブ
  responsive: {
    mobile: 'w-full sm:w-auto',
    desktop: 'w-auto',
  },
} as const;

// =============================================================================
// コンポーネント別スタイル定義
// =============================================================================

export const componentStyles = {
  // ページコンテナ
  pageContainer: {
    base: 'flex min-h-screen items-center justify-center bg-gray-50 px-2 sm:px-4',
    card: 'w-full max-w-md sm:max-w-lg md:max-w-xl shadow-lg rounded-2xl',
    content: 'py-8 sm:py-12 px-4 sm:px-10 flex flex-col gap-4 sm:gap-8',
  },

  // ボタンスタイル
  button: {
    base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    variants: designTokens.colors,
    sizes: designTokens.componentSize,
  },

  // 入力フィールド
  input: {
    base: 'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    sizes: designTokens.componentSize,
  },

  // ラベル
  label: {
    base: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  },

  // カード
  card: {
    base: 'rounded-lg border bg-white shadow-sm',
    content: 'p-4',
    header: 'p-4 pb-2',
    footer: 'p-4 pt-2',
  },

  // リストアイテム
  listItem: {
    compact: 'flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg mb-2',
    normal: 'border border-gray-200 rounded-lg p-4 mb-3 bg-white shadow-sm hover:shadow-md transition-shadow',
  },

  // セクションタイトル
  sectionTitle: {
    base: 'text-gray-900 tracking-tight text-center sm:text-left focus:outline-none',
    sizes: {
      sm: 'text-lg font-semibold mb-2',
      base: 'text-2xl font-bold mb-4',
      lg: 'text-3xl font-extrabold mb-6',
    },
  },
} as const;

// =============================================================================
// ユーティリティ関数
// =============================================================================

/**
 * クラス名を結合
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * ボタンクラス生成
 */
export function getButtonClasses(
  variant: keyof typeof designTokens.colors = 'primary',
  size: keyof typeof designTokens.componentSize = 'base',
  fullWidth = false,
  additional = ''
): string {
  return cn(
    componentStyles.button.base,
    componentStyles.button.variants[variant],
    componentStyles.button.sizes[size].height,
    componentStyles.button.sizes[size].padding,
    componentStyles.button.sizes[size].text,
    fullWidth ? 'w-full' : '',
    additional
  );
}

/**
 * 入力フィールドクラス生成
 */
export function getInputClasses(
  size: keyof typeof designTokens.componentSize = 'base',
  error = false,
  additional = ''
): string {
  return cn(
    componentStyles.input.base,
    componentStyles.input.sizes[size].height,
    componentStyles.input.sizes[size].text,
    error ? 'border-red-500 focus-visible:ring-red-500' : '',
    additional
  );
}

/**
 * 金額表示用スタイル取得
 */
export function getAmountStyle(balance: number): string {
  if (balance > 0) return designTokens.stateColors.positive;
  if (balance < 0) return designTokens.stateColors.negative;
  return designTokens.stateColors.neutral;
}

/**
 * レスポンシブスペーシング
 */
export function getResponsiveSpacing(
  mobile: keyof typeof designTokens.spacing = 'base',
  desktop?: keyof typeof designTokens.spacing
): string {
  const mobileClass = designTokens.spacing[mobile];
  const desktopClass = desktop ? designTokens.spacing[desktop] : mobileClass;
  
  return cn(
    mobileClass,
    desktop ? `sm:${desktopClass}` : ''
  );
}

/**
 * カードスタイル生成
 */
export function getCardClasses(variant: 'compact' | 'normal' = 'normal'): string {
  return variant === 'compact' 
    ? componentStyles.listItem.compact
    : componentStyles.listItem.normal;
}

// =============================================================================
// 型定義
// =============================================================================

export type DesignTokens = typeof designTokens;
export type ComponentStyles = typeof componentStyles;
export type ButtonVariant = keyof typeof designTokens.colors;
export type ComponentSize = keyof typeof designTokens.componentSize;
export type SpacingSize = keyof typeof designTokens.spacing; 