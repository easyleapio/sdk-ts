import { UseBalanceResult, useBalance as useBalanceSN } from "@starknet-react/core";
import { useBalance as useBalanceWagmi } from "wagmi";
import { Chains, InteractionMode, useAccount } from "./useAccount";
import TokensInfo from "../utils/tokens.json";
import TokensInfoSepolia from "../utils/tokens.sepolia.json";
import { standardise } from "../utils";
import { useEffect, useMemo } from "react";
import { constants } from "starknet";

export interface UseBalanceProps {
    l2TokenAddress: `0x${string}`, 
}

export function useBalance(props: UseBalanceProps): UseBalanceResult {
    const {l2TokenAddress} = props;
    const { mode, source, addressSource, addressDestination, chainIdSN } = useAccount();
    const resultSN = useBalanceSN({token: l2TokenAddress, address: addressDestination});

    // Find corresponding EVM token address
    const sourceTokenAddr = useMemo(() => {
        const tokens = chainIdSN == BigInt(constants.StarknetChainId.SN_MAIN) ? TokensInfo : TokensInfoSepolia;
        console.log("useBalance2", tokens, l2TokenAddress);
        const tokenInfo = tokens.filter((token) => {
            if (!token.l2_token_address) return false;
            return standardise(token.l2_token_address) == standardise(l2TokenAddress);
        });
        const tokenAddr = tokenInfo.length ? tokenInfo[0].l1_token_address as `0x${string}` : '0x0';
        if (tokenAddr != '0x0' && tokenInfo[0].name == 'Ether') {
            return undefined
        }
        return tokenAddr;
    }, [chainIdSN, l2TokenAddress]);

    const resultWagma = useBalanceWagmi({address: addressSource, token: sourceTokenAddr});
   
    const result = useMemo(() => { 
        if (mode == InteractionMode.Starknet || mode == InteractionMode.None) {
            return resultSN;
        }
        
        if (mode == InteractionMode.Bridge && source == Chains.ETH_MAINNET) {
            // If token is not found in the tokens.json file, return the Starknet balance
            if (sourceTokenAddr == '0x0') {
                // todo return error
                return resultSN;
            }
   
            return resultWagma;
        }

        // todo return error
        return resultSN;
    }, [mode, source, sourceTokenAddr, resultSN, resultWagma]);

    useEffect(() => {
        console.log("useBalance", {result, mode, addressDestination, source, resultWagma, addressSource, error: result.error, sourceTokenAddr});
    }, [result]);
    return result;
}