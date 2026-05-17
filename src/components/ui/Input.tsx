import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils/cn';

// Per DESIGN.md §Components.input: surface background, ink text, body-md
// typography, sm rounding (2px — the ONE place rounding is allowed besides
// pill badges).
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'w-full bg-surface text-ink font-body-md text-[0.9375rem]',
        'rounded-sm border border-hairline',
        'px-[14px] py-[14px]',
        'placeholder:text-ink-mute',
        'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
