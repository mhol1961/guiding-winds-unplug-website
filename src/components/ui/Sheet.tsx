import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '../../lib/utils/cn';

// Sheet = side-drawer modal. Used for the mobile nav menu. Built on
// Radix Dialog so focus trap + escape-to-close + scroll-lock come free.
export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetPortal = DialogPrimitive.Portal;

export const SheetOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-40 bg-primary/70 backdrop-blur-[14px]',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = 'SheetOverlay';

interface SheetContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: 'right' | 'left' | 'top' | 'bottom';
}

const sideStyles: Record<NonNullable<SheetContentProps['side']>, string> = {
  right: 'inset-y-0 right-0 h-full w-full sm:max-w-md border-l border-hairline',
  left: 'inset-y-0 left-0 h-full w-full sm:max-w-md border-r border-hairline',
  top: 'inset-x-0 top-0 w-full border-b border-hairline',
  bottom: 'inset-x-0 bottom-0 w-full border-t border-hairline',
};

export const SheetContent = forwardRef<ElementRef<typeof DialogPrimitive.Content>, SheetContentProps>(
  ({ className, children, side = 'right', ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 bg-primary text-ink p-8 sm:p-12',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          sideStyles[side],
          className,
        )}
        {...props}
      >
        {children}
        <SheetClose className="absolute right-6 top-6 cursor-pointer text-ink-soft hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2">
          <X className="size-6" strokeWidth={1.5} />
          <span className="sr-only">Close</span>
        </SheetClose>
      </DialogPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = 'SheetContent';
