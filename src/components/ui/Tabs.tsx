import * as TabsPrimitive from '@radix-ui/react-tabs';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '../../lib/utils/cn';

// Per DESIGN.md §Components.Picker tabs: horizontal label-caps row, no
// background, no border. Active tab has a 1px coral underline at -8px.
export const Tabs = TabsPrimitive.Root;

export const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center gap-lg border-b border-hairline',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

export const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'relative cursor-pointer pb-3',
      'font-label-caps uppercase tracking-[0.28em] text-[0.6875rem] font-semibold',
      'text-ink-soft transition-colors hover:text-ink',
      'data-[state=active]:text-ink',
      'data-[state=active]:after:absolute data-[state=active]:after:bottom-[-1px] data-[state=active]:after:left-0 data-[state=active]:after:right-0',
      'data-[state=active]:after:h-px data-[state=active]:after:bg-accent',
      'focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-xl focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';
