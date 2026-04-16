import { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn('w-full rounded-xl border border-border bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-primary', className)}
      {...props}
    />
  );
}
