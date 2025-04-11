import { useMemo } from "react";
import { useAccount } from "./useAccount";
import { constants } from "starknet";
import TokensInfo, { SupportedToken } from "@lib/utils/tokens";
import TokensInfoSepolia from "@lib/utils/tokens.sepolia";

export type useSupportedTokensResult = SupportedToken[];

/**
 * A custom hook that provides the list of supported tokens based on the current Starknet chain ID.
 *
 * @returns {useSupportedTokensResult} The list of supported tokens for the current chain.
 *
 * The hook uses the `useAccount` hook to retrieve the current Starknet chain ID (`chainIdSN`).
 * It then determines the appropriate token list using `useMemo`:
 * - If the chain ID matches `SN_MAIN`, it returns `TokensInfo`.
 * - Otherwise, it returns `TokensInfoSepolia`.
 *
 * Dependencies:
 * - `chainIdSN`: The Starknet chain ID from the `useAccount` hook.
 */
export function useSupportedTokens(): useSupportedTokensResult {
  const { chainIdSN } = useAccount();

  const tokens = useMemo(() => {
    // Determine the token list based on the current Starknet chain ID
    return chainIdSN === BigInt(constants.StarknetChainId.SN_MAIN)
      ? TokensInfo
      : TokensInfoSepolia;
  }, [chainIdSN]);

  return tokens;
}
