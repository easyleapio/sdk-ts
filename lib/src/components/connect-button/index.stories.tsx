import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { ConnectButton } from "./index";

const meta = {
  title: "Components/ConnectButton",
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
  },

  decorators: [(Story) => <Story />]
} satisfies Meta<typeof ConnectButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    style: {
      buttonStyles: { backgroundColor: "" },
      modalStyles: { backgroundColor: "" }
    },
    className: ""
  }
};
