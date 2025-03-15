import { Chains } from "@lib/hooks/useAccount";

export const ZERO_ADDRESS_EVM = "0x0000000000000000000000000000000000000000";

export const ADDRESSES = {
  [Chains.STARKNET]: {
    RECEIVER:
      "0x1989d862bd8b045010bc9d61eccf85a164df6fb9c26cc34e2ecee93419f2e3d",
    EXECUTOR:
      "0x25eeb95b5b75cb383da475eb15ecaa7a7df82df3df11039309a106264d0be66",
  },
  [Chains.ETH_MAINNET]: {
    BRIDGE_MANAGER: "0x0f234D3fD7f1C525fA03afbF0e8c8DE8c1fF79A3",
  },
};

export function getConfig() {
  return {
    evm: {
      l1Manager: "0x2B7f5d9982d4f7AD67Adb0F7a29D2147E78572ac"
    },
    starknet: {
      executor:
        "0x7982df3d605fb36e6269c620d647c959c5e49836ae82c398fa7d1675d0d22bf",
      receiver:
        "0x4f5033eee9e31bc32c71a48849d97743de5229bf9b9a099f15db3e6758e1ce9"
    }
  };
}

