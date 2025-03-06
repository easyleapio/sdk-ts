import { mainnet, sepolia } from "@starknet-react/chains";
import {
  publicProvider,
  StarknetConfig,
  StarknetConfigProps,
  voyager,
} from "@starknet-react/core";
import { getDefaultConfig } from "connectkit";
import React from "react";
import { sepolia as sepoliaEVM } from "viem/chains";
import {
  createConfig,
  http,
  Config as WagmiConfig,
  WagmiProvider,
} from "wagmi";

import { Toaster } from "@lib/components/ui/toaster";
import { SharedStateProvider, useSharedState } from "@lib/contexts/SharedState";
import { GlobalTheme, ThemeProvider } from "@lib/contexts/ThemeContext";

export interface EasyleapConfig {
  wagmiConfig?: WagmiConfig;
  starknetConfig?: StarknetConfigProps;
  children?: React.ReactNode;
  theme?: GlobalTheme;
}

const WALLET_CONNECT_DEFAULT_PROJECT_ID = "242405a2808ac6e90831cb540f36617f"; // akira@unwraplabs.com wallet connect account

export function defaultEasyleapConfig() {
  return {
    wagmiConfig: createConfig(
      getDefaultConfig({
        // Your dApps chains
        chains: [sepoliaEVM],
        transports: {
          // RPC URL for each chain
          [sepoliaEVM.id]: http(`https://eth-sepolia.public.blastapi.io`),
        },

        // Required API Keys
        walletConnectProjectId: WALLET_CONNECT_DEFAULT_PROJECT_ID,

        // Required App Info
        appName: "Easyleap",

        // Optional App Info
        appDescription: "Bridge funds to Starknet dApps in a single click",
        appUrl: "https://easyleap.com", // your app's url
        appIcon: "https://easyleap.com/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
      }),
    ),
    starknetConfig: {
      chains: [sepolia],
      provider: publicProvider(),
      explorer: voyager,
    },
  };
}

export function EasyleapProvider(
  props: EasyleapConfig = {
    starknetConfig: defaultEasyleapConfig().starknetConfig,
    wagmiConfig: defaultEasyleapConfig().wagmiConfig,
    children: null,
    theme: {},
  },
) {
  const context = useSharedState();

  const wagmiConfig = React.useMemo(() => {
    if (!props.wagmiConfig) {
      return defaultEasyleapConfig().wagmiConfig;
    }
    return props.wagmiConfig;
  }, [props.wagmiConfig]);

  const starknetConfig: StarknetConfigProps = React.useMemo(() => {
    if (!props.starknetConfig) {
      return defaultEasyleapConfig().starknetConfig;
    }
    return props.starknetConfig;
  }, [props.starknetConfig]);

  React.useEffect(() => {
    // todo need to ensure only one chain can be given
    if (starknetConfig.chains && starknetConfig.chains.length > 0) {
      context.setChains({
        starknet: starknetConfig.chains[0],
      });
    }
  }, [starknetConfig.chains]);

  return (
    <SharedStateProvider>
      <ThemeProvider theme={props.theme}>
        <WagmiProvider config={wagmiConfig}>
          <StarknetConfig
            chains={[sepolia, mainnet]}
            provider={starknetConfig.provider}
            explorer={starknetConfig.explorer}
            connectors={starknetConfig?.connectors || []}
          >
            {props.children}
            <Toaster />
          </StarknetConfig>
        </WagmiProvider>
      </ThemeProvider>
    </SharedStateProvider>
  );
}
