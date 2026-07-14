import { cn } from '../../lib/utils'

export function Badge({ className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 text-xs font-medium tracking-[0.18em] text-slate-300 uppercase',
        className,
      )}
      {...props}
    />
  )
}
