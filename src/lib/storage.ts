import type { WarikanState, ValidationResult, Result } from './types';

/**
 * 高性能ストレージ管理システム
 * - 型安全性・耐障害性・パフォーマンス最適化
 * - データ整合性保証とマイグレーション対応
 */

/** 設定定数 */
const CONFIG = {
  STORAGE_KEY: 'warican-app-data-v2' as const,
  STORAGE_VERSION: '2.0.0' as const,
  BACKUP_KEY: 'warican-backup-v2' as const,
  MAX_STORAGE_SIZE: 4.5 * 1024 * 1024, // 4.5MB (安全マージン)
  COMPRESSION_THRESHOLD: 1024, // 1KB以上で圧縮検討
} as const;

/** ストレージエラー体系 */
export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

// エラーファクトリー（将来使用予定）
// const createStorageError = (code: string, message: string, cause?: Error) => 
//   new StorageError(message, code, cause);

/** ストレージデータ型 */
interface StorageMetadata {
  readonly version: string;
  readonly timestamp: number;
  readonly checksum: string;
  readonly compressed?: boolean;
}

interface StorageContainer {
  readonly metadata: StorageMetadata;
  readonly data: WarikanState;
}

/** デフォルト状態ファクトリー */
const createDefaultState = (): WarikanState => ({
  eventName: '',
  members: [],
  payments: [],
  lastUpdated: new Date(),
  version: CONFIG.STORAGE_VERSION,
});

/** 環境検出 */
const isStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/** チェックサム計算（簡易実装） */
const calculateChecksum = (data: unknown): string => {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit整数変換
  }
  return Math.abs(hash).toString(16);
};

/** データ圧縮（将来拡張用） */
// const compressData = (data: string): string => {
//   // 現在はそのまま返す（将来的にlz-stringなど検討）
//   return data;
// };

// const decompressData = (data: string): string => {
//   return data;
// };

/** ストレージデータバリデーション */
const validateStorageContainer = (rawData: unknown): Result<StorageContainer> => {
  try {
    if (!rawData || typeof rawData !== 'object') {
      return {
        success: false,
        error: { code: 'INVALID_FORMAT', message: 'データ形式が無効です' },
      };
    }

    const container = rawData as Partial<StorageContainer>;
    
    if (!container.metadata || !container.data) {
      return {
        success: false,
        error: { code: 'MISSING_FIELDS', message: '必須フィールドが不足しています' },
      };
    }

    // メタデータ検証
    const { metadata, data } = container as StorageContainer;
    if (typeof metadata.version !== 'string' || typeof metadata.timestamp !== 'number') {
      return {
        success: false,
        error: { code: 'INVALID_METADATA', message: 'メタデータが無効です' },
      };
    }

    // データ整合性チェック
    if (metadata.checksum !== calculateChecksum(data)) {
      return {
        success: false,
        error: { code: 'CHECKSUM_MISMATCH', message: 'データが破損している可能性があります' },
      };
    }

    // アプリデータ検証
    const appData = data as Partial<WarikanState>;
    if (typeof appData.eventName !== 'string' || 
        !Array.isArray(appData.members) || 
        !Array.isArray(appData.payments)) {
      return {
        success: false,
        error: { code: 'INVALID_APP_DATA', message: 'アプリデータが無効です' },
      };
    }

    // 日付復元
    const validatedData: WarikanState = {
      ...appData as WarikanState,
      lastUpdated: appData.lastUpdated ? new Date(appData.lastUpdated) : new Date(),
      payments: appData.payments.map(payment => ({
        ...payment,
        createdAt: payment.createdAt ? new Date(payment.createdAt) : new Date(),
        updatedAt: payment.updatedAt ? new Date(payment.updatedAt) : undefined,
      })),
    };

    return {
      success: true,
      data: { metadata, data: validatedData },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'PARSE_ERROR',
        message: 'データの解析に失敗しました',
        details: error,
      },
    };
  }
};

/** 自動バックアップ */
const createBackup = (data: string): void => {
  try {
    if (isStorageAvailable()) {
      localStorage.setItem(CONFIG.BACKUP_KEY, data);
    }
  } catch {
    // バックアップ失敗は致命的ではない
  }
};

const restoreFromBackup = (): string | null => {
  try {
    return isStorageAvailable() ? localStorage.getItem(CONFIG.BACKUP_KEY) : null;
  } catch {
    return null;
  }
};

/**
 * 高性能ストレージ読み込み
 */
