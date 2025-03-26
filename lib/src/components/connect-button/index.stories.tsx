import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { ConnectButton } from "./index";

const meta = {
  title: "ConnectButton",
  component: ConnectButton,
  parameters: {
    layout: "centered"
  },

  tags: ["autodocs"],

  argTypes: {
    style: { control: { type: "object" } },
    className: { control: { type: "text" } }
  },

  args: {
    onConnectStarknet: fn(),
    onDisconnectStarknet: fn(),
    onConnectEVM: fn(),
    onDisconnectEVM: fn()
  }
} satisfies Meta<typeof ConnectButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    style: {
      buttonStyles: { backgroundColor: "" },
      modalStyles: { backgroundColor: "" }
    },
    className: ""
  }
};
