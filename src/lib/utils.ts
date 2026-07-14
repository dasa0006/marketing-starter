import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names, resolving conflicts via tailwind-merge.
 * Accepts the same inputs as clsx (strings, arrays, objects of conditionals).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
