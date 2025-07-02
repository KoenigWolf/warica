"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWarikanStore } from "../useWarikanStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PageContainer } from "@/components/PageContainer";
import { SectionTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";

/**
 * 割り勘 支払い入力ページ（支払い対象のメンバー全員/複数も選択可）
 */
const PaymentsPage: React.FC = () => {
  const router = useRouter();
  const {
    state: { members, payments },
    addPayment,
    removePayment,
  } = useWarikanStore();

  // 入力値
  const [payerId, setPayerId] = useState<string>(members[0]?.id || "");
  const [selectedPayeeIds, setSelectedPayeeIds] = useState<string[]>(members.map(m => m.id)); // デフォルト全員
  const [amount, setAmount] = useState<string>("");
  const [memo, setMemo] = useState<string>("");

  /**
   * payees全員選択/解除トグル
   */
  const isAllPayees = selectedPayeeIds.length === members.length;
  const toggleSelectAllPayees = () => {
    setSelectedPayeeIds(isAllPayees ? [] : members.map(m => m.id));
  };

  /**
   * payee個別選択トグル
   */
  const handlePayeeToggle = (id: string) => {
    setSelectedPayeeIds(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  /**
   * 支払い追加ロジック
   * - 金額を選択されたpayees数で分割
   * - payerId == payeeIdのときは登録しない（自分には割り当てない）
   */
  const handleAdd = useCallback(() => {
    const validAmount = Number(amount);
    const payees = selectedPayeeIds.filter(id => id !== payerId);
    if (!payerId || !amount || isNaN(validAmount) || validAmount <= 0 || payees.length === 0) return;

    // 割り勘金額計算（端数は最初のpayeeから+1）
    const base = Math.floor(validAmount / payees.length);
    let amari = validAmount - base * payees.length;
    payees.forEach((payeeId) => {
      const share = base + (amari > 0 ? 1 : 0);
      addPayment(
        payerId,
        share,
        `[${members.find(m => m.id === payeeId)?.name}]${memo ? " " + memo : ""}`
      );
      if (amari > 0) amari--;
    });

    setAmount("");
    setMemo("");
    setSelectedPayeeIds(members.map(m => m.id));
  }, [payerId, amount, memo, addPayment, members, selectedPayeeIds]);

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
              disabled={
                !payerId ||
                !amount ||
                isNaN(Number(amount)) ||
                Number(amount) <= 0 ||
                selectedPayeeIds.filter(id => id !== payerId).length === 0
              }
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
        <Label className="block mb-2 font-semibold">支払い一覧</Label>
        {payments.length === 0 ? (
          <p className="text-gray-400">まだ支払いが登録されていません</p>
        ) : (
          <ul>
            {payments.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-2 mb-1 border-b py-1"
              >
                <span className="flex-1 text-base">
                  {members.find((m) => m.id === p.payerId)?.name || "?"} が {p.amount}円
                  {p.memo && (
                    <span className="text-xs text-gray-500 ml-2">({p.memo})</span>
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-red-500 px-3"
                  onClick={() => removePayment(p.id)}
                  type="button"
                  aria-label="この支払いを削除"
                >
                  削除
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <Button
        className="w-full mt-8 mb-4 text-base py-3"
        disabled={payments.length === 0}
        onClick={() => router.push("/result")}
        type="button"
        aria-label="割り勘計算へ進む"
      >
        割り勘計算へ進む
      </Button>
      <ActionButtons />
    </PageContainer>
  );
};

export default PaymentsPage;
