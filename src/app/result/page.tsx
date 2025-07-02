"use client";
import React, { useCallback } from "react";
import { useWarikanStore } from "../useWarikanStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/PageContainer";
import { SectionTitle, BoldTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";
import { PaymentList as EnhancedPaymentList } from "@/components/shared/PaymentItem";
import { useResultLogic, useCommonNavigation } from "../../lib/shared-logic";
import { cn, typography, advancedSpacing, motion, getModernCardClasses, colorSystem } from "@/lib/design-system";
import type { Payment, PaymentId } from "../../lib/types";

/**
 * 世界最高水準結果ページ v2.0
 * - Glass Morphism + プレミアム結果表示
 * - 黄金比ベース余白システム  
 * - 高度なデータビジュアライゼーション
 * - 完全アクセシビリティ対応
 */
const ResultPage: React.FC = () => {
  const {
    state: { eventName, members, payments },
    editPayment,
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

  // 編集・削除ハンドラー
  const handleEditPayment = useCallback((payment: Payment) => {
    editPayment(payment.id, {
      payerId: payment.payerId,
      amount: payment.amount,
      memo: payment.memo
    });
  }, [editPayment]);

  const handleRemovePayment = useCallback((id: unknown) => {
    removePayment(id as PaymentId);
  }, [removePayment]);

  return (
    <PageContainer variant="premium">
      {/* ページヘッダー */}
      <header className={cn(
        'text-center space-y-4',
        advancedSpacing.section.loose
      )}>
        <BoldTitle>割り勘結果</BoldTitle>
        {eventName && (
          <div className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full',
            'bg-blue-50/80 backdrop-blur-sm border border-blue-200/30'
          )}>
            <span className="text-lg">🎉</span>
            <span className={cn(typography.body.base, 'font-medium text-blue-700')}>
              {eventName}
            </span>
          </div>
        )}
        <p className={cn(
          typography.body.large,
          'text-gray-600 max-w-2xl mx-auto'
        )}>
          計算完了！誰がいくら受け取り/支払いするかを確認しましょう
        </p>
      </header>

      {/* メンバー清算金額リスト */}
      <section className={cn(
        'space-y-4',
        advancedSpacing.section.normal
      )}>
        <div className="flex items-center gap-3">
          <h3 className={cn(typography.heading.h3, 'text-gray-800')}>
            💰 各メンバーの清算金額
          </h3>
        </div>
        
        <div className={cn(
          getModernCardClasses('feature'),
          motion.entrance.slideUp
        )}>
          <div className="space-y-3">
            {resultLogic.display.balanceItems.map((item) => (
              <div 
                key={item.memberId}
                className={cn(
                  'flex items-center justify-between p-4 rounded-xl transition-all duration-200',
                  item.balance > 0 
                    ? 'bg-emerald-50/80 border border-emerald-200/50 hover:bg-emerald-50'
                    : item.balance < 0
                    ? 'bg-red-50/80 border border-red-200/50 hover:bg-red-50'
                    : 'bg-gray-50/80 border border-gray-200/50 hover:bg-gray-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                    item.balance > 0 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                      : item.balance < 0
                      ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white' 
                      : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                  )}>
                    {item.memberName.charAt(0)}
                  </div>
                  <div>
                    <p className={cn(typography.body.base, 'font-semibold text-gray-800')}>
                      {item.memberName}
                    </p>
                    <p className={cn(typography.body.small, 'text-gray-500')}>
                      {item.label}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={cn(
                    typography.heading.h4,
                    'font-bold',
                    item.balance > 0 ? 'text-emerald-600' : 
                    item.balance < 0 ? 'text-red-600' : 'text-gray-500'
                  )}>
                    {item.formattedBalance}円
                  </p>
                  <p className={cn(
                    typography.body.small,
                    'font-medium',
                    item.balance > 0 ? 'text-emerald-500' : 
                    item.balance < 0 ? 'text-red-500' : 'text-gray-400'
                  )}>
                    {item.balance > 0 ? '🎉 受け取り' : 
                     item.balance < 0 ? '💸 支払い' : '✅ 精算済み'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 送金リスト */}
      <section className={cn(
        'space-y-4',
        advancedSpacing.section.normal
      )}>
        <div className="flex items-center gap-3">
          <h3 className={cn(typography.heading.h3, 'text-gray-800')}>
            📤 送金リスト
          </h3>
          <span className={cn(
            'px-2 py-1 text-xs font-medium rounded-full',
            'bg-blue-100 text-blue-700'
          )}>
            最小{resultLogic.display.settlementItems.length}回
          </span>
        </div>

        <div className={cn(
          getModernCardClasses('normal'),
          motion.entrance.slideUp
        )}>
          {resultLogic.display.settlementItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🎊</div>
              <p className={cn(typography.body.base, 'text-gray-600 mb-1')}>
                全員精算済みです！
              </p>
              <p className={cn(typography.body.small, 'text-gray-500')}>
                送金の必要はありません
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {resultLogic.display.settlementItems.map((item, index) => (
                <div 
                  key={index}
                  className={cn(
                    'p-4 rounded-xl border border-blue-200/30 transition-all duration-200',
                    'bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm',
                    'hover:from-blue-50 hover:to-indigo-50 hover:shadow-md'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-medium text-white">
                          {item.from.charAt(0)}
                        </div>
                        <span className={cn(typography.body.base, 'font-semibold text-gray-800')}>
                          {item.from}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-medium text-white">
                          {item.to.charAt(0)}
                        </div>
                        <span className={cn(typography.body.base, 'font-semibold text-gray-800')}>
                          {item.to}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={cn(typography.heading.h4, 'font-bold text-blue-700')}>
                        {item.formattedAmount}円
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 支払い詳細セクション */}
      <section className={cn(
        'space-y-4',
        advancedSpacing.section.normal
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className={cn(typography.heading.h3, 'text-gray-800')}>
              📋 支払い詳細
            </h3>
            <span className={cn(
              'px-2 py-1 text-xs font-medium rounded-full',
              'bg-gray-100 text-gray-600'
            )}>
              {payments.length}件
            </span>
          </div>
        </div>

        <div className={cn(
          getModernCardClasses('normal'),
          motion.entrance.slideUp
        )}>
          <EnhancedPaymentList
            payments={payments}
            members={members}
            onEditPayment={handleEditPayment}
            onRemovePayment={handleRemovePayment}
            compact={false}
            emptyMessage={
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📝</div>
                <p className={cn(typography.body.base, 'text-gray-500')}>
                  支払い履歴はありません
                </p>
              </div>
            }
          />
        </div>
      </section>

      {/* アクションボタンセクション */}
      <section className={cn(
        'space-y-4 pt-6',
        advancedSpacing.section.normal
      )}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={() => navigation.goToPayments()}
            variant="secondary"
            size="lg"
            className={cn(motion.interaction.hover)}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              支払いを追加
            </span>
          </Button>
          
          <Button
            onClick={handleReset}
            variant="destructive"
            size="lg"
            className={cn(motion.interaction.hover)}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2M15 15v5h-.582M4.582 15A8.001 8.001 0 0019.418 11m0 0V11a8 8 0 10-15.356-2" />
              </svg>
              新しくはじめる
            </span>
          </Button>
        </div>
      </section>

      <ActionButtons />
    </PageContainer>
  );
};

export default ResultPage;
