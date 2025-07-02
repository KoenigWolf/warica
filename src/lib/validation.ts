import type { ValidationResult, Member, AppError } from './types';

/**
 * 統一バリデーションシステム
 * - 型安全性・パフォーマンス・再利用性を最適化
 * - 構造化エラーメッセージでUX向上
 */

/** エラーコード定数 */
export const ERROR_CODES = {
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_LENGTH: 'INVALID_LENGTH',
  DUPLICATE_VALUE: 'DUPLICATE_VALUE',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  INSUFFICIENT_MEMBERS: 'INSUFFICIENT_MEMBERS',
  INVALID_SELECTION: 'INVALID_SELECTION',
} as const;

/** エラーメッセージマップ */
const ERROR_MESSAGES = {
  [ERROR_CODES.REQUIRED_FIELD]: (field: string) => `${field}は必須です`,
  [ERROR_CODES.INVALID_LENGTH]: (field: string, min?: number, max?: number) => {
    if (min && max) return `${field}は${min}〜${max}文字で入力してください`;
    if (min) return `${field}は${min}文字以上で入力してください`;
    if (max) return `${field}は${max}文字以内で入力してください`;
    return `${field}の長さが無効です`;
  },
  [ERROR_CODES.DUPLICATE_VALUE]: (field: string) => `この${field}は既に存在します`,
  [ERROR_CODES.INVALID_AMOUNT]: () => '金額は1円以上1,000,000円以下で入力してください',
  [ERROR_CODES.INSUFFICIENT_MEMBERS]: () => '最低2人のメンバーが必要です',
  [ERROR_CODES.INVALID_SELECTION]: (field: string) => `${field}を選択してください`,
} as const;

/** バリデーション設定型 */
interface StringValidationOptions {
  readonly required?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly fieldName?: string;
}

interface AmountValidationOptions {
  readonly min?: number;
  readonly max?: number;
}

/** 基本バリデーター */
const createValidator = <T>(
  validate: (value: T) => AppError[]
) => (value: T): ValidationResult<T> => {
  const errors = validate(value);
  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? value : undefined,
    errors: errors.map(e => e.message),
  };
};

/** 文字列バリデーション */
export const validateString = createValidator<string>(() => {
  // 基本的な文字列チェックのみ（オプションは別関数で）
  return [];
});

export const validateStringWithOptions = (
  value: string,
  options: StringValidationOptions = {}
): ValidationResult<string> => {
  const { required = false, minLength, maxLength, fieldName = 'この項目' } = options;
  const errors: AppError[] = [];
  const trimmedValue = value.trim();

  if (required && !trimmedValue) {
    errors.push({
      code: ERROR_CODES.REQUIRED_FIELD,
      message: ERROR_MESSAGES[ERROR_CODES.REQUIRED_FIELD](fieldName),
    });
  }

  if (trimmedValue && minLength && trimmedValue.length < minLength) {
    errors.push({
      code: ERROR_CODES.INVALID_LENGTH,
      message: ERROR_MESSAGES[ERROR_CODES.INVALID_LENGTH](fieldName, minLength),
    });
  }

  if (trimmedValue && maxLength && trimmedValue.length > maxLength) {
    errors.push({
      code: ERROR_CODES.INVALID_LENGTH,
      message: ERROR_MESSAGES[ERROR_CODES.INVALID_LENGTH](fieldName, undefined, maxLength),
    });
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? trimmedValue : undefined,
    errors: errors.map(e => e.message),
  };
};

/** メンバー名バリデーション（最適化済み） */
const memberNameCache = new Map<string, ValidationResult<string>>();

export const validateMemberName = (
  name: string,
  existingMembers: readonly Member[] = []
): ValidationResult<string> => {
  const cacheKey = `${name}:${existingMembers.map(m => m.name).join(',')}`;
  const cached = memberNameCache.get(cacheKey);
  if (cached) return cached;

  const basicValidation = validateStringWithOptions(name, {
    required: true,
    maxLength: 20,
    fieldName: 'メンバー名',
  });

  if (!basicValidation.isValid) {
    memberNameCache.set(cacheKey, basicValidation);
    return basicValidation;
  }

  const trimmedName = basicValidation.data!;
  const isDuplicate = existingMembers.some(
    member => member.name.toLowerCase() === trimmedName.toLowerCase()
  );

  const result: ValidationResult<string> = isDuplicate ? {
    isValid: false,
    errors: [ERROR_MESSAGES[ERROR_CODES.DUPLICATE_VALUE]('メンバー名')],
  } : basicValidation;

  memberNameCache.set(cacheKey, result);
  return result;
};

/** イベント名バリデーション */
export const validateEventName = (name: string): ValidationResult<string> => 
  validateStringWithOptions(name, {
    required: true,
    maxLength: 50,
    fieldName: 'イベント名',
  });

/** 金額バリデーション（パフォーマンス改善） */
export const validateAmount = (
  value: string | number,
  options: AmountValidationOptions = {}
): ValidationResult<number> => {
  const { min = 1, max = 1000000 } = options;
  const numberValue = typeof value === 'string' ? Number(value) : value;
  const errors: AppError[] = [];

  if (!Number.isFinite(numberValue)) {
    errors.push({
      code: ERROR_CODES.INVALID_AMOUNT,
      message: '有効な数値を入力してください',
    });
  } else if (numberValue < min || numberValue > max) {
    errors.push({
      code: ERROR_CODES.INVALID_AMOUNT,
      message: ERROR_MESSAGES[ERROR_CODES.INVALID_AMOUNT](),
    });
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? numberValue : undefined,
    errors: errors.map(e => e.message),
  };
};

/** 複合バリデーション */
export const validateSetupCompletion = (
  eventName: string,
  members: readonly Member[]
): ValidationResult<{ eventName: string; members: readonly Member[] }> => {
  const errors: string[] = [];

  const eventResult = validateEventName(eventName);
  if (!eventResult.isValid) {
    errors.push(...eventResult.errors);
  }

  if (members.length < 2) {
    errors.push(ERROR_MESSAGES[ERROR_CODES.INSUFFICIENT_MEMBERS]());
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? { eventName: eventResult.data!, members } : undefined,
    errors,
  };
};

/** 支払い入力バリデーション（型安全性強化） */
export const validatePaymentInput = (
  payerId: string,
  amount: string,
  payeeIds: readonly string[]
): ValidationResult<{
  payerId: string;
  amount: number;
  payeeIds: readonly string[];
}> => {
  const errors: string[] = [];

  if (!payerId) {
    errors.push(ERROR_MESSAGES[ERROR_CODES.INVALID_SELECTION]('支払者'));
  }

  const amountResult = validateAmount(amount);
  if (!amountResult.isValid) {
    errors.push(...amountResult.errors);
  }

  const validPayeeIds = payeeIds.filter(id => id !== payerId);
  if (validPayeeIds.length === 0) {
    errors.push(ERROR_MESSAGES[ERROR_CODES.INVALID_SELECTION]('対象メンバー'));
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? {
      payerId,
      amount: amountResult.data!,
      payeeIds: validPayeeIds,
    } : undefined,
    errors,
  };
};

/** キャッシュクリア */
export const clearValidationCache = (): void => {
  memberNameCache.clear();
}; 