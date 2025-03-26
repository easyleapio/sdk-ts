import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "easyleap-z-50 easyleap-overflow-hidden easyleap-rounded-md easyleap-bg-primary easyleap-px-3 easyleap-py-1.5 easyleap-text-xs easyleap-text-primary-foreground easyleap-animate-in easyleap-fade-in-0 easyleap-zoom-in-95 easyleap-data-[state=closed]:easyleap-animate-out data-[state=closed]:easyleap-fade-out-0 data-[state=closed]:easyleap-zoom-out-95 data-[side=bottom]:easyleap-slide-in-from-top-2 data-[side=left]:easyleap-slide-in-from-right-2 data-[side=right]:easyleap-slide-in-from-left-2 data-[side=top]:easyleap-slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
