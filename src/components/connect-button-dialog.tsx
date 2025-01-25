import {
  useConnect as useConnectSN,
  useDisconnect as useDisconnectSN,
} from "@starknet-react/core";
import { MailIcon, X } from "lucide-react";
import React, { useEffect } from "react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { cn, shortAddress } from "../../lib/utils";

import { Icons } from "./Icons";
import { Switch } from "./ui/switch";
import { useAccount } from "../../lib/hooks/useAccount";
import useMode from "../../lib/hooks/useMode";
import { InteractionMode, useSharedState } from "../../lib/hooks/SharedState";

const ConnectButtonDialog: React.FC = () => {
  const mode = useMode();
  const sharedState = useSharedState();
  const { addressSource, addressDestination } = useAccount();

  const { disconnect: disconnectSN } = useDisconnectSN();
  const { disconnect: disconnectWagmi } = useDisconnectWagmi();

  const { connector } = useConnectSN();

  useEffect(() => {
    console.log("useAccount22 mode", mode)
  }, [mode])

  // todo need to figure out a way to make it generic
  const getWalletIcon = (walletId: string) => {
    switch (walletId) {
      // Starknet wallets
      case "braavos":
        return <Icons.braavos className="size-5" />;
      case "argentX":
        return <Icons.argentX className="size-5" />;
      case "argentWebWallet":
        return <MailIcon className="size-5" />;
      case "keplr":
        return <Icons.keplr className="size-5" />;
      case "argent-mobile":
        return <Icons.argentMobile className="size-5" />;

      // EVM wallets
      case "metamask":
        return <Icons.metamask className="size-5" />;
      case "coinbase wallet":
        return <Icons.metamask className="size-5" />;
      case "subwallet":
        return <Icons.metamask className="size-5" />;
      case "trust":
        return <Icons.trust className="size-5" />;
      case "Rainbow":
        return <Icons.rainbow className="size-5" />;
      case "phantom":
        return <Icons.phantom className="size-5" />;
      case "walletconnect":
        return <Icons.phantom className="size-5" />;

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
            className="w-full rounded-xl border border-[#211d31] bg-[#b5abdf] px-2 py-1"
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
              <span className="rounded-full bg-white p-1">
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
      <ul className="space-y-4">
        {connectors.map((connector) => (
          <li
            key={connector.id}
            className="w-full rounded-lg bg-[#b5abdf] px-4 py-2"
          >
            <button
              onClick={() => connect({ connector })}
              className="flex w-full items-center justify-between"
            >
              {connector.name}
              <div className="rounded-full bg-white p-1">
                {getWalletIcon(connector.id)}
              </div>
            </button>
          </li>
        ))}
      </ul>
    );
  }

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
  }, [addressSource, addressDestination]);

  const connectedEvmWalletName = localStorage.getItem("STARKPULL_WALLET_EVM");

  return (
    <div
      className={cn("z-10 rounded-2xl", {
        "bg-[#d4cfe9] py-2 pl-5 pr-3": addressSource || addressDestination,
      })}
    >
      <Dialog>
        <div className="flex items-center gap-4">
          <DialogTrigger asChild>
            <div className="font-firaCode">
              {!addressSource && !addressDestination && (
                <Button
                  variant="outline"
                  className="rounded-[20px] text-center"
                >
                  Connect wallet
                </Button>
              )}

              {mode == InteractionMode.Starknet && (
                <Button className="mx-auto flex w-fit items-center justify-start gap-3 rounded-2xl border-2 border-[#211d31] bg-[#b5abdf] font-medium text-[#211d31] hover:bg-[#9489c2]">
                  <span className="rounded-full bg-[#fff] p-1">
                    {getWalletIcon(connector?.id ?? "braavos")}
                  </span>
                  {shortAddress(addressDestination || '', 8, 8)}
                </Button>
              )}

              {mode == InteractionMode.Bridge && (
                <div className="mx-auto flex w-fit cursor-pointer items-center justify-center -space-x-[2.6rem] rounded-lg font-medium text-[#211d31]">
                  <Button className="z-20 flex w-fit scale-110 items-center justify-start gap-3 rounded-xl border-2 border-[#211d31] bg-[#b5abdf] text-[#211d31] hover:bg-[#9489c2]">
                    <span className="rounded-full bg-[white] p-1">
                      {connectedEvmWalletName &&
                        getWalletIcon(connectedEvmWalletName.toLowerCase())}
                    </span>
                    {shortAddress(addressSource, 4, 4)}
                  </Button>

                  <Button className="z-0 flex w-fit items-center justify-start gap-3 rounded-xl bg-[#b9b3d3] text-#211d31/70 hover:bg-[#b9b3d3]/50">
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
                      sharedState.setMode(value ? InteractionMode.Bridge : InteractionMode.Starknet);
                      sharedState.setModeSwitchedManually(true);
                    }}
                    className="h-9 w-28 border-2 border-[#211d31] !bg-[#b5abdf] font-firaCode"
                  />
                </TooltipTrigger>
                {
                  <TooltipContent className="mr-5 mt-2 max-w-[20rem] border border-[#211d31] !bg-[#b5abdf] px-4 py-2 text-[#211d31]">
                    <p>Switch to Bridge mode to deposit directly from
                    ETH Mainnet into your starknet wallet in a single step.</p>
                    <br/>
                    <p>This dApp supports in-app bridge mode, powered by<span> </span>
                    <a href="https://easyleap.io/" className="underline">easyleap.io.</a></p> 
                  </TooltipContent>
                }
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <DialogContent className="max-h-[100vh] overflow-y-auto overflow-x-hidden font-dmSans sm:max-w-[425px] lg:max-h-none">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-normal">
              Connect To
              <br />{" "}
              <span className="font-semibold">
                EVM and Starknet
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex w-full flex-col items-start justify-center gap-6">
            <div className="mt-1 w-full">
              {!addressDestination ? (
                <SNWalletOptions />
              ) : (
                <div className="mt-5 flex flex-col items-start gap-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Connected to {connector?.name}
                  </p>
                  <Button className="flex w-full items-center justify-between rounded-lg bg-[#b5abdf] !font-firaCode font-medium text-[#211d31] hover:bg-[#9489c2] [&_svg]:pointer-events-auto">
                    <div className="flex items-center justify-start gap-3">
                      <span className="rounded-full bg-[#fff] p-1">
                        {getWalletIcon(connector?.id ?? "braavos")}
                      </span>
                      {shortAddress(addressDestination, 14, 14)}
                    </div>

                    <X
                      className="size-4 text-[#3F6870]"
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
              <h5 className="text-center text-base font-medium text-black">
                Optional
              </h5>
              <p className="mt-1 text-center text-sm font-normal text-muted-foreground">
                Link your EVM wallet to transfer L1 tokens seamlessly into
                the DApp!
              </p>

              {!addressSource ? (
                <Accordion type="single" collapsible className="mt-5 w-full">
                  <AccordionItem
                    value="evm-wallets"
                    className="mt-2 rounded-lg bg-[#f1f1f1] px-4 py-3"
                  >
                    <AccordionTrigger hideChevron className="w-full py-0">
                      <div className="flex w-full items-center justify-between">
                        EVM Wallets
                        <div className="flex items-center -space-x-[0.8rem]">
                          <div className="rounded-full border bg-white p-1">
                            <Icons.phantom className="size-5" />
                          </div>
                          <div className="rounded-full border bg-white p-1">
                            <Icons.rainbow className="size-5" />
                          </div>
                          <div className="rounded-full border bg-white p-1">
                            <Icons.trust className="size-5" />
                          </div>
                          <div className="rounded-full border bg-white p-1">
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
                  <p className="text-xs font-medium text-muted-foreground">
                    Connected to {connectedEvmWalletName}
                  </p>
                  <Button className="flex w-full items-center justify-between rounded-lg bg-[#b5abdf] !font-firaCode font-medium text-[#211d31] hover:bg-[#9489c2] [&_svg]:pointer-events-auto">
                    <div className="flex items-center justify-start gap-3">
                      <span className="rounded-full bg-[white] p-1">
                        {connectedEvmWalletName &&
                          getWalletIcon(connectedEvmWalletName.toLowerCase())}
                      </span>
                      {shortAddress(addressSource, 14, 14)}
                    </div>

                    <X
                      className="size-4 text-[#3F6870]"
                      onClick={() => {
                        disconnectWagmi();
                      }}
                    />
                  </Button>
                </div>
              )}

              {(addressSource || addressDestination) && (
                <DialogTrigger className="mt-8 w-full">
                  <Button className="w-full rounded-lg bg-[#b5abdf] font-medium text-[#211d31] hover:bg-[#9489c2]">
                    Done
                  </Button>
                </DialogTrigger>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConnectButtonDialog;
