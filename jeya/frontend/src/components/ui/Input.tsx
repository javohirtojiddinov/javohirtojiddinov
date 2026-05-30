import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-jeya-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full bg-jeya-card border rounded-xl px-4 py-3 text-jeya-text placeholder-jeya-muted outline-none transition-all duration-200',
            error
              ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-500'
              : 'border-jeya-border focus:border-jeya-accent focus:ring-1 focus:ring-jeya-accent',
            className
          )}
          {...props}
        />
        {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
