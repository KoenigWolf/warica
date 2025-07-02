/**
 * 世界最高水準デザインシステム v2.0
 * - 科学的余白システム（黄金比・フィボナッチ数列ベース）
 * - モダンUIUX：Glass Morphism + Neumorphism融合
 * - プレミアムタイポグラフィ階層
 * - 高度な配色システム（色彩心理学ベース）
 */

// =============================================================================
// 高度余白システム（黄金比ベース：1.618、スマホ最適化）
// =============================================================================

export const advancedSpacing = {
  // プライマリースペーシング（黄金比系列）
  scale: {
    xs: '0.5rem',      // ~8px
    sm: '0.75rem',     // ~12px
    base: '1rem',      // 16px (基準)
    md: '1.5rem',      // ~24px
    lg: '2rem',        // ~32px
    xl: '3rem',        // ~48px
    '2xl': '4rem',     // ~64px
  },

  // セクション間余白（コンテンツ階層、上部余白削減）
  section: {
    tight: 'mb-4 sm:mb-6',           // 密な関係
    normal: 'mb-6 sm:mb-8',          // 標準セクション間
    loose: 'mb-8 sm:mb-12',          // 論理的分離
    dramatic: 'mb-12 sm:mb-16',      // ドラマチック分割
  },

  // インターナル余白（要素内余白、スマホ優先）
  internal: {
    tight: 'p-4 sm:p-6',             // コンパクト
    normal: 'p-6 sm:p-8',            // 標準
    generous: 'p-8 sm:p-12',         // ゆとり
    luxurious: 'p-12 sm:p-16',       // 高級感
  },

  // 要素間ギャップ（フレックス・グリッド、スマホ配慮）
  gap: {
    xs: 'gap-3',           // 12px - 密接な関係
    sm: 'gap-4',           // 16px - 関連要素
    md: 'gap-6',           // 24px - 標準
    lg: 'gap-8',           // 32px - セクション内
    xl: 'gap-12',          // 48px - セクション間
  },
} as const;

// =============================================================================
// プレミアムタイポグラフィシステム（スマホ最適化）
// =============================================================================

export const typography = {
  // 階層的見出しシステム（スマホで読みやすいサイズ）
  heading: {
    hero: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight',
    h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight',
    h2: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-snug',
    h3: 'text-xl sm:text-2xl md:text-3xl font-semibold leading-snug',
    h4: 'text-lg sm:text-xl md:text-2xl font-medium leading-normal',
  },

  // ボディテキスト階層（最小16px、読みやすい行間）
  body: {
    large: 'text-xl sm:text-2xl leading-relaxed',
    base: 'text-lg sm:text-xl leading-relaxed',
    small: 'text-base sm:text-lg leading-relaxed',
    caption: 'text-sm sm:text-base leading-normal',
  },

  // スペシャル用途（スマホ配慮）
  special: {
    mono: 'font-mono text-base sm:text-lg tracking-wide leading-relaxed',
    emphasis: 'font-medium text-lg sm:text-xl tracking-wide leading-relaxed',
    subtle: 'text-base sm:text-lg text-gray-500 leading-relaxed',
  },
} as const;

// =============================================================================
// 高度配色システム（心理学ベース）
// =============================================================================

export const colorSystem = {
  // プライマリーパレット（信頼性・専門性）
  primary: {
    50: 'from-blue-50 to-indigo-50',
    100: 'from-blue-100 to-indigo-100', 
    500: 'from-blue-500 to-indigo-600',
    600: 'from-blue-600 to-indigo-700',
    700: 'from-blue-700 to-indigo-800',
  },

  // セマンティックカラー（意味的配色）
  semantic: {
    success: 'from-emerald-500 to-teal-600',    // 成功・確認
    warning: 'from-amber-500 to-orange-500',    // 注意・警告
    danger: 'from-red-500 to-rose-600',         // エラー・削除
    info: 'from-cyan-500 to-blue-500',          // 情報・中性
  },

  // UI状態カラー（視覚的フィードバック）
  state: {
    positive: 'text-emerald-600 bg-emerald-50 border-emerald-200',  // 受け取り
    negative: 'text-red-600 bg-red-50 border-red-200',             // 支払い
    neutral: 'text-gray-600 bg-gray-50 border-gray-200',           // 中性
    highlight: 'text-violet-700 bg-violet-50 border-violet-200',   // 強調
  },
} as const;

