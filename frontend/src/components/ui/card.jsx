import { cn } from '../../lib/utils'

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-slate-800/80 bg-slate-900/75 shadow-soft backdrop-blur-xl',
        className,
      )}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6 sm:p-8', className)} {...props} />
}
