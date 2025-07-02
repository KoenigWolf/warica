import { useState, useEffect, useCallback } from "react";

/**
 * メンバー情報
 */
export type Member = {
  id: string;
  name: string;
};

/**
 * 支払い情報
 */
export type Payment = {
  id: string;
  payerId: string;
  amount: number;
  memo?: string;
};

/**
 * アプリ全体の状態
 */
export type WarikanState = {
  eventName: string;
  members: Member[];
  payments: Payment[];
};

const STORAGE_KEY = "warikan-app-data-v1";

/**
 * ローカルストレージから初期データを取得
 * @returns WarikanState
 */
function loadStateFromStorage(): WarikanState {
  if (typeof window === "undefined") return defaultWarikanState;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // バリデーション
      if (
        typeof parsed.eventName === "string" &&
        Array.isArray(parsed.members) &&
        Array.isArray(parsed.payments)
      ) {
        return parsed;
      }
    }
  } catch {
    // フォールバック: 不正データの場合は初期化
    localStorage.removeItem(STORAGE_KEY);
  }
  return defaultWarikanState;
}

/**
 * デフォルトの初期値
 */
const defaultWarikanState: WarikanState = {
  eventName: "",
  members: [],
  payments: [],
};

/**
 * ローカルストレージに状態を保存
 */
function saveStateToStorage(state: WarikanState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * 全データをローカルストレージから削除
 */
function clearStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 割り勘アプリ用状態管理カスタムフック
 * - イベント名、メンバー、支払い情報を管理し、ローカルストレージに永続化
 * - 副作用はフック外ユーティリティに委譲し、テスト容易性・責務分離を確保
 */
export function useWarikanStore() {
  const [state, setState] = useState<WarikanState>(loadStateFromStorage);

  // 状態保存副作用
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  /** イベント名を設定 */
  const setEventName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, eventName: name }));
  }, []);

  /** メンバー追加 */
  const addMember = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      members: [...prev.members, { id: crypto.randomUUID(), name }],
    }));
  }, []);

  /** メンバー名編集 */
  const editMember = useCallback((id: string, name: string) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === id ? { ...m, name } : m
      ),
    }));
  }, []);

  /** メンバー削除（その人が支払者のデータも削除） */
  const removeMember = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
      payments: prev.payments.filter((p) => p.payerId !== id),
    }));
  }, []);

  /** 支払い追加 */
  const addPayment = useCallback(
    (payerId: string, amount: number, memo?: string) => {
      setState((prev) => ({
        ...prev,
        payments: [
          ...prev.payments,
          { id: crypto.randomUUID(), payerId, amount, memo },
        ],
      }));
    },
    []
  );

  /** 支払い削除 */
  const removePayment = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      payments: prev.payments.filter((p) => p.id !== id),
    }));
  }, []);

  /** 支払い編集 */
  const editPayment = useCallback(
    (id: string, update: Partial<Omit<Payment, 'id'>>) => {
      setState((prev) => ({
        ...prev,
        payments: prev.payments.map((p) =>
          p.id === id ? { ...p, ...update } : p
        ),
      }));
    },
    []
  );

  /** 全データリセット */
  const resetAll = useCallback(() => {
    setState(defaultWarikanState);
    clearStorage();
  }, []);

  return {
    state,
    setEventName,
    addMember,
    editMember,
    removeMember,
    addPayment,
    removePayment,
    editPayment,
    resetAll,
    setState, // 高度な用途のみ: 通常は直接使わない
  };
}
