import { useAccount as useAccountWagmi } from 'wagmi';
import { useAccount as useAccountSn } from '@starknet-react/core';
import { useEffect, useMemo } from 'react';
import { InteractionMode, useSharedState } from './SharedState';

export enum Chains {
    ETH_MAINNET = 'ETH_MAINNET',
    STARKNET = 'STARKNET'
}

/** Return type of  */
export interface useAccountResult {
    addressSource: `0x${string}` | undefined,
    addressDestination: `0x${string}` | undefined,
    source: Chains,
    destination: Chains,
    chainIdEVM: number | undefined,
    chainIdSN: bigint | undefined
}

/**
 * This hook provides the account information and the mode of interaction with the Starknet DApp
 * @returns UseAccountResult
 */
export function useAccount(): useAccountResult {
    const { address: addressSource, chainId: chainIdEVM } = useAccountWagmi()
    const { address: addressDestination, chainId: chainIdSN } = useAccountSn()
    const sharedState = useSharedState();

    useEffect(() => {
        if (addressSource && addressDestination && !sharedState.isModeSwitchedManually) {
            sharedState.setMode(InteractionMode.Bridge)
        } else if (addressDestination && !addressSource) {
            sharedState.setMode(InteractionMode.Starknet)
        } else if (!addressSource && !addressDestination) {
            sharedState.setMode(InteractionMode.None)
        }
    }, [addressSource, addressDestination])

    const source = useMemo(() => {
        if (addressSource) {
            return Chains.ETH_MAINNET
        }
        return Chains.STARKNET
    }, [addressSource])

    const destination = Chains.STARKNET

    return {
        addressSource, addressDestination, source, destination, chainIdEVM, chainIdSN
    }
}