import type { Meta, StoryObj } from "@storybook/react";
import { ReviewModal } from "./index";
import { SharedStateProvider } from "@lib/main";

const meta = {
  title: "Components/ReviewModal",
  component: ReviewModal,
  parameters: {
    layout: "centered"
  },
  decorators: [
    (Story) => (
      <SharedStateProvider>
        <Story />
      </SharedStateProvider>
    )
  ]
} satisfies Meta<typeof ReviewModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTokensIn = [
  {
    name: "ETH",
    amount: "1000000000000000000"
    // logo: "https://app.strkfarm.com/zklend/icons/tokens/strk.svg?w=20"
  }
];

const mockTokensOut = [
  {
    name: "ETH",
    amount: "1000000000000000000"
    // logo: "/tokens/eth.svg"
  }
];

const mockDestinationDapp = {
  name: "Vesu",
  logo: "/tokens/eth.svg"
};

export const Default: Story = {
  args: {
    isOpen: true,
    tokensIn: mockTokensIn,
    tokensOut: mockTokensOut,
    destinationDapp: mockDestinationDapp,
    onContinue: () => console.log("Continue clicked")
  }
};
