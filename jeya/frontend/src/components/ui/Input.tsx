import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-xs font-medium text-jeya-cyan/80 uppercase tracking-wider">{label}</label>}
      <input ref={ref} id={inputId}
        className={clsx(
          'w-full bg-jeya-dark border rounded-lg px-4 py-3 text-jeya-text placeholder-jeya-muted/50 outline-none transition-all duration-200 text-sm',
          error ? 'border-red-500/60 focus:border-red-400' : 'border-jeya-border focus:border-jeya-cyan/60 focus:shadow-[0_0_10px_rgba(0,245,255,0.15)]',
          className
        )}
        {...props}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
})
Input.displayName = 'Input'
export default Input
