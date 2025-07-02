"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  cn, 
  getCardClasses, 
  getAmountStyle 
} from '@/lib/design-system';
import { 
  formatCompactAmount, 
  formatMemo, 
  formatTimeAgo
} from '@/lib/utils';
import type { Payment, Member, PaymentId } from '@/lib/types';

/**
 * 支払い項目表示コンポーネント
 * - 新デザインシステム統合
 * - 視認性とUXを最適化
 * - レスポンシブ対応・アクセシビリティ配慮
 */

interface PaymentItemProps {
  payment: Payment;
  members: readonly Member[];
  onEdit?: (payment: Payment) => void;
  onRemove?: (paymentId: PaymentId) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const PaymentItem: React.FC<PaymentItemProps> = ({
  payment,
  members,
  onEdit,
  onRemove,
  showActions = true,
  compact = false,
}) => {
  const payerName = members.find(m => m.id === payment.payerId)?.name || '不明';
  const amountStyleClass = getAmountStyle(payment.amount);

  if (compact) {
    return (
      <div className={getCardClasses('compact')}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-base sm:text-lg">
            <span className="font-medium text-gray-800 truncate">
              {payerName}
            </span>
            <span className={cn(amountStyleClass, "whitespace-nowrap font-mono")}>
              {formatCompactAmount(payment.amount)}
            </span>
          </div>
          {payment.memo && (
            <div className="text-sm sm:text-base text-gray-500 mt-1 truncate">
              {formatMemo(payment.memo, 30)}
            </div>
          )}
        </div>
        {showActions && (
          <div className="flex gap-1 ml-2">
            {onEdit && (
              <Button
                variant="ghost"
                onClick={() => onEdit(payment)}
                className="text-sm px-3 py-2 h-auto"
                aria-label={`${payerName}の支払いを編集`}
              >
                編集
              </Button>
            )}
            {onRemove && (
              <Button
                variant="ghost"
                onClick={() => onRemove(payment.id)}
                className="text-sm text-red-500 px-3 py-2 h-auto hover:text-red-700"
                aria-label={`${payerName}の支払いを削除`}
              >
                削除
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={getCardClasses('normal')}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* メイン情報 */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-base">
                  {payerName.charAt(0)}
                </span>
              </div>
              <span className="font-medium text-gray-800 text-lg">
                {payerName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-base">が支払い</span>
              <span className={cn(amountStyleClass, "font-mono font-semibold text-lg")}>
                {formatCompactAmount(payment.amount)}
              </span>
            </div>
          </div>

          {/* メモ情報 */}
          {payment.memo && (
            <div className="mb-2">
              <div className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 rounded text-base text-gray-600">
                <span className="text-sm">💬</span>
                <span>{formatMemo(payment.memo, 40)}</span>
              </div>
            </div>
          )}

          {/* タイムスタンプ */}
          <div className="text-sm text-gray-400">
            {formatTimeAgo(payment.createdAt)}
            {payment.updatedAt && payment.updatedAt !== payment.createdAt && (
              <span className="ml-2">(編集済み)</span>
            )}
          </div>
        </div>

        {/* アクション */}
        {showActions && (
          <div className="flex flex-col gap-2 ml-4">
            {onEdit && (
              <Button
                variant="outline"
                onClick={() => onEdit(payment)}
                className="text-sm px-4 py-2"
                aria-label={`${payerName}の支払いを編集`}
              >
                編集
              </Button>
            )}
            {onRemove && (
              <Button
                variant="ghost"
                onClick={() => onRemove(payment.id)}
                className="text-sm text-red-500 px-4 py-2 hover:text-red-700 hover:bg-red-50"
                aria-label={`${payerName}の支払いを削除`}
              >
                削除
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 支払い一覧コンポーネント
 * - 統一されたスタイリング
 * - パフォーマンス最適化
 */
interface PaymentListProps {
  payments: readonly Payment[];
  members: readonly Member[];
  onEditPayment?: (payment: Payment) => void;
  onRemovePayment?: (paymentId: PaymentId) => void;
  compact?: boolean;
  emptyMessage?: string;
}

export const PaymentList: React.FC<PaymentListProps> = ({
  payments,
  members,
  onEditPayment,
  onRemovePayment,
  compact = false,
  emptyMessage = '支払いが登録されていません',
}) => {
  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="text-6xl mb-4">💳</div>
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1" role="list" aria-label="支払い一覧">
      {payments.map((payment) => (
        <PaymentItem
          key={payment.id}
          payment={payment}
          members={members}
          onEdit={onEditPayment}
          onRemove={onRemovePayment}
          compact={compact}
        />
      ))}
    </div>
  );
}; 