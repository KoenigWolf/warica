import React from "react";
import { cn, componentStyles } from "@/lib/design-system";

/**
 * セクションタイトルコンポーネント
 * - 新デザインシステム統合
 * - 統一されたタイポグラフィとスペーシング
 * - アクセシビリティ配慮
 */

interface SectionTitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'sm' | 'base' | 'lg';
  className?: string;
  id?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ 
  children, 
  level = 1,
  size = 'base',
  className,
  id 
}) => {
  // レベル別のセマンティックタグ
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  // スタイルクラス
  const titleClasses = cn(
    componentStyles.sectionTitle.base,
    componentStyles.sectionTitle.sizes[size],
    className
  );

  return (
    <Tag
      id={id}
      className={titleClasses}
      tabIndex={0}
      role="heading"
      aria-level={level}
    >
      {children}
    </Tag>
  );
}; 