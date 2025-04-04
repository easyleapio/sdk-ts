import { Clock } from "lucide-react";

import { Icons } from "@lib/components/Icons";
import { Button } from "@lib/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@lib/components/ui/dialog";
import { useSharedState } from "@lib/main";

export interface TokenTransfer {
  name: string;
  amount: string;
  logo: string;
}

export interface DestinationDapp {
  name: string;
  logo: string;
}

export interface ReviewModalProps {
  isOpen: boolean;
  onClose?: () => void;
  tokensIn: TokenTransfer[];
  tokensOut: TokenTransfer[];
  destinationDapp: DestinationDapp;
  onContinue: () => void;
  needsApproval?: boolean;
  isApprovalPending?: boolean;
  isApprovalSuccess?: boolean;
  onApprove?: () => void;
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
      open={context.reviewModalProps.isOpen}
      onOpenChange={(value) => {
        if (!context.reviewModalProps.isApprovalPending) {
          context.setReviewModalProps({
            ...context.reviewModalProps,
            isOpen: value
          });
        }
      }}
    >
      <DialogTrigger className=""></DialogTrigger>

      <DialogContent
        className="easyleap-max-h-[100vh] easyleap-overflow-y-auto easyleap-overflow-x-hidden easyleap-border easyleap-border-[#675E99] easyleap-bg-white easyleap-font-dmSans easyleap-sm:easyleap-max-w-[425px] easyleap-lg:easyleap-max-h-none"
        closeClassName="text-[#B9AFF1]"
      >
        <h4 className="easyleap-text-center easyleap-text-2xl easyleap-font-normal easyleap-text-black">
          Confirmation
        </h4>

        <p className="easyleap-mt-[-2px] easyleap-text-center easyleap-text-sm easyleap-font-normal easyleap-text-black">
          You are about to perform the deposit with bridge mode.{" "}
          <br className="hidden md:block" /> Funds are automatically bridged
          from L1 to L2 and sent to <br className="hidden md:block" />{" "}
          <b className="text-white">Vesu</b> on your behalf.
        </p>

        <div
          className="easyleap-mt-5 easyleap-flex easyleap-items-center easyleap-justify-center easyleap-md:easyleap-mt-0 easyleap-md:!easyleap-gap-0"
          style={{ gap: "1rem" }}
        >
          <div className="flex flex-col items-start gap-0.5 md:mt-5">
            <p className="easyleap-flex easyleap-items-center easyleap-gap-1 easyleap-text-base easyleap-text-black">
              <Icons.ethereumLogo className="size-5 shrink-0" />
              Ethereum
            </p>
            <span className="easyleap-text-xs easyleap-text-black/60">
              Sepolia
            </span>
          </div>

          <Icons.arrowRight className="easyleap-arrowIcon" />

          <div className="flex flex-col items-start gap-0.5 md:mt-5">
            <p className="easyleap-flex easyleap-items-center easyleap-gap-1 easyleap-text-base easyleap-text-black">
              <Icons.starknetLogo className="size-5 shrink-0" />
              Starknet
            </p>
            <span className="easyleap-text-xs easyleap-text-black/60">
              Sepolia
            </span>
          </div>

          <Icons.arrowRight className="easyleap-arrowIcon" />

          <div className="easyleap-flex easyleap-items-center easyleap-justify-center">
            <span className="easyleap-flex easyleap-items-center easyleap-gap-2">
              <img
                src={context.reviewModalProps.destinationDapp.logo}
                alt={context.reviewModalProps.destinationDapp.name}
                className="size-5 shrink-0"
              />
              {context.reviewModalProps.destinationDapp.name}
            </span>
          </div>
        </div>

