"use client";
import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/PageContainer";
import { SectionTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";
import { useWarikanStore, type Member, type Payment } from "../useWarikanStore";

/**
 * 最小送金リスト用型
 */
type Settlement = {
  from: string;
  to: string;
  amount: number;
};

/* ===============================
  計算ユーティリティ
=============================== */

/**
 * 各メンバーの収支計算（+は受け取り、-は支払い）
 */
function calculateBalances(
  members: Member[],
  payments: Payment[]
): Record<string, number> {
  if (members.length === 0) return {};
  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  const perPerson = Math.floor(total / members.length);
  const paidMap: Record<string, number> = {};
  members.forEach((m) => (paidMap[m.id] = 0));
  payments.forEach((p) => {
    paidMap[p.payerId] += p.amount;
  });
  const balances: Record<string, number> = {};
  members.forEach((m) => {
    balances[m.id] = paidMap[m.id] - perPerson;
  });
  // 端数を先頭から順に引く
  let amari = total - perPerson * members.length;
  for (let i = 0; amari > 0; i++, amari--) {
    balances[members[i % members.length].id]--;
  }
  return balances;
}

/**
 * 最小送金リストをグリーディ法で生成
 */
function calculateMinimalSettlements(
  balances: Record<string, number>,
  members: Member[]
): Settlement[] {
  const plus = members
    .filter((m) => balances[m.id] > 0)
    .map((m) => ({ id: m.id, name: m.name, amount: balances[m.id] }));
  const minus = members
    .filter((m) => balances[m.id] < 0)
    .map((m) => ({ id: m.id, name: m.name, amount: -balances[m.id] }));
  const settlements: Settlement[] = [];
  let i = 0, j = 0;
  while (i < minus.length && j < plus.length) {
    const pay = Math.min(minus[i].amount, plus[j].amount);
    settlements.push({
      from: minus[i].name,
      to: plus[j].name,
      amount: pay,
    });
    minus[i].amount -= pay;
    plus[j].amount -= pay;
    if (minus[i].amount === 0) i++;
    if (plus[j].amount === 0) j++;
  }
  return settlements;
}

/* ===============================
  コンポーネント
=============================== */

/**
 * 割り勘計算結果ページ
 * - 収支・最小送金リスト・全リセット
 */
const ResultPage: React.FC = () => {
  const router = useRouter();
  const {
    state: { eventName, members, payments },
    resetAll,
    editPayment,
    removePayment,
  } = useWarikanStore();

  // 各メンバー収支
  const balances = useMemo(
    () => calculateBalances(members, payments),
    [members, payments]
  );

  // 最小送金リスト
  const settlements = useMemo(
    () => calculateMinimalSettlements(balances, members),
    [balances, members]
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
      <PaymentList payments={payments} members={members} editPayment={editPayment} removePayment={removePayment} />
      <BalanceList members={members} balances={balances} />
      <SettlementList settlements={settlements} />
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
  editPayment: (id: string, update: Partial<Omit<Payment, 'id'>>) => void;
  removePayment: (id: string) => void;
};
const PaymentList: React.FC<PaymentListProps> = ({ payments, members, editPayment, removePayment }) => {
  const [editId, setEditId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<{ payerId: string; amount: string; memo: string }>({ payerId: "", amount: "", memo: "" });

  // 編集開始
  const handleEditStart = (p: Payment) => {
    setEditId(p.id);
    setForm({ payerId: p.payerId, amount: String(p.amount), memo: p.memo || "" });
  };
  // 編集キャンセル
  const handleEditCancel = () => {
    setEditId(null);
    setForm({ payerId: "", amount: "", memo: "" });
  };
  // 編集保存
  const handleEditSave = (id: string) => {
    if (!form.payerId || !form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) return;
    editPayment(id, { payerId: form.payerId, amount: Number(form.amount), memo: form.memo });
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
                <Select value={form.payerId} onValueChange={v => setForm(f => ({ ...f, payerId: v }))}>
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
                <Button size="sm" variant="secondary" onClick={() => handleEditSave(p.id)} aria-label="保存">保存</Button>
                <Button size="sm" variant="ghost" onClick={handleEditCancel} aria-label="キャンセル">キャンセル</Button>
              </>
            ) : (
              <>
                <span className="flex-1">
                  {members.find(m => m.id === p.payerId)?.name || "?"} が {p.amount}円
                  {p.memo && <span className="text-xs text-gray-500 ml-2">({p.memo})</span>}
                </span>
                <Button size="sm" variant="ghost" onClick={() => handleEditStart(p)} aria-label="編集">編集</Button>
                <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removePayment(p.id)} aria-label="削除">削除</Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};
