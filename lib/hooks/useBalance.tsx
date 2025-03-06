import {
  UseBalanceResult,
  useBalance as useBalanceSN,
} from "@starknet-react/core";
import { useEffect, useMemo } from "react";
import { constants } from "starknet";
import { useBalance as useBalanceWagmi } from "wagmi";

import { standardise } from "@lib/utils";
import { ZERO_ADDRESS_EVM } from "@lib/utils/constants";
import TokensInfo from "@lib/utils/tokens.json";
import TokensInfoSepolia from "@lib/utils/tokens.sepolia.json";

import { InteractionMode } from "../contexts/SharedState";
import { Chains, useAccount } from "./useAccount";
import useMode from "./useMode";

export interface UseBalanceProps {
  l2TokenAddress: `0x${string}`;
}

export function useSourceBridgeInfo(l2TokenAddress: `0x${string}`):
  | {
      l1_bridge_address: string;
      l1_token_address: string;
    }
  | undefined {
  const { chainIdSN } = useAccount();
  const output = useMemo(() => {
    const tokens =
      chainIdSN == BigInt(constants.StarknetChainId.SN_MAIN)
        ? TokensInfo
        : TokensInfoSepolia;
    const tokensInfo = tokens.filter((token) => {
      if (!token.l2_token_address) return false;
      return standardise(token.l2_token_address) == standardise(l2TokenAddress);
    });
    const tokenInfo = tokensInfo.length ? tokensInfo[0] : undefined;
    if (tokenInfo != undefined && tokensInfo[0].name == "Ether") {
      tokenInfo.l1_token_address = ZERO_ADDRESS_EVM;
    }
    return tokenInfo;
  }, [chainIdSN, l2TokenAddress]);

  if (!output || !output.l1_token_address || !output.l1_bridge_address) {
    return undefined;
  }
  return output;
}

export function useBalance(props: UseBalanceProps): UseBalanceResult {
  const { l2TokenAddress } = props;
  const mode = useMode();
  const { source, addressSource, addressDestination } = useAccount();
  const resultSN = useBalanceSN({
    token: l2TokenAddress,
    address: addressDestination,
  });

  // Find corresponding EVM token address
  const sourceTokenInfo = useSourceBridgeInfo(l2TokenAddress);

  const resultWagma = useBalanceWagmi({ address: addressSource });

  const result = useMemo(() => {
    if (mode == InteractionMode.Starknet || mode == InteractionMode.None) {
      return resultSN;
    }

    if (mode == InteractionMode.Bridge && source == Chains.ETH_MAINNET) {
      // If token is not found in the tokens.json file, return the Starknet balance
      if (!sourceTokenInfo) {
        // todo return error
        return resultSN;
      }

      return resultWagma;
    }

    // todo return error
    return resultSN;
  }, [mode, source, sourceTokenInfo?.l1_token_address, resultSN, resultWagma]);

  useEffect(() => {
    console.log("useBalance", {
      result,
      mode,
      addressDestination,
      source,
      resultWagma,
      addressSource,
      error: result.error,
      sourceTokenAddr: sourceTokenInfo?.l1_token_address,
    });
  }, [result]);
  return result;
}
