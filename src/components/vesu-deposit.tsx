"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import React from "react";
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
import { useAccount } from "@/hooks/useAccount";
import { useBalance } from "@/hooks/useBalance";

import { Icons } from "./Icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
  };
  return (
    <>
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
    </>
  );
};

export default VesuDeposit;
