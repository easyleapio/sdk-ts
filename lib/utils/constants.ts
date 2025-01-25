import { Chains } from "../hooks/useAccount";

export const ZERO_ADDRESS_EVM = "0x0000000000000000000000000000000000000000";

export const ADDRESSES = {
  [Chains.STARKNET]: {
    'RECEIVER': '0x7ff7ab2241b087f35ca116cc1a3ce218e36234a1a0a1937250c73eeca20b389',
    'EXECUTOR': '0x1bd99991c7923b3853c19c55f7562bbac369be8d72d03e49bba9f9d4e5420c2'
  },
  [Chains.ETH_MAINNET]: {
    'BRIDGE_MANAGER': '0x54636479410d630F72da478Ed85371dDcaE7666a'
  }
}