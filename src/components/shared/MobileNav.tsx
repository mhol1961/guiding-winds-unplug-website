import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/Sheet';
import { Button } from '../ui/Button';

interface NavLink {
  label: string;
  href: string;
}

interface Props {
  links: NavLink[];
  ctaLabel: string;
  ctaHref: string;
}

// React island. Astro renders the trigger button; this component owns the
// sheet open/close state and the panel contents.
export function MobileNav({ links, ctaLabel, ctaHref }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="md:hidden inline-flex items-center justify-center size-11 cursor-pointer text-ink hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          <Menu className="size-6" strokeWidth={1.5} />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <p className="font-label-caps uppercase tracking-[0.28em] text-[0.6875rem] font-semibold text-ink-soft mb-8">
          Menu
        </p>
        <nav className="flex flex-col gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-h3 text-[1.5rem] leading-[1.1] tracking-[-0.015em] text-ink hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto pt-10">
          <Button asChild className="w-full">
            <a href={ctaHref}>{ctaLabel}</a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
