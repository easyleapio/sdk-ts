"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

import { Icons } from "./Icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAccount } from "../../lib/hooks/useAccount";
import { useBalance } from "../../lib/hooks/useBalance";
import { useAmountOut } from "../../lib/hooks/useAmountOut";
import { Call, CallData } from "starknet";
import { ADDRESSES } from "../../lib/utils/constants";
import { useSendTransaction } from "../../lib/hooks/useSendTransaction";
import { TokenTransfer } from "@lib/components/connect/review-modal";

const formSchema = z.object({
  depositAmount: z.string().refine(
    (v) => {
      const n = Number(v);
      return !isNaN(n) && v?.length > 0 && n > 0;
    },
    { message: "Invalid input" },
  ),
});

export type FormValues = z.infer<typeof formSchema>;

const VesuDeposit: React.FC = () => {
  const { addressSource, addressDestination } = useAccount();

  const balanceInfo = useBalance({
    l2TokenAddress:
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: {
      depositAmount: "",
    },
    mode: "onChange",
  });

  const rawAmount = useMemo(() => {
    return BigInt(Math.round(Number(form.getValues("depositAmount")) * 1e18).toFixed(0))
  }, [form.getValues("depositAmount")]);
  const amountOutRes = useAmountOut(rawAmount);

  const handleQuickDepositPrice = (percentage: number) => {
    if (!addressSource || !addressDestination) {
      return toast({
        description: (
          <div className="flex items-center gap-2">
            <Info className="size-5" />
            Please connect your wallet
          </div>
        ),
      });
    }

    if (balanceInfo?.data?.formatted && percentage === 100) {
      if (Number(balanceInfo?.data?.formatted) < 1) {
        form.setValue("depositAmount", "0");
        form.clearErrors("depositAmount");
        return;
      }
      form.setValue(
        "depositAmount",
        (Number(balanceInfo?.data?.formatted) - 1).toString(),
      );
      form.clearErrors("depositAmount");
      return;
    }
    if (balanceInfo?.data) {
      form.setValue(
        "depositAmount",
        ((Number(balanceInfo?.data?.formatted) * percentage) / 100).toString(),
      );
      form.clearErrors("depositAmount");
    }
  };

  const { send, error } = useSendTransaction({
    calls: getCalls(amountOutRes.amountOut, addressDestination),
    bridgeConfig: {
      l2_token_address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      amount: rawAmount,
    }
  }) 

  useEffect(() => {
    console.log("useSendTransaction error", error);
    if (error) {
      toast({
        description: (
          <div className="flex items-center gap-2">
            <Info className="size-5" />
            {error.message}
          </div>
        ),
      });
    }
  }, [error]);

  const onSubmit = async (values: FormValues) => {
    if (Number(values.depositAmount) > Number(balanceInfo?.data?.formatted)) {
      return toast({
        description: (
          <div className="flex items-center gap-2">
            <Info className="size-5" />
            Insufficient balance
          </div>
        ),
      });
    }

    // Deposit calls
    const tokensOut: TokenTransfer[] = [{
      name: "ETH",
      amount: (Number(rawAmount) / 1e18).toFixed(4),
      logo: "https://app.strkfarm.com/zklend/icons/tokens/eth.svg?w=20"
    }];
    const tokensIn: TokenTransfer[] = [{
      name: "vETH",
      amount: (Number(amountOutRes.amountOut) / 1e18).toFixed(4),
      logo: "https://app.strkfarm.com/zklend/icons/tokens/eth.svg?w=20"
    }];
    send(tokensIn, tokensOut);
  };
  return (
    <>
      <div className="items-center flex flex-col gap-2">
        <span className="text-3xl text-white/80">Deposit to</span>
        <Icons.vesuNamedLogo />
      </div>
      <p className="text-[grey] mt-24">This popup showcases the option to perform a one-step ETH deposit into Vesu (Sepolia) using either Bridge Mode or Starknet Mode.</p>
      <div className="mt-5 flex w-full flex-col items-start rounded-md bg-[#3E3970] px-5 py-4 lg:gap-2">
      
        <div className="flex flex-1 flex-col items-start">
          <p className="text-xs text-white/80">I will deposit</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full gap-2"
            >
              <FormField
                control={form.control}
                name="depositAmount"
                render={({ field }) => (
                  <FormItem className="relative mt-1 space-y-1">
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="h-fit border-none px-0 pr-1 text-2xl text-white shadow-none outline-none placeholder:text-white/70 focus-visible:ring-0 lg:pr-0 lg:!text-3xl"
                          placeholder="0.123"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="absolute -bottom-5 left-0 text-xs lg:left-1" />
                  </FormItem>
                )}
              />
              <div className="flex flex-col items-end gap-0.5 text-xs font-medium text-white/60 lg:text-sm">
                <div className="flex flex-row-reverse items-center gap-1">
                  <Icons.wallet className="size-3 lg:size-4" />
                  <span className="hidden md:block">Balance</span>
                </div>
                <span className="font-bold text-orange-500">
                  {balanceInfo?.data?.formatted
                    ? Number(balanceInfo?.data?.formatted).toFixed(2)
                    : "0"}{" "}
                  ETH
                </span>
              </div>
            </form>
          </Form>
        </div>

        <div className="mt-7 flex w-full flex-col items-end">
          <div className="hidden w-full items-center justify-between gap-2 text-white/80 lg:flex">
            <button
              onClick={() => handleQuickDepositPrice(25)}
              className="w-full rounded-md border border-indigo-400 px-2 py-1 text-sm font-semibold hover:bg-indigo-400 hover:text-white"
            >
              25%
            </button>

            <button
              onClick={() => handleQuickDepositPrice(50)}
              className="w-full rounded-md border border-indigo-400 px-2 py-1 text-sm font-semibold hover:bg-indigo-400 hover:text-white"
            >
              50%
            </button>
            <button
              onClick={() => handleQuickDepositPrice(75)}
              className="w-full rounded-md border border-indigo-400 px-2 py-1 text-sm font-semibold hover:bg-indigo-400 hover:text-white"
            >
              75%
            </button>
            <button
              onClick={() => handleQuickDepositPrice(100)}
              className="w-full rounded-md border border-indigo-400 px-2 py-1 text-sm font-semibold hover:bg-indigo-400 hover:text-white"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 w-full">
        <Button
          type="submit"
          disabled={
            Number(form.getValues("depositAmount")) <= 0 ||
            isNaN(Number(form.getValues("depositAmount")))
              ? true
              : false
          }
          onClick={form.handleSubmit(onSubmit)}
          style={{
            background:
              "linear-gradient(180deg, #7151EB 0%, #C078FF 100%), radial-gradient(29.19% 139.29% at 51.96% 8.93%, #80A6FC 0%, rgba(113, 81, 235, 0) 100%)",
          }}
          className="w-full rounded-lg text-sm font-semibold text-white disabled:opacity-50"
        >
          Deposit
        </Button>
      </div>
      {/* <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <Dialog.Title className="DialogTitle">Connect</Dialog.Title>
                    <div>
                        <div style={{width: '50%', float: 'left'}}>
                            <h3>Connect Starknet</h3>
                            <p>{addressDestination ? `Connected: ${addressDestination}` : "Not connected"}</p>
                        </div>
                        <div style={{width: '50%', float: 'left'}}>
                            <h3>Connect EVM</h3>
                            <p>{addressSource ? `Connected: ${addressSource}` : "Not connected"}</p>
                        </div>
                    </div>
            <Dialog.Close asChild>
              <button className="IconButton" aria-label="Close">
                X
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root> */}
      <div className="text-[grey]">Amount you get: {(Number(amountOutRes.amountOut) / 1e18).toFixed(8)} ETH</div>
      <div className="text-[grey]">Service Fee: {(Number(amountOutRes.fee) / 1e18).toFixed(8)} ETH</div>
    </>
  );
};

