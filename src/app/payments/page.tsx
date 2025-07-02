"use client";
import React, { useState, useCallback } from "react";
import { useWarikanStore } from "../useWarikanStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PageContainer } from "@/components/PageContainer";
import { SectionTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";
import { PaymentList } from "@/components/shared/PaymentItem";
import { usePaymentFormLogic, useCommonNavigation, useButtonState } from "../../lib/shared-logic";
import { ROUTES } from "../../lib/routes";

/**
 * 割り勘 支払い入力ページ（支払い対象のメンバー全員/複数も選択可）
 * - 共通ロジックライブラリで重複削除・簡素化
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
  const [payerId, setPayerId] = useState<string>(members[0]?.id || "");
  const [selectedPayeeIds, setSelectedPayeeIds] = useState<string[]>(members.map(m => m.id));
  const [amount, setAmount] = useState<string>("");
  const [memo, setMemo] = useState<string>("");

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

  // 進行ボタン状態
  const buttonState = useButtonState(
    "割り勘計算へ進む",
    payments.length > 0,
    navigation.goToResults // ROUTES.result
  );

  return (
    <PageContainer>
      <SectionTitle>支払い入力</SectionTitle>
      <section className="mb-6" aria-label="支払い追加フォーム">
        <Label htmlFor="payer-select" className="block mb-2 font-semibold">
          支払い追加
        </Label>
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="payer-select" className="min-w-[56px]">立て替え</Label>
            <Select value={payerId} onValueChange={setPayerId} name="payer" required>
              <SelectTrigger id="payer-select" aria-label="立て替えた人" className="min-w-[110px] text-base py-2">
                <SelectValue placeholder="支払者" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="text-base">
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block">対象メンバー</Label>
            <div className="flex flex-wrap gap-3 items-center">
              <Checkbox
                id="payee-all"
                checked={isAllPayees}
                onCheckedChange={toggleSelectAllPayees}
                aria-label="全員選択"
              />
              <Label htmlFor="payee-all" className="mr-4 select-none">全員</Label>
              {members.map((m) => (
                <span key={m.id} className="flex items-center gap-1">
                  <Checkbox
                    id={`payee-${m.id}`}
                    checked={selectedPayeeIds.includes(m.id)}
                    onCheckedChange={() => handlePayeeToggle(m.id)}
                    aria-label={`${m.name}を選択`}
                    disabled={payerId === m.id}
                  />
                  <Label htmlFor={`payee-${m.id}`} className="select-none text-base">{m.name}</Label>
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min="1"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="金額"
              aria-label="金額"
              className="w-24 text-base py-2"
            />
            <Input
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="メモ（任意）"
              aria-label="メモ"
              className="flex-1 text-base py-2"
            />
            <Button
              onClick={handleAdd}
              disabled={!canAdd}
              type="button"
              aria-label="支払いを追加"
              className="text-base px-4 py-2"
            >
              追加
            </Button>
          </div>
        </div>
      </section>
      <section className="mb-8" aria-label="支払い一覧">
        <Label className="block mb-3 font-semibold text-lg">支払い一覧</Label>
        <PaymentList
          payments={payments}
          members={members}
          onRemovePayment={removePayment}
          compact={true}
          emptyMessage="まだ支払いが登録されていません"
        />
      </section>
      <Button
        className={buttonState.className}
        disabled={buttonState.disabled}
        onClick={buttonState.onClick}
        type="button"
        aria-label="割り勘計算へ進む"
      >
        {buttonState.text}
      </Button>
      <ActionButtons />
    </PageContainer>
  );
};

export default PaymentsPage;
