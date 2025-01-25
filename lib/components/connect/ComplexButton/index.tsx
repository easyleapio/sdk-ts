import * as Wagmi from "wagmi"
import * as SNReact from "@starknet-react/core"
import * as Dialog from "@radix-ui/react-dialog";
import { DialogPortal } from "../../../utils/DialogPortal";

export interface ComplexButtonProps {
  dummy: string // remove later once there are props
}

export function ComplexButton() {
    function EVMButton() {
        const { address } = Wagmi.useAccount()
        const { disconnect } = Wagmi.useDisconnect()
        const { data: ensName } = Wagmi.useEnsName({ address })
        const { data: ensAvatar } = Wagmi.useEnsAvatar({ name: ensName! })

        return (
            <div>
              {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
              {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
              <button onClick={() => disconnect()}>EVM Disconnect</button>
            </div>
        )
    }

    function SNButton() {
        const { address } = SNReact.useAccount()
        const { disconnect } = SNReact.useDisconnect()

        return (
            <div>
              <div>{address ? address : "Not connected"}</div>
              <button onClick={() => disconnect()}>SN Disconnect</button>
            </div>
        )
    }

  return <div>
    <Dialog.Root>
		<Dialog.Trigger asChild>
			<button className="Button violet">Connect</button>
		</Dialog.Trigger>
        <DialogPortal></DialogPortal>
    </Dialog.Root>

    <EVMButton></EVMButton>
    <SNButton></SNButton>
  </div>
}