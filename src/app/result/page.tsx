"use client";
import React, { useCallback } from "react";
import { useWarikanStore } from "../useWarikanStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/PageContainer";
import { SectionTitle } from "@/components/SectionTitle";
import { ActionButtons } from "@/components/ActionButtons";
import { PaymentList as EnhancedPaymentList } from "@/components/shared/PaymentItem";
import { useResultLogic, useCommonNavigation, useButtonState } from "../../lib/shared-logic";
import type { Payment } from "../../lib/types";
import { ROUTES } from "../../lib/routes";

/**
 * 割り勘結果ページ
 * - 共通ロジックライブラリで重複削除・簡素化
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
    navigation.goHome(); // ROUTES.home
  }, [resetAll, navigation]);

  // 編集・削除ハンドラー
  const handleEditPayment = useCallback((payment: Payment) => {
    editPayment(payment.id as unknown as any, { // eslint-disable-line @typescript-eslint/no-explicit-any
      payerId: payment.payerId,
      amount: payment.amount,
      memo: payment.memo
    });
  }, [editPayment]);

  const handleRemovePayment = useCallback((id: unknown) => {
    removePayment(id as unknown as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }, [removePayment]);

  // リセットボタン状態
  const buttonState = useButtonState(
    "新しくはじめる",
    true,
    handleReset
  );

  return (
    <PageContainer>
      <SectionTitle>割り勘結果</SectionTitle>
      <Header eventName={eventName} />
      
      <section className="mb-8" aria-label="支払い詳細一覧">
        <Label className="block mb-3 font-semibold text-lg">支払い詳細</Label>
        <EnhancedPaymentList
          payments={payments}
          members={members}
          onEditPayment={handleEditPayment}
          onRemovePayment={handleRemovePayment}
          compact={false}
          emptyMessage="支払い履歴はありません"
        />
      </section>
      
      <BalanceList 
        balanceItems={resultLogic.display.balanceItems}
      />
      
      <SettlementList 
        settlementItems={resultLogic.display.settlementItems}
      />
      
      <Button
        className={buttonState.className}
        disabled={buttonState.disabled}
        onClick={buttonState.onClick}
        type="button"
        aria-label="新しくはじめる（全データリセット）"
      >
        {buttonState.text}
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
  balanceItems: Array<{
    memberId: string;
    memberName: string;
    balance: number;
    formattedBalance: string;
    styleClass: string;
    label: string;
    ariaLabel: string;
  }>;
}> = ({ balanceItems }) => (
  <section className="mb-8" aria-label="各メンバーの清算金額一覧">
    <Label className="font-semibold mb-2 text-base">各メンバーの清算金額</Label>
    <ul>
      {balanceItems.map((item) => (
        <li
          key={item.memberId}
          className="flex justify-between py-1 border-b text-sm"
          aria-label={item.ariaLabel}
        >
          <span>{item.memberName}</span>
          <span
            className={item.styleClass}
            aria-label={item.label}
          >
            {item.formattedBalance}円 {item.balance > 0 ? '受け取り' : item.balance < 0 ? '支払い' : ''}
          </span>
        </li>
      ))}
    </ul>
  </section>
);

/**
 * 最小送金リスト
 */
const SettlementList: React.FC<{
  settlementItems: Array<{
    from: string;
    to: string;
    amount: number;
    formattedAmount: string;
    ariaLabel: string;
  }>;
}> = ({ settlementItems }) => (
  <section className="mb-8" aria-label="最小送金リスト">
    <Label className="font-semibold mb-2 text-base">送金リスト</Label>
    {settlementItems.length === 0 ? (
      <p className="text-gray-400">全員精算済みです</p>
    ) : (
      <ul>
        {settlementItems.map((item, i) => (
          <li key={i} className="py-2 px-3 bg-blue-50 rounded-lg mb-2 border-l-4 border-blue-400">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                <span className="font-semibold text-gray-800">{item.from}</span> 
                <span className="text-gray-500 mx-2">→</span>
                <span className="font-semibold text-gray-800">{item.to}</span>
              </span>
              <span className="text-blue-700 font-bold text-lg font-mono">
                {item.formattedAmount}
              </span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
);
