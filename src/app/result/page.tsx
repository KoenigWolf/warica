"use client";
import React, { useCallback } from "react";
import { useWarikanStore } from "../useWarikanStore";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/PageContainer";
import { BoldTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";
import { PaymentList as EnhancedPaymentList } from "@/components/shared/PaymentItem";
import { useResultLogic, useCommonNavigation } from "../../lib/shared-logic";
import { cn, typography } from "@/lib/design-system";
import type { PaymentId } from "../../lib/types";

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
      {/* トップに戻るボタン */}
      <div className="mb-4">
        <Button
          onClick={navigation.goHome}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-800"
        >
          ← ホームに戻る
        </Button>
      </div>

      {/* ページヘッダー */}
      <section className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg mb-6 sm:mb-8">
        <BoldTitle>
          🎉 精算結果
        </BoldTitle>
        <div className="mt-4 text-center">
          <p className={cn(
            typography.body.large,
            'text-gray-600 leading-relaxed'
          )}>
            {eventName} の割り勘計算が完了しました！
          </p>
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className={cn(
              'bg-blue-50/80 rounded-lg p-3',
              'border border-blue-200/50'
            )}>
              <div className={cn(typography.heading.h4, 'text-blue-700 mb-1')}>
                {members.length}
              </div>
              <div className={cn(typography.body.small, 'text-blue-600')}>
                メンバー
              </div>
            </div>
            
            <div className={cn(
              'bg-emerald-50/80 rounded-lg p-3',
              'border border-emerald-200/50'
            )}>
              <div className={cn(typography.heading.h4, 'text-emerald-700 mb-1')}>
                {payments.length}
              </div>
              <div className={cn(typography.body.small, 'text-emerald-600')}>
                支払い
              </div>
            </div>
            
                         <div className={cn(
               'bg-violet-50/80 rounded-lg p-3',
               'border border-violet-200/50'
             )}>
               <div className={cn(typography.heading.h4, 'text-violet-700 mb-1')}>
                 ¥{resultLogic.calculations.totalAmount.toLocaleString()}
               </div>
               <div className={cn(typography.body.small, 'text-violet-600')}>
                 総額
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 各メンバーの清算金額 */}
      <section className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h3 className={cn(typography.heading.h3, 'text-gray-800')}>
            💰 受け取り/支払い金額を
          </h3>
        </div>
        
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-lg">
                  {item.memberName.charAt(0)}
                </div>
                <span className={cn(typography.body.base, 'font-medium text-gray-800')}>
                  {item.memberName}
                </span>
              </div>
              
              <div className="text-right">
                <div className={cn(
                  typography.heading.h4,
                  item.balance > 0 
                    ? 'text-emerald-600' 
                    : item.balance < 0 
                    ? 'text-red-600' 
                    : 'text-gray-500'
                )}>
                  {item.formattedBalance}
                </div>
                <div className={cn(
                  typography.body.small,
                  item.balance > 0 
                    ? 'text-emerald-500' 
                    : item.balance < 0 
                    ? 'text-red-500' 
                    : 'text-gray-400'
                )}>
                  {item.balance > 0 ? '受け取り' : item.balance < 0 ? '支払い' : '精算済み'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 送金リスト */}
      <section className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h3 className={cn(typography.heading.h3, 'text-gray-800')}>
            📤 送金リスト
          </h3>
          <span className={cn(
            'px-3 py-1 text-sm sm:text-base font-medium rounded-full',
            'bg-blue-100 text-blue-700'
          )}>
            最小{resultLogic.display.settlementItems.length}回
          </span>
        </div>

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
                key={`${item.from}-${item.to}-${index}`}
                className="flex items-center justify-between p-4 rounded-xl bg-blue-50/80 border border-blue-200/50 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center text-white font-medium text-base">
                    {item.from.charAt(0)}
                  </div>
                  <span className={cn(typography.body.base, 'text-gray-700')}>
                    {item.from}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={cn(typography.body.small, 'text-gray-500')}>→</span>
                  <span className={cn(typography.heading.h4, 'text-blue-600')}>
                    {item.formattedAmount}
                  </span>
                  <span className={cn(typography.body.small, 'text-gray-500')}>→</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={cn(typography.body.base, 'text-gray-700')}>
                    {item.to}
                  </span>
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-medium text-base">
                    {item.to.charAt(0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 支払い詳細セクション */}
      <section className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className={cn(typography.heading.h3, 'text-gray-800')}>
              📋 支払い詳細
            </h3>
            <span className={cn(
              'px-3 py-1 text-sm sm:text-base font-medium rounded-full',
              'bg-gray-100 text-gray-600'
            )}>
              {payments.length}件
            </span>
          </div>
        </div>

        <EnhancedPaymentList
          payments={payments}
          members={members}
          onRemovePayment={handleRemovePayment}
          emptyMessage="支払い履歴はありません"
        />
      </section>

      {/* 最終アクション */}
      <section className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={() => navigation.goToPayments()}
            variant="secondary"
            size="lg"
            className="w-full"
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
            className="w-full"
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
