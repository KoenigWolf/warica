import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 最適化ユーティリティ関数群
 * - Tailwind CSS クラス統合
 * - 視認性・UX最適化フォーマッター
 * - 型安全性とパフォーマンス向上
 */

/**
 * Tailwind CSS クラス統合（最適化済み）
 * - 条件付きクラス名のマージとコンフリクト解消
 * - パフォーマンス：メモ化対応（将来拡張）
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * 遅延実行（デバウンス）ユーティリティ
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 金額フォーマッター（視認性強化版）
 */
export const formatCurrency = (amount: number): string => 
  new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(amount)

/** 数値のみの通貨フォーマット（カンマ区切り） */
export const formatAmount = (amount: number): string => 
  new Intl.NumberFormat('ja-JP').format(amount)

/** 収支表示用フォーマット（符号付き） */
export const formatBalance = (balance: number): string => {
  const formatted = formatAmount(Math.abs(balance))
  if (balance > 0) return `+${formatted}`
  if (balance < 0) return `-${formatted}`
  return '±0'
}

/** コンパクト金額表示（3桁区切り + 円） */
export const formatCompactAmount = (amount: number): string => 
  `${formatAmount(amount)}円`

/**
 * テキスト表示の最適化
 */

/** メンバー名の表示最適化 */
export const formatMemberName = (name: string, maxLength = 8): string => {
  if (name.length <= maxLength) return name
  return `${name.slice(0, maxLength - 1)}…`
}

/** メモテキストの表示最適化 */
export const formatMemo = (memo: string, maxLength = 20): string => {
  if (!memo) return ''
  const trimmed = memo.trim()
  if (trimmed.length <= maxLength) return trimmed
  return `${trimmed.slice(0, maxLength - 1)}…`
}

/** 支払い説明文の生成 */
export const formatPaymentDescription = (
  payerName: string,
  amount: number,
  memo?: string
): string => {
  const baseText = `${formatMemberName(payerName)} が ${formatCompactAmount(amount)}`
  if (memo) {
    return `${baseText} (${formatMemo(memo)})`
  }
  return baseText
}

/**
 * 日付ユーティリティ
 */
export const formatDate = (date: Date): string => 
  new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)

export const formatDateTime = (date: Date): string => 
  new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

export const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'たった今'
  if (diffMins < 60) return `${diffMins}分前`
  if (diffHours < 24) return `${diffHours}時間前`
  if (diffDays < 7) return `${diffDays}日前`
  return formatDate(date)
}

/**
 * CSS・スタイリングヘルパー
 */

/** 収支額のスタイルクラス */
export const getBalanceStyleClass = (balance: number): string => {
  if (balance > 0) return 'text-green-600 font-semibold'
  if (balance < 0) return 'text-red-600 font-semibold'
  return 'text-gray-500'
}

/** 金額のスタイルクラス（大きさ別） */
export const getAmountStyleClass = (amount: number): string => {
  if (amount >= 10000) return 'text-lg font-bold text-blue-700'
  if (amount >= 5000) return 'text-base font-semibold text-blue-600'
  if (amount >= 1000) return 'text-base font-medium text-blue-600'
  return 'text-sm font-normal text-gray-700'
}

/**
 * データ変換ヘルパー
 */

/** 安全な配列アクセス */
export const safeGet = <T>(array: readonly T[], index: number): T | undefined => 
  array[index]

/** 型安全なオブジェクトキー取得 */
export const getKeys = <T extends Record<string, unknown>>(obj: T): (keyof T)[] => 
  Object.keys(obj) as (keyof T)[]

/** 深いオブジェクト比較（浅い実装） */
export const isEqual = <T>(a: T, b: T): boolean => 
  JSON.stringify(a) === JSON.stringify(b)

/** 配列のグループ化 */
export const groupBy = <T, K extends string | number>(
  array: readonly T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};
