import { Chains } from "../hooks/useAccount";

export const ZERO_ADDRESS_EVM = "0x0000000000000000000000000000000000000000";

export const ADDRESSES = {
  [Chains.STARKNET]: {
    'RECEIVER': '0x1989d862bd8b045010bc9d61eccf85a164df6fb9c26cc34e2ecee93419f2e3d',
    'EXECUTOR': '0x25eeb95b5b75cb383da475eb15ecaa7a7df82df3df11039309a106264d0be66'
  },
  [Chains.ETH_MAINNET]: {
    'BRIDGE_MANAGER': '0x0f234D3fD7f1C525fA03afbF0e8c8DE8c1fF79A3'
  }
}