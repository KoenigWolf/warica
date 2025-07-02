/**
 * コアドメイン型定義
 * - 型安全性とビジネスルール一元管理
 * - Zero-runtime型ブランディングによる実行時安全性
 */

/** ブランド型：実行時検証付きID */
export type MemberId = string & { readonly __brand: 'MemberId' };
export type PaymentId = string & { readonly __brand: 'PaymentId' };
export type PositiveAmount = number & { readonly __brand: 'PositiveAmount' };

/** エラー型：構造化エラーハンドリング */
export interface AppError {
  readonly code: string;
  readonly message: string;
  readonly details?: unknown;
}

/** 結果型：型安全なエラーハンドリング */
export type Result<T, E = AppError> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

/** バリデーション結果：後方互換性維持 */
export interface ValidationResult<T> {
  readonly isValid: boolean;
  readonly data?: T;
  readonly errors: readonly string[];
}

/** ドメインエンティティ */
export interface Member {
  readonly id: MemberId;
  readonly name: string;
  readonly createdAt?: Date;
}

export interface Payment {
  readonly id: PaymentId;
  readonly payerId: MemberId;
  readonly amount: PositiveAmount;
  readonly memo?: string;
  readonly createdAt: Date;
  readonly updatedAt?: Date;
}

/** アプリケーション状態 */
export interface WarikanState {
  readonly eventName: string;
  readonly members: readonly Member[];
  readonly payments: readonly Payment[];
  readonly lastUpdated: Date;
  readonly version?: string;
}

/** 計算結果型 */
export interface Settlement {
  readonly from: string;
  readonly to: string;
  readonly amount: PositiveAmount;
}

export interface MemberBalance {
  readonly memberId: MemberId;
  readonly memberName: string;
  readonly balance: number;
  readonly status: 'receive' | 'pay' | 'settled';
  readonly absoluteAmount: PositiveAmount;
}

export interface CalculationSummary {
  readonly totalAmount: PositiveAmount;
  readonly averagePerPerson: number;
  readonly paymentCount: number;
  readonly memberCount: number;
  readonly settlementsCount: number;
}

/** 型ガード関数 */
export const isPositiveAmount = (value: number): value is PositiveAmount => 
  Number.isFinite(value) && value > 0;

export const isMemberId = (value: string): value is MemberId => 
  typeof value === 'string' && value.length > 0;

export const isPaymentId = (value: string): value is PaymentId => 
  typeof value === 'string' && value.length > 0;

/** 型安全ファクトリー関数 */
export const createMemberId = (id: string): Result<MemberId> => 
  isMemberId(id) 
    ? { success: true, data: id as MemberId }
    : { success: false, error: { code: 'INVALID_MEMBER_ID', message: 'Invalid member ID' } };

export const createPaymentId = (id: string): Result<PaymentId> => 
  isPaymentId(id)
    ? { success: true, data: id as PaymentId }
    : { success: false, error: { code: 'INVALID_PAYMENT_ID', message: 'Invalid payment ID' } };

export const createPositiveAmount = (amount: number): Result<PositiveAmount> => 
  isPositiveAmount(amount)
    ? { success: true, data: amount as PositiveAmount }
    : { success: false, error: { code: 'INVALID_AMOUNT', message: 'Amount must be positive' } };

/** 便利ヘルパー（後方互換性） */
export const createMemberIdUnsafe = (id: string): MemberId => id as MemberId;
export const createPaymentIdUnsafe = (id: string): PaymentId => id as PaymentId;
export const createPositiveAmountUnsafe = (amount: number): PositiveAmount | null => 
  isPositiveAmount(amount) ? (amount as PositiveAmount) : null; 