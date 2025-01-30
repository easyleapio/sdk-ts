import { standariseAddress } from "../utils";
import { useAccount } from "./useAccount";
import { TXN_QUERY } from "@/hooks/queries";
import apolloClient from "@/hooks/apollo-client";
import { useSharedState } from "./SharedState";
import { useEffect } from "react";

/**
* Merge two arrays of transactions, removing duplicates
* Priortises arr2 over arr1
 * @param arr1 
 * @param arr2 
 * @returns 
 */
export function mergeArrays(arr1: any[], arr2: any[]) {
  const map = new Map(arr2.map((item: any) => [item.txHash, item]));

  arr1.forEach(item => {
    if (!map.has(item.txHash)) {
      map.set(item.txHash, item);
    }
  });

  const data = Array.from(map.values());
  console.log("Merged arrays", arr1, arr2, data);
  return data;
}

export function useTransactionHistory(addressDestination: string | undefined, pollingTimeMs = 5000) {
  const context = useSharedState();

  useEffect(() => {
    let isMounted = true;

    const pollData = async () => {
      const now = new Date().getTime();
      if ((now - context.lastTxPollTime) < pollingTimeMs) {
        return;
      }
      console.log("Polling data", new Date(), new Date(context.lastTxPollTime));
      if (!addressDestination) {
        context.setSourceTransactions([]);
        context.setDestinationTransactions([]);
        return;
      }

      try {
        const { data } = await apolloClient.query({
          query: TXN_QUERY,
          variables: {
            where: {
              receiver: {
                equals: standariseAddress(addressDestination),
                // equals:
                //   "0x54d159fa98b0f67b3d3b287aae0340bf595d8f2a96ed99532785aeef08c1ede",
              },
            },
            findManyDestinationRequestsWhere2: {
              l2_owner: {
                equals: standariseAddress(addressDestination),
                // equals:
                //   "0x54d159fa98b0f67b3d3b287aae0340bf595d8f2a96ed99532785aeef08c1ede",
              },
            },
          },
        });

        const finalSourceTxs = mergeArrays(context.sourceTransactions, data.findManySource_requests.reverse())
          .sort((a, b) => b.timestamp - a.timestamp);
        const finalDestinationTxs = mergeArrays(context.destinationTransactions, data.findManyDestination_requests.reverse())
          .sort((a, b) => b.timestamp - a.timestamp);
        context.setSourceTransactions(finalSourceTxs);
        context.setDestinationTransactions(finalDestinationTxs);
        context.setLastTxPollTime(now);
      } catch (error) {
        console.error("GraphQL Error:", error);
        throw error;
      }

      if (isMounted) {
        setTimeout(pollData, pollingTimeMs);
      }
    };

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [addressDestination, pollingTimeMs]);
}