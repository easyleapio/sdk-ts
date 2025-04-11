import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@lib/utils";

const buttonVariants = cva(
  [
    "easyleap-inline-flex",
    "easyleap-items-center",
    "easyleap-justify-center",
    "easyleap-gap-2",
    "easyleap-whitespace-nowrap",
    "easyleap-text-sm",
    "easyleap-font-medium",
    "easyleap-transition-colors",
    "focus-visible:easyleap-outline-none",
    "focus-visible:easyleap-ring-1",
    "focus-visible:easyleap-ring-[#0A0A0A]",
    "disabled:easyleap-pointer-events-none",
    "disabled:easyleap-opacity-50",
    "[&_svg]:easyleap-pointer-events-none",
    "[&_svg]:easyleap-shrink-0"
  ],
  {
    variants: {
      variant: {
        default:
          "my-active-button",
        destructive:
          "easyleap-bg-[#EF4444] easyleap-text-[#FAFAFA] easyleap-shadow-sm hover:easyleap-bg-[#EF4444]/90",
        outline:
          "easyleap-border-2 easyleap-border-white easyleap-bg-transparent easyleap-shadow-md easyleap-shadow-shadow hover:easyleap-bg-[#454545] hover:easyleap-text-[#1A1A1A]",
        secondary:
          "easyleap-bg-[#F5F5F6] easyleap-text-[#1A1A1A] easyleap-shadow-sm hover:easyleap-bg-[#F5F5F6]/80",
        ghost: "hover:easyleap-bg-[#454545] hover:easyleap-text-[#1A1A1A]",
        link: "easyleap-text-[#1A1A1A] easyleap-underline-offset-4 hover:easyleap-underline"
      },
      size: {
        default: "easyleap-h-9 easyleap-px-4 easyleap-py-2",
        sm: "easyleap-h-8 easyleap-px-3 easyleap-text-xs",
        lg: "easyleap-h-10 easyleap-px-8",
        icon: "easyleap-h-9 easyleap-w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
