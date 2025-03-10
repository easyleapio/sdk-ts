import { gql } from "@apollo/client";

export const TXN_QUERY = gql`
  query FindManySource_requests(
    $where: Source_requestsWhereInput
    $findManyDestinationRequestsWhere2: Destination_requestsWhereInput
  ) {
    findManySource_requests(where: $where) {
      amount_raw
      receiver
      block_number
      chain
      cursor
      eventIndex
      request_id
      sender
      status
      timestamp
      token
      txHash
      txIndex
    }
    findManyDestination_requests(where: $findManyDestinationRequestsWhere2) {
      amount_raw
      block_number
      chain
      cursor
      eventIndex
      l2_owner
      request_id
      status
      timestamp
      token
      txHash
      txIndex
    }
  }
`;
