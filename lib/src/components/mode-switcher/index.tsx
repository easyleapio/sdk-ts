import { Switch } from "@lib/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@lib/components/ui/tooltip";
import { useTheme } from "@lib/contexts/ThemeContext";
import { InteractionMode, useSharedState } from "@lib/hooks";
import { toast } from "@lib/hooks/use-toast";
import { useAccount } from "@lib/hooks/useAccount";
import { useMode } from "@lib/hooks/useMode";
import { cn } from "@lib/utils";

interface ModeSwitcherProps {
  className?: string;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ className }) => {
  const { addressDestination, addressSource } = useAccount();

  const sharedState = useSharedState();

  const mode = useMode();

  const theme = useTheme();

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
                      title: "Connect EVM wallet to enable bridge mode"
                    });
                  }
                  sharedState.setMode(
                    value ? InteractionMode.Bridge : InteractionMode.Starknet
                  );
                  sharedState.setModeSwitchedManually(true);
                }}
                className={cn(
                  "easyleap-w-28 easyleap-font-firaCode easyleap-ml-4 easyleap-border-[1.5px] easyleap-border-[#DBDBDB]/60",
                  className
                )}
                style={{
                  border:
                    mode === InteractionMode.Starknet
                      ? theme?.starknetMode?.switchButton?.border
                      : theme?.bridgeMode?.switchButton?.border,
                  color:
                    mode === InteractionMode.Starknet
                      ? theme?.starknetMode?.switchButton?.color
                      : theme?.bridgeMode?.switchButton?.color,
                  backgroundColor:
                    mode === InteractionMode.Starknet
                      ? theme?.starknetMode?.switchButton?.backgroundColor
                      : theme?.bridgeMode?.switchButton?.backgroundColor
                }}
              />
            </TooltipTrigger>
            <TooltipContent className="easyleap-mr-5 easyleap-mt-2 easyleap-max-w-[20rem] easyleap-border easyleap-border-[#211d31] easyleap-bg-[#b5abdf] easyleap-px-4 easyleap-py-2 easyleap-text-[#211d31]">
              <p>
                Switch to Bridge mode to deposit directly from ETH Mainnet into
                your starknet wallet in a single step.
              </p>
              <br />
              <p>
                This dApp supports in-app bridge mode, powered by
                <span> </span>
                <a href="https://easyleap.io/" className="easyleap-underline">
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
