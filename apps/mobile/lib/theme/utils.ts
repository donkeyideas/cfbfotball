/**
 * Converts a hex color + opacity (0-1) to an rgba() string.
 * Replaces hardcoded rgba values so they adapt to dark mode.
 */
export function withAlpha(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}
