import React from 'react';
import { cn } from '../../lib/utils';

/**
 * ローディングスピナーコンポーネント
 * - アクセシビリティ対応
 * - カスタマイズ可能なサイズとスタイル
 * - 再利用性を重視した設計
 */

export interface LoadingSpinnerProps {
  /** サイズ */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** 色 */
  variant?: 'primary' | 'secondary' | 'muted';
  /** メッセージ */
  message?: string;
  /** フルスクリーン表示 */
  fullScreen?: boolean;
  /** クラス名 */
  className?: string;
  /** テスト用ID */
  testId?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
} as const;

const variantClasses = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  muted: 'text-gray-400',
} as const;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  message,
  fullScreen = false,
  className,
  testId = 'loading-spinner',
}) => {
  const spinnerElement = (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-transparent border-t-current',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label={message || 'データを読み込み中'}
      data-testid={testId}
    />
  );

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50"
        aria-live="polite"
      >
        <div className="text-center">
          {spinnerElement}
          {message && (
            <p className="mt-2 text-sm text-gray-600" aria-live="polite">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4" aria-live="polite">
      {spinnerElement}
      {message && (
        <span className="ml-2 text-sm text-gray-600" aria-live="polite">
          {message}
        </span>
      )}
    </div>
  );
};

/**
 * インラインローディングコンポーネント
 */
export interface InlineLoadingProps {
  text?: string;
  size?: LoadingSpinnerProps['size'];
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  text = 'しばらくお待ちください...',
  size = 'sm',
}) => (
  <span className="inline-flex items-center gap-2">
    <LoadingSpinner size={size} variant="muted" />
    <span className="text-sm text-gray-600">{text}</span>
  </span>
);

/**
 * ボタン用ローディングスピナー
 */
export const ButtonSpinner: React.FC<{ size?: 'sm' | 'md' }> = ({ 
  size = 'sm' 
}) => (
  <LoadingSpinner 
    size={size} 
    variant="secondary" 
    className="text-current"
  />
); 