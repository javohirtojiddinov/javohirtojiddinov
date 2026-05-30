import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> { hover?: boolean; cyan?: boolean }

export default function Card({ hover, cyan, className, children, ...props }: CardProps) {
  return (
    <div className={clsx(
      'rounded-xl p-5',
      cyan ? 'glass-cyan' : 'glass',
      hover && 'hover:border-jeya-cyan/30 hover:shadow-[0_0_20px_rgba(0,245,255,0.08)] transition-all duration-300 cursor-pointer',
      className
    )} {...props}>
      {children}
    </div>
  )
}
