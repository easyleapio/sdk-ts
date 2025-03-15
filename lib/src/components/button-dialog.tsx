import {
  useConnect as useConnectSN,
  useDisconnect as useDisconnectSN
} from "@starknet-react/core";
import { format } from "date-fns";
import { Loader2, MailIcon, X } from "lucide-react";
import React from "react";
import {
  useConnect as useConnectWagmi,
  useDisconnect as useDisconnectWagmi
} from "wagmi";

import { Icons } from "@lib/components/Icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@lib/components/ui/accordion";
import { Button } from "@lib/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@lib/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@lib/components/ui/popover";
import { ScrollArea } from "@lib/components/ui/scroll-area";
import { InteractionMode, useSharedState } from "@lib/contexts/SharedState";
import { useTheme } from "@lib/contexts/ThemeContext";
import { toast, useToast } from "@lib/hooks/use-toast";
import { useAccount } from "@lib/hooks/useAccount";
import { useMode } from "@lib/hooks/useMode";
import { cn, shortAddress } from "@lib/utils";

import { ModeSwitcher, type ConnectButtonProps } from ".";

export const ButtonDialog: React.FC<ConnectButtonProps> = ({
  onConnectStarknet,
  onDisconnectStarknet,
  onConnectEVM,
  onDisconnectEVM,
  className
}) => {
  const mode = useMode();
  const sharedState = useSharedState();
  const { addressSource, addressDestination } = useAccount();

  const { disconnect: disconnectSN } = useDisconnectSN();
  const { disconnect: disconnectWagmi } = useDisconnectWagmi();

  const { dismiss } = useToast();

  const { connector } = useConnectSN();

  const theme = useTheme();

  const walletIconMap: Record<
    string,
    { Icon: React.ElementType; size?: string }
  > = {
    // Starknet wallets
    braavos: { Icon: Icons.braavos, size: "size-3" },
    argentX: { Icon: Icons.argentX, size: "size-[18px]" },
    argentWebWallet: { Icon: MailIcon, size: "size-3" },
    keplr: { Icon: Icons.keplr, size: "size-3" },
    "argent-mobile": { Icon: Icons.argentMobile, size: "size-3" },

    // EVM wallets
    metamask: { Icon: Icons.metamask, size: "size-3" },
    "coinbase wallet": { Icon: Icons.coinbase, size: "size-3" },
    subwallet: { Icon: Icons.subwallet, size: "size-3" },
    trust: { Icon: Icons.trust, size: "size-3" },
    rainbow: { Icon: Icons.rainbow, size: "size-3" },
    phantom: { Icon: Icons.phantom, size: "size-3" },
    walletconnect: { Icon: Icons.wallet, size: "size-3" }
  };

  const getWalletIcon = (walletId: string) => {
    const wallet = walletIconMap[walletId];

    return wallet ? (
      <div className="easyleap">
        <wallet.Icon key={walletId} className={wallet.size || "size-3"} />
      </div>
    ) : null;
  };

  function EVMWalletOptions() {
    const { connectors, connect } = useConnectWagmi();

    const uniqueConnectors = connectors.filter(
      (connector, index, self) =>
        index === self.findIndex((c) => c.name === connector.name)
    );

    return (
      <ul className="easyleap-space-y-2">
        {uniqueConnectors.map((connector) => (
          <li
            key={connector.uid}
            className="easyleap-flex easyleap-w-full easyleap-items-center easyleap-rounded-xl easyleap-border easyleap-border-[#B9AFF11A] easyleap-px-3 easyleap-py-1"
          >
            <button
              onClick={() => {
                if (!addressDestination)
                  return toast({
                    title: "Connect Starknet wallet first"
                  });
                connect({ connector });
                onConnectEVM?.();
                localStorage.setItem("STARKPULL_WALLET_EVM", connector.name);
              }}
              className="easyleap-flex easyleap-w-full easyleap-items-center easyleap-justify-between easyleap-text-xs"
            >
              {connector.name}
              <span className="easyleap-rounded-full easyleap-border easyleap-border-[#B9AFF11A] easyleap-bg-[#211D31] easyleap-p-1">
                {getWalletIcon(connector.name.toLowerCase())}
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  }

  function SNWalletOptions() {
    const { connectors, connect } = useConnectSN();

    const uniqueConnectors = connectors.filter(
      (connector, index, self) =>
        index === self.findIndex((c) => c.name === connector.name)
    );

    return (
      <ul className="easyleap-space-y-2.5">
        {uniqueConnectors.map((connector) => (
          <li
            key={connector.id}
            className="easyleap-flex easyleap-h-[2.69rem] easyleap-w-full easyleap-items-center easyleap-rounded-lg easyleap-border easyleap-border-[#B9AFF133] easyleap-px-3 easyleap-py-1 easyleap-text-sm easyleap-text-[#B9AFF1]"
          >
            <button
              onClick={() => {
                connect({ connector });
                onConnectStarknet?.();
              }}
              className="easyleap-flex easyleap-w-full easyleap-items-center easyleap-justify-between"
            >
              {connector.name}
              <div
                className={cn(
                  "easyleap-rounded-full easyleap-border easyleap-border-[#B9AFF133] easyleap-bg-transparent easyleap-p-1",
                  {
                    "easyleap-p-0": connector.id === "argentX"
                  }
                )}
              >
                {getWalletIcon(connector.id)}
              </div>
            </button>
          </li>
        ))}
      </ul>
    );
  }

  const getDestinationTxn = (srcTxn: any) => {
    const txn = sharedState.destinationTransactions.find(
      (destTxn: any) => destTxn.request_id === srcTxn.request_id
    );

    if (!txn) {
      return {
        status: "pending"
      };
    }

    return txn as any;
  };

  const getPendingTxnCount = () => {
    const requestIdsSet = new Set(
      sharedState.destinationTransactions.map((item) => item.request_id)
    );
    const pendingTxns = sharedState.sourceTransactions.filter(
      (item) => !requestIdsSet.has(item.request_id)
    );

    return pendingTxns.length;
  };

  React.useEffect(() => {
    console.log("useAccount22 mode", mode);
  }, [mode]);

  React.useEffect(() => {
    if (addressSource && addressDestination) {
      toast({
        title: "Wallets Connected!",
        description:
          "Starknet and EVM wallets are linked. move L1 funds to this dApp."
      });
    }

    if (addressSource && !addressDestination) {
      disconnectWagmi();
      onDisconnectEVM?.();
    }

    if (mode === InteractionMode.Bridge) {
      dismiss();
      toast({
        title: "Bridge mode is enabled"
      });
    } else {
      dismiss();
    }
  }, [addressSource, addressDestination, mode]);

  const connectedEvmWalletName = localStorage.getItem("STARKPULL_WALLET_EVM");

  return (
    <div
      className={cn(
        "easyleap-z-10 easyleap-flex easyleap-flex-col easyleap-items-center easyleap-gap-4 easyleap-md:flex-row easyleap-rounded-[20px]",
        {
          "easyleap-py-2 easyleap-pl-5 easyleap-pr-3":
            addressSource || addressDestination
        }
      )}
      style={{
        backgroundColor:
          mode === InteractionMode.Starknet
            ? theme?.starknetMode?.mainBgColor
            : theme?.bridgeMode?.mainBgColor
      }}
    >
      <Dialog
        open={sharedState.connectWalletModalOpen}
        onOpenChange={sharedState.setConnectWalletModalOpen}
      >
        <div className="easyleap-flex easyleap-flex-col easyleap-items-center easyleap-md:flex-row">
          <DialogTrigger asChild>
            <div className="easyleap-w-full easyleap-font-firaCode">
              {!addressSource && !addressDestination && (
                <Button
                  variant="outline"
                  style={{
                    color: theme?.noneMode?.color,
                    backgroundColor: theme?.noneMode?.backgroundColor,
                    border: theme?.noneMode?.border
                  }}
                  className={cn(
                    "easyleap-rounded-[20px] easyleap-bg-transparent easyleap-text-center easyleap-hover:bg-transparent easyleap-hover:text-white",
                    className
                  )}
                >
                  Connect wallet
                </Button>
              )}

              {mode == InteractionMode.Starknet && (
                <Button
                  style={{
                    color: theme?.starknetMode?.button?.color,
                    backgroundColor:
                      theme?.starknetMode?.button?.backgroundColor,
                    border: theme?.starknetMode?.button?.border,
                    borderRadius: theme?.starknetMode?.button?.borderRadius
                  }}
                  className={cn(
                    "easyleap-mx-auto easyleap-flex easyleap-w-fit easyleap-items-center easyleap-justify-start easyleap-gap-3 easyleap-font-medium easyleap-hover:bg-transparent",
                    className
                  )}
                >
                  <span className="easyleap-rounded-full easyleap-bg-[#fff] easyleap-p-1">
                    {getWalletIcon(connector?.id ?? "braavos")}
                  </span>
                  {shortAddress(addressDestination || "", 8, 8)}
                </Button>
              )}

              {mode == InteractionMode.Bridge && (
                <div
                  className={cn(
                    "easyleap-mx-auto easyleap-flex easyleap-w-fit easyleap-cursor-pointer easyleap-items-center easyleap-justify-center easyleap--space-x-[2.6rem] easyleap-rounded-lg",
                    className
                  )}
                >
                  <Button
                    style={{
                      color: theme?.bridgeMode?.evmButton?.color,
                      backgroundColor:
                        theme?.bridgeMode?.evmButton?.backgroundColor,
                      border: theme?.bridgeMode?.evmButton?.border,
                      borderRadius: theme?.bridgeMode?.evmButton?.borderRadius
                    }}
                    className="easyleap-z-20 easyleap-flex easyleap-w-fit easyleap-scale-110 easyleap-items-center easyleap-justify-start easyleap-gap-3 easyleap-rounded-xl easyleap-shadow-xl easyleap-shadow-[#1C182B] easyleap-hover:bg-[#1C182B]"
                  >
                    <span className="easyleap-rounded-full easyleap-bg-[white] easyleap-p-1">
                      {connectedEvmWalletName &&
                        getWalletIcon(connectedEvmWalletName.toLowerCase())}
                    </span>
                    {shortAddress(addressSource, 4, 4)}
                  </Button>

                  <Button
                    style={{
                      color: theme?.bridgeMode?.starknetButton?.color,
                      backgroundColor:
                        theme?.bridgeMode?.starknetButton?.backgroundColor,
                      border: theme?.bridgeMode?.starknetButton?.border,
                      borderRadius:
                        theme?.bridgeMode?.starknetButton?.borderRadius
                    }}
                    className={cn(
                      "easyleap-z-0 easyleap-flex easyleap-w-fit easyleap-items-center easyleap-justify-start easyleap-gap-3 easyleap-rounded-xl easyleap-font-semibold easyleap-hover:bg-[#35314F]",
                      className
                    )}
                  >
                    {shortAddress(addressDestination, 4, 4)}
                    <span className="easyleap-rounded-full easyleap-bg-[#fff] easyleap-p-1">
                      {getWalletIcon(connector?.id ?? "braavos")}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </DialogTrigger>

          <ModeSwitcher />
        </div>

        <DialogContent
          className="easyleap-max-h-[100vh] easyleap-overflow-y-auto easyleap-overflow-x-hidden easyleap-border easyleap-border-[#675E99] easyleap-bg-[#211D31] easyleap-p-2 easyleap-font-dmSans easyleap-md:p-6 easyleap-lg:max-h-none"
          closeClassName="easyleap-text-[#B9AFF1]"
        >
          <DialogHeader>
            <DialogTitle className="easyleap-text-center easyleap-text-2xl easyleap-font-normal easyleap-text-[#B9AFF1]">
              Connect To
              <br />{" "}
              <span className="easyleap-font-bold easyleap-text-white">
                EVM and Starknet
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="easyleap-flex easyleap-w-full easyleap-flex-col easyleap-items-start easyleap-justify-center easyleap-gap-6">
            <div className="easyleap-mt-1 easyleap-w-full">
              {!addressDestination ? (
                <SNWalletOptions />
              ) : (
                <div className="easyleap-mt-5 easyleap-flex easyleap-flex-col easyleap-items-start easyleap-gap-2">
                  <p className="easyleap-text-xs easyleap-font-medium easyleap-text-[#EDDFFDCC]/60">
                    Connected to {connector?.name}
                  </p>
                  <Button className="easyleap-flex easyleap-w-[98.2%] easyleap-items-center easyleap-rounded-lg easyleap-bg-[#b5abdf] !easyleap-font-firaCode easyleap-font-semibold easyleap-text-black easyleap-hover:bg-[#9489c2] easyleap-md:w-full easyleap-md:justify-between [&_svg]:easyleap-pointer-events-auto">
                    <div className="easyleap-flex easyleap-items-center easyleap-justify-start easyleap-gap-3">
                      <span
                        className={cn(
                          "easyleap-rounded-full easyleap-bg-black easyleap-p-1",
                          {
                            "easyleap-p-0": connector?.id === "argentX"
                          }
                        )}
                      >
                        {getWalletIcon(connector?.id ?? "braavos")}
                      </span>
                      {shortAddress(addressDestination, 14, 14)}
                    </div>

                    <X
                      className="easyleap-size-4 easyleap-text-black"
                      onClick={() => {
                        disconnectSN();
                        disconnectWagmi();
                        onDisconnectEVM?.();
                        onDisconnectStarknet?.();
                      }}
                    />
                  </Button>
                </div>
              )}
            </div>

            <div className="easyleap-mt-3 easyleap-w-full">
              <h5 className="easyleap-text-center easyleap-text-base easyleap-font-medium easyleap-text-[#B9AFF1]">
                Optional
              </h5>
              <p className="easyleap-mt-1 easyleap-text-center easyleap-text-sm easyleap-font-normal easyleap-text-[#EDDFFDCC]">
                Link your EVM wallet to transfer L1 tokens seamlessly <br />{" "}
                into the DApp!
              </p>

              {!addressSource ? (
                <Accordion
                  type="single"
                  collapsible
                  className="easyleap-mt-5 easyleap-w-full"
                >
                  <AccordionItem
                    value="evm-wallets"
                    className="easyleap-mt-2 easyleap-rounded-xl easyleap-border easyleap-border-[#B9AFF133] easyleap-bg-transparent easyleap-px-4 easyleap-py-2 easyleap-text-[#B9AFF1]"
                  >
                    <AccordionTrigger
                      hideChevron
                      className="easyleap-w-full easyleap-py-0"
                    >
                      <div className="easyleap-flex easyleap-w-full easyleap-items-center easyleap-justify-between">
                        EVM Wallets
                        <div className="easyleap-flex easyleap-items-center easyleap--space-x-[0.8rem]">
                          <div className="easyleap-rounded-full easyleap-border easyleap-border-[#B9AFF11A] easyleap-bg-[#211D31] easyleap-p-1">
                            <Icons.phantom className="easyleap-size-5" />
                          </div>
                          <div className="easyleap-rounded-full easyleap-border easyleap-border-[#B9AFF11A] easyleap-bg-[#211D31] easyleap-p-1">
                            <Icons.rainbow className="easyleap-size-5" />
                          </div>
                          <div className="easyleap-rounded-full easyleap-border easyleap-border-[#B9AFF11A] easyleap-bg-[#211D31] easyleap-p-1">
                            <Icons.trust className="easyleap-size-5" />
                          </div>
                          <div className="easyleap-rounded-full easyleap-border easyleap-border-[#B9AFF11A] easyleap-bg-[#211D31] easyleap-p-1">
                            <Icons.metamask className="easyleap-size-5" />
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="easyleap-mt-5 easyleap-pb-0">
                      <EVMWalletOptions />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <div className="easyleap-mt-7 easyleap-flex easyleap-flex-col easyleap-items-start easyleap-gap-2">
                  <p className="easyleap-text-xs easyleap-font-medium easyleap-text-[#EDDFFDCC]/60">
                    Connected to {connectedEvmWalletName}
                  </p>

                  <Button className="easyleap-flex easyleap-w-[98.2%] easyleap-items-center easyleap-justify-between easyleap-rounded-lg easyleap-bg-[#b5abdf] !easyleap-font-firaCode easyleap-font-semibold easyleap-text-black easyleap-hover:bg-[#9489c2] easyleap-md:w-full [&_svg]:easyleap-pointer-events-auto">
                    <div className="easyleap-flex easyleap-items-center easyleap-justify-start easyleap-gap-3">
                      <span className="easyleap-rounded-full easyleap-bg-black easyleap-p-1">
                        {connectedEvmWalletName &&
                          getWalletIcon(connectedEvmWalletName.toLowerCase())}
                      </span>
                      {shortAddress(addressSource, 14, 14)}
                    </div>

                    <X
                      className="easyleap-size-4 easyleap-text-black"
                      onClick={() => {
                        disconnectWagmi();
                        onDisconnectEVM?.();
                      }}
                    />
                  </Button>
                </div>
              )}

              {(addressSource || addressDestination) && (
                <DialogTrigger className="easyleap-mt-8 easyleap-w-[98.2%] easyleap-md:w-full">
                  <Button className="easyleap-w-full easyleap-rounded-lg easyleap-bg-[#b5abdf] easyleap-font-semibold easyleap-text-black easyleap-hover:bg-[#9489c2]">
                    Done
                  </Button>
                </DialogTrigger>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {(addressDestination || addressDestination) && (
        <Popover
          open={sharedState.isTxnPopoverOpen}
          onOpenChange={sharedState.setIsTxnPopoverOpen}
        >
          <PopoverTrigger className="easyleap-relative">
            <>
              {getPendingTxnCount() > 0 && (
                <div className="easyleap-absolute easyleap--right-0 easyleap--top-1.5 easyleap-flex easyleap-size-4 easyleap-items-center easyleap-justify-center easyleap-rounded-full easyleap-bg-red-500 easyleap-p-1 easyleap-text-[9px] easyleap-font-semibold easyleap-text-white">
                  {getPendingTxnCount()}
                </div>
              )}

              {!sharedState.isSuccessEVM && (
                <div className="easyleap-rounded-full easyleap-bg-[#35314F] easyleap-p-2">
                  <Icons.historyIcon className="easyleap-shrink-0" />
                </div>
              )}

              {sharedState.isSuccessEVM &&
                getDestinationTxn(sharedState.sourceTransactions[0]).status ===
                  "" && (
                  <div
                    className={cn("easyleap-rounded-full", {
                      "easyleap-animate-pulse easyleap-bg-green-500 easyleap-p-px":
                        sharedState.isSuccessEVM
                    })}
                  >
                    <div className="easyleap-rounded-full easyleap-bg-[#35314F] easyleap-p-2">
                      <Icons.historyIcon className="easyleap-shrink-0" />
                    </div>
                  </div>
                )}

              {sharedState.isSuccessEVM &&
                getDestinationTxn(sharedState.sourceTransactions[0]).status ===
                  "pending" && (
                  <div className="easyleap-rounded-full easyleap-bg-[#35314F] easyleap-p-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.25 21.6399C6.25 20.8399 4.49999 19.3899 3.33999 17.3799C2.19999 15.4099 1.81999 13.2199 2.08999 11.1299"
                        stroke="#1C182B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.8501 4.47986C7.5501 3.14986 9.68009 2.35986 12.0001 2.35986C14.2701 2.35986 16.3601 3.12985 18.0401 4.40985"
                        stroke="#B9AFF1"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.75 21.6399C17.75 20.8399 19.5 19.3899 20.66 17.3799C21.8 15.4099 22.18 13.2199 21.91 11.1299"
                        stroke="#1C182B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.25 21.6399C6.25 20.8399 4.49999 19.3899 3.33999 17.3799C2.19999 15.4099 1.81999 13.2199 2.08999 11.1299"
                        stroke="#1C182B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.8501 4.47986C7.5501 3.14986 9.68009 2.35986 12.0001 2.35986C14.2701 2.35986 16.3601 3.12985 18.0401 4.40985"
                        stroke="#38EF7D"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.75 21.6399C17.75 20.8399 19.5 19.3899 20.66 17.3799C21.8 15.4099 22.18 13.2199 21.91 11.1299"
                        stroke="#38EF7D"
                        stroke-opacity="0.5"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 17C14.75 17 17 14.75 17 12C17 9.25 14.75 7 12 7C9.25 7 7 9.25 7 12C7 14.75 9.25 17 12 17Z"
                        stroke="#1C182B"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.875 12L11.29 13.415L14.125 10.585"
                        stroke="#1C182B"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}

              {sharedState.isSuccessEVM &&
                getDestinationTxn(sharedState.sourceTransactions[0]).status ===
                  "confirmed" && (
                  <div className="easyleap-rounded-full easyleap-bg-[#35314F] easyleap-p-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.25 21.6399C6.25 20.8399 4.49999 19.3899 3.33999 17.3799C2.19999 15.4099 1.81999 13.2199 2.08999 11.1299"
                        stroke="#38EF7D"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.84961 4.47986C7.54961 3.14986 9.6796 2.35986 11.9996 2.35986C14.2696 2.35986 16.3596 3.12985 18.0396 4.40985"
                        stroke="#38EF7D"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.75 21.6399C17.75 20.8399 19.5 19.3899 20.66 17.3799C21.8 15.4099 22.18 13.2199 21.91 11.1299"
                        stroke="#38EF7D"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 17C14.75 17 17 14.75 17 12C17 9.25 14.75 7 12 7C9.25 7 7 9.25 7 12C7 14.75 9.25 17 12 17Z"
                        stroke="#38EF7D"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.875 12L11.29 13.415L14.125 10.585"
                        stroke="#38EF7D"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
            </>
          </PopoverTrigger>
          <PopoverContent className="easyleap-mr-[5.37rem] easyleap-mt-4 easyleap-w-[484px] easyleap-border easyleap-border-[#675E99] easyleap-bg-[#1C182B] easyleap-px-8 easyleap-py-6 easyleap-font-dmSans">
            <h4 className="easyleap-flex easyleap-w-full easyleap-items-center easyleap-justify-between easyleap-text-lg easyleap-font-bold easyleap-text-[#DADADA]">
              Bridge transaction history
              <Icons.crossIcon
                className="easyleap-cursor-pointer"
                onClick={() => sharedState.setIsTxnPopoverOpen(false)}
              />
            </h4>

            <ScrollArea className="easyleap-mt-5 easyleap-h-[40vh]">
              <Accordion type="single" collapsible>
                {sharedState.sourceTransactions.map((txn: any, i: any) => (
                  <AccordionItem
                    key={i}
                    value={`txn-${i + 1}`}
                    className="easyleap-mt-2 easyleap-rounded-xl easyleap-border-0 easyleap-bg-[#B9AFF108] easyleap-px-4 easyleap-py-2 easyleap-text-[#B9AFF1]"
                  >
                    <AccordionTrigger
                      className="easyleap-w-full easyleap-items-start easyleap-px-2.5 easyleap-py-1 easyleap-hover:no-underline"
                      customChevron={
                        <Icons.chevronIcon className="easyleap-size-5" />
                      }
                    >
                      <div className="easyleap-flex easyleap-w-full easyleap-flex-col easyleap-items-center easyleap-gap-6">
                        <div className="easyleap-flex easyleap-w-full easyleap-items-center easyleap-gap-8">
                          <div className="easyleap-flex easyleap-flex-col easyleap-items-start easyleap-gap-0.5">
                            <p className="easyleap-flex easyleap-items-center easyleap-gap-1 easyleap-text-base easyleap-text-[#B9AFF1]">
                              <img
                                src="/tokens/eth.svg"
                                alt="eth logo"
                                className="easyleap-size-5 easyleap-shrink-0"
                              />
                              Ethereum
                            </p>
                            <span className="easyleap-text-xs easyleap-text-[#EDDFFDCC]">
                              Sepolia
                            </span>
                          </div>

                          <Icons.arrowRight className="!easyleap-rotate-0" />

                          <div className="easyleap-flex easyleap-flex-col easyleap-items-start easyleap-gap-0.5">
                            <p className="easyleap-flex easyleap-items-center easyleap-gap-1 easyleap-text-base easyleap-text-[#B9AFF1]">
                              <img
                                src="/tokens/strk.svg"
                                alt="strk logo"
                                className="easyleap-size-5 easyleap-shrink-0"
                              />
                              Starknet
                            </p>
                            <span className="easyleap-text-xs easyleap-text-[#EDDFFDCC]">
                              Sepolia
                            </span>
                          </div>
                        </div>

                        <div className="easyleap-flex easyleap-w-full easyleap-items-center easyleap-justify-between easyleap-text-xs easyleap-text-[#EDDFFDCC]">
                          {format(
                            new Date(txn?.timestamp * 1000),
                            "dd MMM, yyyy h:mm a"
                          )}

                          {getDestinationTxn(txn)?.status === "pending" && (
                            <div className="easyleap--mr-5 easyleap-text-nowrap easyleap-rounded-full easyleap-bg-[#261A8DCC] easyleap-p-1 easyleap-px-2 easyleap-text-[10px] easyleap-text-[#B9AFF1]">
                              Pending Submission
                            </div>
                          )}

                          {getDestinationTxn(txn)?.status === "confirmed" && (
                            <div className="easyleap--mr-5 easyleap-flex easyleap-items-center easyleap-gap-2">
                              <div className="easyleap-text-nowrap easyleap-rounded-full easyleap-bg-[#38EF7D80] easyleap-p-1 easyleap-px-2 easyleap-text-[10px] easyleap-text-[#000]">
                                Success
                              </div>
                              <a
                                href={`https://sepolia.etherscan.io/tx/${txn.txHash}`}
                                target="_blank"
                                className="easyleap-rounded-3xl easyleap-bg-[#35314F] easyleap-p-1"
                              >
                                <Icons.externalLinkIcon className="easyleap-size-4" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="easyleap-mx-5 easyleap-mt-4 easyleap-border-t easyleap-border-[#675E9933]">
                      <div className="easyleap-mt-5 easyleap-flex easyleap-items-center easyleap-justify-start easyleap-gap-3">
                        <div className="easyleap-flex easyleap-flex-col easyleap-items-center easyleap-justify-center easyleap-gap-3">
                          {txn?.status === "pending" && (
                            <Loader2 className="easyleap-size-6 easyleap-animate-spin" />
                          )}
                          {txn?.status === "confirmed" && (
                            <Icons.checkIcon className="easyleap-size-6" />
                          )}

                          {getDestinationTxn(txn)?.status === "pending" && (
                            <>
                              <div className="easyleap-h-6 easyleap-w-px easyleap-rounded-full easyleap-bg-[#675E9933]" />
                              <Loader2 className="easyleap-size-6 easyleap-animate-spin" />
                              <div className="easyleap-h-6 easyleap-w-px easyleap-rounded-full easyleap-bg-[#675E9933]" />
                              <Loader2 className="easyleap-size-6 easyleap-animate-spin" />
                            </>
                          )}

                          {getDestinationTxn(txn)?.status === "confirmed" && (
                            <>
                              <div className="easyleap-h-6 easyleap-w-px easyleap-rounded-full easyleap-bg-[#675E9933]" />
                              <Icons.checkIcon className="easyleap-size-6" />
                              <div className="easyleap-h-6 easyleap-w-px easyleap-rounded-full easyleap-bg-[#675E9933]" />
                              <Icons.checkIcon className="easyleap-size-6" />
                            </>
                          )}
                        </div>

                        <div className="easyleap-flex easyleap-flex-col easyleap-items-start easyleap-gap-6">
                          <a
                            href={`https://sepolia.etherscan.io/tx/${txn?.txHash}`}
                            target="_blank"
                            className="easyleap-group easyleap-flex easyleap-cursor-pointer easyleap-flex-col easyleap-items-start easyleap-gap-1"
                          >
                            <p
                              className={cn(
                                "easyleap-flex easyleap-items-center easyleap-gap-2 easyleap-text-base easyleap-text-[#B9AFF1]",
                                {
                                  "easyleap-font-bold easyleap-text-white":
                                    txn?.status === "confirmed"
                                }
                              )}
                            >
                              Initiated transfer from EVM wallet{" "}
                              <Icons.externalLinkIcon className="easyleap-transition-all easyleap-group-hover:brightness-125" />
                            </p>
                            <span className="easyleap-text-xs easyleap-text-[#EDDFFDCC]">
                              The deposit was submitted on Ethereum.
                            </span>
                          </a>

                          <div className="easyleap-group easyleap-flex easyleap-flex-col easyleap-items-start easyleap-gap-1">
                            <p
                              className={cn(
                                "easyleap-flex easyleap-items-center easyleap-gap-2 easyleap-text-base easyleap-text-[#B9AFF1]",
                                {
                                  "easyleap-font-bold easyleap-text-white":
                                    getDestinationTxn(txn)?.status ===
                                    "confirmed"
                                }
                              )}
                            >
                              Bridging to Starknet
                            </p>
                            <span className="easyleap-flex easyleap-items-center easyleap-gap-2 easyleap-text-xs easyleap-text-[#EDDFFDCC]">
                              Bridged {(txn?.amount_raw / 10 ** 18).toFixed(5)}
                              <Icons.ethereumLogo className="easyleap-size-4" />
                            </span>
                          </div>

                          <a
                            href={`https://sepolia.voyager.online/tx/${getDestinationTxn(txn)?.txHash}`}
                            target="_blank"
                            className="easyleap-group easyleap-mt-2 easyleap-flex easyleap-cursor-pointer easyleap-flex-col easyleap-items-start easyleap-gap-1"
                          >
                            <p
                              className={cn(
                                "easyleap-flex easyleap-items-center easyleap-gap-2 easyleap-text-base easyleap-text-[#B9AFF1]",
                                {
                                  "easyleap-font-bold easyleap-text-white":
                                    getDestinationTxn(txn)?.status ===
                                    "confirmed"
                                }
                              )}
                            >
                              Deposited on Vesu
                              <Icons.externalLinkIcon className="easyleap-transition-all easyleap-group-hover:brightness-125" />
                            </p>
                          </a>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}

                {sharedState.sourceTransactions.length === 0 && (
                  <div className="easyleap-flex easyleap-h-40 easyleap-w-full easyleap-items-center easyleap-justify-center">
                    <p className="easyleap-text-[#B9AFF1]">
                      No transactions yet
                    </p>
                  </div>
                )}
              </Accordion>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
