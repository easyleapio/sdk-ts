import React, { useEffect } from "react";

import apolloClient from "@lib/hooks/apollo-client";
import { TXN_QUERY } from "@lib/hooks/queries";
import { standariseAddress } from "@lib/utils";

import { useSharedState } from "../contexts/SharedState";

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
    const merged = mergeSortArrays(
      context.sourceTransactions,
      localSourceTransactions,
    );
    context.setSourceTransactions(merged);
  }, [localSourceTransactions]);

  useEffect(() => {
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
              },
            },
            findManyDestinationRequestsWhere2: {
              l2_owner: {
                equals: standariseAddress(addressDestination),
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
        throw error;
      }

      if (isMounted) {
        setTimeout(pollData, pollingTimeMs);
      }
    };

    pollData();

    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [addressDestination, pollingTimeMs]);
}
