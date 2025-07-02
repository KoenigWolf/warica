"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, motion, typography } from "@/lib/design-system";

/**
 * 世界最高水準ページコンテナ v2.0
 * - Glass Morphism + 高度余白システム
 * - 黄金比ベースレスポンシブレイアウト
 * - プレミアムタイポグラフィ統合
 * - アクセシビリティ・パフォーマンス最適化
 * - SSR対応・ハイドレーションエラー対策
 */

interface PageContainerProps {
  children: React.ReactNode;
  variant?: 'narrow' | 'default' | 'wide' | 'premium';
  className?: string;
  title?: string;
  subtitle?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  variant = 'default',
  className,
  title,
  subtitle
}) => {
  // クライアント専用状態
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // バリアント別レイアウト定義（黄金比ベース）
  const variantStyles = {
    narrow: 'max-w-md sm:max-w-lg',                    // モバイル特化
    default: 'max-w-lg sm:max-w-xl md:max-w-2xl',      // 標準レイアウト  
    wide: 'max-w-xl sm:max-w-2xl md:max-w-4xl',        // ワイドレイアウト
    premium: 'max-w-2xl sm:max-w-3xl md:max-w-5xl',    // プレミアム体験
  }[variant];

  return (
    <div className={cn(
      // 基本レイアウト（上部余白を削減）
      'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-6 py-4 sm:px-8 sm:py-6',
      isClient && motion.entrance.fadeIn,
      className
    )}>
      {/* メインコンテナ（Glass Morphism） */}
      <Card className={cn(
        // カードスタイル（スマホファースト、ホバー効果を削除）
        'w-full backdrop-blur-sm bg-white/80 shadow-2xl shadow-blue-500/10 rounded-3xl border border-white/20',
        variantStyles,
        isClient && motion.entrance.slideUp
      )}>
        <CardContent className={cn(
          // コンテンツ余白（上部を削減）
          'p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8',
          // プレミアムバリアント特別スタイル
          variant === 'premium' && 'p-6 sm:p-8 md:p-12 lg:p-16 space-y-8 sm:space-y-10'
        )}>
          {/* 動的ヘッダー（オプション） */}
          {(title || subtitle) && (
            <header className={cn(
              'text-center space-y-2',
              isClient && motion.entrance.slideDown
            )}>
              {title && (
                <h1 className={cn(
                  typography.heading.hero,
                  'bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'
                )}>
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className={cn(
                  typography.body.large,
                  'text-gray-600 max-w-2xl mx-auto'
                )}>
                  {subtitle}
                </p>
              )}
            </header>
          )}

          {/* メインコンテンツエリア */}
          <main className={cn(
            'relative',
            isClient && motion.entrance.zoom,
            // グラデーションオーバーレイ（プレミアム）
            variant === 'premium' && 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-50/20 before:to-indigo-50/20 before:rounded-xl before:-z-10'
          )}>
            {children}
          </main>

          {/* 装飾的要素（プレミアム限定） */}
          {variant === 'premium' && isClient && (
            <div className="absolute inset-0 pointer-events-none">
              {/* 装飾的光沢効果 */}
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-gradient-to-r from-violet-400/10 to-purple-400/10 rounded-full blur-3xl" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* フローティングアクセント（デザイン装飾） */}
      {isClient && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/5 to-indigo-400/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-violet-400/5 to-purple-400/5 rounded-full blur-3xl" />
        </div>
      )}
    </div>
  );
}; 