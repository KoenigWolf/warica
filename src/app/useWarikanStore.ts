import { useState, useEffect, useCallback, useMemo } from "react";
import type { WarikanState, Member, Payment, MemberId, PaymentId } from "../lib/types";
import { createMemberId, createPaymentId, createPositiveAmount } from "../lib/types";
import { loadFromStorage, saveToStorage, clearStorage } from "../lib/storage";
import { clearCalculationCache } from "../lib/calculations";
import { validateMemberName, validateAmount } from "../lib/validation";
import {
  calculateMemberBalances,
  calculateMinimalSettlements,
} from '../lib/calculations';

/**
 * 割り勘アプリ用状態管理カスタムフック v3.0
 * - hydrationエラー修正
 * - 型安全性とバリデーションを強化
 * - エラーハンドリングとパフォーマンス最適化
 */

// 初期状態（サーバー・クライアント統一）
const INITIAL_STATE: WarikanState = {
  eventName: "",
  members: [],
  payments: [],
  lastUpdated: new Date(),
};

export function useWarikanStore() {
  // 統一された初期状態
  const [state, setState] = useState<WarikanState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // エラー状態の管理
  const [errors, setErrors] = useState<readonly string[]>([]);

  // クライアントサイドでのみストレージから読み込み
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoaded) {
      const result = loadFromStorage();
      if (result.isValid && result.data) {
        setState(result.data);
      } else if (result.errors.length > 0) {
        console.warn('ストレージからの読み込みに失敗:', result.errors);
      }
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // 状態保存副作用（デバウンス付き）
  useEffect(() => {
    // 初期読み込み完了後のみ保存
    if (!isLoaded) return;

    const timeoutId = setTimeout(() => {
      const result = saveToStorage(state);
      if (!result.isValid) {
        setErrors(result.errors);
        console.error('データ保存エラー:', result.errors);
      } else {
        setErrors([]);
      }
    }, 500); // 500ms デバウンス

    return () => clearTimeout(timeoutId);
  }, [state, isLoaded]);

  // 計算キャッシュクリア
  const clearCache = useCallback(() => {
    clearCalculationCache();
  }, []);

  /** イベント名を設定 */
  const setEventName = useCallback((name: string) => {
    // 入力中はバリデーションを行わず、状態のみ更新
    setErrors([]);
    setState((prev) => ({ 
      ...prev, 
      eventName: name,
      lastUpdated: new Date(),
    }));
  }, []);

  /** 型安全ヘルパー関数 */
  const createSafeMemberId = (id: string): MemberId => {
    const result = createMemberId(id);
    if (result.success) return result.data;
    throw new Error(`Invalid member ID: ${id}`);
  };

  const createSafePaymentId = (id: string): PaymentId => {
    const result = createPaymentId(id);
    if (result.success) return result.data;
    throw new Error(`Invalid payment ID: ${id}`);
  };

  const createSafeAmount = (amount: number) => {
    const result = createPositiveAmount(amount);
    if (result.success) return result.data;
    return null;
  };

  /** メンバー追加（バリデーション付き） */
  const addMember = useCallback((name: string) => {
    setState((prev) => {
      const validation = validateMemberName(name, prev.members);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return prev;
      }

      setErrors([]);
      clearCalculationCache();
      
      const newMember: Member = {
        id: createSafeMemberId(crypto.randomUUID()),
        name: validation.data!,
        createdAt: new Date(),
      };

      return {
        ...prev,
        members: [...prev.members, newMember],
        lastUpdated: new Date(),
      };
    });
  }, []);

  /** メンバー名編集（バリデーション付き） */
  const editMember = useCallback((id: MemberId, name: string) => {
    setState((prev) => {
      const otherMembers = prev.members.filter(m => m.id !== id);
      const validation = validateMemberName(name, otherMembers);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        return prev;
      }

      setErrors([]);
      clearCalculationCache();

      return {
        ...prev,
        members: prev.members.map((m) =>
          m.id === id ? { ...m, name: validation.data! } : m
        ),
        lastUpdated: new Date(),
      };
    });
  }, []);

  /** メンバー削除（関連支払いも削除） */
  const removeMember = useCallback((id: MemberId) => {
    setState((prev) => {
      clearCalculationCache();
      setErrors([]);

      return {
        ...prev,
        members: prev.members.filter((m) => m.id !== id),
        payments: prev.payments.filter((p) => p.payerId !== id),
        lastUpdated: new Date(),
      };
    });
  }, []);

  /** 支払い追加（バリデーション付き） */
  const addPayment = useCallback((
    payerId: MemberId, 
    amount: number, 
    memo?: string
  ) => {
    setState((prev) => {
      const validation = validateAmount(amount);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return prev;
      }

      const positiveAmount = createSafeAmount(validation.data!);
      if (!positiveAmount) {
        setErrors(['正の金額を入力してください']);
        return prev;
      }

      setErrors([]);
      clearCalculationCache();

      const newPayment: Payment = {
        id: createSafePaymentId(crypto.randomUUID()),
        payerId,
        amount: positiveAmount,
        memo: memo?.trim(),
        createdAt: new Date(),
      };

      return {
        ...prev,
        payments: [...prev.payments, newPayment],
        lastUpdated: new Date(),
      };
    });
  }, []);

  /** 支払い削除 */
  const removePayment = useCallback((id: PaymentId) => {
    setState((prev) => {
      clearCalculationCache();
      setErrors([]);

      return {
        ...prev,
        payments: prev.payments.filter((p) => p.id !== id),
        lastUpdated: new Date(),
      };
    });
  }, []);

  /** 全データリセット */
  const resetAll = useCallback(() => {
    clearCalculationCache();
    setErrors([]);
    setState(INITIAL_STATE);
    clearStorage();
  }, []);

  /** メモ化された計算結果 */
  const calculations = useMemo(() => {
    if (state.members.length === 0 || state.payments.length === 0) {
      return {
        balances: [],
        settlements: [],
        totalAmount: 0,
        perPersonAmount: 0,
      };
    }

    try {
      const balances = calculateMemberBalances(state.members, state.payments);
      const settlements = calculateMinimalSettlements(balances);
      const totalAmount = state.payments.reduce((sum, p) => sum + p.amount, 0);
      const perPersonAmount = totalAmount / state.members.length;

      return { balances, settlements, totalAmount, perPersonAmount };
    } catch (error) {
      console.error('計算エラー:', error);
      setErrors(['計算中にエラーが発生しました']);
      return {
        balances: [],
        settlements: [],
        totalAmount: 0,
        perPersonAmount: 0,
      };
    }
  }, [state.members, state.payments]);

  return {
    state,
    errors,
    calculations,
    isLoaded, // ローディング状態を追加
    // Actions
    setEventName,
    addMember,
    editMember,
    removeMember,
    addPayment,
    removePayment,
    resetAll,
    clearCache,
  };
}
