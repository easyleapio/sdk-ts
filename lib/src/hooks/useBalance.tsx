import {
  UseBalanceResult,
  useBalance as useBalanceSN
} from "@starknet-react/core";
import { useEffect, useMemo } from "react";
import { useBalance as useBalanceWagmi } from "wagmi";
import { InteractionMode } from "../contexts/SharedState";
import { useAccount, Chains } from "./useAccount";
import { useMode } from "./useMode";
import { useSourceBridgeInfo } from "./useSourceBridgeInfo";
import { logger } from "@lib/utils/logger";


export interface UseBalanceProps {
  l2TokenAddress: `0x${string}`;
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
  const sourceTokenInfo = useSourceBridgeInfo({
    l2TokenAddress,
  });

  const resultWagmi = useBalanceWagmi({
    address: addressSource,
    token: !sourceTokenInfo || !sourceTokenInfo.requireApproval ? undefined : sourceTokenInfo.l1_token_address,
  });

  const result = useMemo(() => {
    if (mode == InteractionMode.Starknet || mode == InteractionMode.None) {
      return resultSN;
    }

    if (mode == InteractionMode.Bridge && source == Chains.ETH_MAINNET) {
      // If token is not found in the tokens.json file, return the Starknet balance
      if (!sourceTokenInfo) {
        logger.warn("EasyLeap::useBalance", `Source token info not found for L2 token address ${l2TokenAddress}`);
        throw new Error("Source token info not found");
      }

      return resultWagmi;
    }

    throw new Error("In Bridge mode, only ETH network is supported");
  }, [mode, source, sourceTokenInfo?.l1_token_address, resultSN, resultWagmi]);

  useEffect(() => {
    logger.verbose("useBalance", {
      result,
      mode,
      addressDestination,
      source,
      resultWagmi,
      addressSource,
      l2TokenAddress,
      error: result.error,
      sourceTokenAddr: sourceTokenInfo?.l1_token_address
    });
  }, [result]);
  return result;
}
