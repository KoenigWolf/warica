"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn, typography } from '@/lib/design-system';
import { formatCompactAmount } from '@/lib/utils';
import type { Payment, Member, PaymentId } from '@/lib/types';

/**
 * 支払い一覧コンポーネント
 * - シンプルで見やすいデザイン
 * - スマホ最適化
 */
interface PaymentListProps {
  payments: readonly Payment[];
  members: readonly Member[];
  onRemovePayment?: (paymentId: PaymentId) => void;
  emptyMessage?: string;
}

export const PaymentList: React.FC<PaymentListProps> = ({
  payments,
  members,
  onRemovePayment,
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
    <div className="space-y-3">
      {payments.map((payment) => {
        const member = members.find((m) => m.id === payment.payerId);
        if (!member) return null;

        return (
          <div
            key={payment.id}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 shadow-sm hover:bg-white/80 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-base">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className={cn(typography.body.base, 'font-medium text-gray-800')}>
                    {member.name}
                  </p>
                  {payment.memo && (
                    <p className={cn(typography.body.small, 'text-gray-500')}>
                      {payment.memo}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={cn(typography.heading.h4, 'font-semibold text-gray-800')}>
                  {formatCompactAmount(payment.amount)}
                </span>
                
                {onRemovePayment && (
                  <Button
                    onClick={() => onRemovePayment?.(payment.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-10 w-10 p-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="sr-only">削除</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}; 