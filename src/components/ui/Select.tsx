import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils/cn';

// Native <select> styled to match the design system. We don't use Radix
// Select for v1 because keyboard a11y on native select is already strong
// and avoids the +12KB of Radix's listbox primitive.
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full bg-surface text-ink font-body-md text-[0.9375rem]',
        'rounded-sm border border-hairline appearance-none',
        'px-[14px] py-[14px] pr-10',
        // Custom caret in coral so the chrome ties back to the accent system.
        'bg-no-repeat bg-[right_14px_center]',
        "bg-[url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1L6 6L11 1' stroke='%23E13F2A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>\")]",
        'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = 'Select';
