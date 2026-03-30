/**
 * Gridiron Classic theme colors for React Native.
 *
 * @deprecated Use `useColors()` from `@/lib/theme/ThemeProvider` instead.
 * This static export does not respond to dark mode.
 * Kept for backward compatibility during migration.
 */
import { lightPalette } from './palettes';

export const colors = lightPalette;

export type SchoolColors = {
  primary: string;
  secondary: string;
};
