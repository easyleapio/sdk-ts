"use client";

import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "easyleap-fixed easyleap-right-0 easyleap-top-0 easyleap-z-[100] easyleap-flex easyleap-max-h-screen easyleap-w-full easyleap-flex-col-reverse easyleap-p-4 sm:easyleap-bottom-0 sm:easyleap-right-0 sm:easyleap-top-auto sm:easyleap-flex-col md:easyleap-max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "easyleap-group easyleap-pointer-events-auto easyleap-relative easyleap-flex easyleap-w-full easyleap-items-center easyleap-justify-between easyleap-space-x-2 easyleap-overflow-hidden easyleap-rounded-md easyleap-border easyleap-p-4 easyleap-pr-6 easyleap-shadow-lg easyleap-transition-all data-[swipe=cancel]:easyleap-translate-x-0 data-[swipe=end]:easyleap-translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:easyleap-translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:easyleap-transition-none data-[state=open]:easyleap-animate-in data-[state=closed]:easyleap-animate-out data-[swipe=end]:easyleap-animate-out data-[state=closed]:easyleap-fade-out-80 data-[state=closed]:easyleap-slide-out-to-right-full data-[state=open]:easyleap-slide-in-from-top-full data-[state=open]:sm:easyleap-slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "easyleap-border easyleap-bg-white easyleap-text-[#0A0A0A]",
        destructive:
          "easyleap-[#EF4444] easyleap-group easyleap-border-[#EF4444] easyleap-bg-[#EF4444] easyleap-text-[#FAFAFA]",
        pending:
          "easyleap-max-w-[298px] easyleap-right-0 easyleap-ml-auto easyleap-bg-white easyleap-rounded-[16px] easyleap-border-none",
        complete:
          "easyleap-max-w-[298px] easyleap-right-0 easyleap-ml-auto easyleap-bg-white easyleap-rounded-[16px] easyleap-border-none"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "easyleap-inline-flex easyleap-h-8 easyleap-shrink-0 easyleap-items-center easyleap-justify-center easyleap-rounded-md easyleap-border easyleap-bg-transparent easyleap-px-3 easyleap-text-sm easyleap-font-medium easyleap-transition-colors hover:easyleap-bg-[#F5F5F6] focus:easyleap-outline-none focus:easyleap-ring-1 focus:easyleap-ring-[#0A0A0A] disabled:easyleap-pointer-events-none disabled:easyleap-opacity-50 group-[.destructive]:easyleap-border-[#F5F5F6]/40 group-[.destructive]:hover:easyleap-border-[#EF4444]/30 group-[.destructive]:hover:easyleap-bg-[#EF4444] group-[.destructive]:hover:easyleap-text-[#FAFAFA] group-[.destructive]:focus:easyleap-ring-[#EF4444]",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "easyleap-absolute easyleap-right-1 easyleap-top-1 easyleap-rounded-md easyleap-p-1 easyleap-text-[#0A0A0A]/50 easyleap-opacity-0 easyleap-transition-opacity hover:easyleap-text-[#0A0A0A] focus:easyleap-opacity-100 focus:easyleap-outline-none focus:easyleap-ring-1 group-hover:easyleap-opacity-100 group-[.destructive]:easyleap-text-red-300 group-[.destructive]:hover:easyleap-text-red-500 group-[.destructive]:focus:easyleap-ring-red-400 group-[.destructive]:focus:easyleap-ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="easyleap-h-4 easyleap-w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "easyleap-text-sm easyleap-font-semibold [&+div]:easyleap-text-xs",
      className
    )}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("easyleap-text-sm easyleap-opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps
};