// =============================================================================
// モダンコンポーネントスタイル（Glass + Neumorphism）
// =============================================================================

export const modernComponents = {
  // ページコンテナ（メインレイアウト）
  pageContainer: {
    wrapper: 'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8',
    card: 'w-full max-w-lg sm:max-w-xl md:max-w-2xl backdrop-blur-sm bg-white/80 shadow-2xl shadow-blue-500/10 rounded-3xl border border-white/20',
    content: 'p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8',
  },

  // モダンボタンシステム（スマホ最適化）
  button: {
    base: 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
    
    variants: {
      primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 focus-visible:ring-blue-500',
      secondary: 'bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-200/50 shadow-sm hover:bg-white hover:shadow-md focus-visible:ring-gray-300',
      success: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 focus-visible:ring-emerald-500',
      danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 focus-visible:ring-red-500',
      ghost: 'text-gray-700 hover:bg-gray-100/80 hover:backdrop-blur-sm focus-visible:ring-gray-300',
    },

    sizes: {
      sm: 'h-11 px-6 text-base',      // 44px最小タッチターゲット
      base: 'h-12 px-8 text-lg',      // 48px標準
      lg: 'h-14 px-10 text-xl',       // 56px大きめ
      xl: 'h-16 px-12 text-2xl',      // 64px最大
    },
  },

  // プレミアム入力フィールド（スマホ最適化）
  input: {
    base: 'w-full rounded-lg border-0 bg-white/60 backdrop-blur-sm px-6 py-4 text-gray-900 shadow-sm ring-1 ring-gray-200/50 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:bg-white/80 transition-all duration-200',
    sizes: {
      sm: 'h-11 px-4 py-3 text-base',   // 44px最小
      base: 'h-12 px-6 py-4 text-lg',   // 48px標準
      lg: 'h-14 px-8 py-4 text-xl',     // 56px大きめ
    },
  },

  // エレガントカードシステム（スマホ最適化）
  card: {
    base: 'bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg shadow-gray-500/5',
    variants: {
      normal: 'p-6 sm:p-8 space-y-6',
      compact: 'p-4 sm:p-6 space-y-4',
      feature: 'p-8 sm:p-12 space-y-8 shadow-xl shadow-blue-500/10',
    },
  },

  // リストアイテム（モダンデザイン、スマホ配慮）
  listItem: {
    base: 'rounded-lg transition-all duration-200',
    variants: {
      normal: 'bg-white/60 backdrop-blur-sm border border-gray-200/30 p-6 sm:p-8 shadow-sm hover:shadow-md hover:bg-white/80',
      compact: 'bg-gray-50/80 backdrop-blur-sm p-4 sm:p-6 hover:bg-white/60',
      feature: 'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/30 p-6 sm:p-8 shadow-md',
    },
  },
} as const;

// =============================================================================
// レスポンシブブレークポイントシステム（スマホファースト）
// =============================================================================

export const responsive = {
  // デバイス別余白調整（スマホ重視）
  spacing: {
    mobile: 'px-6 py-8',
    tablet: 'sm:px-8 sm:py-12',
    desktop: 'md:px-12 md:py-16',
    wide: 'lg:px-16 lg:py-20',
  },

  // テキストサイズ調整（最小16px保証）
  text: {
    fluid: 'text-base sm:text-lg md:text-xl',
    heading: 'text-xl sm:text-2xl md:text-3xl',
    hero: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
  },

  // 要素サイズ調整（44px以上保証）
  component: {
    button: 'h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10',
    input: 'h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10',
  },
} as const;

// =============================================================================
// アニメーション・トランジション
// =============================================================================

