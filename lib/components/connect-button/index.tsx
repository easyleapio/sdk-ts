import ButtonDialog from "~/components/button-dialog";

export interface ConnectButtonProps {
  onConnectStarknet?: () => void;
  onDisconnectStarknet?: () => void;
  onConnectEVM?: () => void;
  onDisconnectEVM?: () => void;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  onConnectStarknet,
  onDisconnectStarknet,
  onConnectEVM,
  onDisconnectEVM,
}) => {
  return (
    <div>
      <ButtonDialog
        onConnectStarknet={onConnectStarknet}
        onDisconnectStarknet={onDisconnectStarknet}
        onConnectEVM={onConnectEVM}
        onDisconnectEVM={onDisconnectEVM}
      />
    </div>
  );
};
