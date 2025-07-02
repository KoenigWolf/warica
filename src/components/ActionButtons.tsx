import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWarikanStore } from "../app/useWarikanStore";
import { cn } from "@/lib/design-system";

/**
 * アクションボタンコンポーネント
 * - 新デザインシステム統合
 * - 統一されたボタンスタイルとスペーシング
 * - レスポンシブ対応
 */

interface ActionButtonsProps {
  spacing?: 'sm' | 'base' | 'lg';
  className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  spacing = 'base',
  className 
}) => {
  const router = useRouter();
  const { resetAll } = useWarikanStore();

  // ボタンアクション
  const handleReset = () => {
    resetAll();
    router.push("/");
  };

  const handleBack = () => {
    router.back();
  };

  // スペーシングマッピング
  const spacingClass = {
    sm: 'gap-2',
    base: 'gap-3', 
    lg: 'gap-4',
  }[spacing];

  return (
    <div 
      className={cn(
        'flex justify-between items-center mt-6',
        'flex-col sm:flex-row',
        spacingClass,
        className
      )}
    >
      <Button
        variant="outline"
        className="w-full sm:w-auto text-sm sm:text-base px-4 py-2"
        onClick={handleBack}
        type="button"
        aria-label="前のページに戻る"
      >
        ← 戻る
      </Button>
      
      <Button
        variant="ghost"
        className="w-full sm:w-auto text-sm sm:text-base px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={handleReset}
        type="button"
        aria-label="全データをリセットしてホームに戻る"
      >
        🔄 リセット
      </Button>
    </div>
  );
}; 