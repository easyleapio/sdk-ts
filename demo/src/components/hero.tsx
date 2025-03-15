import React from "react";

import { Button } from "./ui/button";

const Hero: React.FC = () => {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center md:flex-row md:justify-between">
      <img
        src="/hero/coins.svg"
        className="pointer-events-none absolute bottom-5 left-[46%] z-0 hidden -translate-x-1/2 select-none md:block"
        alt="coins"
      />

      <div className="z-10 mt-10 flex flex-col items-center gap-3 text-[#DADADA] md:-mt-32 md:items-start">
        <h1 className="bg-gradient-to-r from-[#FFFFFF] to-[#EC796B] bg-clip-text text-center text-2xl font-semibold text-transparent md:text-start md:text-[64.54px] md:leading-[77.45px]">
          The In-App cross-chain
          <br className="hidden md:block" />
          deposit SDK for Starknet
        </h1>

        <p className="mt-2 text-center font-semibold md:text-start md:text-[18px] md:leading-[21.6px]">
          Allow your users to seamlessly bridge into you dApp
          <br className="hidden md:block" />
          in a single step
        </p>

        <div className="mt-4 flex flex-col items-center gap-0 font-medium md:flex-row md:gap-2 md:text-[18px] md:leading-[23.91px]">
          Supporting chains:{" "}
          <p className="text-[#2FDB81]">
            Ethereum
            <span className="text-sm text-[grey]"> (more coming soon)</span>
          </p>
        </div>

        <a className="mt-6" href="#tryit">
          <Button
            style={{
              background:
                "linear-gradient(180deg, #7151EB 0%, #C078FF 100%), radial-gradient(29.19% 139.29% at 51.96% 8.93%, #80A6FC 0%, rgba(113, 81, 235, 0) 100%)",
            }}
            className="h-[49px] rounded-[40px] px-6 text-white"
          >
            Try it out now
          </Button>
        </a>

        {/* <div className="mt-32 space-y-4">
          <p className="text-sm font-medium leading-[18.59px] text-[#DADADA]">
            DApps which already integrated us
          </p>
          <div className="flex w-full items-center gap-4">
            <Icons.endurNamedLogo />
            <Icons.vesuNamedLogo />
          </div>
        </div> */}
      </div>

      <div className="pointer-events-none z-10 mt-7 select-none md:-mt-32">
        <img src="/hero/easyleap-illustration.svg" alt="Hero Image" />
      </div>
    </div>
  );
};

export default Hero;
