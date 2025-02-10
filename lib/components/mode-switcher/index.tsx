import { Switch } from "~/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { InteractionMode, useSharedState } from "~/hooks";
import { toast } from "~/hooks/use-toast";
import { useAccount } from "~/hooks/useAccount";
import useMode from "~/hooks/useMode";
import { cn } from "~/utils";

export const ModeSwitcher = () => {
  const { addressDestination, addressSource } = useAccount();

  const sharedState = useSharedState();

  const mode = useMode();

  return (
    <div>
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
                    value ? InteractionMode.Bridge : InteractionMode.Starknet,
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
                Switch to Bridge mode to deposit directly from ETH Mainnet into
                your starknet wallet in a single step.
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
  );
};
