import { useState, useEffect, useCallback, useMemo } from "react";
import type { WarikanState, Member, Payment, MemberId, PaymentId } from "../lib/types";
import { createMemberId, createPaymentId, createPositiveAmount } from "../lib/types";
import { loadFromStorage, saveToStorage, clearStorage } from "../lib/storage";
import { clearCalculationCache } from "../lib/calculations";
import { validateMemberName, validateAmount } from "../lib/validation";

/**
 * 割り勘アプリ用状態管理カスタムフック
 * - 型安全性とバリデーションを強化
 * - エラーハンドリングとパフォーマンス最適化
 * - テスト容易性と保守性を向上
 */
export function useWarikanStore() {
  // 初期状態の読み込み
  const [state, setState] = useState<WarikanState>(() => {
    const result = loadFromStorage();
    if (result.isValid && result.data) {
      return result.data;
    }
    console.warn('ストレージからの読み込みに失敗:', result.errors);
    return {
      eventName: "",
      members: [],
      payments: [],
      lastUpdated: new Date(),
    };
  });

  // エラー状態の管理
  const [errors, setErrors] = useState<readonly string[]>([]);

  // 状態保存副作用（デバウンス付き）
  useEffect(() => {
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
  }, [state]);

  // 計算キャッシュクリア
  const clearCache = useCallback(() => {
    clearCalculationCache();
  }, []);

  /** イベント名を設定 */
  const setEventName = useCallback((name: string) => {
    setState((prev) => ({ 
      ...prev, 
      eventName: name.trim(),
      lastUpdated: new Date(),
    }));
  }, []);

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
        id: createMemberId(crypto.randomUUID()),
        name: validation.data!,
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

      const positiveAmount = createPositiveAmount(validation.data!);
      if (!positiveAmount) {
        setErrors(['正の金額を入力してください']);
        return prev;
      }

      setErrors([]);
      clearCalculationCache();

      const newPayment: Payment = {
        id: createPaymentId(crypto.randomUUID()),
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

  /** 支払い編集 */
  const editPayment = useCallback((
    id: PaymentId, 
    update: Partial<Pick<Payment, 'payerId' | 'amount' | 'memo'>>
  ) => {
    setState((prev) => {
      const processedUpdate = { ...update };
      
      if (update.amount !== undefined) {
        const validation = validateAmount(update.amount);
        if (!validation.isValid) {
          setErrors(validation.errors);
          return prev;
        }

        const positiveAmount = createPositiveAmount(validation.data!);
        if (!positiveAmount) {
          setErrors(['正の金額を入力してください']);
          return prev;
        }
        processedUpdate.amount = positiveAmount;
      }

      setErrors([]);
      clearCalculationCache();

      return {
        ...prev,
        payments: prev.payments.map((p) =>
          p.id === id ? { ...p, ...processedUpdate } : p
        ),
        lastUpdated: new Date(),
      };
    });
  }, []);

  /** 全データリセット */
  const resetAll = useCallback(() => {
    const result = clearStorage();
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    clearCalculationCache();
    setErrors([]);
    
    setState({
      eventName: "",
      members: [],
      payments: [],
      lastUpdated: new Date(),
    });
  }, []);

  // メモ化された派生状態
  const derivedState = useMemo(() => ({
    memberCount: state.members.length,
    paymentCount: state.payments.length,
    totalAmount: state.payments.reduce((sum, p) => sum + p.amount, 0),
    hasData: state.members.length > 0 || state.payments.length > 0,
  }), [state.members.length, state.payments]);

  return {
    // 基本状態
    state,
    errors,
    derived: derivedState,
    
    // アクション
    setEventName,
    addMember,
    editMember,
    removeMember,
    addPayment,
    removePayment,
    editPayment,
    resetAll,
    clearCache,
    
    // 高度な用途（テスト等）
    setState,
  };
}
