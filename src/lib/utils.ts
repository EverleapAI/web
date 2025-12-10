// src/lib/utils.ts

/**
 * Utility to conditionally join classNames.
 * Works like the "cn" helper used in shadcn/ui.
 *
 * Usage:
 *   cn("base", isActive && "active", isError && "error")
 */
export function cn(
  ...classes: (string | undefined | null | false | 0)[]
): string {
  return classes.filter(Boolean).join(" ");
}
