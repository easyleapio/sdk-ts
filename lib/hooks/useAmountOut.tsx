import { useReadContract } from "@starknet-react/core";
import { useMemo } from "react";

import { ADDRESSES } from "@lib/utils/constants";

/**
 *
 * @param amount_raw In full decimal string format (e.g. "1000000000000000000" for 1 ETH)
 */
export function useAmountOut(amount_raw: bigint) {
  const output = useReadContract({
    abi: [
      {
        name: "get_fee",
        type: "function",
        inputs: [
          {
            name: "amount",
            type: "core::integer::u128",
          },
        ],
        outputs: [
          {
            type: "core::integer::u128",
          },
        ],
        state_mutability: "view",
      },
    ] as const,
    functionName: "get_fee",
    address: ADDRESSES.STARKNET.EXECUTOR as `0x${string}`,
    args: [amount_raw],
  });

  const postFeeAmount = useMemo(() => {
    if (output.data) {
      return BigInt(amount_raw.toString()) - BigInt(output.data.toString());
    }
    return amount_raw;
  }, [output.data, amount_raw]);

  const toReturn = {
    amountOut: postFeeAmount,
    fee: output.data as bigint,
    ...output,
  };
  delete toReturn.data;
  return toReturn;
}
