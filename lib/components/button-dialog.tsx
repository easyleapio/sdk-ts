import {
  useConnect as useConnectSN,
  useDisconnect as useDisconnectSN,
} from "@starknet-react/core";
import { format } from "date-fns";
import { Loader2, MailIcon, X } from "lucide-react";
import React from "react";
import {
  useConnect as useConnectWagmi,
  useDisconnect as useDisconnectWagmi,
} from "wagmi";

import { Icons } from "~/components/Icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { InteractionMode, useSharedState } from "~/contexts/SharedState";
import { useTheme } from "~/contexts/ThemeContext";
import { toast, useToast } from "~/hooks/use-toast";
import { useAccount } from "~/hooks/useAccount";
import useMode from "~/hooks/useMode";
import { cn, shortAddress } from "~/utils";

import { ModeSwitcher, type ConnectButtonProps } from ".";

const ButtonDialog: React.FC<ConnectButtonProps> = ({
  onConnectStarknet,
  onDisconnectStarknet,
  onConnectEVM,
  onDisconnectEVM,
  className,
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
    walletconnect: { Icon: Icons.wallet, size: "size-3" },
  };

  const getWalletIcon = (walletId: string) => {
    const wallet = walletIconMap[walletId];

    return wallet ? (
      <wallet.Icon key={walletId} className={wallet.size || "size-3"} />
    ) : null;
  };

  function EVMWalletOptions() {
    const { connectors, connect } = useConnectWagmi();

    const uniqueConnectors = connectors.filter(
      (connector, index, self) =>
        index === self.findIndex((c) => c.name === connector.name),
    );

    return (
      <ul className="space-y-2">
        {uniqueConnectors.map((connector) => (
          <li
            key={connector.uid}
            className="flex w-full items-center rounded-xl border border-[#B9AFF11A] px-3 py-1"
          >
            <button
              onClick={() => {
                if (!addressDestination)
                  return toast({
                    title: "Connect Starknet wallet first",
                  });
                connect({ connector });
                onConnectEVM?.();
                localStorage.setItem("STARKPULL_WALLET_EVM", connector.name);
              }}
              className="flex w-full items-center justify-between text-xs"
            >
              {connector.name}
              <span className="rounded-full border border-[#B9AFF11A] bg-[#211D31] p-1">
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
        index === self.findIndex((c) => c.name === connector.name),
    );

    return (
      <ul className="space-y-2.5">
        {uniqueConnectors.map((connector) => (
          <li
            key={connector.id}
            className="flex h-[2.69rem] w-full items-center rounded-lg border border-[#B9AFF133] px-3 py-1 text-sm text-[#B9AFF1]"
          >
            <button
              onClick={() => {
                connect({ connector });
                onConnectStarknet?.();
              }}
              className="flex w-full items-center justify-between"
            >
              {connector.name}
              <div
                className={cn(
                  "rounded-full border border-[#B9AFF133] bg-transparent p-1",
                  {
                    "p-0": connector.id === "argentX",
                  },
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
      (destTxn: any) => destTxn.request_id === srcTxn.request_id,
    );

    if (!txn) {
      return {
        status: "pending",
      };
    }

    return txn as any;
  };

  const getPendingTxnCount = () => {
    const requestIdsSet = new Set(
      sharedState.destinationTransactions.map((item) => item.request_id),
    );
    const pendingTxns = sharedState.sourceTransactions.filter(
      (item) => !requestIdsSet.has(item.request_id),
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
          "Starknet and EVM wallets are linked. move L1 funds to this dApp.",
      });
    }

    if (addressSource && !addressDestination) {
      disconnectWagmi();
      onDisconnectEVM?.();
    }

    if (mode === InteractionMode.Bridge) {
      dismiss();
      toast({
        title: "Bridge mode is enabled",
      });
    } else {
      dismiss();
    }
  }, [addressSource, addressDestination, mode]);

  const connectedEvmWalletName = localStorage.getItem("STARKPULL_WALLET_EVM");

  return (
    <div
      className={cn(
        "z-10 flex flex-col items-center gap-4 rounded-2xl md:flex-row",
        {
          "py-2 pl-5 pr-3": addressSource || addressDestination,
        },
      )}
      style={{
        backgroundColor:
          mode === InteractionMode.Starknet
            ? theme?.starknetMode?.mainBgColor
            : theme?.bridgeMode?.mainBgColor,
      }}
    >
      <Dialog
        open={sharedState.connectWalletModalOpen}
        onOpenChange={sharedState.setConnectWalletModalOpen}
      >
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <DialogTrigger asChild>
            <div className="w-full font-firaCode">
              {!addressSource && !addressDestination && (
                <Button
                  variant="outline"
                  style={{
                    color: theme?.noneMode?.color,
                    backgroundColor: theme?.noneMode?.backgroundColor,
                    border: theme?.noneMode?.border,
                  }}
                  className={cn(
                    "rounded-[20px] bg-transparent text-center hover:bg-transparent hover:text-white",
                    className,
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
                    borderRadius: theme?.starknetMode?.button?.borderRadius,
                  }}
                  className={cn(
                    "mx-auto flex w-fit items-center justify-start gap-3 font-medium hover:bg-transparent",
                    className,
                  )}
                >
                  <span className="rounded-full bg-[#fff] p-1">
                    {getWalletIcon(connector?.id ?? "braavos")}
                  </span>
                  {shortAddress(addressDestination || "", 8, 8)}
                </Button>
              )}

              {mode == InteractionMode.Bridge && (
                <div
                  className={cn(
                    "mx-auto flex w-fit cursor-pointer items-center justify-center -space-x-[2.6rem] rounded-lg",
                    className,
                  )}
                >
                  <Button
                    style={{
                      color: theme?.bridgeMode?.evmButton?.color,
                      backgroundColor:
                        theme?.bridgeMode?.evmButton?.backgroundColor,
                      border: theme?.bridgeMode?.evmButton?.border,
                      borderRadius: theme?.bridgeMode?.evmButton?.borderRadius,
                    }}
                    className="z-20 flex w-fit scale-110 items-center justify-start gap-3 rounded-xl shadow-xl shadow-[#1C182B] hover:bg-[#1C182B]"
                  >
                    <span className="rounded-full bg-[white] p-1">
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
                        theme?.bridgeMode?.starknetButton?.borderRadius,
                    }}
                    className={cn(
                      "z-0 flex w-fit items-center justify-start gap-3 rounded-xl font-semibold hover:bg-[#35314F]",
                      className,
                    )}
                  >
                    {shortAddress(addressDestination, 4, 4)}
                    <span className="rounded-full bg-[#fff] p-1">
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
          className="max-h-[100vh] overflow-y-auto overflow-x-hidden border border-[#675E99] bg-[#211D31] p-2 py-4 font-dmSans sm:max-w-[425px] md:p-6 lg:max-h-none"
          closeClassName="text-[#B9AFF1]"
        >
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-normal text-[#B9AFF1]">
              Connect To
              <br />{" "}
              <span className="font-bold text-white">EVM and Starknet</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex w-full flex-col items-start justify-center gap-6">
            <div className="mt-1 w-full">
              {!addressDestination ? (
                <SNWalletOptions />
              ) : (
                <div className="mt-5 flex flex-col items-start gap-2">
                  <p className="text-xs font-medium text-[#EDDFFDCC]/60">
                    Connected to {connector?.name}
                  </p>
                  <Button className="flex w-[98.2%] items-center rounded-lg bg-[#b5abdf] !font-firaCode font-semibold text-black hover:bg-[#9489c2] md:w-full md:justify-between [&_svg]:pointer-events-auto">
                    <div className="flex items-center justify-start gap-3">
                      <span
                        className={cn("rounded-full bg-black p-1", {
                          "p-0": connector?.id === "argentX",
                        })}
                      >
                        {getWalletIcon(connector?.id ?? "braavos")}
                      </span>
                      {shortAddress(addressDestination, 14, 14)}
                    </div>

                    <X
                      className="size-4 text-black"
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

            <div className="mt-3 w-full">
              <h5 className="text-center text-base font-medium text-[#B9AFF1]">
                Optional
              </h5>
              <p className="mt-1 text-center text-sm font-normal text-[#EDDFFDCC]">
                Link your EVM wallet to transfer L1 tokens seamlessly <br />{" "}
                into the DApp!
              </p>

              {!addressSource ? (
                <Accordion type="single" collapsible className="mt-5 w-full">
                  <AccordionItem
                    value="evm-wallets"
                    className="mt-2 rounded-xl border border-[#B9AFF133] bg-transparent px-4 py-2 text-[#B9AFF1]"
                  >
                    <AccordionTrigger hideChevron className="w-full py-0">
                      <div className="flex w-full items-center justify-between">
                        EVM Wallets
                        <div className="flex items-center -space-x-[0.8rem]">
                          <div className="rounded-full border border-[#B9AFF11A] bg-[#211D31] p-1">
                            <Icons.phantom className="size-5" />
                          </div>
                          <div className="rounded-full border border-[#B9AFF11A] bg-[#211D31] p-1">
                            <Icons.rainbow className="size-5" />
                          </div>
                          <div className="rounded-full border border-[#B9AFF11A] bg-[#211D31] p-1">
                            <Icons.trust className="size-5" />
                          </div>
                          <div className="rounded-full border border-[#B9AFF11A] bg-[#211D31] p-1">
                            <Icons.metamask className="size-5" />
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="mt-5 pb-0">
                      <EVMWalletOptions />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <div className="mt-7 flex flex-col items-start gap-2">
                  <p className="text-xs font-medium text-[#EDDFFDCC]/60">
                    Connected to {connectedEvmWalletName}
                  </p>

                  <Button className="flex w-[98.2%] items-center justify-between rounded-lg bg-[#b5abdf] !font-firaCode font-semibold text-black hover:bg-[#9489c2] md:w-full [&_svg]:pointer-events-auto">
                    <div className="flex items-center justify-start gap-3">
                      <span className="rounded-full bg-black p-1">
                        {connectedEvmWalletName &&
                          getWalletIcon(connectedEvmWalletName.toLowerCase())}
                      </span>
                      {shortAddress(addressSource, 14, 14)}
                    </div>

                    <X
                      className="size-4 text-black"
                      onClick={() => {
                        disconnectWagmi();
                        onDisconnectEVM?.();
                      }}
                    />
                  </Button>
                </div>
              )}

              {(addressSource || addressDestination) && (
                <DialogTrigger className="mt-8 w-[98.2%] md:w-full">
                  <Button className="w-full rounded-lg bg-[#b5abdf] font-semibold text-black hover:bg-[#9489c2]">
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
          <PopoverTrigger className="relative">
            <>
              {getPendingTxnCount() > 0 && (
                <div className="absolute -right-0 -top-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 p-1 text-[9px] font-semibold text-white">
                  {getPendingTxnCount()}
                </div>
              )}

              {!sharedState.isSuccessEVM && (
                <div className="rounded-full bg-[#35314F] p-2">
                  <Icons.historyIcon className="shrink-0" />
                </div>
              )}

              {sharedState.isSuccessEVM &&
                getDestinationTxn(sharedState.sourceTransactions[0]).status ===
                  "" && (
                  <div
                    className={cn("rounded-full", {
                      "animate-pulse bg-green-500 p-px":
                        sharedState.isSuccessEVM,
                    })}
                  >
                    <div className="rounded-full bg-[#35314F] p-2">
                      <Icons.historyIcon className="shrink-0" />
                    </div>
                  </div>
                )}

              {sharedState.isSuccessEVM &&
                getDestinationTxn(sharedState.sourceTransactions[0]).status ===
                  "pending" && (
                  <div className="rounded-full bg-[#35314F] p-2">
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
                  <div className="rounded-full bg-[#35314F] p-2">
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
          <PopoverContent className="mr-[5.37rem] mt-4 w-[484px] border border-[#675E99] bg-[#1C182B] px-8 py-6 font-dmSans">
            <h4 className="flex w-full items-center justify-between text-lg font-bold text-[#DADADA]">
              Bridge transaction history
              <Icons.crossIcon
                className="cursor-pointer"
                onClick={() => sharedState.setIsTxnPopoverOpen(false)}
              />
            </h4>

            <ScrollArea className="mt-5 h-[40vh]">
              <Accordion type="single" collapsible>
                {sharedState.sourceTransactions.map((txn: any, i: any) => (
                  <AccordionItem
                    key={i}
                    value={`txn-${i + 1}`}
                    className="mt-2 rounded-xl border-0 bg-[#B9AFF108] px-4 py-2 text-[#B9AFF1]"
                  >
                    <AccordionTrigger
                      className="w-full items-start px-2.5 py-1 hover:no-underline"
                      customChevron={<Icons.chevronIcon className="size-5" />}
                    >
                      <div className="flex w-full flex-col items-center gap-6">
                        <div className="flex w-full items-center gap-8">
                          <div className="flex flex-col items-start gap-0.5">
                            <p className="flex items-center gap-1 text-base text-[#B9AFF1]">
                              <img
                                src="/tokens/eth.svg"
                                alt="eth logo"
                                className="size-5 shrink-0"
                              />
                              Ethereum
                            </p>
                            <span className="text-xs text-[#EDDFFDCC]">
                              Sepolia
                            </span>
                          </div>

                          <Icons.arrowRight className="!rotate-0" />

                          <div className="flex flex-col items-start gap-0.5">
                            <p className="flex items-center gap-1 text-base text-[#B9AFF1]">
                              <img
                                src="/tokens/strk.svg"
                                alt="strk logo"
                                className="size-5 shrink-0"
                              />
                              Starknet
                            </p>
                            <span className="text-xs text-[#EDDFFDCC]">
                              Sepolia
                            </span>
                          </div>
                        </div>

                        <div className="flex w-full items-center justify-between text-xs text-[#EDDFFDCC]">
                          {format(
                            new Date(txn?.timestamp * 1000),
                            "dd MMM, yyyy h:mm a",
                          )}

                          {getDestinationTxn(txn)?.status === "pending" && (
                            <div className="-mr-5 text-nowrap rounded-full bg-[#261A8DCC] p-1 px-2 text-[10px] text-[#B9AFF1]">
                              Pending Submission
                            </div>
                          )}

                          {getDestinationTxn(txn)?.status === "confirmed" && (
                            <div className="-mr-5 flex items-center gap-2">
                              <div className="text-nowrap rounded-full bg-[#38EF7D80] p-1 px-2 text-[10px] text-[#000]">
                                Success
                              </div>
                              <a
                                href={`https://sepolia.etherscan.io/tx/${txn.txHash}`}
                                target="_blank"
                                className="rounded-3xl bg-[#35314F] p-1"
                              >
                                <Icons.externalLinkIcon className="size-4" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="mx-5 mt-4 border-t border-[#675E9933]">
                      <div className="mt-5 flex items-center justify-start gap-3">
                        <div className="flex flex-col items-center justify-center gap-3">
                          {txn?.status === "pending" && (
                            <Loader2 className="size-6 animate-spin" />
                          )}
                          {txn?.status === "confirmed" && (
                            <Icons.checkIcon className="size-6" />
                          )}

                          {getDestinationTxn(txn)?.status === "pending" && (
                            <>
                              <div className="h-6 w-px rounded-full bg-[#675E9933]" />
                              <Loader2 className="size-6 animate-spin" />
                              <div className="h-6 w-px rounded-full bg-[#675E9933]" />
                              <Loader2 className="size-6 animate-spin" />
                            </>
                          )}

                          {getDestinationTxn(txn)?.status === "confirmed" && (
                            <>
                              <div className="h-6 w-px rounded-full bg-[#675E9933]" />
                              <Icons.checkIcon className="size-6" />
                              <div className="h-6 w-px rounded-full bg-[#675E9933]" />
                              <Icons.checkIcon className="size-6" />
                            </>
                          )}
                        </div>

                        <div className="flex flex-col items-start gap-6">
                          <a
                            href={`https://sepolia.etherscan.io/tx/${txn?.txHash}`}
                            target="_blank"
                            className="group flex cursor-pointer flex-col items-start gap-1"
                          >
                            <p
                              className={cn(
                                "flex items-center gap-2 text-base text-[#B9AFF1]",
                                {
                                  "font-bold text-white":
                                    txn?.status === "confirmed",
                                },
                              )}
                            >
                              Initiated transfer from EVM wallet{" "}
                              <Icons.externalLinkIcon className="transition-all group-hover:brightness-125" />
                            </p>
                            <span className="text-xs text-[#EDDFFDCC]">
                              The deposit was submitted on Ethereum.
                            </span>
                          </a>

                          <div className="group flex flex-col items-start gap-1">
                            <p
                              className={cn(
                                "flex items-center gap-2 text-base text-[#B9AFF1]",
                                {
                                  "font-bold text-white":
                                    getDestinationTxn(txn)?.status ===
                                    "confirmed",
                                },
                              )}
                            >
                              Bridging to Starknet
                            </p>
                            <span className="flex items-center gap-2 text-xs text-[#EDDFFDCC]">
                              Bridged {(txn?.amount_raw / 10 ** 18).toFixed(5)}
                              <Icons.ethereumLogo className="size-4" />
                            </span>
                          </div>

                          <a
                            href={`https://sepolia.voyager.online/tx/${getDestinationTxn(txn)?.txHash}`}
                            target="_blank"
                            className="group mt-2 flex cursor-pointer flex-col items-start gap-1"
                          >
                            <p
                              className={cn(
                                "flex items-center gap-2 text-base text-[#B9AFF1]",
                                {
                                  "font-bold text-white":
                                    getDestinationTxn(txn)?.status ===
                                    "confirmed",
                                },
                              )}
                            >
                              Deposited on Vesu
                              <Icons.externalLinkIcon className="transition-all group-hover:brightness-125" />
                            </p>
                          </a>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}

                {sharedState.sourceTransactions.length === 0 && (
                  <div className="flex h-40 w-full items-center justify-center">
                    <p className="text-[#B9AFF1]">No transactions yet</p>
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

export default ButtonDialog;
