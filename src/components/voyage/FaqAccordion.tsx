import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/Accordion';

interface Props {
  items: { q: string; a: string }[];
}

// Single React island. The Radix Accordion provider has to wrap all its
// items, so we render the whole accordion (root + items + triggers +
// contents) inside one component instead of letting Astro split each
// AccordionItem into its own island and break the context.
export function FaqAccordion({ items }: Props) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
