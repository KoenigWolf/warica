"use client";
import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWarikanStore } from "../useWarikanStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/PageContainer";
import { SectionTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";
import { PaymentList as EnhancedPaymentList } from "@/components/shared/PaymentItem";
import { calculateMemberBalances, calculateMinimalSettlements } from "../../lib/calculations";
import { formatCompactAmount, formatBalance, getBalanceStyleClass } from "../../lib/utils";
import type { Member, Settlement } from "../../lib/types";

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
      <section className="mb-8" aria-label="支払い詳細一覧">
        <Label className="block mb-3 font-semibold text-lg">支払い詳細</Label>
        <EnhancedPaymentList
          payments={payments}
          members={members}
          onEditPayment={(payment) => editPayment(payment.id as any, { // eslint-disable-line @typescript-eslint/no-explicit-any
            payerId: payment.payerId,
            amount: payment.amount,
            memo: payment.memo
          })}
          onRemovePayment={(id) => removePayment(id as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
          compact={false}
          emptyMessage="支払い履歴はありません"
        />
      </section>
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
              className={getBalanceStyleClass(balance)}
              aria-label={label}
            >
              {formatBalance(balance)}円 {balance > 0 ? '受け取り' : balance < 0 ? '支払い' : ''}
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
          <li key={i} className="py-2 px-3 bg-blue-50 rounded-lg mb-2 border-l-4 border-blue-400">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                <span className="font-semibold text-gray-800">{s.from}</span> 
                <span className="text-gray-500 mx-2">→</span>
                <span className="font-semibold text-gray-800">{s.to}</span>
              </span>
              <span className="text-blue-700 font-bold text-lg font-mono">
                {formatCompactAmount(s.amount)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
);

// PaymentListコンポーネントは shared/PaymentItem.tsx に移動
