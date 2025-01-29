import { Clock } from "lucide-react";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { useSharedState } from "../../main";

export interface TokenTransfer {
  name: string;
  amount: string;
  logo: string;
}

export interface ReviewModalProps {
  isOpen: boolean;
  onClose?: () => void;
  tokensIn: TokenTransfer[];
  tokensOut: TokenTransfer[];
  onContinue: () => void;
}

export function ReviewModal() {
  const context = useSharedState();

  function getTokenItem(token: TokenTransfer, index: number, isIn: boolean) {
    return (
      <li key={index} className="flex w-full items-center gap-1">
        <span>
          {isIn ? "+" : "-"}
          {token.amount} {token.name}
        </span>
        <img
          src={token.logo}
          alt={token.name}
          style={{ width: "20px", height: "20px", marginLeft: "5px" }}
        />
      </li>
    );
  }

  return (
    <Dialog
      // reviewModalProps state wasn't updating this way so had to create a new separate state
      // open={context.reviewModalProps.isOpen}
      // onOpenChange={(value) => {
      //   context.setReviewModalProps({
      //     ...context.reviewModalProps,
      //     isOpen: !value,
      //   });
      // }}
      open={context.reviewModalProps.isOpen}
      onOpenChange={(value) => {
        context.setReviewModalProps({
          ...context.reviewModalProps,
          isOpen: value,
        });
      }}
    >
      <DialogTrigger className="invisible"></DialogTrigger>

      <DialogContent
        className="max-h-[100vh] overflow-y-auto overflow-x-hidden border border-[#675E99] bg-[#1C182B] font-dmSans sm:max-w-[425px] lg:max-h-none"
        closeClassName="text-[#B9AFF1]"
      >
        <h4 className="text-center text-2xl font-normal text-[#B9AFF1]">
          Confirmation
        </h4>

        <p className="-mt-2 text-center text-sm font-normal text-[#EDDFFDCC]">
          You are about to perform the deposit with bridge mode. <br /> Funds
          are automatically bridged from L1 to L2 and sent to <br />{" "}
          <b className="text-white">Vesu</b> on your behalf.
        </p>

        <div className="flex items-center justify-between">
          <div className="mt-5 flex flex-col items-start gap-0.5">
            <p className="flex items-center gap-1 text-base text-[#B9AFF1]">
              <img
                src="/tokens/eth.svg"
                alt="eth logo"
                className="size-5 shrink-0"
              />
              Ethereum
            </p>
            <span className="text-xs text-[#EDDFFDCC]">Sepolia</span>
          </div>

          <Icons.arrowRight />

          <div className="mt-5 flex flex-col items-start gap-0.5">
            <p className="flex items-center gap-1 text-base text-[#B9AFF1]">
              <img
                src="/tokens/strk.svg"
                alt="strk logo"
                className="size-5 shrink-0"
              />
              Starknet
            </p>
            <span className="text-xs text-[#EDDFFDCC]">Sepolia</span>
          </div>

          <Icons.arrowRight />

          <div className="flex items-center justify-center">
            <Icons.vesuNamedLogo />
          </div>
        </div>

        <div className="mt-7">
          <div className="flex flex-col items-start gap-3 rounded-xl bg-[#B9AFF108] px-5 py-2 pb-4">
            <span className="text-xs text-[#EDDFFDCC]">Send</span>
            <div className="flex w-full items-center justify-between">
              <p className="flex items-center gap-2 text-base text-[#B9AFF1]">
                <img
                  src="/tokens/eth.svg"
                  alt="eth logo"
                  className="size-7 shrink-0"
                />
                Ethereum
              </p>
              <p className="flex items-center gap-2 text-base text-[#B9AFF1]">
                {context.reviewModalProps.tokensOut.map((token, index) =>
                  getTokenItem(token, index, false),
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-start gap-3 rounded-xl bg-[#B9AFF108] px-5 py-2 pb-4">
            <span className="text-xs text-[#EDDFFDCC]">Receive</span>
            <div className="flex w-full items-center justify-between">
              <p className="flex items-center gap-2 text-base text-[#B9AFF1]">
                <img
                  src="/tokens/strk.svg"
                  alt="strk logo"
                  className="size-7 shrink-0"
                />
                Starknet
              </p>
              <p
                className="flex items-center gap-2 text-base"
                style={{ color: "#38EF7D" }}
              >
                {context.reviewModalProps.tokensIn.map((token, index) =>
                  getTokenItem(token, index, true),
                )}
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col items-start gap-1 rounded-xl bg-[#B9AFF108] px-5 py-4">
            <div className="flex w-full items-center justify-between text-xs">
              <p className="flex items-center gap-2 text-[#B9AFF1]">
                Estimated transaction time
              </p>
              <p className="flex items-center gap-1 text-[#B9AFF1]">
                3min <Clock className="size-3" />
              </p>
            </div>

            <div className="flex w-full items-center justify-between text-xs">
              <p className="flex items-center gap-2 text-[#B9AFF1]">
                Service fees
              </p>
              <p className="flex items-center gap-2 text-[#B9AFF1]">
                0.00000
                <img
                  src="/tokens/eth.svg"
                  alt="eth logo"
                  className="size-3 shrink-0"
                />
              </p>
            </div>

            <div className="flex w-full items-center justify-between text-xs">
              <p className="flex items-center gap-2 text-[#B9AFF1]">Gas fees</p>
              <p className="flex items-center gap-2 text-[#B9AFF1]">$1.0</p>
            </div>
          </div>

          <Button
            onClick={context.reviewModalProps.onContinue}
            style={{
              background:
                "linear-gradient(180deg, #7151EB 0%, #C078FF 100%), radial-gradient(29.19% 139.29% at 51.96% 8.93%, #80A6FC 0%, rgba(113, 81, 235, 0) 100%)",
            }}
            className="mt-5 h-11 w-full rounded-[40px] px-6 text-white"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
