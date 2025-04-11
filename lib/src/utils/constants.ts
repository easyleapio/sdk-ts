import { Chains } from "@lib/hooks/useAccount";

export const ZERO_ADDRESS_EVM = "0x0000000000000000000000000000000000000000";

export const ADDRESSES = {
  [Chains.STARKNET]: {
    RECEIVER:
      "0x4f5033eee9e31bc32c71a48849d97743de5229bf9b9a099f15db3e6758e1ce9",
    EXECUTOR:
      "0x7982df3d605fb36e6269c620d647c959c5e49836ae82c398fa7d1675d0d22bf"
  },
  [Chains.ETH_MAINNET]: {
    BRIDGE_MANAGER: "0x2B7f5d9982d4f7AD67Adb0F7a29D2147E78572ac"
  }
};

export const SOURCE_FEE_ETH = 0.0001;
export const MESSAGE_FEE_ETH = 0.001;

export const EASYLEAP_EXPLORER = "https://sepolia.explorer.easyleap.io/"