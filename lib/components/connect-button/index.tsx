import ButtonDialog from "@lib/components/button-dialog";

export interface ConnectButtonProps {
  onConnectStarknet?: () => void;
  onDisconnectStarknet?: () => void;
  onConnectEVM?: () => void;
  onDisconnectEVM?: () => void;
  className?: string;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  onConnectStarknet,
  onDisconnectStarknet,
  onConnectEVM,
  onDisconnectEVM,
  className = "",
}) => {
  return (
    <div>
      <ButtonDialog
        onConnectStarknet={onConnectStarknet}
        onDisconnectStarknet={onDisconnectStarknet}
        onConnectEVM={onConnectEVM}
        onDisconnectEVM={onDisconnectEVM}
        className={className}
      />
    </div>
  );
};
