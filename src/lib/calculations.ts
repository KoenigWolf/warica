import type { Member, Payment, Settlement, MemberBalance, CalculationSummary } from './types';
import { createPositiveAmount, createPositiveAmountUnsafe } from './types';

/**
 * 高性能割り勘計算エンジン
 * - アルゴリズム最適化（O(n log n)）
 * - インテリジェントキャッシュシステム
 * - 数値精度保証と端数処理
 */

/** 計算キャッシュストア */
class CalculationCache {
  private static instance: CalculationCache;
  private cache = new Map<string, { data: unknown; timestamp: number; hits: number }>();
  private readonly maxSize = 100;
  private readonly ttl = 5 * 60 * 1000; // 5分

  static getInstance(): CalculationCache {
    if (!CalculationCache.instance) {
      CalculationCache.instance = new CalculationCache();
    }
    return CalculationCache.instance;
  }

  private createKey(prefix: string, data: unknown): string {
    return `${prefix}:${this.hashObject(data)}`;
  }

  private hashObject(obj: unknown): string {
    const str = JSON.stringify(obj);
    // 日本語対応のハッシュ関数（簡易実装）
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit整数変換
    }
    return Math.abs(hash).toString(16);
  }

  get<T>(prefix: string, data: unknown): T | null {
    const key = this.createKey(prefix, data);
    const entry = this.cache.get(key);
    
    if (!entry || Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    entry.hits++;
    return entry.data as T;
  }

  set(prefix: string, data: unknown, result: unknown): void {
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    const key = this.createKey(prefix, data);
    this.cache.set(key, {
      data: result,
      timestamp: Date.now(),
      hits: 1,
    });
  }

  private evictLeastUsed(): void {
    let minHits = Infinity;
    let keyToEvict = '';

    for (const [key, entry] of this.cache) {
      if (entry.hits < minHits) {
        minHits = entry.hits;
        keyToEvict = key;
      }
    }

    if (keyToEvict) {
      this.cache.delete(keyToEvict);
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      totalHits: Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.hits, 0),
    };
  }
}

const cache = CalculationCache.getInstance();

/** 数値精度ヘルパー */
const roundToYen = (value: number): number => Math.round(value);
const isValidAmount = (value: number): boolean => Number.isFinite(value) && value >= 0;

/**
 * 最適化された収支計算
 * - 端数分散アルゴリズム改善
 * - O(n+m) 時間計算量保証
 */
export const calculateMemberBalances = (
  members: readonly Member[],
  payments: readonly Payment[]
): readonly MemberBalance[] => {
  if (members.length === 0) return [];

  const cached = cache.get<readonly MemberBalance[]>('balances', { members, payments });
  if (cached) return cached;

  // 高精度計算のため、すべて整数で処理
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  if (!isValidAmount(totalAmount)) return [];

  // 均等割りベース計算
  const baseAmount = Math.floor(totalAmount / members.length);
  const remainder = totalAmount - baseAmount * members.length;

  // 支払い額集計（Map使用で高速化）
  const paidAmounts = new Map<string, number>();
  members.forEach(member => paidAmounts.set(member.id, 0));
  
  for (const payment of payments) {
    const current = paidAmounts.get(payment.payerId) ?? 0;
    paidAmounts.set(payment.payerId, current + payment.amount);
  }

  // 収支計算（端数は先頭から配分）
  const balances: MemberBalance[] = members.map((member, index) => {
    const paidAmount = paidAmounts.get(member.id) ?? 0;
    const shouldPay = baseAmount + (index < remainder ? 1 : 0);
    const balance = paidAmount - shouldPay;
    const absAmount = Math.abs(balance);

    return {
      memberId: member.id,
      memberName: member.name,
      balance: roundToYen(balance),
      status: balance > 0 ? 'receive' : balance < 0 ? 'pay' : 'settled',
      absoluteAmount: createPositiveAmountUnsafe(absAmount) || createPositiveAmountUnsafe(1)!,
    };
  });

  cache.set('balances', { members, payments }, balances);
  return balances;
};

