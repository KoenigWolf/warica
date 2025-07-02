"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useWarikanStore } from "../useWarikanStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { PageContainer } from "@/components/PageContainer";
import { BoldTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";
import { PaymentList } from "@/components/shared/PaymentItem";
import { useCommonNavigation } from "../../lib/shared-logic";
import { cn, typography, colors, spacing } from "@/lib/design-system";
import type { MemberId } from "@/lib/types";

/**
 * ハイブランド 支払いページ v3.0
 * - モノトーンデザイン
 * - ミニマルインターフェース
 * - 高級感のあるレイアウト
 */
const PaymentsPage: React.FC = () => {
  const {
    state: { members, payments },
    isLoaded,
    addPayment,
    removePayment,
  } = useWarikanStore();

  // ナビゲーション
  const navigation = useCommonNavigation();

  // 入力値（ローカル状態）
  const [payerId, setPayerId] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  // メンバーロード後に初期payerIdを設定
  React.useEffect(() => {
    if (isLoaded && members.length > 0 && !payerId) {
      setPayerId(members[0].id);
    }
  }, [isLoaded, members, payerId]);

  // 支払い追加ロジック
  const handleAdd = useCallback(() => {
    const validAmount = Number(amount);
    if (!payerId || isNaN(validAmount) || validAmount <= 0) {
      return;
    }

    addPayment(payerId as MemberId, validAmount, memo || undefined);
    setAmount("");
    setMemo("");
  }, [payerId, amount, memo, addPayment]);

  // 結果ページへの進行
  const handleGoToResults = useCallback(() => {
    navigation.goToResults();
  }, [navigation]);

  // 追加ボタンの有効性チェック
  const canAdd = !!(
    payerId &&
    amount &&
    !isNaN(Number(amount)) &&
    Number(amount) > 0
  );

  // 結果ページに進行可能かチェック
  const canProceedToResults = isLoaded && payments.length > 0;

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

      {/* タイトルセクション */}
      <section className={cn(
        colors.surface.elevated,
        'p-6 sm:p-8 mb-8',
        spacing.element
      )}>
        <BoldTitle>
          Payments
        </BoldTitle>
        <p className={cn(typography.body.base, colors.text.secondary, 'mt-4')}>
          Record who paid for what expenses
        </p>
      </section>

      {/* 支払い一覧 */}
      <section className={cn(
        colors.surface.elevated,
        'p-6 sm:p-8 mb-8'
      )}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={cn(typography.label)}>
            Recorded Payments
          </h3>
                     <span className={cn(
             'px-3 py-1 text-xs font-medium border',
             colors.surface.secondary,
             colors.text.tertiary
           )}>
             {isLoaded ? payments.length : 0}
           </span>
        </div>
        
        <PaymentList
          payments={isLoaded ? payments : []}
          members={isLoaded ? members : []}
          onRemovePayment={removePayment}
          emptyMessage="No payments recorded yet. Add payments using the form below."
        />
      </section>

      {/* 新しい支払い追加フォーム */}
      <section className={cn(
        colors.surface.elevated,
        'p-6 sm:p-8 mb-8'
      )}>
        <h3 className={cn(typography.label, 'mb-6')}>
          Add New Payment
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className={spacing.tight}>
            <Label htmlFor="payment-member" className={cn(typography.label, 'mb-3 block')}>
              Payer
            </Label>
            <Select
              value={payerId}
              onValueChange={setPayerId}
            >
              <SelectTrigger className="h-12 font-light">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {isLoaded && members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-6 h-6 border border-border flex items-center justify-center text-xs font-medium',
                        colors.text.secondary
                      )}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      {member.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={spacing.tight}>
            <Label htmlFor="payment-amount" className={cn(typography.label, 'mb-3 block')}>
              Amount
            </Label>
            <Input
              id="payment-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="h-12 font-light"
            />
          </div>

          <div className={cn(spacing.tight, 'sm:col-span-2')}>
            <Label htmlFor="payment-description" className={cn(typography.label, 'mb-3 block')}>
              Description
            </Label>
            <Input
              id="payment-description"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="e.g. Restaurant, Taxi, Hotel"
              className="h-12 font-light"
            />
          </div>

          <div className="sm:col-span-2">
            <Button
              onClick={handleAdd}
              disabled={!canAdd}
              size="lg"
              className="w-full h-12 font-light tracking-wide"
            >
              Add Payment
            </Button>
          </div>
        </div>
      </section>

      {/* 結果ページへの進行ボタン */}
      <section className={cn(
        colors.surface.elevated,
        'p-6 sm:p-8 mb-8'
      )}>
        <div className={cn('text-center', spacing.element)}>
          <Button
            onClick={handleGoToResults}
            disabled={!canProceedToResults}
            variant={canProceedToResults ? "default" : "secondary"}
            size="lg"
            className="w-full sm:w-auto min-w-48 h-12 font-light tracking-wide"
          >
            {canProceedToResults ? (
              <span className="flex items-center gap-3">
                Calculate Results
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            ) : (
              "Add payments to continue"
            )}
          </Button>
          
          {!canProceedToResults && (
            <p className={cn(
              typography.caption,
              'mt-4'
            )}>
              At least one payment is required
            </p>
          )}
        </div>
      </section>

      <ActionButtons />
    </PageContainer>
  );
};

export default PaymentsPage;
