import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

import { cn } from "@lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "easyleap-z-50 easyleap-w-72 easyleap-rounded-md easyleap-border easyleap-bg-popover easyleap-p-4 easyleap-text-popover-foreground easyleap-shadow-md easyleap-outline-none easyleap-data-[state=open]:animate-in easyleap-data-[state=closed]:animate-out easyleap-data-[state=closed]:fade-out-0 easyleap-data-[state=open]:fade-in-0 easyleap-data-[state=closed]:zoom-out-95 easyleap-data-[state=open]:zoom-in-95 easyleap-data-[side=bottom]:slide-in-from-top-2 easyleap-data-[side=left]:slide-in-from-right-2 easyleap-data-[side=right]:slide-in-from-left-2 easyleap-data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
