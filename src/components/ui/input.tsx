import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn, motion, typography } from "@/lib/design-system"

/**
 * 世界最高水準モダンインプット v2.0
 * - Glass Morphism + フォーカス効果
 * - フローティングラベル・アニメーション
 * - 高度なバリデーション表示
 * - 完全アクセシビリティ対応
 */

const inputVariants = cva(
  // ベーススタイル（Glass Morphism）
  "w-full rounded-lg border-0 bg-white/60 backdrop-blur-sm px-4 py-3 text-gray-900 shadow-sm ring-1 ring-gray-200/50 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        // 標準スタイル
        default: "focus:ring-blue-500/50",
        
        // 成功状態
        success: "ring-emerald-200/50 focus:ring-emerald-500/50 bg-emerald-50/60",
        
        // エラー状態  
        destructive: "ring-red-200/50 focus:ring-red-500/50 bg-red-50/60",
        
        // 警告状態
        warning: "ring-amber-200/50 focus:ring-amber-500/50 bg-amber-50/60",
        
        // プレミアムスタイル
        premium: cn(
          "bg-gradient-to-r from-white/70 to-blue-50/70 backdrop-blur-md",
          "ring-blue-200/30 focus:ring-violet-500/50 focus:bg-gradient-to-r focus:from-white/90 focus:to-blue-50/90"
        ),
      },
      
      inputSize: {
        sm: "h-9 px-3 py-2 text-sm",
        default: "h-11 px-4 py-3 text-base", 
        lg: "h-12 px-5 py-3 text-lg",
        xl: "h-14 px-6 py-4 text-xl",
      },
      
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm", 
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      rounded: "lg",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  floating?: boolean;
  loading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text",
    variant,
    inputSize,
    rounded,
    label,
    helperText,
    errorMessage,
    leftIcon,
    rightIcon,
    floating = false,
    loading = false,
    placeholder,
    value,
    disabled,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(!!value)
    
    // エラー状態を自動判定
    const isError = !!errorMessage
    const currentVariant = isError ? 'destructive' : variant
    
    React.useEffect(() => {
      setHasValue(!!value)
    }, [value])

    return (
      <div className="relative w-full">
        {/* 標準ラベル（非フローティング） */}
        {label && !floating && (
          <label className={cn(
            typography.body.small,
            "font-medium text-gray-700 mb-2 block",
            isError && "text-red-600"
          )}>
            {label}
          </label>
        )}
        
        {/* 入力フィールドコンテナ */}
        <div className="relative">
          {/* 左側アイコン */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          {/* メイン入力フィールド */}
          <input
            type={type}
            className={cn(
              inputVariants({ variant: currentVariant, inputSize, rounded }),
              // アイコン用パディング調整
              ...(leftIcon ? ["pl-10"] : []),
              ...(rightIcon ? ["pr-10"] : []),
              // フローティングラベル用調整
              ...(floating ? ["placeholder-transparent"] : []),
              // カスタムアニメーション
              motion.transition.normal,
              className
            )}
            ref={ref}
            placeholder={floating ? " " : placeholder}
            value={value}
            disabled={disabled || loading}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            onChange={(e) => {
              setHasValue(!!e.target.value)
              props.onChange?.(e)
            }}
            {...props}
          />
          
          {/* フローティングラベル */}
          {label && floating && (
            <label className={cn(
              "absolute left-4 transition-all duration-200 pointer-events-none",
              typography.body.small,
              // ラベル位置制御
              (isFocused || hasValue)
                ? "-top-2.5 left-3 bg-white/80 backdrop-blur-sm px-2 text-xs font-medium"
                : "top-1/2 -translate-y-1/2 text-gray-400",
              // カラー制御
              isFocused 
                ? isError ? "text-red-600" : "text-blue-600"
                : isError ? "text-red-600" : "text-gray-400",
              // アイコン用オフセット
              ...(leftIcon ? ["left-10"] : [])
            )}>
            {label}
          </label>
          )}
          
          {/* 右側アイコン・ローディング */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {loading && (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            )}
            {rightIcon && !loading && (
              <span className="text-gray-400">{rightIcon}</span>
            )}
          </div>
          
          {/* フォーカス時のグロー効果 */}
          {isFocused && (
            <div className={cn(
              "absolute inset-0 rounded-lg ring-2 ring-offset-2 pointer-events-none transition-all duration-200",
              isError ? "ring-red-500/20" : "ring-blue-500/20"
            )} />
          )}
        </div>
        
        {/* ヘルパーテキスト・エラーメッセージ */}
        {(helperText || errorMessage) && (
          <div className={cn(
            "mt-2 flex items-start gap-1",
            motion.entrance.slideUp
          )}>
            {isError && (
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <p className={cn(
              typography.body.caption,
              isError ? "text-red-600" : "text-gray-500"
            )}>
              {errorMessage || helperText}
            </p>
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input, inputVariants }
