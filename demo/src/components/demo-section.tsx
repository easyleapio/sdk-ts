import { useIsMobile } from "./ui/use-mobile";
import VesuDeposit from "./vesu-deposit";

export const DemoSection: React.FC = () => {
  const isMobile = useIsMobile();
  return (
    <div
      className="flex h-full min-h-screen w-full flex-col items-center justify-between gap-5 md:flex-row"
      id="tryit"
    >
      <div className="relative z-10 flex flex-col items-center gap-3">
        <h1 className="text-center text-[24px] font-bold leading-[28.8px] text-[#DADADA] md:text-start">
          Benefits
          <p className="mt-5 rounded-lg bg-[#B9AFF10D] p-2 px-5 text-sm font-normal shadow-lg md:text-lg">
            Unified deposit experience for Starknet dApps,{" "}
            <br className="hidden md:block" /> whether cross-chain or native.
          </p>
          <p className="mt-4 rounded-lg bg-[#B9AFF10D] p-2 px-5 text-sm font-normal shadow-lg md:text-lg">
            A general purpose SDK which is inspired by{" "}
            <br className="hidden md:block" />
            starknet-react and easy to integrate
          </p>
          {!isMobile && <img
            src="/strk-laid-coin.svg"
            className="pointer-events-none absolute -bottom-[10rem] left-1/2 z-0 -translate-x-1/2 select-none md:-bottom-[12rem]"
            alt="coins"
          />}
        </h1>
      </div>

      <div className="relative">
        <VesuDeposit />

        <img
          src="/usdc-laid-coin.svg"
          className="pointer-events-none absolute -bottom-28 left-[66%] z-0 hidden -translate-x-1/2 select-none md:block"
          alt="coins"
        />
      </div>
    </div>
  );
};
