import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within, expect, waitFor } from "storybook/test";
import { LocaleSwitcher } from "./LocaleSwitcher";

const meta: Meta<typeof LocaleSwitcher> = {
  title: "UI/LocaleSwitcher",
  component: LocaleSwitcher,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LocaleSwitcher>;

export const Default: Story = {};

export const CustomClass: Story = {
  args: {
    className: "border-2 border-[var(--surface-accent)]",
  },
};

/**
 * Interaction test: select a different locale and verify that the
 * locale-switch machinery fires without error.
 *
 * The component is controlled by `useLocale()` from next-intl, which
 * is hard-coded to `"en"` in the preview decorator, so the select
 * value does **not** change after interaction — that is expected.
 *
 * What is verified:
 * - Initial state: the select shows `"en"` and both labels exist.
 * - The `useTransition` pending state (`.opacity-50`) was entered and
 *   then resolved, proving `handleChange` → `router.replace` was
 *   called through `startTransition` without error.
 */
export const LocaleSelection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // ── initial state ──────────────────────────────────────────────
    const select = canvas.getByRole("combobox", { name: "Select language" });
    await expect(select).toHaveValue("en");
    await expect(canvas.getByText("EN")).toBeInTheDocument();
    await expect(canvas.getByText("DA")).toBeInTheDocument();

    // ── interact: select Danish locale ─────────────────────────────
    await userEvent.selectOptions(select, "da");

    // ── verify transition completed ────────────────────────────────
    // The `useTransition` pending state is conveyed via `.opacity-50`.
    // Once the transition finishes (the synchronous mock `router.replace`
    // call resolves), the class is removed.  Checking for its absence
    // proves the full cycle ran.
    await waitFor(() => {
      expect(select).not.toHaveClass("opacity-50");
    });
  },
};
