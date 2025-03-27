"use client";

import { useToast } from "@lib/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from "./toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="easyleap-h-fit easyleap-rounded-xl easyleap-bg-white easyleap-backdrop-blur-lg"
          >
            <div className="easyleap-grid easyleap-gap-1">
              {title && (
                <ToastTitle className="easyleap-text-[#1C182B]">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="easyleap-text-[#1B182B]">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
