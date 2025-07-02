import React, { Component, ReactNode } from 'react';
import { Button } from '../ui/button';

/**
 * エラーバウンダリーコンポーネント
 * - アプリケーション全体のエラーハンドリング
 * - ユーザーフレンドリーなエラー表示
 * - 開発環境での詳細なエラー情報表示
 */

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: React.ErrorInfo) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // エラーコールバック実行
    this.props.onError?.(error, errorInfo);

    // 開発環境での詳細ログ
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined 
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      return <DefaultErrorFallback 
        error={this.state.error} 
        onReset={this.handleReset}
      />;
    }

    return this.props.children;
  }
}

/**
 * デフォルトエラーフォールバックコンポーネント
 */
interface DefaultErrorFallbackProps {
  error?: Error;
  onReset: () => void;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({ 
  error, 
  onReset 
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            エラーが発生しました
          </h1>
          <p className="text-gray-600 mb-4">
            申し訳ございません。アプリケーションでエラーが発生しました。
            下のボタンをクリックして再試行してください。
          </p>
        </div>

        {isDevelopment && error && (
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
              開発者向け詳細情報
            </summary>
            <div className="p-3 bg-gray-100 rounded text-xs font-mono break-all">
              <div className="mb-2">
                <strong>エラー:</strong> {error.message}
              </div>
              {error.stack && (
                <div>
                  <strong>スタックトレース:</strong>
                  <pre className="mt-1 whitespace-pre-wrap">{error.stack}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        <div className="space-y-2">
          <Button 
            onClick={onReset}
            className="w-full"
            aria-label="アプリケーションを再試行"
          >
            再試行
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full"
            aria-label="ページを再読み込み"
          >
            ページを再読み込み
          </Button>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          問題が解決しない場合は、ページを再読み込みしてください。
        </p>
      </div>
    </div>
  );
}; 