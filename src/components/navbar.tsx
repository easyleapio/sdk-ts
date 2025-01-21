import React from "react";
import { Icons } from "./Icons";
import ConnectButtonDialog from "./connect-button-dialog";

const Navbar: React.FC = () => {
  return (
    <header className="z-10 flex w-full items-center justify-between px-3 py-4">
      <Icons.namedLogo />

      <ConnectButtonDialog />
    </header>
  );
};

export default Navbar;
