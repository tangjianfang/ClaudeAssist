import { createContext, useContext, type ReactNode } from 'react';
import { useFavorites } from '../hooks/useFavorites';

interface FavoritesContextValue {
  favorites: Set<string>;
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favorites: new Set(),
  isFavorite: () => false,
  toggle: () => undefined,
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { favorites, isFavorite, toggle } = useFavorites();
  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  return useContext(FavoritesContext);
}
