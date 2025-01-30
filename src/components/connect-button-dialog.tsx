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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import apolloClient from "@/hooks/apollo-client";
import { TXN_QUERY } from "@/hooks/queries";
import { toast, useToast } from "@/hooks/use-toast";

import { InteractionMode, useSharedState } from "../../lib/hooks/SharedState";
import { useAccount } from "../../lib/hooks/useAccount";
import useMode from "../../lib/hooks/useMode";
import { cn, shortAddress, standariseAddress } from "../../lib/utils";
import { Icons } from "./Icons";
import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";

const ConnectButtonDialog: React.FC = () => {
  const [sourceTxns, setSourceTxns] = React.useState<any>([]);
  const [destinationTxns, setDestinationTxns] = React.useState<any>([]);

  // const [respectiveDestinationTxn, setRespectiveDestinationTxn] =
  // React.useState<any>({});

  const mode = useMode();
  const sharedState = useSharedState();
  const { addressSource, addressDestination } = useAccount();

  const { disconnect: disconnectSN } = useDisconnectSN();
  const { disconnect: disconnectWagmi } = useDisconnectWagmi();

  const { dismiss } = useToast();

  const { connector } = useConnectSN();

  // todo need to figure out a way to make it generic
  const getWalletIcon = (walletId: string) => {
    switch (walletId) {
      // Starknet wallets
      case "braavos":
        return <Icons.braavos className="size-3" />;
      case "argentX":
        return <Icons.argentX className="size-[18px]" />;
      case "argentWebWallet":
        return <MailIcon className="size-3" />;
      case "keplr":
        return <Icons.keplr className="size-3" />;
      case "argent-mobile":
        return <Icons.argentMobile className="size-3" />;

      // EVM wallets
      case "metamask":
        return <Icons.metamask className="size-3" />;
      case "coinbase wallet":
        return <Icons.metamask className="size-3" />;
      case "subwallet":
        return <Icons.metamask className="size-3" />;
      case "trust":
        return <Icons.trust className="size-3" />;
      case "Rainbow":
        return <Icons.rainbow className="size-3" />;
      case "phantom":
        return <Icons.phantom className="size-3" />;
      case "walletconnect":
        return <Icons.phantom className="size-3" />;

      default:
        return null;
    }
  };

  function EVMWalletOptions() {
    const { connectors, connect } = useConnectWagmi();

    return (
      <ul className="space-y-2">
        {connectors.map((connector) => (
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

    return (
      <ul className="space-y-2.5">
        {connectors.map((connector) => (
          <li
            key={connector.id}
            className="flex h-[2.69rem] w-full items-center rounded-lg border border-[#B9AFF133] px-3 py-1 text-sm text-[#B9AFF1]"
          >
            <button
              onClick={() => connect({ connector })}
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
    const txn = destinationTxns.find(
      (destTxn: any) => destTxn.request_id === srcTxn.request_id,
    );

    console.log(txn, "txnnnnnn");

    if (!txn) {
      return {
        status: "pending",
      };
    }

    return txn as any;
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

  React.useEffect(() => {
    if (!addressDestination) {
      return;
    }

    (async () => {
      try {
        const { data } = await apolloClient.query({
          query: TXN_QUERY,
          variables: {
            where: {
              receiver: {
                equals: standariseAddress(addressDestination),
                // equals:
                //   "0x54d159fa98b0f67b3d3b287aae0340bf595d8f2a96ed99532785aeef08c1ede",
              },
            },
            findManyDestinationRequestsWhere2: {
              l2_owner: {
                equals: standariseAddress(addressDestination),
                // equals:
                //   "0x54d159fa98b0f67b3d3b287aae0340bf595d8f2a96ed99532785aeef08c1ede",
              },
            },
          },
        });

        setSourceTxns(data.findManySource_requests.reverse());
        setDestinationTxns(data.findManyDestination_requests.reverse());
      } catch (error) {
        console.error("GraphQL Error:", error);
        throw error;
      }
    })();
  }, [addressDestination]);

  console.log(sourceTxns, "sourceTxns");
  console.log(destinationTxns, "destination");

  const connectedEvmWalletName = localStorage.getItem("STARKPULL_WALLET_EVM");

  return (
    <div
      className={cn(
        "z-10 flex flex-col items-center gap-4 rounded-2xl md:flex-row",
        {
          "bg-[#1C182B] py-2 pl-5 pr-3": addressSource || addressDestination,
        },
      )}
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
                  className="rounded-[20px] border bg-transparent text-center text-white hover:bg-transparent hover:text-white"
                >
                  Connect wallet
                </Button>
              )}

              {mode == InteractionMode.Starknet && (
                <Button className="mx-auto flex w-fit items-center justify-start gap-3 rounded-xl border-2 border-[#443f54] bg-transparent font-medium text-[#B9AFF1] hover:bg-transparent">
                  <span className="rounded-full bg-[#fff] p-1">
                    {getWalletIcon(connector?.id ?? "braavos")}
                  </span>
                  {shortAddress(addressDestination || "", 8, 8)}
                </Button>
              )}

              {mode == InteractionMode.Bridge && (
                <div className="mx-auto flex w-fit cursor-pointer items-center justify-center -space-x-[2.6rem] rounded-lg">
                  <Button className="z-20 flex w-fit scale-110 items-center justify-start gap-3 rounded-xl border-2 border-[#b5abdf] bg-[#1C182B] text-[#b5abdf] shadow-xl shadow-[#1C182B] hover:bg-[#1C182B]">
                    <span className="rounded-full bg-[white] p-1">
                      {connectedEvmWalletName &&
                        getWalletIcon(connectedEvmWalletName.toLowerCase())}
                    </span>
                    {shortAddress(addressSource, 4, 4)}
                  </Button>

                  <Button className="z-0 flex w-fit items-center justify-start gap-3 rounded-xl bg-[#35314F] font-semibold text-[#9183E9] hover:bg-[#35314F]">
                    {shortAddress(addressDestination, 4, 4)}
                    <span className="rounded-full bg-[#fff] p-1">
                      {getWalletIcon(connector?.id ?? "braavos")}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </DialogTrigger>

          {(addressDestination || addressSource) && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Switch
                    id="airplane-mode"
                    checked={mode == InteractionMode.Bridge}
                    onCheckedChange={(value) => {
                      if (!addressSource) {
                        return toast({
                          title: "Connect EVM wallet to enable bridge mode",
                        });
                      }
                      sharedState.setMode(
                        value
                          ? InteractionMode.Bridge
                          : InteractionMode.Starknet,
                      );
                      sharedState.setModeSwitchedManually(true);
                    }}
                    className={cn(
                      "h-9 w-28 border-2 border-[#b5abdf] font-firaCode",
                      {
                        "border-[#443f54]": mode == InteractionMode.Starknet,
                      },
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent className="mr-5 mt-2 max-w-[20rem] border border-[#211d31] !bg-[#b5abdf] px-4 py-2 text-[#211d31]">
                  <p>
                    Switch to Bridge mode to deposit directly from ETH Mainnet
                    into your starknet wallet in a single step.
                  </p>
                  <br />
                  <p>
                    This dApp supports in-app bridge mode, powered by
                    <span> </span>
                    <a href="https://easyleap.io/" className="underline">
                      easyleap.io.
                    </a>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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
              {destinationTxns.filter((txn: any) => txn.status === "pending")
                .length > 0 && (
                <div className="absolute -right-0 -top-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 p-1 text-[9px] font-semibold text-white">
                  {
                    destinationTxns.filter(
                      (txn: any) => txn.status === "pending",
                    ).length
                  }
                </div>
              )}

              {!sharedState.isSuccessEVM && (
                <div className="rounded-full bg-[#35314F] p-2">
                  <Icons.historyIcon className="shrink-0" />
                </div>
              )}

              {sharedState.isSuccessEVM &&
                getDestinationTxn(sourceTxns[0]).status === "" && (
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
                getDestinationTxn(sourceTxns[0]).status === "pending" && (
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
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M5.8501 4.47986C7.5501 3.14986 9.68009 2.35986 12.0001 2.35986C14.2701 2.35986 16.3601 3.12985 18.0401 4.40985"
                        stroke="#B9AFF1"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.75 21.6399C17.75 20.8399 19.5 19.3899 20.66 17.3799C21.8 15.4099 22.18 13.2199 21.91 11.1299"
                        stroke="#1C182B"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.25 21.6399C6.25 20.8399 4.49999 19.3899 3.33999 17.3799C2.19999 15.4099 1.81999 13.2199 2.08999 11.1299"
                        stroke="#1C182B"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M5.8501 4.47986C7.5501 3.14986 9.68009 2.35986 12.0001 2.35986C14.2701 2.35986 16.3601 3.12985 18.0401 4.40985"
                        stroke="#38EF7D"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.75 21.6399C17.75 20.8399 19.5 19.3899 20.66 17.3799C21.8 15.4099 22.18 13.2199 21.91 11.1299"
                        stroke="#38EF7D"
                        stroke-opacity="0.5"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12 17C14.75 17 17 14.75 17 12C17 9.25 14.75 7 12 7C9.25 7 7 9.25 7 12C7 14.75 9.25 17 12 17Z"
                        stroke="#1C182B"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.875 12L11.29 13.415L14.125 10.585"
                        stroke="#1C182B"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                )}

              {sharedState.isSuccessEVM &&
                getDestinationTxn(sourceTxns[0]).status === "confirmed" && (
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
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M5.84961 4.47986C7.54961 3.14986 9.6796 2.35986 11.9996 2.35986C14.2696 2.35986 16.3596 3.12985 18.0396 4.40985"
                        stroke="#38EF7D"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.75 21.6399C17.75 20.8399 19.5 19.3899 20.66 17.3799C21.8 15.4099 22.18 13.2199 21.91 11.1299"
                        stroke="#38EF7D"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12 17C14.75 17 17 14.75 17 12C17 9.25 14.75 7 12 7C9.25 7 7 9.25 7 12C7 14.75 9.25 17 12 17Z"
                        stroke="#38EF7D"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.875 12L11.29 13.415L14.125 10.585"
                        stroke="#38EF7D"
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
                {sourceTxns.map((txn: any, i: any) => (
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
                              Ethereum {txn?.request_id}
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
                              Transaction Completed
                              <Icons.externalLinkIcon className="transition-all group-hover:brightness-125" />
                            </p>
                          </a>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default ConnectButtonDialog;
