import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "easyleap-fixed easyleap-inset-0 easyleap-z-50 easyleap-bg-black/80 easyleap-data-[state=open]:animate-in easyleap-data-[state=closed]:animate-out easyleap-data-[state=closed]:fade-out-0 easyleap-data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    closeClassName?: string;
  }
>(({ className, children, closeClassName, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "easyleap-fixed easyleap-left-[50%] easyleap-top-[50%] easyleap-z-50 easyleap-grid easyleap-w-full easyleap-translate-x-[-50%] easyleap-translate-y-[-50%] easyleap-gap-4 easyleap-border easyleap-p-6 easyleap-shadow-lg easyleap-duration-200 easyleap-data-[state=open]:animate-in easyleap-data-[state=closed]:animate-out easyleap-data-[state=closed]:fade-out-0 easyleap-data-[state=open]:fade-in-0 easyleap-data-[state=closed]:zoom-out-95 easyleap-data-[state=open]:zoom-in-95 easyleap-data-[state=closed]:slide-out-to-left-1/2 easyleap-data-[state=closed]:slide-out-to-top-[48%] easyleap-data-[state=open]:slide-in-from-left-1/2 easyleap-data-[state=open]:slide-in-from-top-[48%] easyleap-rounded-lg easyleap-max-w-[425px]",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className={cn(
          "easyleap-absolute easyleap-right-4 easyleap-top-4 easyleap-rounded-sm easyleap-opacity-70 easyleap-ring-offset-background easyleap-transition-opacity easyleap-hover:opacity-100 easyleap-focus:outline-none easyleap-focus:ring-2 easyleap-focus:ring-ring easyleap-focus:ring-offset-2 easyleap-disabled:pointer-events-none easyleap-data-[state=open]:bg-accent easyleap-data-[state=open]:text-muted-foreground",
          closeClassName
        )}
      >
        <X className="easyleap-h-4 easyleap-w-4" />
        <span className="easyleap-sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "easyleap-flex easyleap-flex-col easyleap-space-y-1.5 easyleap-text-center easyleap-sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "easyleap-flex easyleap-flex-col-reverse easyleap-sm:flex-row easyleap-sm:justify-end easyleap-sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("easyleap-tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("easyleap-text-sm easyleap-text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
};
