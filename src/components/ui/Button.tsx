import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils/cn';

// Per DESIGN.md §Components.Button: square corners (no rounding), label-caps
// typography (Inter, 0.6875rem, 0.28em tracking, semibold, all-caps render).
// Three surface contexts: primary on dark, ghost on dark, on-bone on cream.
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 cursor-pointer',
    'font-label-caps uppercase tracking-[0.28em] text-[0.6875rem] font-semibold',
    'rounded-none border-0 select-none',
    'transition-colors duration-200 ease-out',
    'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-3',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: 'bg-accent text-ink hover:bg-accent-hot',
        ghost: 'bg-transparent text-ink border border-ink/30 hover:bg-ink hover:text-primary',
        'on-bone': 'bg-primary text-ink hover:bg-accent',
      },
      size: {
        default: 'px-7 py-[18px]',
        mini: 'px-4 py-2 text-[0.625rem] tracking-[0.24em]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
