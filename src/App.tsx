import Hero from "@/components/hero";
import { DemoSection } from "./components/demo-section";
import MaxWidthWrapper from "./components/max-width-wrapper";
import Navbar from "./components/navbar";

function App() {
  // const balanceInfo = useBalance({
  //   l2TokenAddress:
  //     "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  // });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#211D31] font-dmSans">
      <img
        src="/hero/bg-grid-pattern.svg"
        className="pointer-events-none absolute right-0 top-0 z-0 select-none"
        alt="bg-grid-pattern"
      />

      <Navbar />

      <MaxWidthWrapper>
        <Hero />
        <DemoSection />
        {/* <h1>StarkPull</h1>
      <h3>Use Starknet dApps with funds on L1</h3>

      {/* <ComplexButton></ComplexButton> */}

        {/* <div className="my-9">
        <ConnectButtonDialog />
      </div> */}

        {/* {balanceInfo.isLoading ? "Loading..." : ""}
      {balanceInfo.isError ? "Error" : ""}
      {balanceInfo.data ? `Balance: ${balanceInfo.data.formatted}` : ""} */}
      </MaxWidthWrapper>
    </div>
  );
}

export default App;
