import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, componentStyles } from "@/lib/design-system";

/**
 * 全ページ共通の中央寄せ・レスポンシブなラッパー
 * - 新デザインシステム統合
 * - 簡潔で保守しやすい実装
 * - UI一貫性・アクセシビリティ対応
 */

interface PageContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'wide' | 'narrow';
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  variant = 'default',
  className 
}) => {
  // バリアント別の最大幅クラス
  const maxWidthClass = {
    narrow: 'max-w-sm sm:max-w-md',           // 384px / 448px
    default: 'max-w-md sm:max-w-lg md:max-w-xl', // 448px / 512px / 576px
    wide: 'max-w-lg sm:max-w-xl md:max-w-2xl',   // 512px / 576px / 672px
  }[variant];

  return (
    <div className={cn(componentStyles.pageContainer.base, className)}>
      <Card className={cn(componentStyles.pageContainer.card, maxWidthClass)}>
        <CardContent className={componentStyles.pageContainer.content}>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}; 