import { Chain as ChainSN, sepolia as sepoliaSN } from "@starknet-react/chains";
import React from "react";

import { ReviewModalProps } from "@lib/components/review-modal";
import { toast } from "@lib/hooks/use-toast";

/**
 * The mode of interaction with the Starknet DApp.
 * Bridge mode is used when the the action will be performed on source (e.g. L1) chain to bridge into Starknet
 * Starknet mode is used when the action will be performed on Starknet chain only
 * None mode is used when no action is being performed (happens when no account is connected)
 */
export enum InteractionMode {
  Bridge = "Bridge",
  Starknet = "Starknet",
  None = "None"
}

export interface ChainsConfig {
  starknet: ChainSN;
}

export interface SharedContext {
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

  sourceTransactions: any[]; // todo type
  setSourceTransactions: (value: any[]) => void;

  destinationTransactions: any[]; // todo type
  setDestinationTransactions: (value: any[]) => void;

  lastTxPollTime: number;
  setLastTxPollTime: (value: number) => void;

  switchMode: () => void;
}

const SharedStateContext = React.createContext({
  mode: InteractionMode.None,
  setMode: () => {},
  isModeSwitchedManually: false,
  setModeSwitchedManually: () => {},
  chains: {
    starknet: sepoliaSN
  },
  setChains: () => {},
  reviewModalProps: {
    isOpen: false,
    tokensIn: [],
    tokensOut: [],
    destinationDapp: {
      name: "",
      logo: ""
    },
    onContinue: () => {},
    hookProps: {
      sourceTokenInfo: undefined,
      amount: BigInt(0),
      address: "0x0",
    }
  },
  setReviewModalProps: () => {},
  connectWalletModalOpen: false,
  setConnectWalletModalOpen: () => {},

  isTxnPopoverOpen: false,
  setIsTxnPopoverOpen: () => {},

  isSuccessEVM: false,
  setIsSuccessEVM: () => {},

  sourceTransactions: [],
  setSourceTransactions: () => {},

  destinationTransactions: [],
  setDestinationTransactions: () => {},

  lastTxPollTime: 0,
  setLastTxPollTime: () => {},

  switchMode: () => {}
} as SharedContext);

export const SharedStateProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = React.useState(InteractionMode.None);
  const [isModeSwitchedManually, setModeSwitchedManually] =
    React.useState(false);
  const [chains, setChains] = React.useState<ChainsConfig>({
    starknet: sepoliaSN
  });
  const [reviewModalProps, setReviewModalProps] =
    React.useState<ReviewModalProps>({
      isOpen: false,
      tokensIn: [],
      tokensOut: [],
      destinationDapp: {
        name: "",
        logo: ""
      },
      onContinue: () => {},
      hookProps: {
        sourceTokenInfo: undefined,
        amount: BigInt(0),
        address: "0x0"
      }
    });

  const memoizedSetReviewModalProps = React.useCallback(
    (value: ReviewModalProps) => {
      console.log("Setting review modal props:", value);
      setReviewModalProps(value);
    },
    []
  );

  const [connectWalletModalOpen, setConnectWalletModalOpen] =
    React.useState(false);

  const [isTxnPopoverOpen, setIsTxnPopoverOpen] = React.useState(false);

  const [isSuccessEVM, setIsSuccessEVM] = React.useState(false);

  const [sourceTransactions, setSourceTransactions] = React.useState<any[]>([]);
  const [destinationTransactions, setDestinationTransactions] = React.useState<
    any[]
  >([]);

  const [lastTxPollTime, setLastTxPollTime] = React.useState(0);

  // only switches from Bridge to Starknet or vice versa
  const switchMode = () => {
    if (mode === InteractionMode.Bridge) {
      setMode(InteractionMode.Starknet);
      return toast({
        title: "Switched to Starknet mode",
        duration: 3000
      });
    } else if (mode === InteractionMode.Starknet) {
      setMode(InteractionMode.Bridge);
      return toast({
        title: "Switched to Bridge mode",
        duration: 3000
      });
    }
  };

  return (
    <SharedStateContext.Provider
      value={{
        mode,
        chains,
        reviewModalProps,
        setReviewModalProps: memoizedSetReviewModalProps,
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

        sourceTransactions,
        setSourceTransactions,

        destinationTransactions,
        setDestinationTransactions,

        lastTxPollTime,
        setLastTxPollTime,

        switchMode
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
