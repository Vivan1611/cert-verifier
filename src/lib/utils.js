import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind classes, resolving conflicts using tailwind-merge.
 * Excellent for building flexible Web3 UI components.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
