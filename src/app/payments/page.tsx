"use client";
import React, { useState, useCallback } from "react";
import { useWarikanStore } from "../useWarikanStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PageContainer } from "@/components/PageContainer";
import { BoldTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";
import { PaymentList } from "@/components/shared/PaymentItem";
import { usePaymentFormLogic, useCommonNavigation } from "../../lib/shared-logic";
import { cn, typography, advancedSpacing, motion, getModernCardClasses } from "@/lib/design-system";

/**
 * 世界最高水準支払いページ v2.0
 * - Glass Morphism + プレミアムフォームデザイン
 * - 黄金比ベース余白システム
 * - 高度なインタラクション・バリデーション
 * - 完全アクセシビリティ対応
 */
const PaymentsPage: React.FC = () => {
  const {
    state: { members, payments },
    addPayment,
    removePayment,
  } = useWarikanStore();

  // 共通ロジック使用
  const paymentLogic = usePaymentFormLogic(members);
  const navigation = useCommonNavigation();

  // 入力値（ローカル状態）
  const [payerId, setPayerId] = useState(members[0]?.id || "");
  const [selectedPayeeIds, setSelectedPayeeIds] = useState(members.map(m => m.id));
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  // payees全員選択/解除トグル
  const isAllPayees = selectedPayeeIds.length === members.length;
  const toggleSelectAllPayees = () => {
    setSelectedPayeeIds(isAllPayees ? [] : members.map(m => m.id));
  };

  // payee個別選択トグル
  const handlePayeeToggle = (id: string) => {
    setSelectedPayeeIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  // 支払い追加ロジック（共通ライブラリ使用）
  const handleAdd = useCallback(() => {
    const validAmount = Number(amount);
    const success = paymentLogic.calculateSplitPayments(
      payerId,
      validAmount,
      selectedPayeeIds,
      memo,
      addPayment
    );

    if (success) {
      setAmount("");
      setMemo("");
      setSelectedPayeeIds(members.map(m => m.id));
    }
  }, [payerId, amount, memo, selectedPayeeIds, paymentLogic, addPayment, members]);

  // 追加ボタンの有効性チェック
  const canAdd = !!(
    payerId &&
    amount &&
    !isNaN(Number(amount)) &&
    Number(amount) > 0 &&
    selectedPayeeIds.filter(id => id !== payerId).length > 0
  );

  return (
    <PageContainer variant="wide">
      {/* ページヘッダー */}
      <header className={cn(
        'text-center space-y-3',
        advancedSpacing.section.normal
      )}>
        <BoldTitle>支払い入力</BoldTitle>
        <p className={cn(
          typography.body.large,
          'text-gray-600 max-w-xl mx-auto'
        )}>
          誰が何にお金を支払ったかを記録しましょう
        </p>
      </header>

      {/* 支払い追加フォーム */}
      <section className={cn(
        'space-y-6',
        advancedSpacing.section.normal
      )}>
        <div className={cn(
          getModernCardClasses('feature'),
          motion.entrance.slideUp
        )}>
          <div className="space-y-6">
            {/* セクションヘッダー */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <span className="text-white font-semibold">💳</span>
              </div>
              <div>
                <h3 className={cn(typography.heading.h3, 'text-gray-800')}>
                  支払い追加
                </h3>
                <p className={cn(typography.body.small, 'text-gray-500')}>
                  立て替えた人と対象メンバーを選択
                </p>
              </div>
            </div>

            {/* 立て替え者選択 */}
            <div className="space-y-2">
              <Label className={cn(typography.body.base, 'font-medium text-gray-700')}>
                💸 立て替えた人
              </Label>
              <Select value={payerId} onValueChange={setPayerId}>
                <SelectTrigger className="h-12 text-base bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="支払者を選択" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id} className="text-base">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-xs text-white font-medium">
                          {member.name.charAt(0)}
                        </div>
                        {member.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 対象メンバー選択 */}
            <div className="space-y-3">
              <Label className={cn(typography.body.base, 'font-medium text-gray-700')}>
                👥 対象メンバー
              </Label>
              
              {/* 全員選択チェックボックス */}
              <div className={cn(
                'flex items-center gap-3 p-3 rounded-lg',
                'bg-blue-50/50 backdrop-blur-sm border border-blue-200/30'
              )}>
                <Checkbox
                  id="payee-all"
                  checked={isAllPayees}
                  onCheckedChange={toggleSelectAllPayees}
                />
                <Label htmlFor="payee-all" className={cn(
                  typography.body.base,
                  'font-medium text-blue-700 cursor-pointer'
                )}>
                  全員選択 ({members.length}人)
                </Label>
              </div>

              {/* 個別メンバー選択 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {members.map((member) => (
                  <div 
                    key={member.id}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg transition-all duration-200',
                      selectedPayeeIds.includes(member.id)
                        ? 'bg-emerald-50/80 border border-emerald-200/50'
                        : 'bg-gray-50/50 border border-gray-200/30',
                      payerId === member.id ? 'opacity-50' : 'hover:shadow-sm'
                    )}
                  >
                    <Checkbox
                      id={`payee-${member.id}`}
                      checked={selectedPayeeIds.includes(member.id)}
                      onCheckedChange={() => handlePayeeToggle(member.id)}
                      disabled={payerId === member.id}
                    />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                        selectedPayeeIds.includes(member.id)
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      )}>
                        {member.name.charAt(0)}
                      </div>
                      <span className={cn(
                        typography.body.small,
                        'truncate',
                        payerId === member.id ? 'text-gray-400' : 'text-gray-700'
                      )}>
                        {member.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 金額・メモ入力 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <Input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="金額"
                  size="lg"
                  floating
                  label="金額"
                  leftIcon={<span className="text-lg">💰</span>}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="メモ (例: ランチ代、タクシー代)"
                  size="lg"
                  floating
                  label="メモ (任意)"
                  leftIcon={<span className="text-lg">📝</span>}
                />
              </div>
            </div>

            {/* 追加ボタン */}
            <Button
              onClick={handleAdd}
              disabled={!canAdd}
              variant={canAdd ? "success" : "secondary"}
              size="lg"
              fullWidth
              className={cn(motion.interaction.hover)}
            >
              {canAdd ? (
                <span className="flex items-center gap-2">
                  ✨ 支払いを追加
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              ) : (
                "条件を満たしてください"
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* 支払い一覧セクション */}
      <section className={cn(
        'space-y-4',
        advancedSpacing.section.normal
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className={cn(typography.heading.h3, 'text-gray-800')}>
              支払い一覧
            </h3>
            <span className={cn(
              'px-3 py-1 text-sm font-medium rounded-full',
              payments.length > 0 
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-500'
            )}>
              {payments.length}件
            </span>
          </div>
        </div>

        <div className={cn(
          getModernCardClasses('normal'),
          motion.entrance.slideUp
        )}>
          <PaymentList
            payments={payments}
            members={members}
            onRemovePayment={removePayment}
            compact={true}
            emptyMessage={
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📋</div>
                <p className={cn(typography.body.base, 'text-gray-500 mb-2')}>
                  まだ支払いが登録されていません
                </p>
                <p className={cn(typography.body.small, 'text-gray-400')}>
                  上のフォームから支払いを追加しましょう
                </p>
              </div>
            }
          />
        </div>
      </section>

      {/* 進行ボタンセクション */}
      <section className={cn(
        'space-y-4 pt-6',
        advancedSpacing.section.normal
      )}>
        <Button
          onClick={navigation.goToResults}
          disabled={payments.length === 0}
          variant={payments.length > 0 ? "premium" : "secondary"}
          size="xl"
          fullWidth
          className={cn(
            motion.entrance.zoom,
            motion.interaction.hover
          )}
        >
          {payments.length > 0 ? (
            <span className="flex items-center gap-2">
              割り勘計算へ進む 🧮
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          ) : (
            "支払いを追加してください"
          )}
        </Button>

        {payments.length === 0 && (
          <p className={cn(
            typography.body.small,
            'text-center text-gray-500',
            motion.entrance.fadeIn
          )}>
            最低1つの支払いが必要です
          </p>
        )}
      </section>

      <ActionButtons />
    </PageContainer>
  );
};

export default PaymentsPage;
