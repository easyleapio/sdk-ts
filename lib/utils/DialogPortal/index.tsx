import * as Dialog from "@radix-ui/react-dialog";
import { useConnect as useConnectWagmi } from 'wagmi';
import { useConnect as useConnectSN } from "@starknet-react/core";
import "./dialog-portal.css";
import { useAccount } from "../../hooks/useAccount";


export function EVMWalletOptions() {
    const { connectors, connect } = useConnectWagmi()
  
    return <ul>{connectors.map((connector) => (
      <li key={connector.uid}><button onClick={() => connect({ connector })}>
        {connector.name}
      </button></li>
    ))}</ul>
}

export function SNWalletOptions() {
    const { connectors, connect } = useConnectSN()
    return <ul>{connectors.map((connector) => (
        <li key={connector.id}><button onClick={() => connect({ connector })}>
            {connector.name}
        </button></li>
    ))}</ul>
}

export function DialogPortal() {
    const { addressSource, addressDestination } = useAccount();
    
    return (
        <Dialog.Portal>
			<Dialog.Overlay className="DialogOverlay" />
			<Dialog.Content className="DialogContent">
				<Dialog.Title className="DialogTitle">Connect</Dialog.Title>
                <div>
                    <div style={{width: '50%', float: 'left'}}>
                        <h3>Connect Starknet</h3>
                        <p>{addressDestination ? `Connected: ${addressDestination}` : "Not connected"}</p>
                        {SNWalletOptions()}
                    </div>
                    <div style={{width: '50%', float: 'left'}}>
                        <h3>Connect EVM</h3>
                        <p>{addressSource ? `Connected: ${addressSource}` : "Not connected"}</p>
                        {EVMWalletOptions()}
                    </div>
                </div>
				<Dialog.Close asChild>
					<button className="IconButton" aria-label="Close">
						X
					</button>
				</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
    )
}