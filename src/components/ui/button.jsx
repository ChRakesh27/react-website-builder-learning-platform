import { cn } from '../../lib/utils.js';

export function Button({ className, variant = 'default', asChild = false, ...props }) {
  const Comp = asChild ? 'span' : 'button';
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    outline: 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
  };

  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
