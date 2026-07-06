import * as React from 'react'
import { cn } from '@/lib/utils'

export function Tabs({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('w-full', className)} {...props} />
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex gap-6 border-b border-slate-200 px-1', className)}
      role="tablist"
      {...props}
    />
  )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
}

export function TabsTrigger({ className, isActive, ...props }: TabsTriggerProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={cn(
        'border-b-2 pb-3 text-sm font-medium capitalize transition-colors',
        isActive ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('pt-6', className)} role="tabpanel" {...props} />
}
