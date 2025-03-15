import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@lib/utils";

const buttonVariants = cva(
  "easyleap-inline-flex easyleap-items-center easyleap-justify-center easyleap-gap-2 easyleap-whitespace-nowrap easyleap-text-sm easyleap-font-medium easyleap-transition-colors easyleap-focus-visible:outline-none easyleap-focus-visible:ring-1 easyleap-focus-visible:ring-ring easyleap-disabled:pointer-events-none easyleap-disabled:opacity-50 [&_svg]:easyleap-pointer-events-none [&_svg]:easyleap-shrink-0",
  {
    variants: {
      variant: {
        default:
          "easyleap-bg-primary easyleap-text-primary-foreground easyleap-shadow easyleap-hover:bg-primary/90",
        destructive:
          "easyleap-bg-destructive easyleap-text-destructive-foreground easyleap-shadow-sm easyleap-hover:bg-destructive/90",
        outline:
          "easyleap-border easyleap-border-input  easyleap-bg-background easyleap-shadow-sm easyleap-hover:bg-accent easyleap-hover:text-accent-foreground",
        secondary:
          "easyleap-bg-secondary easyleap-text-secondary-foreground easyleap-shadow-sm easyleap-hover:bg-secondary/80",
        ghost: "easyleap-hover:bg-accent easyleap-hover:text-accent-foreground",
        link: "easyleap-text-primary easyleap-underline-offset-4 easyleap-hover:underline"
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
