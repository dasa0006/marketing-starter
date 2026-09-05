import type { IHeading } from "./Heading";

const shortHeading = "Boost your marketing";
const longHeading =
  "A much longer marketing headline that keeps going across several words so you can see how the heading wraps gracefully onto multiple lines within its container";
const sectionHeading = "The playbook behind fast-growing campaigns";

export const shortHeadingMocks = {
  children: shortHeading,
} satisfies IHeading;

export const longHeadingMocks = {
  children: longHeading,
} satisfies IHeading;

export const sectionHeadingMocks = {
  as: "h2",
  children: sectionHeading,
} satisfies IHeading;
