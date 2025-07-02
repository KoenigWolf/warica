"use client";

import React from 'react';
import { cn, typography } from "@/lib/design-system";

/**
 * セクションタイトルコンポーネント v2.0
 * - シンプルで読みやすいデザイン
 * - スマホファースト対応
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
      'text-gray-800',
      className
    )}>
      {children}
    </Tag>
  );
};

// スペシャライズされたコンポーネント
export const HeroTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h1 className={cn(
    typography.heading.hero,
    'text-gray-800 mb-4',
    className
  )}>
    {children}
  </h1>
);

export const BoldTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h2 className={cn(
    typography.heading.h1,
    'text-gray-800 mb-3',
    className
  )}>
    {children}
  </h2>
); 