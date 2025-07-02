import type { Member, Payment, Settlement, MemberBalance } from './types';
import { createPositiveAmount } from './types';

/**
 * 割り勘計算ユーティリティ
 * - 純粋関数として実装し、テスト容易性とパフォーマンスを向上
 * - メモ化とアルゴリズム最適化を適用
 */

/** 計算結果のキャッシュ */
const calculationCache = new Map<string, unknown>();

/** キャッシュキー生成 */
const createCacheKey = (prefix: string, data: unknown): string => {
  return `${prefix}:${JSON.stringify(data)}`;
};

/**
 * メンバーごとの収支計算
 * - 端数処理を考慮した正確な計算
 * - O(n+m) の時間計算量（n=メンバー数, m=支払い数）
 */
export const calculateMemberBalances = (
  members: readonly Member[],
  payments: readonly Payment[]
): readonly MemberBalance[] => {
  if (members.length === 0) return [];

  const cacheKey = createCacheKey('balances', { members, payments });
  const cached = calculationCache.get(cacheKey) as readonly MemberBalance[] | undefined;
  if (cached) return cached;

  // 合計金額と一人当たりの負担額を計算
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const perPersonAmount = Math.floor(totalAmount / members.length);
  const remainder = totalAmount - perPersonAmount * members.length;

  // 各メンバーの支払い額を集計
  const paidAmounts = new Map<string, number>();
  members.forEach(member => paidAmounts.set(member.id, 0));
  payments.forEach(payment => {
    const current = paidAmounts.get(payment.payerId) ?? 0;
    paidAmounts.set(payment.payerId, current + payment.amount);
  });

  // 収支計算（端数は先頭メンバーから順番に負担）
  const balances: MemberBalance[] = members.map((member, index) => {
    const paidAmount = paidAmounts.get(member.id) ?? 0;
    const shouldPayAmount = perPersonAmount + (index < remainder ? 1 : 0);
    const balance = paidAmount - shouldPayAmount;

    return {
      memberId: member.id,
      memberName: member.name,
      balance,
      status: balance > 0 ? 'receive' : balance < 0 ? 'pay' : 'settled',
    };
  });

  calculationCache.set(cacheKey, balances);
  return balances;
};

/**
 * 最小送金リストをグリーディ法で生成
 * - 送金回数を最小化するアルゴリズム
 * - O(n log n) の時間計算量
 */
export const calculateMinimalSettlements = (
  balances: readonly MemberBalance[]
): readonly Settlement[] => {
  const cacheKey = createCacheKey('settlements', balances);
  const cached = calculationCache.get(cacheKey) as readonly Settlement[] | undefined;
  if (cached) return cached;

  // プラス残高（受け取る人）とマイナス残高（支払う人）に分離
  const receivers = balances
    .filter(b => b.balance > 0)
    .map(b => ({ name: b.memberName, amount: b.balance }))
    .sort((a, b) => b.amount - a.amount); // 降順ソート

  const payers = balances
    .filter(b => b.balance < 0)
    .map(b => ({ name: b.memberName, amount: -b.balance }))
    .sort((a, b) => b.amount - a.amount); // 降順ソート

  const settlements: Settlement[] = [];
  let receiverIndex = 0;
  let payerIndex = 0;

  // グリーディ法で最小送金リストを生成
  while (receiverIndex < receivers.length && payerIndex < payers.length) {
    const receiver = receivers[receiverIndex];
    const payer = payers[payerIndex];
    const transferAmount = Math.min(receiver.amount, payer.amount);

    if (transferAmount > 0) {
      const positiveAmount = createPositiveAmount(transferAmount);
      if (positiveAmount) {
        settlements.push({
          from: payer.name,
          to: receiver.name,
          amount: positiveAmount,
        });
      }

      receiver.amount -= transferAmount;
      payer.amount -= transferAmount;
    }

    // 残高が0になった方のインデックスを進める
    if (receiver.amount === 0) receiverIndex++;
    if (payer.amount === 0) payerIndex++;
  }

  calculationCache.set(cacheKey, settlements);
  return settlements;
};

/**
 * 支払い分割計算
 * - 金額を対象メンバー数で分割し、端数を適切に処理
 */
export const calculatePaymentSplit = (
  totalAmount: number,
  payeeCount: number
): readonly number[] => {
  if (payeeCount <= 0) return [];

  const baseAmount = Math.floor(totalAmount / payeeCount);
  const remainder = totalAmount - baseAmount * payeeCount;

  return Array.from({ length: payeeCount }, (_, index) => 
    baseAmount + (index < remainder ? 1 : 0)
  );
};

/**
 * 統計情報計算
 */
export const calculateStatistics = (
  members: readonly Member[],
  payments: readonly Payment[]
): {
  totalAmount: number;
  averagePerPerson: number;
  paymentCount: number;
  memberCount: number;
} => {
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const averagePerPerson = members.length > 0 ? totalAmount / members.length : 0;

  return {
    totalAmount,
    averagePerPerson,
    paymentCount: payments.length,
    memberCount: members.length,
  };
};

/** キャッシュクリア */
export const clearCalculationCache = (): void => {
  calculationCache.clear();
}; 