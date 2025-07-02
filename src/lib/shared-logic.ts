/**
 * 共通ロジック統一ライブラリ
 * - ページ間で重複しているロジックを統一管理
 * - 型安全性を保ちながらシンプルな実装
 * - 計算結果とUI操作の分離
 */

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { validateSetupCompletion } from './validation';
import { calculateMemberBalances, calculateMinimalSettlements } from './calculations';
import { formatCompactAmount, formatBalance, getBalanceStyleClass } from './utils';
import type { Member, Payment, MemberId } from './types';
import { ROUTES } from './routes';

// =============================================================================
// ナビゲーション共通ロジック
// =============================================================================

export function useCommonNavigation() {
  const router = useRouter();

  return {
    goBack: useCallback(() => router.back(), [router]),
    goHome: useCallback(() => router.push(ROUTES.home), [router]),
    goToPayments: useCallback(() => router.push(ROUTES.payments), [router]),
    goToResults: useCallback(() => router.push(ROUTES.result), [router]),
  };
}

// =============================================================================
// セットアップページ共通ロジック
// =============================================================================

export function useSetupLogic(
  eventName: string,
  members: readonly Member[]
) {
  // バリデーション結果をメモ化
  const validation = useMemo(() => 
    validateSetupCompletion(eventName, members),
    [eventName, members]
  );

  return {
    validation,
    computed: {
      canProceed: validation.isValid,
      memberCount: members.length,
    },
  };
}

// =============================================================================
// 支払いフォーム共通ロジック
// =============================================================================

export function usePaymentFormLogic(members: readonly Member[]) {
  // 割り勘計算ヘルパー
  const calculateSplitPayments = useCallback((
    payerId: string,
    totalAmount: number,
    selectedPayeeIds: string[],
    memo: string,
    addPaymentFn: (payerId: MemberId, amount: number, memo?: string) => void
  ) => {
    const payees = selectedPayeeIds.filter(id => id !== payerId);
    if (!payerId || isNaN(totalAmount) || totalAmount <= 0 || payees.length === 0) {
      return false;
    }

    // 割り勘金額計算（端数は最初のpayeeから+1）
    const base = Math.floor(totalAmount / payees.length);
    let remainder = totalAmount - base * payees.length;
    
    payees.forEach((payeeId) => {
      const share = base + (remainder > 0 ? 1 : 0);
      const memberName = members.find(m => m.id === payeeId)?.name || '不明';
      const memoText = `[${memberName}]${memo ? ' ' + memo : ''}`;
      
      addPaymentFn(payerId as MemberId, share, memoText);
      
      if (remainder > 0) remainder--;
    });

    return true;
  }, [members]);

  return {
    calculateSplitPayments,
  };
}

// =============================================================================
// 結果ページ共通ロジック
// =============================================================================

export function useResultLogic(
  members: readonly Member[],
  payments: readonly Payment[]
) {
  // 計算結果をメモ化
  const calculations = useMemo(() => {
    const memberBalances = calculateMemberBalances(members, payments);
    const settlements = calculateMinimalSettlements(memberBalances);
    
    // 互換性マップ
    const balanceMap = Object.fromEntries(
      memberBalances.map(balance => [balance.memberId, balance.balance])
    );

    return {
      memberBalances,
      settlements,
      balanceMap,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    };
  }, [members, payments]);

  // 表示用データ生成
  const displayData = useMemo(() => {
    const balanceItems = members.map((member) => {
      const balance = calculations.balanceMap[member.id] ?? 0;
      let label = '精算不要';
      if (balance > 0) label = '受け取る金額';
      else if (balance < 0) label = '支払う金額';
      
      return {
        memberId: member.id,
        memberName: member.name,
        balance,
        formattedBalance: formatBalance(balance),
        styleClass: getBalanceStyleClass(balance),
        label,
        ariaLabel: `${member.name}さん: ${label} ${Math.abs(balance)}円`,
      };
    });

    const settlementItems = calculations.settlements.map((settlement) => ({
      from: settlement.from,
      to: settlement.to,
      amount: settlement.amount,
      formattedAmount: formatCompactAmount(settlement.amount),
      ariaLabel: `${settlement.from}さんから${settlement.to}さんへ${settlement.amount}円送金`,
    }));

    return { balanceItems, settlementItems };
  }, [members, calculations]);

  return {
    calculations,
    display: displayData,
    computed: {
      hasPayments: payments.length > 0,
      hasMembers: members.length > 0,
      hasSettlements: calculations.settlements.length > 0,
      isSettled: calculations.settlements.length === 0,
    },
  };
}

// =============================================================================
// エラー表示共通ロジック
// =============================================================================

export function useErrorDisplay(errors: readonly string[]) {
  return {
    hasErrors: errors.length > 0,
    errorProps: {
      errors,
      className: 'mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm',
    },
  };
} 