import { InjectedConnector } from "@starknet-react/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WebWalletConnector } from "starknetkit/webwallet";

import { Toaster } from "@/components/ui/toaster.tsx";

import App from "./App.tsx";
import "./index.css";
import { defaultEasyleapConfig, EasyleapProvider } from "../lib/components/EasyleapProvider/index.tsx";

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
        ],
      }}
    >
      <App />
      <Toaster />
    </EasyleapProvider>
  </StrictMode>,
);
