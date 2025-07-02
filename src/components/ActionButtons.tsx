import React from "react";
import { Button } from "@/components/ui/button";
import { useWarikanStore } from "../app/useWarikanStore";
import { useCommonNavigation } from "../lib/shared-logic";
import { cn, colors, typography } from "@/lib/design-system";
import { ROUTES } from "../lib/routes";

/**
 * ハイブランド アクションボタン v3.0
 * - モノトーンデザイン
 * - ミニマルインターフェース
 * - エレガントなナビゲーション
 */

interface ActionButtonsProps {
  spacing?: 'sm' | 'base' | 'lg';
  className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  spacing = 'base',
  className 
}) => {
  const { resetAll } = useWarikanStore();
  const navigation = useCommonNavigation();

  // ボタンアクション
  const handleReset = () => {
    resetAll();
    navigation.goHome();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // スペーシングマッピング
  const spacingClass = {
    sm: 'gap-3',
    base: 'gap-4', 
    lg: 'gap-6',
  }[spacing];

  return (
    <div 
      className={cn(
        'flex justify-between items-center mt-8 pt-6 border-t',
        'flex-col sm:flex-row',
        spacingClass,
        colors.text.secondary,
        className
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'w-full sm:w-auto font-light tracking-wide',
          'hover:text-foreground transition-colors'
        )}
        onClick={handleBack}
        type="button"
        aria-label="Go back to previous page"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'w-full sm:w-auto font-light tracking-wide text-destructive/60',
          'hover:text-destructive hover:bg-destructive/5 transition-colors'
        )}
        onClick={handleReset}
        type="button"
        aria-label="Reset all data and return to home"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2M15 15v5h-.582M4.582 15A8.001 8.001 0 0019.418 11m0 0V11a8 8 0 10-15.356-2" />
        </svg>
        Reset
      </Button>
    </div>
  );
}; 