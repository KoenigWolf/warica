"use client";
import React, { useState, useCallback } from "react";
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
import { cn, typography } from "@/lib/design-system";
import type { MemberId } from "@/lib/types";

const PaymentsPage: React.FC = () => {
  const {
    state: { members, payments },
    addPayment,
    removePayment,
  } = useWarikanStore();

  // ナビゲーション
  const navigation = useCommonNavigation();

  // 入力値（ローカル状態）
  const [payerId, setPayerId] = useState(members[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  // 支払い追加ロジック（簡略化）
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
  const canProceedToResults = payments.length > 0;

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

      {/* タイトルセクション */}
      <section className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg mb-6 sm:mb-8">
        <BoldTitle>
          💸 支払い記録
        </BoldTitle>
        <p className={cn(typography.body.base, 'text-gray-600 mt-2')}>
          誰がいくら支払ったかを記録してください
        </p>
      </section>

      {/* 支払い一覧 */}
      <section className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn(typography.heading.h3, 'text-gray-800')}>
            📝 登録済み支払い
          </h3>
          <span className={cn(
            'px-3 py-1 text-sm sm:text-base font-medium rounded-full',
            payments.length > 0 
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-gray-100 text-gray-500'
          )}>
            {payments.length}件
          </span>
        </div>
        
        <PaymentList
          payments={payments}
          members={members}
          onRemovePayment={removePayment}
          emptyMessage="まだ支払いが登録されていません。下のフォームから支払いを追加しましょう。"
        />
      </section>

      {/* 新しい支払い追加フォーム */}
      <section className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg mb-6 sm:mb-8">
        <h3 className={cn(typography.heading.h3, 'text-gray-800 mb-4')}>
          ➕ 新しい支払いを追加
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="payment-member" className={cn(typography.body.base, 'font-medium text-gray-700')}>
              支払った人
            </Label>
            <Select
              value={payerId}
              onValueChange={setPayerId}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="メンバーを選択" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-base">
                        {member.name.charAt(0)}
                      </div>
                      {member.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-amount" className={cn(typography.body.base, 'font-medium text-gray-700')}>
              金額
            </Label>
            <Input
              id="payment-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="h-12"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="payment-description" className={cn(typography.body.base, 'font-medium text-gray-700')}>
              内容
            </Label>
            <Input
              id="payment-description"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="例: 居酒屋代、タクシー代"
              className="h-12"
            />
          </div>

          <div className="sm:col-span-2">
            <Button
              onClick={handleAdd}
              disabled={!canAdd}
              size="lg"
              variant="success"
              className="w-full"
            >
              支払いを追加
            </Button>
          </div>
        </div>
      </section>

      {/* 結果ページへの進行ボタン */}
      <section className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 shadow-lg mb-6 sm:mb-8">
        <div className="text-center space-y-4">
          <Button
            onClick={handleGoToResults}
            disabled={!canProceedToResults}
            variant={canProceedToResults ? "default" : "secondary"}
            size="lg"
            className="w-full sm:w-auto min-w-48"
          >
            {canProceedToResults ? (
              <span className="flex items-center gap-2">
                割り勘結果を見る ✨
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            ) : (
              "支払いを追加してください"
            )}
          </Button>
          
          {!canProceedToResults && (
            <p className={cn(
              typography.body.small,
              'text-gray-500'
            )}>
              最低1つの支払いが必要です
            </p>
          )}
        </div>
      </section>

      <ActionButtons />
    </PageContainer>
  );
};

export default PaymentsPage;