export const loadFromStorage = (): ValidationResult<WarikanState> => {
  if (!isStorageAvailable()) {
    return {
      isValid: true,
      data: createDefaultState(),
      errors: [],
    };
  }

  try {
    const rawData = localStorage.getItem(CONFIG.STORAGE_KEY);
    
    if (!rawData) {
      return {
        isValid: true,
        data: createDefaultState(),
        errors: [],
      };
    }

    const parsedData = JSON.parse(rawData);
    const validation = validateStorageContainer(parsedData);

    if (!validation.success) {
      console.warn('プライマリデータ読み込み失敗:', validation.error);
      
      // バックアップからの復旧試行
      const backupData = restoreFromBackup();
      if (backupData) {
        try {
          const backupParsed = JSON.parse(backupData);
          const backupValidation = validateStorageContainer(backupParsed);
          
          if (backupValidation.success) {
            console.info('バックアップから復旧しました');
            return {
              isValid: true,
              data: backupValidation.data.data,
              errors: [],
            };
          }
        } catch {
          // バックアップ復旧失敗
        }
      }

      // 完全失敗時は初期状態
      return {
        isValid: true,
        data: createDefaultState(),
        errors: [],
      };
    }

    return {
      isValid: true,
      data: validation.data.data,
      errors: [],
    };
  } catch (error) {
    console.error('ストレージ読み込みエラー:', error);
    
    // エラー時は破損データクリア
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } catch {
      // クリア失敗も無視
    }

    return {
      isValid: true,
      data: createDefaultState(),
      errors: [],
    };
  }
};

/**
 * 最適化ストレージ保存
 */
export const saveToStorage = (state: WarikanState): ValidationResult<void> => {
  if (!isStorageAvailable()) {
    return { isValid: true, errors: [] };
  }

  try {
    const enhancedState: WarikanState = {
      ...state,
      lastUpdated: new Date(),
      version: CONFIG.STORAGE_VERSION,
    };

    const metadata: StorageMetadata = {
      version: CONFIG.STORAGE_VERSION,
      timestamp: Date.now(),
      checksum: calculateChecksum(enhancedState),
    };

    const container: StorageContainer = {
      metadata,
      data: enhancedState,
    };

    const serializedData = JSON.stringify(container);

    // サイズチェック
    if (serializedData.length > CONFIG.MAX_STORAGE_SIZE) {
      return {
        isValid: false,
        errors: ['データサイズが制限を超えています'],
      };
    }

    // 圧縮検討（将来拡張）
    if (serializedData.length > CONFIG.COMPRESSION_THRESHOLD) {
      // metadata.compressed = true;
      // serializedData = compressData(serializedData);
    }

    // バックアップ作成
    createBackup(serializedData);

    // メイン保存
    localStorage.setItem(CONFIG.STORAGE_KEY, serializedData);

    return { isValid: true, errors: [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : '不明なエラー';
    return {
      isValid: false,
      errors: [`データの保存に失敗しました: ${message}`],
    };
  }
};

/**
 * 安全なストレージクリア
 */
export const clearStorage = (): ValidationResult<void> => {
  if (!isStorageAvailable()) {
    return { isValid: true, errors: [] };
  }

  try {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    localStorage.removeItem(CONFIG.BACKUP_KEY);
    return { isValid: true, errors: [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : '不明なエラー';
    return {
      isValid: false,
      errors: [`データの削除に失敗しました: ${message}`],
    };
  }
};

/**
 * ストレージ使用量分析
 */
export const getStorageUsage = (): {
  used: number;
  total: number;
  percentage: number;
  hasBackup: boolean;
} => {
  if (!isStorageAvailable()) {
    return { used: 0, total: 0, percentage: 0, hasBackup: false };
  }

  try {
    const mainData = localStorage.getItem(CONFIG.STORAGE_KEY);
    const backupData = localStorage.getItem(CONFIG.BACKUP_KEY);
    
    const mainSize = mainData ? new Blob([mainData]).size : 0;
    const backupSize = backupData ? new Blob([backupData]).size : 0;
    const used = mainSize + backupSize;
    
    const total = CONFIG.MAX_STORAGE_SIZE;
    const percentage = (used / total) * 100;

    return { 
      used, 
      total, 
      percentage: Math.round(percentage * 100) / 100,
      hasBackup: !!backupData,
    };
  } catch {
    return { used: 0, total: 0, percentage: 0, hasBackup: false };
  }
};

/**
 * データ整合性チェック
 */
export const checkDataIntegrity = (): {
  isValid: boolean;
  issues: string[];
} => {
  if (!isStorageAvailable()) {
    return { isValid: true, issues: [] };
  }

  const issues: string[] = [];

  try {
    const rawData = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!rawData) {
      return { isValid: true, issues: [] };
    }

    const validation = validateStorageContainer(JSON.parse(rawData));
    if (!validation.success) {
      issues.push(validation.error.message);
    }

    // バックアップチェック
    const backupData = restoreFromBackup();
    if (!backupData) {
      issues.push('バックアップデータが見つかりません');
    }

  } catch {
    issues.push('データの読み込みに失敗しました');
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}; 