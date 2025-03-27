import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button"
  }
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary"
  }
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive"
  }
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline"
  }
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost"
  }
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link"
  }
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small"
  }
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large"
  }
};

export const Icon: Story = {
  args: {
    size: "icon",
    children: "🔍"
  }
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span>With Icon</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </>
    )
  }
};
