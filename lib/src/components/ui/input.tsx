import * as React from "react";

import { cn } from "@lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "easyleap-flex easyleap-h-9 easyleap-w-full easyleap-rounded-md easyleap-border easyleap-border-[#E5E5E7] easyleap-bg-transparent easyleap-px-3 easyleap-py-1 easyleap-text-base easyleap-shadow-sm easyleap-transition-colors file:easyleap-border-0 file:easyleap-bg-transparent file:easyleap-text-sm file:easyleap-font-medium file:easyleap-text-[#0A0A0A] placeholder:easyleap-text-[#757575] focus-visible:easyleap-outline-none focus-visible:easyleap-ring-1 focus-visible:easyleap-ring-[#0A0A0A] disabled:easyleap-cursor-not-allowed disabled:easyleap-opacity-50 md:easyleap-text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
