import ConnectButtonDialog from "@/components/connect-button-dialog";

import { useBalance } from "@/hooks/useBalance";

// import { ComplexButton } from "../lib/components/connect/ComplexButton";
// import { useBalance } from "../lib/hooks/useBalance";

import "./App.css";

function App() {
  const balanceInfo = useBalance({
    l2TokenAddress:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  });

  return (
    <div className="flex flex-col items-center justify-center font-dmSans">
      <h1>StarkPull</h1>
      <h3>Use Starknet dApps with funds on L1</h3>

      {/* <ComplexButton></ComplexButton> */}

      <div className="my-9">
        <ConnectButtonDialog />
      </div>

      {balanceInfo.isLoading ? "Loading..." : ""}
      {balanceInfo.isError ? "Error" : ""}
      {balanceInfo.data ? `Balance: ${balanceInfo.data.formatted}` : ""}
    </div>
  );
}

export default App;
