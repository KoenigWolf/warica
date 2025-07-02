import type { ValidationResult, Member } from './types';

/**
 * バリデーションユーティリティ
 * - 純粋関数として実装し、テスト容易性を向上
 * - 型安全性とビジネスルール検証を統合
 */

/** エラーメッセージ定数 */
export const VALIDATION_MESSAGES = {
  MEMBER_NAME_REQUIRED: 'メンバー名は必須です',
  MEMBER_NAME_TOO_LONG: 'メンバー名は20文字以内で入力してください',
  MEMBER_NAME_DUPLICATE: 'このメンバー名は既に存在します',
  EVENT_NAME_REQUIRED: 'イベント名は必須です',
  EVENT_NAME_TOO_LONG: 'イベント名は50文字以内で入力してください',
  AMOUNT_POSITIVE: '金額は正の数値を入力してください',
  AMOUNT_TOO_LARGE: '金額は1,000,000円以下で入力してください',
  MIN_MEMBERS_REQUIRED: '最低2人のメンバーが必要です',
  PAYER_REQUIRED: '支払者を選択してください',
  PAYEES_REQUIRED: '対象メンバーを選択してください',
} as const;

/** 文字列バリデーション */
export const validateString = (
  value: string,
  options: {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
  } = {}
): ValidationResult<string> => {
  const errors: string[] = [];
  const trimmedValue = value.trim();

  if (options.required && !trimmedValue) {
    errors.push('この項目は必須です');
  }

  if (options.minLength && trimmedValue.length < options.minLength) {
    errors.push(`${options.minLength}文字以上で入力してください`);
  }

  if (options.maxLength && trimmedValue.length > options.maxLength) {
    errors.push(`${options.maxLength}文字以内で入力してください`);
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? trimmedValue : undefined,
    errors,
  };
};

/** メンバー名バリデーション */
export const validateMemberName = (
  name: string,
  existingMembers: readonly Member[] = []
): ValidationResult<string> => {
  const stringResult = validateString(name, {
    required: true,
    maxLength: 20,
  });

  if (!stringResult.isValid) {
    return stringResult;
  }

  const trimmedName = stringResult.data!;
  const isDuplicate = existingMembers.some(
    member => member.name.toLowerCase() === trimmedName.toLowerCase()
  );

  if (isDuplicate) {
    return {
      isValid: false,
      errors: [VALIDATION_MESSAGES.MEMBER_NAME_DUPLICATE],
    };
  }

  return stringResult;
};

/** イベント名バリデーション */
export const validateEventName = (name: string): ValidationResult<string> => {
  return validateString(name, {
    required: true,
    maxLength: 50,
  });
};

/** 金額バリデーション */
export const validateAmount = (value: string | number): ValidationResult<number> => {
  const numberValue = typeof value === 'string' ? Number(value) : value;
  const errors: string[] = [];

  if (isNaN(numberValue)) {
    errors.push('有効な数値を入力してください');
  } else if (numberValue <= 0) {
    errors.push(VALIDATION_MESSAGES.AMOUNT_POSITIVE);
  } else if (numberValue > 1000000) {
    errors.push(VALIDATION_MESSAGES.AMOUNT_TOO_LARGE);
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? numberValue : undefined,
    errors,
  };
};

/** セットアップ完了バリデーション */
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
    errors.push(VALIDATION_MESSAGES.MIN_MEMBERS_REQUIRED);
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? { eventName: eventResult.data!, members } : undefined,
    errors,
  };
};

/** 支払い入力バリデーション */
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
    errors.push(VALIDATION_MESSAGES.PAYER_REQUIRED);
  }

  const amountResult = validateAmount(amount);
  if (!amountResult.isValid) {
    errors.push(...amountResult.errors);
  }

  const validPayeeIds = payeeIds.filter(id => id !== payerId);
  if (validPayeeIds.length === 0) {
    errors.push(VALIDATION_MESSAGES.PAYEES_REQUIRED);
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