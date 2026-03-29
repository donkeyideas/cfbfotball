/**
 * Font family definitions for the Gridiron Classic theme.
 * These reference the custom fonts loaded in _layout.tsx.
 *
 * Fonts must be loaded via expo-font before use.
 * Falls back gracefully if fonts haven't loaded yet.
 */
export const typography = {
  // Playfair Display - Serif headers
  serif: 'PlayfairDisplay-Regular',
  serifBold: 'PlayfairDisplay-Bold',

  // Source Sans 3 - Body text
  sans: 'SourceSans3-Regular',
  sansSemiBold: 'SourceSans3-SemiBold',
  sansBold: 'SourceSans3-Bold',

  // Special Elite - Monospace / vintage
  mono: 'SpecialElite-Regular',
} as const;