        <div className="easyleap-mt-7">
          <div className="easyleap-flex easyleap-flex-col easyleap-items-start easyleap-gap-3 easyleap-rounded-xl easyleap-bg-[#E6E6E6] easyleap-px-5 easyleap-py-2 easyleap-pb-4">
            <span className="easyleap-text-xs easyleap-text-black">Send</span>
            <div className="easyleap-flex easyleap-w-full easyleap-items-center easyleap-justify-between">
              <p className="easyleap-flex easyleap-items-center easyleap-gap-2 easyleap-text-base easyleap-text-black">
                {context.reviewModalProps.tokensOut.map(
                  (token: any, index: any) => (
                    <span
                      key={index}
                      className="easyleap-flex easyleap-items-center easyleap-gap-2"
                    >
                      <img
                        src={token.logo}
                        alt={token.name}
                        className="size-6 shrink-0"
                      />
                      {token.name}
                    </span>
                  )
                )}
              </p>
              <p className="easyleap-flex easyleap-items-center easyleap-gap-2 easyleap-text-base easyleap-text-black">
                {context.reviewModalProps.tokensOut.map(
                  (token: any, index: any) => getTokenItem(token, index, false)
                )}
              </p>
            </div>
          </div>

          <div className="easyleap-mt-4 easyleap-flex easyleap-flex-col easyleap-items-start easyleap-gap-3 easyleap-rounded-xl easyleap-bg-[#E6E6E6] easyleap-px-5 easyleap-py-2 easyleap-pb-4">
            <span className="easyleap-text-xs easyleap-text-black">
              Receive
            </span>
            <div className="easyleap-flex easyleap-w-full easyleap-items-center easyleap-justify-between">
              <p className="easyleap-flex easyleap-items-center easyleap-gap-2 easyleap-text-base easyleap-text-black">
                {context.reviewModalProps.tokensIn.map(
                  (token: any, index: any) => (
                    <span
                      key={index}
                      className="easyleap-flex easyleap-items-center easyleap-gap-2"
                    >
                      <img
                        src={token.logo}
                        alt={token.name}
                        className="size-6 shrink-0"
                      />
                      {token.name}
                    </span>
                  )
                )}
              </p>
              <p className="easyleap-flex easyleap-items-center easyleap-gap-2 easyleap-text-green-600">
                {context.reviewModalProps.tokensIn.map(
                  (token: any, index: any) => getTokenItem(token, index, true)
                )}
              </p>
            </div>
          </div>

          <div className="easyleap-mt-7 easyleap-flex easyleap-flex-col easyleap-items-start easyleap-gap-1 easyleap-rounded-xl easyleap-bg-[#E6E6E6] easyleap-px-5 easyleap-py-4">
            <div className="easyleap-flex easyleap-w-full easyleap-items-center easyleap-justify-between easyleap-text-xs">
              <p className="easyleap-flex easyleap-items-center easyleap-gap-2 easyleap-text-black/60">
                Estimated transaction time:
              </p>
              <p className="easyleap-flex easyleap-items-center easyleap-gap-1 easyleap-text-black/60">
                3min <Clock className="size-3" />
              </p>
            </div>

            <div className="easyleap-flex easyleap-w-full easyleap-items-center easyleap-justify-between easyleap-text-xs">
              <p className="easyleap-flex easyleap-items-center easyleap-gap-2 easyleap-text-black/60">
                Service fees (by Easyleap.io):
              </p>
              <p className="easyleap-flex easyleap-items-center easyleap-gap-2 easyleap-text-black/60">
                0.05%
              </p>
            </div>
          </div>

          <Button
            onClick={
              context.reviewModalProps.needsApproval &&
              !context.reviewModalProps.isApprovalSuccess
                ? context.reviewModalProps.onApprove
                : context.reviewModalProps.onContinue
            }
            className="easyleap-mt-5 easyleap-h-11 easyleap-w-full easyleap-rounded-[40px] easyleap-bg-[#2F2F2F] easyleap-px-6 easyleap-text-white"
            disabled={context.reviewModalProps.isApprovalPending}
          >
            {context.reviewModalProps.isApprovalPending ? (
              <div className="easyleap-flex easyleap-items-center easyleap-justify-center easyleap-gap-2">
                <div className="easyleap-h-4 easyleap-w-4 easyleap-animate-spin easyleap-rounded-full easyleap-border-2 easyleap-border-white easyleap-border-t-transparent"></div>
                Approving...
              </div>
            ) : !context.reviewModalProps.isApprovalSuccess &&
              context.reviewModalProps.needsApproval ? (
              "Approve"
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
