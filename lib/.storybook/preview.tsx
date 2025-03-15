import type { Preview } from "@storybook/react";
import React from "react";
import { WagmiProvider } from "wagmi";
import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";
import { InjectedConnector } from "@starknet-react/core";
import { WebWalletConnector } from "starknetkit/webwallet";

import {
  defaultEasyleapConfig,
  EasyleapProvider
} from "../src/components/EasyleapProvider";

const config = createConfig(
  getDefaultConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(`https://eth-sepolia.public.blastapi.io`)
    },
    walletConnectProjectId: "242405a2808ac6e90831cb540f36617f",
    appName: "Easyleap",
    appDescription: "Bridge funds to Starknet dApps in a single click",
    appUrl: "https://easyleap.com",
    appIcon: "https://easyleap.com/logo.png"
  })
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    (Story) => (
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
        <Story />
      </EasyleapProvider>
    )
  ]
};

export default preview;
