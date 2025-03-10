import { InjectedConnector } from "@starknet-react/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WebWalletConnector } from "starknetkit/webwallet";

import { Toaster } from "@/components/ui/toaster.tsx";

import { defaultEasyleapConfig, EasyleapProvider } from "@easyleap/sdk";

import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EasyleapProvider
      starknetConfig={{
        chains: defaultEasyleapConfig().starknetConfig.chains,
        provider: defaultEasyleapConfig().starknetConfig.provider,
        explorer: defaultEasyleapConfig().starknetConfig.explorer,
        connectors: [
          new WebWalletConnector(),
          new InjectedConnector({ options: { id: "argentX" } }),
          new InjectedConnector({ options: { id: "braavos" } })
        ]
      }}
    >
      <App />
      <Toaster />
    </EasyleapProvider>
  </StrictMode>
);
