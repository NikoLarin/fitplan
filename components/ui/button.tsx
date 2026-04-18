import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold transition disabled:opacity-50',
        'bg-primary text-black hover:opacity-90',
        className
      )}
      {...props}
    />
  );
}
