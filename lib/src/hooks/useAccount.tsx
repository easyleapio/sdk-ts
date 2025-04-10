import {
  useAccount as useAccountSn,
  useSwitchChain
} from "@starknet-react/core";
import { createConfig, http, switchChain as switchChainEVM } from "@wagmi/core";
import { mainnet, sepolia } from "@wagmi/core/chains";
import { useEffect, useMemo } from "react";
import { num } from "starknet";
import { useAccount as useAccountWagmi, useConfig } from "wagmi";
import { InteractionMode, useSharedState } from "../contexts/SharedState";
import { useTransactionHistory } from "./useTransactionHistory";

export enum Chains {
  ETH_MAINNET = "ETH_MAINNET",
  STARKNET = "STARKNET"
}

/** Return type of  */
export interface useAccountResult {
  addressSource: `0x${string}` | undefined;
  addressDestination: `0x${string}` | undefined;
  source: Chains;
  destination: Chains;
  chainIdEVM: number | undefined;
  chainIdSN: bigint | undefined;
}

export const evmConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http()
  }
});

/**
 * This hook provides the account information and the mode of interaction with the Starknet DApp
 * @returns UseAccountResult
 */
export function useAccount(): useAccountResult {
  const config = useConfig();
  const { address: addressSource, chainId: chainIdEVM } = useAccountWagmi();
  const { address: addressDestination, chainId: chainIdSN } = useAccountSn();
  const sharedState = useSharedState();

  // init tx history polling
  useTransactionHistory(addressDestination);

  // todo need to make this generic
  // hard coding for one chain for now
  if (addressSource && chainIdEVM != config.chains[0].id) {
    console.log("Switching to mainnet");
    switchChainEVM(evmConfig, { chainId: config.chains[0].id as 1 | 11155111 });
  }

  const result = useSwitchChain({
    params: {
      chainId: num.getHexString(sharedState.chains.starknet.id.toString())
    }
  });

  useEffect(() => {
    if (addressDestination) {
      if (chainIdSN != sharedState.chains.starknet.id) {
        result.switchChain();
      }
    }
    if (result.error) console.error("switching", result.error);
  }, [addressDestination, chainIdSN, sharedState.chains.starknet]);

  useEffect(() => {
    if (
      addressSource &&
      addressDestination &&
      !sharedState.isModeSwitchedManually
    ) {
      sharedState.setMode(InteractionMode.Bridge);
    } else if (addressDestination && !addressSource) {
      sharedState.setMode(InteractionMode.Starknet);
    } else if (!addressSource && !addressDestination) {
      sharedState.setMode(InteractionMode.None);
    }
  }, [addressSource, addressDestination]);

  const source = useMemo(() => {
    if (addressSource) {
      return Chains.ETH_MAINNET;
    }
    return Chains.STARKNET;
  }, [addressSource]);

  const destination = Chains.STARKNET;

  return {
    addressSource,
    addressDestination,
    source,
    destination,
    chainIdEVM,
    chainIdSN
  };
}
