"use client";
import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWarikanStore } from "../useWarikanStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { PageContainer } from "@/components/PageContainer";
import { SectionTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";
import { calculateMemberBalances, calculateMinimalSettlements } from "../../lib/calculations";
import type { Member, Payment, Settlement, MemberId, PositiveAmount } from "../../lib/types";

/**
 * 割り勘結果ページ
 * - 各メンバーの収支計算と最小送金リストを表示
 * - 支払い一覧の編集機能
 * - リファクタリング済み：型安全性、パフォーマンス最適化
 */
const ResultPage: React.FC = () => {
  const router = useRouter();
  const {
    state: { eventName, members, payments },
    editPayment,
    removePayment,
    resetAll,
  } = useWarikanStore();

  // メンバー残高計算（メモ化）
  const memberBalances = useMemo(() => 
    calculateMemberBalances(members, payments),
    [members, payments]
  );

  // レガシー形式の残高マップ（互換性のため）
  const balances = useMemo(() => 
    Object.fromEntries(
      memberBalances.map(balance => [balance.memberId, balance.balance])
    ),
    [memberBalances]
  );

  // 最小送金リスト計算（メモ化）
  const settlements = useMemo(() => 
    calculateMinimalSettlements(memberBalances),
    [memberBalances]
  );

  // 全リセット・トップ遷移
  const handleReset = useCallback(() => {
    resetAll();
    router.push("/");
  }, [resetAll, router]);

  return (
    <PageContainer>
      <SectionTitle>割り勘結果</SectionTitle>
      <Header eventName={eventName} />
      <PaymentList 
        payments={payments as Payment[]} 
        members={members as Member[]} 
        editPayment={editPayment as (id: string, update: Partial<Pick<Payment, 'payerId' | 'amount' | 'memo'>>) => void} 
        removePayment={removePayment as (id: string) => void} 
      />
      <BalanceList members={members as Member[]} balances={balances} />
      <SettlementList settlements={settlements as Settlement[]} />
      <Button
        className="w-full mt-8 mb-4 text-base py-3"
        onClick={handleReset}
        type="button"
        aria-label="新しくはじめる（全データリセット）"
      >
        新しくはじめる
      </Button>
      <ActionButtons />
    </PageContainer>
  );
};

export default ResultPage;

/* ===============================
  サブコンポーネント
=============================== */

/**
 * ヘッダー
 */
const Header: React.FC<{ eventName: string }> = ({ eventName }) => (
  <header className="mb-6">
    <h2 className="text-xl font-bold mb-2" tabIndex={0}>
      割り勘結果
    </h2>
    {eventName && (
      <div className="text-gray-500 text-sm mb-2" tabIndex={0}>
        イベント名: {eventName}
      </div>
    )}
  </header>
);

/**
 * メンバーごとの収支リスト
 */
const BalanceList: React.FC<{
  members: Member[];
  balances: Record<string, number>;
}> = ({ members, balances }) => (
  <section className="mb-8" aria-label="各メンバーの清算金額一覧">
    <Label className="font-semibold mb-2 text-base">各メンバーの清算金額</Label>
    <ul>
      {members.map((member) => {
        const balance = balances[member.id] ?? 0;
        let label = "精算不要";
        if (balance > 0) label = "受け取る金額";
        else if (balance < 0) label = "支払う金額";
        return (
          <li
            key={member.id}
            className="flex justify-between py-1 border-b text-sm"
            aria-label={`${member.name}さん: ${label} ${balance}円`}
          >
            <span>{member.name}</span>
            <span
              className={
                balance > 0
                  ? "text-green-600"
                  : balance < 0
                  ? "text-red-600"
                  : "text-gray-600"
              }
              aria-label={label}
            >
              {balance > 0
                ? `+${balance}円 受け取り`
                : balance < 0
                ? `${balance}円 支払い`
                : "±0円"}
            </span>
          </li>
        );
      })}
    </ul>
  </section>
);

/**
 * 最小送金リスト
 */
const SettlementList: React.FC<{
  settlements: Settlement[];
}> = ({ settlements }) => (
  <section className="mb-8" aria-label="最小送金リスト">
    <Label className="font-semibold mb-2 text-base">送金リスト</Label>
    {settlements.length === 0 ? (
      <p className="text-gray-400">全員精算済みです</p>
    ) : (
      <ul>
        {settlements.map((s, i) => (
          <li key={i} className="py-1 text-sm">
            <span className="font-semibold">{s.from}</span> さん →{" "}
            <span className="font-semibold">{s.to}</span> さんに{" "}
            <span className="text-blue-700 font-bold">{s.amount}円</span> 支払う
          </li>
        ))}
      </ul>
    )}
  </section>
);

/**
 * 支払い一覧 + 編集機能
 */
type PaymentListProps = {
  payments: Payment[];
  members: Member[];
  editPayment: (id: string, update: Partial<Pick<Payment, 'payerId' | 'amount' | 'memo'>>) => void;
  removePayment: (id: string) => void;
};

const PaymentList: React.FC<PaymentListProps> = ({ 
  payments, 
  members, 
  editPayment, 
  removePayment 
}) => {
  const [editId, setEditId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<{ 
    payerId: string; 
    amount: string; 
    memo: string 
  }>({ payerId: "", amount: "", memo: "" });

  // 編集開始
  const handleEditStart = (p: Payment) => {
    setEditId(p.id);
    setForm({ 
      payerId: p.payerId, 
      amount: String(p.amount), 
      memo: p.memo || "" 
    });
  };

  // 編集キャンセル
  const handleEditCancel = () => {
    setEditId(null);
    setForm({ payerId: "", amount: "", memo: "" });
  };

  // 編集保存
  const handleEditSave = (id: string) => {
    if (!form.payerId || !form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) return;
    editPayment(id, { 
      payerId: form.payerId as MemberId, 
      amount: Number(form.amount) as PositiveAmount, 
      memo: form.memo 
    });
    setEditId(null);
  };

  if (payments.length === 0) return null;

  return (
    <section className="mb-8" aria-label="支払い一覧">
      <Label className="font-semibold mb-2 text-base">支払い一覧（編集可）</Label>
      <ul>
        {payments.map((p) => (
          <li key={p.id} className="flex items-center gap-2 mb-1 border-b py-1">
            {editId === p.id ? (
              <>
                <Select 
                  value={form.payerId} 
                  onValueChange={v => setForm(f => ({ ...f, payerId: v }))}
                >
                  <SelectTrigger className="min-w-[90px]">
                    <SelectValue placeholder="支払者" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  className="w-20"
                  aria-label="金額"
                />
                <Input
                  value={form.memo}
                  onChange={e => setForm(f => ({ ...f, memo: e.target.value }))}
                  className="flex-1"
                  aria-label="メモ"
                  placeholder="メモ（任意）"
                />
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => handleEditSave(p.id)} 
                  aria-label="保存"
                >
                  保存
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleEditCancel} 
                  aria-label="キャンセル"
                >
                  キャンセル
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1">
                  {members.find(m => m.id === p.payerId)?.name || "?"} が {p.amount}円
                  {p.memo && (
                    <span className="text-xs text-gray-500 ml-2">({p.memo})</span>
                  )}
                </span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleEditStart(p)} 
                  aria-label="編集"
                >
                  編集
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-red-500" 
                  onClick={() => removePayment(p.id)} 
                  aria-label="削除"
                >
                  削除
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};
