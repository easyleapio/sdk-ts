import { DialogHeader } from "@/components/ui/dialog";
import { DialogContent, DialogTitle, Dialog, DialogPortal } from "../../utils/dialog";
import { DialogOverlay } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
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
    return <li key={index} className="flex w-full">
      <span>{isIn ? "+" : "-"}{token.amount} {token.name}</span><img src={token.logo} alt={token.name} style={{width: "20px", height: "20px", marginLeft: "5px"}}/>
    </li>;
  }

  return <Dialog open={context.reviewModalProps.isOpen}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          className="max-h-[100vh] overflow-y-auto overflow-x-hidden border border-indigo-400 bg-[#211D31] font-dmSans sm:max-w-[475px] lg:max-h-none"
        >
          <DialogHeader className="text-white/80">
            <DialogTitle className="flex flex-col items-center gap-2 text-center font-normal text-white/80">
              You are about to perform the deposit with bridge mode. Funds are automatically bridged from L1 to L2 and sent to the dApp on your behalf.
            </DialogTitle>
            <div>
              <b>Tokens out:</b>
              <ul>
                {context.reviewModalProps.tokensOut.map((token, index) => (
                  getTokenItem(token, index, false)
                ))}
              </ul>
            </div>
            <div>
              <b>Tokens in:</b>
              <ul>
                {context.reviewModalProps.tokensIn.map((token, index) => (
                  getTokenItem(token, index, true)
                ))}
              </ul>
            </div>
            <div><b>Estimated transaction time:</b> 3min</div>
            <Button onClick={context.reviewModalProps.onContinue}>Continue</Button>
          </DialogHeader>
        </DialogContent>
      </DialogPortal>
    </Dialog>;
}