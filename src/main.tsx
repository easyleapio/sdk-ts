import { InjectedConnector } from "@starknet-react/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WebWalletConnector } from "starknetkit/webwallet";

import {
  defaultStarkpullConfig,
  StarkpullProvider,
} from "@/components/starkpull-provider/index.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";

import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StarkpullProvider
      starknetConfig={{
        chains: defaultStarkpullConfig().starknetConfig.chains,
        provider: defaultStarkpullConfig().starknetConfig.provider,
        explorer: defaultStarkpullConfig().starknetConfig.explorer,
        connectors: [
          new WebWalletConnector(),
          new InjectedConnector({ options: { id: "argentX" } }),
        ],
      }}
    >
      <App />
      <Toaster />
    </StarkpullProvider>
  </StrictMode>,
);