/**
 * 改良されたグリーディ最小送金アルゴリズム
 * - より効率的な送金パターン生成
 * - メモリ使用量最適化
 */
export const calculateMinimalSettlements = (
  balances: readonly MemberBalance[]
): readonly Settlement[] => {
  const cached = cache.get<readonly Settlement[]>('settlements', balances);
  if (cached) return cached;

  // 債権者・債務者を分離し、効率的にソート
  const creditors = balances
    .filter(b => b.balance > 0)
    .map(b => ({ name: b.memberName, amount: b.balance }))
    .sort((a, b) => b.amount - a.amount);

  const debtors = balances
    .filter(b => b.balance < 0)
    .map(b => ({ name: b.memberName, amount: -b.balance }))
    .sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let creditorIdx = 0;
  let debtorIdx = 0;

  // 改良グリーディアルゴリズム
  while (creditorIdx < creditors.length && debtorIdx < debtors.length) {
    const creditor = creditors[creditorIdx];
    const debtor = debtors[debtorIdx];
    const transferAmount = Math.min(creditor.amount, debtor.amount);

    if (transferAmount > 0) {
      const amount = createPositiveAmount(transferAmount);
      if (amount.success) {
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount: amount.data,
        });
      }

      creditor.amount -= transferAmount;
      debtor.amount -= transferAmount;
    }

    // 残額0の場合、次へ進む
    if (creditor.amount === 0) creditorIdx++;
    if (debtor.amount === 0) debtorIdx++;
  }

  cache.set('settlements', balances, settlements);
  return settlements;
};

/**
 * 支払い分割の高精度計算
 */
export const calculatePaymentSplit = (
  totalAmount: number,
  payeeCount: number
): readonly number[] => {
  if (payeeCount <= 0 || !isValidAmount(totalAmount)) return [];

  const baseAmount = Math.floor(totalAmount / payeeCount);
  const remainder = totalAmount - baseAmount * payeeCount;

  return Array.from({ length: payeeCount }, (_, index) => 
    baseAmount + (index < remainder ? 1 : 0)
  );
};

/**
 * 統計情報の包括計算
 */
export const calculateStatistics = (
  members: readonly Member[],
  payments: readonly Payment[]
): CalculationSummary => {
  const cached = cache.get<CalculationSummary>('statistics', { members, payments });
  if (cached) return cached;

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const averagePerPerson = members.length > 0 ? totalAmount / members.length : 0;
  
  // 追加統計：決済数計算
  const balances = calculateMemberBalances(members, payments);
  const settlements = calculateMinimalSettlements(balances);

  const stats: CalculationSummary = {
    totalAmount: createPositiveAmountUnsafe(totalAmount) || createPositiveAmountUnsafe(0)!,
    averagePerPerson: roundToYen(averagePerPerson),
    paymentCount: payments.length,
    memberCount: members.length,
    settlementsCount: settlements.length,
  };

  cache.set('statistics', { members, payments }, stats);
  return stats;
};

/**
 * 高度な分析関数
 */
export const calculateAdvancedMetrics = (
  members: readonly Member[],
  payments: readonly Payment[]
) => {
  const balances = calculateMemberBalances(members, payments);
  const totalBalance = balances.reduce((sum, b) => sum + Math.abs(b.balance), 0);
  
  return {
    balances,
    totalImbalance: totalBalance / 2, // 総不均衡額
    maxCreditor: balances.reduce((max, b) => b.balance > max.balance ? b : max, balances[0]),
    maxDebtor: balances.reduce((min, b) => b.balance < min.balance ? b : min, balances[0]),
    settledCount: balances.filter(b => b.status === 'settled').length,
  };
};

/** キャッシュ管理 */
export const clearCalculationCache = (): void => cache.clear();
export const getCacheStats = () => cache.getStats(); 