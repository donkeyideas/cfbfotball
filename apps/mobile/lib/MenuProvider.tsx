import { createContext, useContext, useState, type PropsWithChildren } from 'react';
import { MenuOverlay } from '@/components/navigation/MenuOverlay';

interface MenuContextValue {
  openMenu: () => void;
}

const MenuContext = createContext<MenuContextValue>({ openMenu: () => {} });

export function useMenu() {
  return useContext(MenuContext);
}

export function MenuProvider({ children }: PropsWithChildren) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <MenuContext.Provider value={{ openMenu: () => setMenuOpen(true) }}>
      {children}
      <MenuOverlay visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </MenuContext.Provider>
  );
}
