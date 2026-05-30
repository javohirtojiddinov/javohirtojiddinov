import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'emerald' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'cyan', size = 'md', isLoading, className, children, disabled, ...props }, ref) => {
    const variants = {
      cyan: 'bg-transparent border border-jeya-cyan/60 text-jeya-cyan hover:bg-jeya-cyan/10 hover:border-jeya-cyan hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]',
      emerald: 'bg-transparent border border-jeya-emerald/60 text-jeya-emerald hover:bg-jeya-emerald/10 hover:border-jeya-emerald hover:shadow-[0_0_20px_rgba(0,255,135,0.3)]',
      ghost: 'text-jeya-muted hover:text-jeya-cyan hover:bg-jeya-card',
      danger: 'border border-red-500/60 text-red-400 hover:bg-red-500/10',
    }
    const sizes = { sm: 'text-xs px-3 py-1.5', md: 'text-sm px-5 py-2.5', lg: 'text-base px-8 py-3.5' }
    return (
      <button ref={ref} disabled={disabled || isLoading}
        className={clsx('inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed', variants[variant], sizes[size], className)}
        {...props}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Yuklanmoqda...
          </span>
        ) : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export default Button
