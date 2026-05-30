import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export default function Card({ hover, className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'glass rounded-2xl p-6',
        hover && 'hover:border-jeya-accent/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all duration-300 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
