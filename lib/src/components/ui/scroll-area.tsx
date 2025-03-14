import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";

import { cn } from "@lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("easyleap-relative easyleap-overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="easyleap-h-full easyleap-w-full easyleap-rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "easyleap-flex easyleap-touch-none easyleap-select-none easyleap-transition-colors",
      orientation === "vertical" &&
        "easyleap-h-full easyleap-w-2.5 easyleap-border-l easyleap-border-l-transparent easyleap-p-[1px]",
      orientation === "horizontal" &&
        "easyleap-h-2.5 easyleap-flex-col easyleap-border-t easyleap-border-t-transparent easyleap-p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="easyleap-relative easyleap-flex-1 easyleap-rounded-full easyleap-bg-[#B9AFF108]" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
