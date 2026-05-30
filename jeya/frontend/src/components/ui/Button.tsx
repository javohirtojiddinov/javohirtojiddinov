import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-jeya-accent hover:bg-jeya-accent-glow text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]',
      secondary: 'bg-jeya-card border border-jeya-border text-jeya-text hover:border-jeya-accent',
      ghost: 'text-jeya-muted hover:text-jeya-text hover:bg-jeya-card',
      danger: 'bg-red-600 hover:bg-red-500 text-white',
    }

    const sizes = {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-sm px-5 py-2.5',
      lg: 'text-base px-8 py-3.5',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
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
