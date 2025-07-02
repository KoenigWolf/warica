"use client";

import React from 'react';
import { cn, typography, colors } from "@/lib/design-system";

/**
 * ハイブランド セクションタイトル v3.0
 * - モノトーンカラーパレット
 * - ミニマルタイポグラフィ
 * - エレガントなスペーシング
 */

interface SectionTitleProps {
  children: React.ReactNode;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  spacing?: 'normal' | 'tight' | 'loose';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  level = 'h2',
  spacing = 'normal',
  className
}) => {
  const Tag = level;
  const typographyKey = level as keyof typeof typography.heading;
  const spacingClass = spacing === 'normal' ? 'mb-6 sm:mb-8' : 
                       spacing === 'tight' ? 'mb-4 sm:mb-6' : 'mb-8 sm:mb-12';

  return (
    <Tag className={cn(
      typography.heading[typographyKey],
      spacingClass,
      colors.text.primary,
      className
    )}>
      {children}
    </Tag>
  );
};

// ハイブランド専用コンポーネント
export const HeroTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h1 className={cn(
    typography.display.base,
    colors.text.primary,
    'mb-6',
    className
  )}>
    {children}
  </h1>
);

export const BoldTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h2 className={cn(
    typography.heading.h1,
    colors.text.primary,
    'mb-4',
    className
  )}>
    {children}
  </h2>
); 