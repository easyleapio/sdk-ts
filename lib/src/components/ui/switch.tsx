import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { Icons } from "@lib/components/Icons";
import { cn } from "@lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "easyleap-peer easyleap-relative easyleap-inline-flex easyleap-h-5 easyleap-shrink-0 easyleap-cursor-pointer easyleap-items-center easyleap-rounded-full easyleap-border-2 easyleap-border-transparent easyleap-shadow-sm easyleap-transition-colors focus-visible:easyleap-outline-none focus-visible:easyleap-ring-2 focus-visible:easyleap-ring-ring focus-visible:easyleap-ring-offset-2 focus-visible:easyleap-ring-offset-background disabled:easyleap-cursor-not-allowed disabled:easyleap-opacity-50 data-[state=checked]:easyleap-bg-primary data-[state=unchecked]:easyleap-bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "easyleap-peer/thumb easyleap-group easyleap-pointer-events-none easyleap-block easyleap-w-4 easyleap-rounded-full easyleap-shadow-lg easyleap-ring-0 easyleap-transition-transform data-[state=checked]:easyleap-translate-x-[4.83rem] data-[state=unchecked]:easyleap-translate-x-0.5"
      )}
    >
      <Icons.ethereumLogo className="easyleap-hidden easyleap-size-7 group-data-[state=checked]:easyleap-block" />
      <Icons.starknetLogo className="easyleap-ml-px easyleap-mt-px easyleap-block easyleap-size-[30px] group-data-[state=checked]:easyleap-hidden" />
    </SwitchPrimitives.Thumb>

    <span className="easyleap-absolute easyleap-left-[20%] easyleap-hidden easyleap-text-sm !easyleap-text-white easyleap-font-semibold peer-data-[state=checked]/thumb:easyleap-block">
      Bridge
    </span>

    <span className="easyleap-absolute easyleap-left-[35%] easyleap-block easyleap-text-sm !easyleap-text-white easyleap-font-semibold peer-data-[state=checked]/thumb:easyleap-hidden">
      Starknet
    </span>
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
