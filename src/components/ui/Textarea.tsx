import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils/cn';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'w-full bg-surface text-ink font-body-md text-[0.9375rem] leading-[1.65]',
        'rounded-sm border border-hairline',
        'px-[14px] py-[14px]',
        'placeholder:text-ink-mute resize-y',
        'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
