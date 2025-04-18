import React from "react";

import { cn } from "@easyleap/sdk";

interface MaxWidthWrapperProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const MaxWidthWrapper: React.FC<MaxWidthWrapperProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn("mx-auto w-[min(83rem,_100%-2rem)]", className)}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
