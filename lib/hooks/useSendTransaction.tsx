import { useSendTransaction as useSendTransactionSN } from "@starknet-react/core";
import { Call, hash, num } from "starknet";
import { useSendTransaction as useSendTransactionEVM } from "wagmi"; 
import useMode from "./useMode";
import { InteractionMode } from "./SharedState";
import { encodeFunctionData } from "viem";
import { useSourceBridgeInfo } from "./useBalance";
import { useAccount } from "./useAccount";
import { useEffect, useMemo } from "react";
import { ADDRESSES, ZERO_ADDRESS_EVM } from "../../lib/utils/constants";

export interface UseSendTransactionArgs {
  calls?: Call[],
  bridgeConfig: {
    l2_token_address: `0x${string}`,
    amount: bigint,
  }
}

export function useSourceFee() {
  return BigInt((0.00001 * 10**18).toString())
}

export function useSNMsgFee() {
  return BigInt((0.001 * 10**18).toString())
}

export function useSendTransaction(props: UseSendTransactionArgs) {
  const mode = useMode();
  const { send: sendSN, error: errorSN } = useSendTransactionSN({ 
    calls: props.calls,
  });
  const { addressDestination } = useAccount();
  const sourceTokenInfo = useSourceBridgeInfo(props.bridgeConfig.l2_token_address);
  const { sendTransaction, error: errorEVM } = useSendTransactionEVM();

  const flat_calls = props.calls?.map(call => [
    BigInt(num.getDecimalString(call.contractAddress)), 
    BigInt(num.getDecimalString(hash.getSelectorFromName(call.entrypoint))), 
    call.calldata ? BigInt(call.calldata.length.toString()) : 0n,
    ...(call.calldata as Array<bigint> || [])
  ]);
  const flat_calls_final = flat_calls ? flat_calls.flat() : [];
  const fullCalldata = [
    0n, // some id
    BigInt(num.getDecimalString(props.bridgeConfig.l2_token_address.toString())),
    props.bridgeConfig.amount,
    BigInt(num.getDecimalString(addressDestination || '0')), // l2 user address (l2 owner)
    BigInt(flat_calls_final.length.toString()) + 1n,
    BigInt(props.calls?.length.toString() || 0), // may fail with 0 calldata
    ...flat_calls_final
  ];
  const calldata = encodeFunctionData({
    abi: [
      {
        "type": "function",
        "name": "push",
        "inputs": [
          {
            "name": "tokenConfig",
            "type": "tuple",
            "internalType": "struct L1Manager.TokenConfig",
            "components": [
              {
                "name": "l1_token_address",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "l2_token_address",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "bridge_address",
                "type": "address",
                "internalType": "address"
              }
            ]
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "_calldata",
            "type": "uint256[]",
            "internalType": "uint256[]"
          }
        ],
        "outputs": [],
        "stateMutability": "payable"
      }
    ],
    functionName: "push",
    args: [
      {
        "l1_token_address": sourceTokenInfo?.l1_token_address as `0x${string}` || ZERO_ADDRESS_EVM,
        "l2_token_address": BigInt(num.getDecimalString(props.bridgeConfig.l2_token_address.toString())),
        "bridge_address": sourceTokenInfo?.l1_bridge_address as `0x${string}` || ZERO_ADDRESS_EVM
      },
      props.bridgeConfig.amount,
      fullCalldata
    ]
  });

  const mySourceFee = useSourceFee();
  const msgFee = useSNMsgFee();

  useEffect(() => {
    console.log('calldata', fullCalldata);
  }, [calldata]);

  const ethValue = useMemo(() => {
    if (sourceTokenInfo && sourceTokenInfo.l1_token_address == ZERO_ADDRESS_EVM) {
      return props.bridgeConfig.amount + mySourceFee + msgFee;
    }
    return mySourceFee + msgFee;
  }, [sourceTokenInfo, props.bridgeConfig.amount, mySourceFee, msgFee]);

  const send = async () => {
    if (!props.calls || !props.calls.length) {
      return null;
    }
    if (mode == InteractionMode.Starknet) {
      return sendSN();
    } else if (mode == InteractionMode.Bridge) {
      return sendTransaction({
        to: ADDRESSES.ETH_MAINNET.BRIDGE_MANAGER as `0x${string}`,
        value: ethValue,
        data: calldata
      });
    } else {
      return null;
    }
  }

  return {
    send,
    error: errorSN || errorEVM
  }
}