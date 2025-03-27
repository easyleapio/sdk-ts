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
        "easyleap-z-50 easyleap-w-72 easyleap-rounded-xl easyleap-border easyleap-p-4 easyleap-text-[#0A0A0A] easyleap-shadow-md easyleap-outline-none data-[state=open]:easyleap-animate-in data-[state=closed]:easyleap-animate-out data-[state=closed]:easyleap-fade-out-0 data-[state=open]:easyleap-fade-in-0 data-[state=closed]:easyleap-zoom-out-95 data-[state=open]:easyleap-zoom-in-95 data-[side=bottom]:easyleap-slide-in-from-top-2 data-[side=left]:easyleap-slide-in-from-right-2 data-[side=right]:easyleap-slide-in-from-left-2 data-[side=top]:easyleap-slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
