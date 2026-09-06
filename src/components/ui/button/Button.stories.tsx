import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Button from "./Button";

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hierarchy: Story = {
  render: () => (
    <div className="space-y-7">
      <div className="space-x-8">
        <Button size={"sm"} disabled>
          Click me
        </Button>
        <Button size={"sm"}>Click me</Button>
        <Button size={"md"}>Click me</Button>
        <Button size={"lg"}>Click me</Button>
      </div>
      <div className="space-x-8">
        <Button size={"sm"} variant={"secondary"} disabled>
          Click me
        </Button>
        <Button size={"sm"} variant={"secondary"}>
          Click me
        </Button>
        <Button size={"md"} variant={"secondary"}>
          Click me
        </Button>
        <Button size={"lg"} variant={"secondary"}>
          Click me
        </Button>
      </div>
      <div className="space-x-8">
        <Button size={"sm"} variant={"accent"} disabled>
          Click me
        </Button>
        <Button size={"sm"} variant={"accent"}>
          Click me
        </Button>
        <Button size={"md"} variant={"accent"}>
          Click me
        </Button>
        <Button size={"lg"} variant={"accent"}>
          Click me
        </Button>
      </div>
      <div className="space-x-8">
        <Button size={"sm"} variant={"ghost"} disabled>
          Click me
        </Button>
        <Button size={"sm"} variant={"ghost"}>
          Click me
        </Button>
        <Button size={"md"} variant={"ghost"}>
          Click me
        </Button>
        <Button size={"lg"} variant={"ghost"}>
          Click me
        </Button>
      </div>
    </div>
  ),
};
