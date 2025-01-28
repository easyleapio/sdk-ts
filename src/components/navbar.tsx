import { useMotionValueEvent, useScroll } from "motion/react";
import React from "react";

import { cn } from "../../lib/utils";
import { Icons } from "./Icons";
import ConnectButtonDialog from "./connect-button-dialog";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 0.1) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <header
      className={cn("sticky top-0 z-50 w-full px-3 py-4", {
        "border-b border-b-[#0E0A1E] backdrop-blur-2xl": isScrolled,
      })}
    >
      <div className="mx-auto flex w-[min(83rem,_100%-2rem)] items-center justify-between">
        <Icons.namedLogo />

        <ConnectButtonDialog />
      </div>
    </header>
  );
};

export default Navbar;
