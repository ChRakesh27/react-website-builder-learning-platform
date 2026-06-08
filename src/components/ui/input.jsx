import { cn } from '../../lib/utils.js';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-offset-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
