import type { WarikanState, ValidationResult } from './types';

/**
 * ローカルストレージ管理
 * - 型安全性とエラーハンドリングを強化
 * - テスト容易性と保守性を向上
 */

const STORAGE_KEY = "warikan-app-data-v1" as const;
const STORAGE_VERSION = "1.0.0" as const;

/** ストレージエラー型 */
export class StorageError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

/** デフォルト状態 */
const createDefaultState = (): WarikanState => ({
  eventName: "",
  members: [],
  payments: [],
  lastUpdated: new Date(),
});

/** ストレージデータの型 */
interface StorageData {
  version: string;
  data: WarikanState;
  timestamp: number;
}

/**
 * ブラウザ環境チェック
 */
const isBrowserEnvironment = (): boolean => {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
};

/**
 * ストレージデータのバリデーション
 */
const validateStorageData = (data: unknown): ValidationResult<WarikanState> => {
  try {
    if (!data || typeof data !== 'object') {
      return {
        isValid: false,
        errors: ['無効なデータ形式です'],
      };
    }

    const storageData = data as Partial<StorageData>;
    
    if (!storageData.data || typeof storageData.data !== 'object') {
      return {
        isValid: false,
        errors: ['アプリデータが見つかりません'],
      };
    }

    const appData = storageData.data as Partial<WarikanState>;

    // 必須フィールドの検証
    if (typeof appData.eventName !== 'string') {
      return {
        isValid: false,
        errors: ['イベント名が無効です'],
      };
    }

    if (!Array.isArray(appData.members)) {
      return {
        isValid: false,
        errors: ['メンバーデータが無効です'],
      };
    }

    if (!Array.isArray(appData.payments)) {
      return {
        isValid: false,
        errors: ['支払いデータが無効です'],
      };
    }

    // 日付フィールドの復元
    const lastUpdated = appData.lastUpdated 
      ? new Date(appData.lastUpdated)
      : new Date();

    const validatedData: WarikanState = {
      eventName: appData.eventName,
      members: appData.members,
      payments: appData.payments.map(payment => ({
        ...payment,
        createdAt: payment.createdAt ? new Date(payment.createdAt) : new Date(),
      })),
      lastUpdated,
    };

    return {
      isValid: true,
      data: validatedData,
      errors: [],
    };
  } catch {
    return {
      isValid: false,
      errors: ['データの解析に失敗しました'],
    };
  }
};

/**
 * ストレージからデータを読み込み
 */
export const loadFromStorage = (): ValidationResult<WarikanState> => {
  if (!isBrowserEnvironment()) {
    return {
      isValid: true,
      data: createDefaultState(),
      errors: [],
    };
  }

  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    
    if (!rawData) {
      return {
        isValid: true,
        data: createDefaultState(),
        errors: [],
      };
    }

    const parsedData = JSON.parse(rawData);
    const validation = validateStorageData(parsedData);

    if (!validation.isValid) {
      // 破損データの場合は初期状態を返す
      console.warn('ストレージデータが破損しています:', validation.errors);
      return {
        isValid: true,
        data: createDefaultState(),
        errors: [],
      };
    }

    return validation;
  } catch (err) {
    console.error('ストレージ読み込みエラー:', err);
    
    // エラー時は破損データを削除
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // 削除に失敗しても継続
    }

    return {
      isValid: true,
      data: createDefaultState(),
      errors: [],
    };
  }
};

/**
 * ストレージにデータを保存
 */
export const saveToStorage = (state: WarikanState): ValidationResult<void> => {
  if (!isBrowserEnvironment()) {
    return {
      isValid: true,
      errors: [],
    };
  }

  try {
    const storageData: StorageData = {
      version: STORAGE_VERSION,
      data: {
        ...state,
        lastUpdated: new Date(),
      },
      timestamp: Date.now(),
    };

    const serialized = JSON.stringify(storageData);
    localStorage.setItem(STORAGE_KEY, serialized);

    return {
      isValid: true,
      errors: [],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : '不明なエラー';
    
    return {
      isValid: false,
      errors: [`データの保存に失敗しました: ${message}`],
    };
  }
};

/**
 * ストレージデータをクリア
 */
export const clearStorage = (): ValidationResult<void> => {
  if (!isBrowserEnvironment()) {
    return {
      isValid: true,
      errors: [],
    };
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    return {
      isValid: true,
      errors: [],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : '不明なエラー';
    
    return {
      isValid: false,
      errors: [`データの削除に失敗しました: ${message}`],
    };
  }
};

/**
 * ストレージ使用量の取得
 */
export const getStorageUsage = (): {
  used: number;
  total: number;
  percentage: number;
} => {
  if (!isBrowserEnvironment()) {
    return { used: 0, total: 0, percentage: 0 };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const used = data ? new Blob([data]).size : 0;
    const total = 1024 * 1024 * 5; // 5MB (一般的なlocalStorageの制限)
    const percentage = (used / total) * 100;

    return { used, total, percentage };
  } catch {
    return { used: 0, total: 0, percentage: 0 };
  }
}; 