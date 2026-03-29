/**
 * Gridiron Classic theme colors for React Native.
 * Mirrors the CSS custom properties in the web app.
 */
export const colors = {
  // Core palette
  paper: '#f4efe4',
  ink: '#3b2f1e',
  crimson: '#8b1a1a',
  primary: '#8b1a1a',
  secondary: '#c9a84c',
  dark: '#2a1f14',

  // Surfaces
  surface: '#ece7db',
  surfaceRaised: '#faf7f0',
  border: '#d4c9b5',
  borderStrong: '#b8a88e',

  // Text
  textPrimary: '#3b2f1e',
  textSecondary: '#6b5d4d',
  textMuted: '#9a8c7a',
  textInverse: '#f4efe4',

  // Semantic
  success: '#4a7c59',
  warning: '#b8860b',
  error: '#8b1a1a',
  info: '#4a6c8c',
} as const;

/**
 * Maps school IDs to their brand colors.
 * In production, these come from the schools table in Supabase.
 * This mapping is only used as a fallback for offline scenarios.
 */
export type SchoolColors = {
  primary: string;
  secondary: string;
};
