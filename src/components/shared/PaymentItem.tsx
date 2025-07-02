"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn, typography, colors, spacing } from '@/lib/design-system';
import { formatCompactAmount } from '@/lib/utils';
import type { Payment, Member, PaymentId } from '@/lib/types';

/**
 * ハイブランド 支払い一覧コンポーネント v3.0
 * - モノトーンデザイン
 * - ミニマルインターフェース
 * - エレガントな表示
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
  emptyMessage = 'No payments recorded',
}) => {
  if (payments.length === 0) {
    return (
      <div className={cn(
        'text-center py-12',
        colors.surface.secondary,
        'border-2 border-dashed'
      )}>
        <p className={cn(typography.body.base, colors.text.secondary)}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={spacing.element}>
      {payments.map((payment) => {
        const member = members.find((m) => m.id === payment.payerId);
        if (!member) return null;

        return (
          <div
            key={payment.id}
            className={cn(
              colors.surface.elevated,
              'p-4 hover:bg-muted/20 transition-colors duration-200'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-10 h-10 border border-border flex items-center justify-center font-medium text-sm',
                  colors.text.secondary
                )}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={cn(typography.body.base, 'font-light')}>
                    {member.name}
                  </p>
                  {payment.memo && (
                    <p className={cn(typography.caption, colors.text.tertiary)}>
                      {payment.memo}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={cn(typography.heading.h4, 'font-light')}>
                  {formatCompactAmount(payment.amount)}
                </span>
                
                {onRemovePayment && (
                  <Button
                    onClick={() => onRemovePayment?.(payment.id)}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'text-destructive/60 hover:text-destructive hover:bg-destructive/5',
                      'h-10 w-10 p-0 transition-colors'
                    )}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="sr-only">Remove</span>
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