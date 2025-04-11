import { useMemo } from "react";
import { standardise } from "@lib/utils";
import { ZERO_ADDRESS_EVM } from "@lib/utils/constants";
import { Address } from "@starknet-react/chains";
import { useSupportedTokens } from "./useSupportedTokens";

export interface useSourceBridgeInfoProps {
  l2TokenAddress: Address;
}

export interface SourceBridgeInfo {
  l1_bridge_address: Address;
  l1_token_address: Address;
  requireApproval: boolean;
}

export type useSourceBridgeInfoResult = SourceBridgeInfo | undefined;

/**
 * Retrieves the corresponding L1 bridge and token information for a given L2 token address.
 *
 * @param l2TokenAddress - The L2 token address in hexadecimal format.
 * @returns An object containing the L1 bridge and token addresses, or undefined if not found.
 */
export function useSourceBridgeInfo(
  { l2TokenAddress }: useSourceBridgeInfoProps
): useSourceBridgeInfoResult {
  const supportedTokens = useSupportedTokens();

  const sourceToken: useSourceBridgeInfoResult = useMemo(() => {
    // Filter tokens to find the one matching the provided L2 token address
    const tokensInfo = supportedTokens.filter((token) => {
      return standardise(token.l2_token_address) === standardise(l2TokenAddress);
    });

    const tokenInfo = tokensInfo.length ? tokensInfo[0] : undefined;

    // If the token is Ether, set its L1 token address to the zero address
    let requireApproval = true;
    if (tokenInfo && tokenInfo.id === "eth") {
      tokenInfo.l1_token_address = ZERO_ADDRESS_EVM;
      requireApproval = false;
    }

    return tokenInfo ? {
      l1_bridge_address: tokenInfo.l1_bridge_address,
      l1_token_address: tokenInfo.l1_token_address,
      requireApproval: requireApproval,
    } : undefined;
  }, [supportedTokens, l2TokenAddress]);

  return sourceToken;
}