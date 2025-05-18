import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This function merges class names together, removing duplicates and ensuring that
// the final class name string is valid.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
