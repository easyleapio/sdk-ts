import { sepolia } from "@starknet-react/chains";
import { StarknetConfig, StarknetConfigProps, publicProvider, voyager } from "@starknet-react/core"
import { getDefaultConfig } from "connectkit";
import React, { useMemo } from "react";
import { sepolia as sepoliaEVM } from "viem/chains"
import { createConfig, http, Config as WagmiConfig, WagmiProvider } from "wagmi"

export interface StarkpullConfig {
    wagmiConfig?: WagmiConfig,
    starknetConfig?: StarknetConfigProps,
    children?: React.ReactNode
}

const WALLET_CONNECT_DEFAULT_PROJECT_ID = '242405a2808ac6e90831cb540f36617f'; // akira@strkfarm.xyz wallet connect account

export function defaultStarkpullConfig() {
    return {
        wagmiConfig: createConfig(
            getDefaultConfig({
              // Your dApps chains
              chains: [sepoliaEVM],
              transports: {
                // RPC URL for each chain
                [sepoliaEVM.id]: http(
                  `https://eth-sepolia.public.blastapi.io`,
                ),
              },
          
              // Required API Keys
              walletConnectProjectId: WALLET_CONNECT_DEFAULT_PROJECT_ID,
          
              // Required App Info
              appName: "Starkpull",
          
              // Optional App Info
              appDescription: "Bridge funds to Starknet dApps in a single click",
              appUrl: "https://starkpull.com", // your app's url
              appIcon: "https://starkpull.com/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
            }),
        ),
        starknetConfig: {
            chains: [sepolia],
            provider: publicProvider(),
            explorer: voyager,
        },
    }
}

export function StarkpullProvider(props: StarkpullConfig = {
  starknetConfig: defaultStarkpullConfig().starknetConfig,
  wagmiConfig: defaultStarkpullConfig().wagmiConfig,
  children: null
}) {
  const wagmiConfig = useMemo(() => {
    if (!props.wagmiConfig) {
      return defaultStarkpullConfig().wagmiConfig
    }
    return props.wagmiConfig
  }, [props.wagmiConfig])

  const starknetConfig: StarknetConfigProps = useMemo(() => {
    if (!props.starknetConfig) {
      return defaultStarkpullConfig().starknetConfig
    }
    return props.starknetConfig
  }, [props.starknetConfig])

  return (
    <WagmiProvider config={wagmiConfig}>
        <StarknetConfig 
          chains={starknetConfig.chains} 
          provider={starknetConfig.provider} 
          explorer={starknetConfig.explorer}
          connectors={starknetConfig?.connectors || []}
        >
          {props.children}
        </StarknetConfig>
    </WagmiProvider>
  );
}