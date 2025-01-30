import { ReviewModalProps } from "@lib/components/connect/review-modal";
import { Chain as ChainSN, sepolia as sepoliaSN } from "@starknet-react/chains";
import React, { createContext } from "react";

/**
 * The mode of interaction with the Starknet DApp.
 * Bridge mode is used when the the action will be performed on source (e.g. L1) chain to bridge into Starknet
 * Starknet mode is used when the action will be performed on Starknet chain only
 * None mode is used when no action is being performed (happens when no account is connected)
 */
export enum InteractionMode {
  Bridge = "Bridge",
  Starknet = "Starknet",
  None = "None",
}

export interface ChainsConfig {
  starknet: ChainSN;
}

interface SharedContext {
  mode: InteractionMode;
  setMode: (value: InteractionMode) => void;
  isModeSwitchedManually: boolean;
  setModeSwitchedManually: (value: boolean) => void;
  chains: ChainsConfig;
  setChains: (value: ChainsConfig) => void;
  reviewModalProps: ReviewModalProps;
  setReviewModalProps: (value: ReviewModalProps) => void;
  connectWalletModalOpen: boolean;
  setConnectWalletModalOpen: (value: boolean) => void;

  isTxnPopoverOpen: boolean;
  setIsTxnPopoverOpen: (value: boolean) => void;

  isSuccessEVM: boolean;
  setIsSuccessEVM: (value: boolean) => void;
}

const SharedStateContext = createContext({
  mode: InteractionMode.None,
  setMode: () => {},
  isModeSwitchedManually: false,
  setModeSwitchedManually: () => {},
  chains: {
    starknet: sepoliaSN,
  },
  setChains: () => {},
  reviewModalProps: {
    isOpen: false,
    tokensIn: [],
    tokensOut: [],
    onContinue: () => {},
  },
  setReviewModalProps: () => {},
  connectWalletModalOpen: false,
  setConnectWalletModalOpen: () => {},

  isTxnPopoverOpen: false,
  setIsTxnPopoverOpen: () => {},

  isSuccessEVM: false,
  setIsSuccessEVM: () => {},
} as SharedContext);

export const SharedStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = React.useState(InteractionMode.None);
  const [isModeSwitchedManually, setModeSwitchedManually] =
    React.useState(false);
  const [chains, setChains] = React.useState<ChainsConfig>({
    starknet: sepoliaSN,
  });
  const [reviewModalProps, setReviewModalProps] =
    React.useState<ReviewModalProps>({
      isOpen: false,
      tokensIn: [],
      tokensOut: [],
      onContinue: () => {},
    });

  const [connectWalletModalOpen, setConnectWalletModalOpen] =
    React.useState(false);

  const [isTxnPopoverOpen, setIsTxnPopoverOpen] = React.useState(false);

  const [isSuccessEVM, setIsSuccessEVM] = React.useState(false);

  return (
    <SharedStateContext.Provider
      value={{
        mode,
        chains,
        reviewModalProps,
        setReviewModalProps,
        setChains,
        setMode,
        isModeSwitchedManually,
        setModeSwitchedManually,
        connectWalletModalOpen,
        setConnectWalletModalOpen,
        isTxnPopoverOpen,
        setIsTxnPopoverOpen,

        isSuccessEVM,
        setIsSuccessEVM,
      }}
    >
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  const context = React.useContext(SharedStateContext);

  if (!context) {
    throw new Error("useSharedState must be used within a SharedStateProvider");
  }

  return context;
};
