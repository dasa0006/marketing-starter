import type { Meta, StoryObj, Decorator } from "@storybook/nextjs-vite";
import { userEvent, within, expect } from "@storybook/test";
import { ToggleMode } from "./ToggleMode";

const darkClassDecorator: Decorator = (StoryComponent) => (
  <div className="dark">
    <StoryComponent />
  </div>
);

const meta: Meta<typeof ToggleMode> = {
  title: "UI/ToggleMode",
  component: ToggleMode,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ToggleMode>;

export const Light: Story = {};

export const Dark: Story = {
  decorators: [darkClassDecorator],
};

/**
 * Interaction test: click the toggle button and verify that the theme
 * class on `document.documentElement` changes between light and dark.
 *
 * The `ThemeProvider` in `.storybook/preview.tsx` is configured with
 * `attribute="class"` and `defaultTheme="light"`, so the initial state
 * has no `.dark` class on `<html>`.
 *
 * What is verified:
 * - Initial state: button label reads "Switch to dark mode" and the
 *   `<html>` element does NOT have the `.dark` class.
 * - After first click: the `.dark` class IS present and the aria-label
 *   updates to "Switch to light mode".
 * - After second click: the `.dark` class is removed (back to light)
 *   and the aria-label reverts.
 */
export const ToggleTheme: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ── initial state: light mode ──────────────────────────────────
    const button = canvas.getByRole("button", { name: "Switch to dark mode" });
    await expect(button).toBeInTheDocument();
    await expect(document.documentElement).not.toHaveClass("dark");

    // ── click to toggle to dark ────────────────────────────────────
    await userEvent.click(button);
    await expect(document.documentElement).toHaveClass("dark");
    await expect(button).toHaveAttribute("aria-label", "Switch to light mode");

    // ── click to toggle back to light ──────────────────────────────
    await userEvent.click(button);
    await expect(document.documentElement).not.toHaveClass("dark");
    await expect(button).toHaveAttribute("aria-label", "Switch to dark mode");
  },
};