export default VesuDeposit;


function getCalls(postBridgeFeeAmount: bigint, user: string | undefined): Call[] {
  if (!user) {
    return []
  }
  const SEPOLIA_SN_ETH = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
  const SEPOLIA_VESU_ETH = '0x07809bb63f557736e49ff0ae4a64bd8aa6ea60e3f77f26c520cb92c24e3700d3'
  const SEPOLIA_vETH = '0x01ceb6db3ac889e2c0d2881eff602117c340316e55436f37699d91c193ee8aa0'

  const call1: Call = {
    contractAddress: SEPOLIA_SN_ETH,
    entrypoint: 'transfer',
    // receiver is some random address to simulate spend of bridged ETH
    calldata: CallData.compile(["0x01BAe0e3cd91E0096bF2283d98390Bd29579B39C93964C1D2a3EEC8d5cf51C61", postBridgeFeeAmount, 0])
  };

  const call2: Call = {
    contractAddress: SEPOLIA_VESU_ETH,
    entrypoint: 'mint',
    // actually no need to use executor anyway, just using for this hacky demo
    // cause vesu supported ETH and bridge ETH are different
    calldata: CallData.compile([ADDRESSES.STARKNET.EXECUTOR, postBridgeFeeAmount, 0]),
  };

  const call3: Call = {
    contractAddress: SEPOLIA_VESU_ETH,
    entrypoint: 'approve',
    calldata: CallData.compile([SEPOLIA_vETH, postBridgeFeeAmount, 0])
  };

  const call4: Call = {
    contractAddress: SEPOLIA_vETH,
    entrypoint: 'deposit',
    calldata: CallData.compile([postBridgeFeeAmount, 0, user])
  };

  return [call1, call2, call3, call4];
}