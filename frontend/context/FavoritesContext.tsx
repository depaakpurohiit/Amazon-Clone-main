"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Product } from "@/types/product";

interface FavoritesContextProps {
  favorites: Product[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(
  undefined
);

const FAVORITES_STORAGE_KEY = "amazon_clone_favorites";

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
    setMounted(true);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  }, [favorites, mounted]);

  const isFavorite = useCallback(
    (productId: string) => favorites.some((fav) => fav.id === productId),
    [favorites]
  );

  const addFavorite = useCallback((product: Product) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== productId));
  }, []);

  const toggleFavorite = useCallback(
    (product: Product) => {
      if (isFavorite(product.id)) {
        removeFavorite(product.id);
      } else {
        addFavorite(product);
      }
    },
    [isFavorite, removeFavorite, addFavorite]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
