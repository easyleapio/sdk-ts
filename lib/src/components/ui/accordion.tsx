import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <div className="easyleap">
    <AccordionPrimitive.Item
      ref={ref}
      className={cn("easyleap-border-b", className)}
      {...props}
    />
  </div>
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    hideChevron?: boolean;
    customChevron?: React.ReactNode;
  }
>(
  (
    { className, children, customChevron, hideChevron = false, ...props },
    ref
  ) => (
    <AccordionPrimitive.Header className="easyleap-flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "easyleap-flex easyleap-flex-1 easyleap-items-center easyleap-justify-between easyleap-text-left easyleap-text-sm easyleap-font-medium easyleap-transition-all easyleap-hover:underline [&[data-state=open]>svg]:easyleap-rotate-180",
          className
        )}
        {...props}
      >
        {children}
        {customChevron
          ? customChevron
          : !hideChevron && (
              <ChevronDown className="easyleap-h-4 easyleap-w-4 easyleap-shrink-0 easyleap-text-muted-foreground easyleap-transition-transform easyleap-duration-200" />
            )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="easyleap-overflow-hidden easyleap-text-sm data-[state=closed]:easyleap-animate-accordion-up data-[state=open]:easyleap-animate-accordion-down"
    {...props}
  >
    <div className={cn("easyleap-pb-4 easyleap-pt-0", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
