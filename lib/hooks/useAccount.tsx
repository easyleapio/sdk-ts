import { useAccount as useAccountWagmi } from 'wagmi';
import { useAccount as useAccountSn } from '@starknet-react/core';
import { useMemo } from 'react';

/**
 * The mode of interaction with the Starknet DApp.
 * Bridge mode is used when the the action will be performed on source (e.g. L1) chain to bridge into Starknet
 * Starknet mode is used when the action will be performed on Starknet chain only
 * None mode is used when no action is being performed (happens when no account is connected)
 */
export enum InteractionMode {
    Bridge = 'Bridge',
    Starknet = 'Starknet',
    None = 'None'
}

export enum Chains {
    ETH_MAINNET = 'ETH_MAINNET',
    STARKNET = 'STARKNET'
}

/** Return type of  */
export interface useAccountResult {
    addressSource: `0x${string}` | undefined,
    addressDestination: `0x${string}` | undefined,
    mode: InteractionMode,
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
    const mode = useMemo(() => {
        if (addressSource && addressDestination) {
            return InteractionMode.Bridge
        }
        if (addressDestination) {
            return InteractionMode.Starknet
        }
        return InteractionMode.None
    }, [addressSource, addressDestination])

    const source = useMemo(() => {
        if (addressSource) {
            return Chains.ETH_MAINNET
        }
        return Chains.STARKNET
    }, [addressSource])

    const destination = Chains.STARKNET

    return {
        addressSource, addressDestination, mode, source, destination, chainIdEVM, chainIdSN
    }
}