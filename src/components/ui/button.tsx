import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/design-system"

/**
 * 世界最高水準モダンボタン v2.0
 * - Glass Morphism + グラデーション効果
 * - 高度なマイクロインタラクション
 * - アクセシビリティ完全対応
 * - 型安全なバリアントシステム
 */

const buttonVariants = cva(
  // ベーススタイル（Glass Morphism + モダンデザイン）
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        // プライマリー（グラデーション + Glass効果）
        default: cn(
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25",
          "hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700",
          "active:scale-95 focus-visible:ring-blue-500",
          "before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity"
        ),
        
        // セカンダリー（Glass Morphism）
        secondary: cn(
          "bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-200/50 shadow-sm",
          "hover:bg-white hover:shadow-md hover:border-gray-300/50",
          "active:scale-95 focus-visible:ring-gray-300"
        ),
        
        // 成功アクション（エメラルドグラデーション）
        success: cn(
          "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25",
          "hover:shadow-xl hover:shadow-emerald-500/30 hover:from-emerald-700 hover:to-teal-700",
          "active:scale-95 focus-visible:ring-emerald-500"
        ),
        
        // 危険アクション（レッドグラデーション）
        destructive: cn(
          "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25",
          "hover:shadow-xl hover:shadow-red-500/30 hover:from-red-700 hover:to-rose-700",
          "active:scale-95 focus-visible:ring-red-500"
        ),
        
        // アウトライン（モダンボーダー）
        outline: cn(
          "border-2 border-gray-200 bg-white/60 backdrop-blur-sm text-gray-900",
          "hover:bg-gray-50/80 hover:border-gray-300 hover:shadow-sm",
          "active:scale-95 focus-visible:ring-gray-300"
        ),
        
        // ゴーストボタン（ミニマル）
        ghost: cn(
          "text-gray-700 hover:bg-gray-100/80 hover:backdrop-blur-sm hover:shadow-sm",
          "active:scale-95 focus-visible:ring-gray-300"
        ),
        
        // リンクスタイル
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 transition-colors",
        
        // プレミアム（特別デザイン）
        premium: cn(
          "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-violet-500/30",
          "hover:shadow-2xl hover:shadow-violet-500/40 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700",
          "active:scale-95 focus-visible:ring-violet-500",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
        ),
      },
      
      size: {
        sm: "h-11 px-6 text-base",      // 44px最小タッチターゲット
        default: "h-12 px-8 text-lg",   // 48px標準
        lg: "h-14 px-10 text-xl",       // 56px大きめ
        xl: "h-16 px-12 text-2xl",      // 64px最大
        icon: "h-12 w-12",              // アイコンボタン（48x48px）
      },
      
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, fullWidth, className }),
          // ローディング状態
          loading && "pointer-events-none",
          // カスタムアニメーション
          'transition-all duration-200 active:scale-95'
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* ローディングスピナー */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* コンテンツエリア */}
        <span className={cn(
          "flex items-center gap-2",
          loading && "opacity-0"
        )}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </span>
        
        {/* ホバー時のリップル効果 */}
        <span className="absolute inset-0 overflow-hidden rounded-xl">
          <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-0 group-hover:scale-100 rounded-full" />
        </span>
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
