"use client";

import React from "react";
import { cn, typography } from "@/lib/design-system";

/**
 * スマホファーストページコンテナ v3.0
 * - フルスクリーンレイアウト（カード制約なし）
 * - 最適化されたスマホ体験
 * - シンプルで高速なレンダリング
 */

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className,
  title,
  subtitle
}) => {
  return (
    <div className={cn(
      // フルスクリーンレイアウト（スマホ最適化）
      'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50',
      'px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12',
      className
    )}>
      {/* メインコンテンツコンテナ */}
      <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* 動的ヘッダー（オプション） */}
        {(title || subtitle) && (
          <header className="text-center space-y-2 mb-8">
            {title && (
              <h1 className={cn(
                typography.heading.hero,
                'text-gray-900'
              )}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className={cn(
                typography.body.large,
                'text-gray-600'
              )}>
                {subtitle}
              </p>
            )}
          </header>
        )}

        {/* メインコンテンツエリア */}
        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
}; 