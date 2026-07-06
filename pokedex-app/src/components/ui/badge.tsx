import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'glass'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize',
        variant === 'glass' && 'bg-white/25 text-white backdrop-blur-sm',
        variant === 'default' && 'bg-slate-100 text-slate-700',
        className,
      )}
      {...props}
    />
  )
}
