import { useReadContract, UseReadContractResult } from "@starknet-react/core";
import { useMemo } from "react";

import { ADDRESSES } from "@lib/utils/constants";
import { useMode } from "./useMode";
import { InteractionMode } from "@lib/contexts";

// todo should define a proper output type

export type UseReadContractResult_EasyLeap = UseReadContractResult<any, any> & {
  amountOut: bigint;
  fee: bigint;
}

/**
 *
 * @param amount_raw In full decimal string format (e.g. "1000000000000000000" for 1 ETH)
 */
export function useAmountOut(amount_raw: bigint): UseReadContractResult_EasyLeap {
  const mode = useMode();
  const output = useReadContract({
    abi: [
      {
        name: "get_fee",
        type: "function",
        inputs: [
          {
            name: "amount",
            type: "core::integer::u128"
          }
        ],
        outputs: [
          {
            type: "core::integer::u128"
          }
        ],
        state_mutability: "view"
      }
    ] as const,
    functionName: "get_fee",
    address: ADDRESSES.STARKNET.EXECUTOR as `0x${string}`,
    args: [amount_raw]
  });

  const postFeeAmount = useMemo(() => {
    if (output.data && mode == InteractionMode.Bridge) {
      return BigInt(amount_raw.toString()) - BigInt(output.data.toString());
    }
    return amount_raw;
  }, [output.data, amount_raw, mode]);

  const toReturn = {
    amountOut: postFeeAmount,
    fee: output.data as bigint,
    ...output
  };
  delete toReturn.data;
  return toReturn;
}
