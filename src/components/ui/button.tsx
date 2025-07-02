import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/design-system"

/**
 * ハイブランド モノトーンボタン v3.0
 * - ミニマルデザイン
 * - モノトーンカラーパレット
 * - エレガントなインタラクション
 */

const buttonVariants = cva(
  // ベーススタイル（ミニマル・高級感）
  "inline-flex items-center justify-center whitespace-nowrap border font-light tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // プライマリー（ブラック）
        default: cn(
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90",
          "focus-visible:ring-primary"
        ),
        
        // セカンダリー（ライトグレー）
        secondary: cn(
          "bg-secondary text-secondary-foreground border-border",
          "hover:bg-secondary/80",
          "focus-visible:ring-secondary"
        ),
        
        // アウトライン（ボーダーのみ）
        outline: cn(
          "border-border bg-background text-foreground",
          "hover:bg-muted hover:text-muted-foreground",
          "focus-visible:ring-foreground"
        ),
        
        // ゴーストボタン（ミニマル）
        ghost: cn(
          "border-transparent text-foreground",
          "hover:bg-muted/50 hover:text-foreground",
          "focus-visible:ring-foreground"
        ),
        
        // 危険アクション
        destructive: cn(
          "bg-destructive text-destructive-foreground border-destructive",
          "hover:bg-destructive/90",
          "focus-visible:ring-destructive"
        ),
        
        // リンクスタイル
        link: cn(
          "text-foreground underline-offset-4 border-transparent",
          "hover:underline focus-visible:ring-0"
        ),
      },
      
      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-4 text-sm", 
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "pointer-events-none opacity-60"
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </div>
        ) : (
          children
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
