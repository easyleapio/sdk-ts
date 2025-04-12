import { UseReadContractResult } from "@starknet-react/core";
import { useMemo } from "react";

import { useMode } from "./useMode";
import { InteractionMode } from "@lib/contexts";

// todo should define a proper output type

export type UseReadContractResult_EasyLeap = Omit<UseReadContractResult<any, any>, 'refetch'> & {
  amountOut: bigint;
  fee: bigint;
}

/**
 *
 * @param amount_raw In full decimal string format (e.g. "1000000000000000000" for 1 ETH)
 */
export function useAmountOut(amount_raw: bigint): UseReadContractResult_EasyLeap {
  const mode = useMode();
  // const output = useReadContract({
  //   abi: [
  //     {
  //       name: "get_fee",
  //       type: "function",
  //       inputs: [
  //         {
  //           name: "amount",
  //           type: "core::integer::u128"
  //         }
  //       ],
  //       outputs: [
  //         {
  //           type: "core::integer::u128"
  //         }
  //       ],
  //       state_mutability: "view"
  //     }
  //   ] as const,
  //   functionName: "get_fee",
  //   address: ADDRESSES.STARKNET.EXECUTOR as `0x${string}`,
  //   args: [amount_raw]
  // });

  const output = useMemo(() => {
    if (mode != InteractionMode.Bridge) {
      return {
        fee: 0n,
        amountOut: amount_raw
      }
    }
    const fee = amount_raw * 5n / 10000n; // 0.05% fee
    const amountOut = amount_raw - fee;
    return { fee, amountOut };
  }, [amount_raw]);

  // const postFeeAmount = useMemo(() => {
  //   if (mode == InteractionMode.Bridge) {
  //     ret
  //   }
  //   return amount_raw;
  // }, [output.data, amount_raw, mode]);

  // const toReturn = {
  //   amountOut: postFeeAmount,
  //   fee: output.data as bigint,
  //   ...output
  // };
  // delete toReturn.data;
  // return toReturn;
  return {
    amountOut: output.amountOut,
    fee: output.fee,
    isLoading: false,
    isSuccess: true,
    isError: false,
    isPending: false,
    isFetching: false,
    status: "success",
    error: null,
    fetchStatus: "idle",
    data: null,
  }
}
