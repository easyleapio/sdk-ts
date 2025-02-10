import React, { useEffect } from "react";

import apolloClient from "~/hooks/apollo-client";
import { TXN_QUERY } from "~/hooks/queries";
import { standariseAddress } from "~/utils";

import { useSharedState } from "./SharedState";

/**
 * Merge two arrays of transactions, removing duplicates
 * Priortises arr2 over arr1
 * @param arr1
 * @param arr2
 * @returns
 */
export function mergeSortArrays(arr1: any[], arr2: any[]) {
  const map = new Map(arr2.map((item: any) => [item.txHash, item]));

  arr1.forEach((item) => {
    if (!map.has(item.txHash)) {
      map.set(item.txHash, item);
    }
  });

  const data = Array.from(map.values()).sort(
    (a, b) => b.timestamp - a.timestamp,
  );
  console.log("Merged arrays", arr1, arr2, data);
  return data;
}

export function useTransactionHistory(
  addressDestination: string | undefined,
  pollingTimeMs = 5000,
) {
  const context = useSharedState();

  const [localSourceTransactions, setLocalSourceTransactions] = React.useState<
    any[]
  >([]);
  const [localDestinationTransactions, setLocalDestinationTransactions] =
    React.useState<any[]>([]);

  useEffect(() => {
    console.log("sourcee", context.sourceTransactions.length, new Date());
  }, [context.sourceTransactions]);

  useEffect(() => {
    const merged = mergeSortArrays(
      context.sourceTransactions,
      localSourceTransactions,
    );
    console.log(
      "sourcee change1",
      context.sourceTransactions.length,
      localSourceTransactions.length,
      merged.length,
      merged[0],
      new Date(),
    );
    context.setSourceTransactions(merged);
  }, [localSourceTransactions]);

  useEffect(() => {
    // console.log('sourcee change2', context.destinationTransactions.length, localDestinationTransactions.length, new Date());
    context.setDestinationTransactions(
      mergeSortArrays(
        context.destinationTransactions,
        localDestinationTransactions,
      ),
    );
  }, [localDestinationTransactions]);

  useEffect(() => {
    let isMounted = true;

    const pollData = async () => {
      const now = new Date().getTime();
      if (now - context.lastTxPollTime < pollingTimeMs) {
        return;
      }
      console.log("Polling data", new Date(), new Date(context.lastTxPollTime));
      if (!addressDestination) {
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

        const finalSourceTxs = mergeSortArrays(
          context.sourceTransactions,
          data.findManySource_requests.reverse(),
        );
        const finalDestinationTxs = mergeSortArrays(
          context.destinationTransactions,
          data.findManyDestination_requests.reverse(),
        );
        setLocalSourceTransactions(finalSourceTxs);
        setLocalDestinationTransactions(finalDestinationTxs);
        context.setLastTxPollTime(now);
      } catch (error) {
        console.error("GraphQL Error:", error);
        throw error;
      }

      if (isMounted) {
        console.log("Polling again in", pollingTimeMs);
        setTimeout(pollData, pollingTimeMs);
      }
    };

    pollData();

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [addressDestination, pollingTimeMs]);
}
