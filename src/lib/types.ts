/**
 * ドメイン型定義
 * - 型安全性とバリデーションを一元管理
 * - ビジネスルールを型レベルで表現
 */

/** メンバーID型 - 型安全性向上 */
export type MemberId = string & { readonly __brand: 'MemberId' };

/** 支払いID型 - 型安全性向上 */
export type PaymentId = string & { readonly __brand: 'PaymentId' };

/** 正の整数型 - 金額の型安全性 */
export type PositiveAmount = number & { readonly __brand: 'PositiveAmount' };

/**
 * メンバー情報
 */
export interface Member {
  readonly id: MemberId;
  readonly name: string;
}

/**
 * 支払い情報
 */
export interface Payment {
  readonly id: PaymentId;
  readonly payerId: MemberId;
  readonly amount: PositiveAmount;
  readonly memo?: string;
  readonly createdAt: Date;
}

/**
 * アプリ全体の状態
 */
export interface WarikanState {
  readonly eventName: string;
  readonly members: readonly Member[];
  readonly payments: readonly Payment[];
  readonly lastUpdated: Date;
}

/**
 * 最小送金リスト項目
 */
export interface Settlement {
  readonly from: string;
  readonly to: string;
  readonly amount: PositiveAmount;
}

/**
 * メンバー収支情報
 */
export interface MemberBalance {
  readonly memberId: MemberId;
  readonly memberName: string;
  readonly balance: number;
  readonly status: 'receive' | 'pay' | 'settled';
}

/**
 * バリデーション結果
 */
export interface ValidationResult<T> {
  readonly isValid: boolean;
  readonly data?: T;
  readonly errors: readonly string[];
}

/** ヘルパー関数: 型安全なID生成 */
export const createMemberId = (id: string): MemberId => id as MemberId;
export const createPaymentId = (id: string): PaymentId => id as PaymentId;
export const createPositiveAmount = (amount: number): PositiveAmount | null => 
  amount > 0 ? (amount as PositiveAmount) : null; 