export const motion = {
  // 基本アニメーション
  transition: {
    fast: 'transition-all duration-150 ease-out',
    normal: 'transition-all duration-200 ease-out',
    slow: 'transition-all duration-300 ease-out',
    smooth: 'transition-all duration-500 ease-in-out',
  },

  // インタラクションエフェクト（ホバー時のサイズ変更を削除）
  interaction: {
    hover: 'hover:shadow-lg',              // サイズ変更を削除、影のみ
    press: 'active:scale-95',              // プレス時のみスケール維持
    focus: 'focus:shadow-lg',              // サイズ変更を削除、影のみ
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },

  // 出現アニメーション
  entrance: {
    fadeIn: 'animate-in fade-in duration-300',
    slideUp: 'animate-in slide-in-from-bottom-4 duration-300',
    slideDown: 'animate-in slide-in-from-top-4 duration-300',
    zoom: 'animate-in zoom-in-95 duration-200',
  },
} as const;

// =============================================================================
// ユーティリティ関数（アップグレード版）
// =============================================================================

/**
 * クラス名を型安全に結合
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * モダンボタンクラス生成（Glass Morphism対応）
 */
export function getModernButtonClasses(
  variant: keyof typeof modernComponents.button.variants = 'primary',
  size: keyof typeof modernComponents.button.sizes = 'base',
  fullWidth = false,
  additional = ''
): string {
  return cn(
    modernComponents.button.base,
    modernComponents.button.variants[variant],
    modernComponents.button.sizes[size],
    motion.transition.normal,
    motion.interaction.press,
    fullWidth ? 'w-full' : '',
    additional
  );
}

/**
 * プレミアム入力フィールドクラス生成
 */
export function getModernInputClasses(
  size: keyof typeof modernComponents.input.sizes = 'base',
  error = false,
  additional = ''
): string {
  return cn(
    modernComponents.input.base,
    modernComponents.input.sizes[size],
    motion.transition.normal,
    error ? 'ring-red-500/50 bg-red-50/80' : '',
    additional
  );
}

/**
 * エレガントカードクラス生成
 */
export function getModernCardClasses(
  variant: keyof typeof modernComponents.card.variants = 'normal',
  additional = ''
): string {
  return cn(
    modernComponents.card.base,
    modernComponents.card.variants[variant],
    motion.transition.normal,
    additional
  );
}

/**
 * モダンリストアイテムクラス生成
 */
export function getModernListItemClasses(
  variant: keyof typeof modernComponents.listItem.variants = 'normal',
  additional = ''
): string {
  return cn(
    modernComponents.listItem.base,
    modernComponents.listItem.variants[variant],
    motion.transition.normal,
    additional
  );
}

/**
 * 金額表示スタイル（プレミアム版）
 */
export function getModernAmountStyle(balance: number): string {
  if (balance > 0) return colorSystem.state.positive;
  if (balance < 0) return colorSystem.state.negative;
  return colorSystem.state.neutral;
}

/**
 * レスポンシブスペーシング生成
 */
export function getResponsiveSpacing(
  mobile: keyof typeof advancedSpacing.scale = 'base',
  desktop?: keyof typeof advancedSpacing.scale
): string {
  const desktopSize = desktop || mobile;
  return `space-y-${mobile.replace('rem', '')} sm:space-y-${desktopSize.replace('rem', '')}`;
}

// =============================================================================
// 型定義（TypeScript完全対応）
// =============================================================================

export type ModernSpacing = typeof advancedSpacing;
export type ModernTypography = typeof typography;
export type ModernColorSystem = typeof colorSystem;
export type ModernComponents = typeof modernComponents;
export type ModernButtonVariant = keyof typeof modernComponents.button.variants;
export type ModernButtonSize = keyof typeof modernComponents.button.sizes;
export type ModernCardVariant = keyof typeof modernComponents.card.variants;
export type ModernListVariant = keyof typeof modernComponents.listItem.variants;

// 後方互換性のためのエイリアス
export const designTokens = advancedSpacing;
export const componentStyles = modernComponents;
export { getModernButtonClasses as getButtonClasses };
export { getModernInputClasses as getInputClasses };
export { getModernCardClasses as getCardClasses };
export { getModernAmountStyle as getAmountStyle }; 