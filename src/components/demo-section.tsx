import VesuDeposit from "./vesu-deposit";

export const DemoSection: React.FC = () => {
  return (
    <div className="flex h-full min-h-screen w-full items-center justify-between">
      <div className="relative z-10 flex flex-col items-center gap-3">
        <h1 className="text-[24px] font-bold leading-[28.8px] text-[#DADADA]">
          Benefits
          <p className="mt-5 rounded-lg bg-[#B9AFF10D] p-2 px-5 text-lg font-normal shadow-lg">
            Unified deposit experience for Starknet dApps, <br /> whether
            cross-chain or native.
          </p>
          <p className="mt-4 rounded-lg bg-[#B9AFF10D] p-2 px-5 text-lg font-normal shadow-lg">
            A general purpose SDK which is inspired by <br />
            starknet-react and easy to integrate
          </p>
          <img
            src="/strk-laid-coin.svg"
            className="pointer-events-none absolute -bottom-[12rem] left-1/2 z-0 -translate-x-1/2 select-none"
            alt="coins"
          />
        </h1>
      </div>

      <div className="relative">
        <VesuDeposit />

        <img
          src="/usdc-laid-coin.svg"
          className="pointer-events-none absolute -bottom-28 left-[66%] z-0 -translate-x-1/2 select-none"
          alt="coins"
        />
      </div>
    </div>
  );
};
