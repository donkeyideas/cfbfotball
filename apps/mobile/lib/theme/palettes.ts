/**
 * Light and dark color palettes for the Gridiron Classic theme.
 * Dark mode values mirror the web app's globals.css `html.dark` variables.
 */

export type ColorPalette = {
  paper: string;
  ink: string;
  crimson: string;
  primary: string;
  secondary: string;
  dark: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  success: string;
  warning: string;
  error: string;
  info: string;
};

export const lightPalette: ColorPalette = {
  paper: '#f4efe4',
  ink: '#3b2f1e',
  crimson: '#8b1a1a',
  primary: '#8b1a1a',
  secondary: '#c9a84c',
  dark: '#2a1f14',
  surface: '#ece7db',
  surfaceRaised: '#faf7f0',
  border: '#d4c9b5',
  borderStrong: '#b8a88e',
  textPrimary: '#3b2f1e',
  textSecondary: '#6b5d4d',
  textMuted: '#9a8c7a',
  textInverse: '#f4efe4',
  success: '#4a7c59',
  warning: '#b8860b',
  error: '#8b1a1a',
  info: '#4a6c8c',
};

export const darkPalette: ColorPalette = {
  paper: '#1a1714',
  ink: '#ddd8ce',
  crimson: '#8b1a1a',
  primary: '#8b1a1a',
  secondary: '#c9a84c',
  dark: '#1a1714',
  surface: '#262320',
  surfaceRaised: '#2c2926',
  border: '#3e3a34',
  borderStrong: '#504a42',
  textPrimary: '#ddd8ce',
  textSecondary: '#b0a898',
  textMuted: '#8a8070',
  textInverse: '#1a1714',
  success: '#4a7c59',
  warning: '#b8860b',
  error: '#8b1a1a',
  info: '#4a6c8c',
};
