import { useMotionValueEvent, useScroll } from "motion/react";
import React from "react";

import { cn } from "../../";

import { ConnectButton } from "../../";
import { Icons } from "./Icons";

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
      className={cn("top-0 z-50 w-full px-3 py-4 md:sticky", {
        "md:border-b md:border-b-[#0E0A1E] md:shadow-sm md:backdrop-blur-2xl":
          isScrolled,
      })}
    >
      <div className="mx-auto flex w-[min(83rem,_100%-2rem)] flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
        <Icons.namedLogo />

        <ConnectButton />
      </div>
    </header>
  );
};

export default Navbar;
