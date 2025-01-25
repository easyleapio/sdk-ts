import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "../../../lib/utils";
import { Icons } from "../Icons";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "peer/thumb group pointer-events-none block h-4 w-4 -translate-y-1.5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[4.83rem] data-[state=unchecked]:translate-x-0.5",
      )}
    >
      <Icons.ethereumLogo className="hidden size-7 group-data-[state=checked]:block" />
      <Icons.starknetLogo className="-ml-1.5 -mt-1.5 block size-10 group-data-[state=checked]:hidden" />
    </SwitchPrimitives.Thumb>

    <span className="absolute left-[40%] hidden -translate-x-1/2 text-sm font-semibold text-[#211d31] peer-data-[state=checked]/thumb:block">
      Bridge
    </span>

    <span className="absolute left-[63%] block -translate-x-1/2 text-sm font-semibold text-[#211d31] peer-data-[state=checked]/thumb:hidden">
      Starknet
    </span>
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
