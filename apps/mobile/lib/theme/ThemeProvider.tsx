import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightPalette, darkPalette } from './palettes';
import type { ColorPalette } from './palettes';

type ColorMode = 'light' | 'dark';

interface ThemeContextValue {
  colorMode: ColorMode;
  colors: ColorPalette;
  isDark: boolean;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
  colorModeReady: boolean;
}

const STORAGE_KEY = '@cfb_color_mode';

const ThemeContext = createContext<ThemeContextValue>({
  colorMode: 'light',
  colors: lightPalette,
  isDark: false,
  toggleColorMode: () => {},
  setColorMode: () => {},
  colorModeReady: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function useColors(): ColorPalette {
  return useContext(ThemeContext).colors;
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [colorMode, setColorModeState] = useState<ColorMode>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'dark' || stored === 'light') {
        setColorModeState(stored);
      }
      setReady(true);
    });
  }, []);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    AsyncStorage.setItem(STORAGE_KEY, mode);
  }, []);

  const toggleColorMode = useCallback(() => {
    setColorModeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const colors = colorMode === 'dark' ? darkPalette : lightPalette;

  return (
    <ThemeContext.Provider
      value={{
        colorMode,
        colors,
        isDark: colorMode === 'dark',
        toggleColorMode,
        setColorMode,
        colorModeReady: ready,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
