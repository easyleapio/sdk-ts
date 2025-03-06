import { useSendTransaction as useSendTransactionSN } from "@starknet-react/core";
import React, { useEffect } from "react";
import { Call, hash, num } from "starknet";
import { encodeFunctionData } from "viem";
import { useSendTransaction as useSendTransactionEVM } from "wagmi";

import { TokenTransfer } from "@lib/components/review-modal";
import { ADDRESSES, ZERO_ADDRESS_EVM } from "@lib/utils/constants";

import { InteractionMode, useSharedState } from "../contexts/SharedState";
import { useAccount } from "./useAccount";
import { useSourceBridgeInfo } from "./useBalance";
import useMode from "./useMode";
import { mergeSortArrays } from "./useTransactionHistory";

export interface EUseSendTransactionArgs_EasyLeap {
  calls?: Call[];
  bridgeConfig: {
    l2_token_address: `0x${string}`;
    amount: bigint;
  };
}

export function useSourceFee() {
  return BigInt((0.00001 * 10 ** 18).toString());
}

export function useSNMsgFee() {
  return BigInt((0.001 * 10 ** 18).toString());
}

export function useSendTransaction(props: EUseSendTransactionArgs_EasyLeap): any {
  const mode = useMode();
  const {
    send: sendSN,
    error: errorSN,
    isPending: isPendingSN,
    isSuccess: isSuccessSN,
    data: dataSN,
  } = useSendTransactionSN({
    calls: props.calls,
  });
  const { addressDestination, addressSource } = useAccount();
  const sourceTokenInfo = useSourceBridgeInfo(
    props.bridgeConfig.l2_token_address,
  );
  const {
    sendTransaction,
    error: errorEVM,
    isPending: isPendingEVM,
    isSuccess: isSuccessEVM,
    isError: isErrorEVM,
    data: dataEVM,
  } = useSendTransactionEVM();

  const calldata = React.useMemo(() => {
    const flat_calls = props.calls?.map((call) => [
      BigInt(num.getDecimalString(call.contractAddress)),
      BigInt(num.getDecimalString(hash.getSelectorFromName(call.entrypoint))),
      call.calldata ? BigInt(call.calldata.length.toString()) : 0n,
      ...((call.calldata as Array<bigint>) || []),
    ]);
    const flat_calls_final = flat_calls ? flat_calls.flat() : [];
    const fullCalldata = [
      0n, // some id
      BigInt(
        num.getDecimalString(props.bridgeConfig.l2_token_address.toString()),
      ),
      props.bridgeConfig.amount,
      BigInt(num.getDecimalString(addressDestination || "0")), // l2 user address (l2 owner)
      BigInt(flat_calls_final.length.toString()) + 1n,
      BigInt(props.calls?.length.toString() || 0), // may fail with 0 calldata
      ...flat_calls_final,
    ];
    console.log("calldata", fullCalldata);
    return encodeFunctionData({
      abi: [
        {
          type: "function",
          name: "push",
          inputs: [
            {
              name: "tokenConfig",
              type: "tuple",
              internalType: "struct L1Manager.TokenConfig",
              components: [
                {
                  name: "l1_token_address",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "l2_token_address",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "bridge_address",
                  type: "address",
                  internalType: "address",
                },
              ],
            },
            {
              name: "amount",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "_calldata",
              type: "uint256[]",
              internalType: "uint256[]",
            },
          ],
          outputs: [],
          stateMutability: "payable",
        },
      ],
      functionName: "push",
      args: [
        {
          l1_token_address:
            (sourceTokenInfo?.l1_token_address as `0x${string}`) ||
            ZERO_ADDRESS_EVM,
          l2_token_address: BigInt(
            num.getDecimalString(
              props.bridgeConfig.l2_token_address.toString(),
            ),
          ),
          bridge_address:
            (sourceTokenInfo?.l1_bridge_address as `0x${string}`) ||
            ZERO_ADDRESS_EVM,
        },
        props.bridgeConfig.amount,
        fullCalldata,
      ],
    });
  }, [props.calls, props.bridgeConfig, addressDestination, sourceTokenInfo]);

  const mySourceFee = useSourceFee();
  const msgFee = useSNMsgFee();

  const ethValue = React.useMemo(() => {
    if (
      sourceTokenInfo &&
      sourceTokenInfo.l1_token_address == ZERO_ADDRESS_EVM
    ) {
      return props.bridgeConfig.amount + mySourceFee + msgFee;
    }
    return mySourceFee + msgFee;
  }, [
    sourceTokenInfo,
    props.bridgeConfig.amount,
    props.bridgeConfig,
    props,
    mySourceFee,
    msgFee,
  ]);

  useEffect(() => {
    console.log("useSendTransactionn", {
      dataEVM,
      isErrorEVM,
      isSuccessEVM,
      isPendingEVM,
    });
    if (dataEVM) {
      context.setSourceTransactions(
        mergeSortArrays(context.sourceTransactions, [
          {
            amount_raw: props.bridgeConfig.amount.toString(),
            receiver: addressDestination,
            block_number: 0,
            chain: "ethereum",
            cursor: 0,
            eventIndex: 0,
            request_id: 0,
            sender: addressSource,
            status: isPendingEVM ? "pending" : "confirmed",
            timestamp: Math.round(new Date().getTime() / 1000),
            token: props.bridgeConfig.l2_token_address,
            txHash: dataEVM,
            txIndex: 0,
          },
        ]),
      );
    }
  }, [dataEVM, isPendingEVM, isSuccessEVM, isErrorEVM]);

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
        data: calldata,
      });
    } else {
      return null;
    }
  };

  const context = useSharedState();

  function openReviewMoal(
    tokensIn: TokenTransfer[],
    tokensOut: TokenTransfer[],
  ) {
    if (mode == InteractionMode.Bridge) {
      context.setReviewModalProps({
        isOpen: true,
        tokensIn,
        tokensOut,
        onContinue: () => {
          send();
          context.setReviewModalProps({
            ...context.reviewModalProps,
            isOpen: false,
          });
        },
      });
    } else {
      send();
    }
  }

  context.setIsSuccessEVM(isSuccessEVM);

  return {
    send: openReviewMoal,
    error: errorSN || errorEVM,
    isPending: isPendingSN || isPendingEVM,
    dataSN,
    dataEVM,
    isSuccessSN,
    isSuccessEVM,
  };
}
