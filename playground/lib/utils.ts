import { type ClassValue, clsx } from "clsx"
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateConnectionId(prefix: string) {
  return `${prefix}-${nanoid()}`
}
