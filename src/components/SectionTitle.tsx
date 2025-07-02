import React from "react";
import { cn, typography, motion, advancedSpacing } from "@/lib/design-system";

/**
 * 世界最高水準セクションタイトル v2.0
 * - プレミアムタイポグラフィ階層
 * - グラデーションテキスト・アニメーション効果
 * - 科学的余白システム（黄金比ベース）
 * - セマンティックHTML・アクセシビリティ完全対応
 */

interface SectionTitleProps {
  children: React.ReactNode;
  level?: 'hero' | 'h1' | 'h2' | 'h3' | 'h4';
  variant?: 'default' | 'gradient' | 'elegant' | 'bold';
  alignment?: 'left' | 'center' | 'right';
  spacing?: 'tight' | 'normal' | 'loose' | 'dramatic';
  className?: string;
  id?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  level = 'h2',
  variant = 'default',
  alignment = 'center',
  spacing = 'normal',
  className,
  id,
}) => {
  // HTML要素マッピング
  const Element = level === 'hero' ? 'h1' : level;

  // タイポグラフィスタイル
  const typographyClass = typography.heading[level];

  // バリアント別スタイル
  const variantStyles = {
    default: 'text-gray-900',
    gradient: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent',
    elegant: 'text-gray-800 tracking-wide font-light',
    bold: 'text-gray-900 font-black tracking-tight',
  }[variant];

  // 配置スタイル
  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment];

  // 余白スタイル（黄金比ベース）
  const spacingClass = advancedSpacing.section[spacing];

  return (
    <Element
      id={id}
      className={cn(
        // ベースタイポグラフィ
        typographyClass,
        // バリアントスタイル
        variantStyles,
        // 配置・余白
        alignmentClass,
        spacingClass,
        // アニメーション効果
        motion.entrance.slideDown,
        motion.transition.smooth,
        // アクセシビリティ
        'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-4',
        // レスポンシブ調整
        'leading-tight sm:leading-tight md:leading-tight',
        // カスタムクラス
        className
      )}
      // アクセシビリティ属性
      tabIndex={0}
      role="heading"
      aria-level={getAriaLevel(level)}
    >
      {/* グラデーントバリアント特別効果 */}
      {variant === 'gradient' && (
        <span className="relative">
          {children}
          {/* 光沢効果オーバーレイ */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse opacity-30" />
        </span>
      )}
      
      {/* その他のバリアント */}
      {variant !== 'gradient' && children}

      {/* エレガントバリアント装飾線 */}
      {variant === 'elegant' && (
        <div className={cn(
          'mx-auto mt-3 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent',
          alignment === 'left' ? 'ml-0 w-16' : '',
          alignment === 'right' ? 'mr-0 w-16' : '',
          alignment === 'center' ? 'w-24' : ''
        )} />
      )}
    </Element>
  );
};

/**
 * ARIA Level マッピングヘルパー
 */
function getAriaLevel(level: SectionTitleProps['level']): number {
  const levelMap = {
    hero: 1,
    h1: 1,
    h2: 2,
    h3: 3,
    h4: 4,
  };
  return levelMap[level || 'h2'];
}

/**
 * 特殊用途コンポーネント
 */

// ページヒーロータイトル
export const HeroTitle: React.FC<Omit<SectionTitleProps, 'level'>> = (props) => (
  <SectionTitle level="hero" variant="gradient" spacing="dramatic" {...props} />
);

// サブセクションタイトル  
export const SubTitle: React.FC<Omit<SectionTitleProps, 'level'>> = (props) => (
  <SectionTitle level="h3" variant="elegant" spacing="normal" {...props} />
);

// 強調タイトル
export const BoldTitle: React.FC<Omit<SectionTitleProps, 'level' | 'variant'>> = (props) => (
  <SectionTitle level="h2" variant="bold" spacing="loose" {...props} />
); 