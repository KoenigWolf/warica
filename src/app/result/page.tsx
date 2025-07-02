"use client";
import React, { useCallback } from "react";
import { useWarikanStore } from "../useWarikanStore";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/PageContainer";
import { BoldTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";
import { PaymentList as EnhancedPaymentList } from "@/components/shared/PaymentItem";
import { useResultLogic, useCommonNavigation } from "../../lib/shared-logic";
import { cn, typography, colors, spacing } from "@/lib/design-system";
import type { PaymentId } from "../../lib/types";

/**
 * ハイブランド 結果ページ v3.0
 * - モノトーンデザイン
 * - ミニマルインターフェース
 * - エレガントなデータ表示
 */
const ResultPage: React.FC = () => {
  const {
    state: { eventName, members, payments },
    isLoaded,
    removePayment,
    resetAll,
  } = useWarikanStore();

  // 共通ロジック使用
  const resultLogic = useResultLogic(members, payments);
  const navigation = useCommonNavigation();

  // 全リセット・トップ遷移
  const handleReset = useCallback(() => {
    resetAll();
    navigation.goHome();
  }, [resetAll, navigation]);

  // 削除ハンドラー
  const handleRemovePayment = useCallback((id: unknown) => {
    removePayment(id as PaymentId);
  }, [removePayment]);

  return (
    <PageContainer>
      {/* ナビゲーション */}
      <div className="mb-8">
        <Button
          onClick={navigation.goHome}
          variant="ghost"
          size="sm"
          className={cn(colors.text.secondary, 'hover:text-foreground font-light')}
        >
          ← Back to Home
        </Button>
      </div>

      {/* ページヘッダー */}
      <section className={cn(
        colors.surface.elevated,
        'p-6 sm:p-8 mb-8',
        spacing.element
      )}>
        <BoldTitle>
          Results
        </BoldTitle>
        <div className="mt-6 text-center">
          <p className={cn(
            typography.body.large,
            colors.text.secondary,
            'leading-relaxed mb-8'
          )}>
            Bill splitting calculation for {eventName} is complete.
          </p>
          
          <div className="grid grid-cols-3 gap-4">
            <div className={cn(
              colors.surface.secondary,
              'border p-4'
            )}>
              <div className={cn(typography.heading.h4, 'mb-2')}>
                {isLoaded ? members.length : 0}
              </div>
              <div className={cn(typography.caption, colors.text.tertiary)}>
                Members
              </div>
            </div>
            
            <div className={cn(
              colors.surface.secondary,
              'border p-4'
            )}>
              <div className={cn(typography.heading.h4, 'mb-2')}>
                {isLoaded ? payments.length : 0}
              </div>
              <div className={cn(typography.caption, colors.text.tertiary)}>
                Payments
              </div>
            </div>
            
            <div className={cn(
              colors.surface.secondary,
              'border p-4'
            )}>
              <div className={cn(typography.heading.h4, 'mb-2')}>
                ¥{isLoaded ? resultLogic.calculations.totalAmount.toLocaleString() : '0'}
              </div>
              <div className={cn(typography.caption, colors.text.tertiary)}>
                Total
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 各メンバーの清算金額 */}
      <section className={cn(
        colors.surface.elevated,
        'p-6 sm:p-8 mb-8'
      )}>
        <div className="flex items-center gap-3 mb-6">
          <h3 className={cn(typography.label)}>
            Settlement Amounts
          </h3>
        </div>
        
        <div className={spacing.element}>
          {isLoaded && resultLogic.display.balanceItems.map((item) => (
            <div 
              key={item.memberId}
              className={cn(
                'flex items-center justify-between p-4 border transition-colors duration-200',
                colors.surface.secondary,
                'hover:bg-muted/30'
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-10 h-10 border border-border flex items-center justify-center font-medium text-sm',
                  colors.text.secondary
                )}>
                  {item.memberName.charAt(0).toUpperCase()}
                </div>
                <span className={cn(typography.body.base, 'font-light')}>
                  {item.memberName}
                </span>
              </div>
              
              <div className="text-right">
                <div className={cn(
                  typography.heading.h4,
                  item.balance > 0 
                    ? 'text-foreground' 
                    : item.balance < 0 
                    ? 'text-destructive' 
                    : colors.text.tertiary
                )}>
                  {item.formattedBalance}
                </div>
                <div className={cn(
                  typography.caption,
                  item.balance > 0 
                    ? colors.text.secondary
                    : item.balance < 0 
                    ? 'text-destructive/60' 
                    : colors.text.tertiary
                )}>
                  {item.balance > 0 ? 'Receive' : item.balance < 0 ? 'Pay' : 'Settled'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 送金リスト */}
      <section className={cn(
        colors.surface.elevated,
        'p-6 sm:p-8 mb-8'
      )}>
        <div className="flex items-center gap-3 mb-6">
          <h3 className={cn(typography.label)}>
            Transfer List
          </h3>
                     <span className={cn(
             'px-3 py-1 text-xs font-medium border',
             colors.surface.secondary,
             colors.text.tertiary
           )}>
             {isLoaded ? resultLogic.display.settlementItems.length : 0} transactions
           </span>
        </div>

        {!isLoaded || resultLogic.display.settlementItems.length === 0 ? (
          <div className="text-center py-12">
            <p className={cn(typography.body.base, colors.text.secondary, 'mb-2')}>
              All members are settled!
            </p>
            <p className={cn(typography.caption, colors.text.tertiary)}>
              No transfers required
            </p>
          </div>
        ) : (
          <div className={spacing.element}>
            {isLoaded && resultLogic.display.settlementItems.map((item, index) => (
              <div 
                key={`${item.from}-${item.to}-${index}`}
                className={cn(
                  'flex items-center justify-between p-4 border transition-colors duration-200',
                  colors.surface.secondary,
                  'hover:bg-muted/30'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-8 h-8 border border-border flex items-center justify-center text-xs font-medium',
                    colors.text.secondary
                  )}>
                    {item.from.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={cn(typography.body.small, 'font-light')}>
                      {item.from}
                    </span>
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className={cn(typography.body.small, 'font-light')}>
                      {item.to}
                    </span>
                  </div>
                </div>
                
                <div className={cn(typography.heading.h4, 'font-light')}>
                  {item.formattedAmount}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 支払い履歴 */}
      <section className={cn(
        colors.surface.elevated,
        'p-6 sm:p-8 mb-8'
      )}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={cn(typography.label)}>
            Payment History
          </h3>
                     <span className={cn(
             'px-3 py-1 text-xs font-medium border',
             colors.surface.secondary,
             colors.text.tertiary
           )}>
             {isLoaded ? payments.length : 0}
           </span>
        </div>
        
        <EnhancedPaymentList
          payments={isLoaded ? payments : []}
          members={isLoaded ? members : []}
          onRemovePayment={handleRemovePayment}
          emptyMessage="No payment records found."
        />
      </section>

      {/* アクションボタン */}
      <section className={cn(
        colors.surface.elevated,
        'p-6 sm:p-8 mb-8'
      )}>
        <div className={cn('text-center', spacing.element)}>
          <Button
            onClick={handleReset}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto min-w-48 h-12 font-light tracking-wide"
          >
            Start New Calculation
          </Button>
          
          <p className={cn(
            typography.caption,
            'mt-4'
          )}>
            This will clear all data and return to the beginning
          </p>
        </div>
      </section>

      <ActionButtons />
    </PageContainer>
  );
};

export default ResultPage;
