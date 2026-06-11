"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { getFavorites, addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite, ApiError } from "@/lib/api";
import { useCart } from "@/context/CartContext";

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

const FAVORITES_STORAGE_KEY = "trade_hive_favorites";

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useCart();

  // Load favorites from localStorage on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isAuthenticated) {
          const serverFavs = await getFavorites();
          if (!cancelled) setFavorites(serverFavs ?? []);
        } else {
          const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (!cancelled) setFavorites(Array.isArray(parsed) ? parsed : []);
          }
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        if (!cancelled) setMounted(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!mounted) return;
    (async () => {
      try {
        if (isAuthenticated) {
          // Sync client favorites with server: best-effort add/remove
          // Fetch current server favorites to compute diff
          const serverFavs = await getFavorites();
          const serverIds = new Set((serverFavs ?? []).map((p) => p.id));
          // Add missing
          for (const p of favorites) {
            if (!serverIds.has(p.id)) {
              try {
                await apiAddFavorite(p.id);
              } catch {
                // ignore individual failures
              }
            }
          }
        } else {
          try {
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
          } catch (error) {
            console.error("Failed to save favorites:", error);
          }
        }
      } catch (error) {
        console.error("Failed to sync favorites:", error);
      }
    })();
  }, [favorites, mounted]);

  const isFavorite = useCallback(
    (productId: string) => favorites.some((fav) => fav.id === productId),
    [favorites]
  );

  const addFavorite = useCallback((product: Product) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === product.id)) return prev;
      const next = [...prev, product];
      // If authenticated, optimistically update and sync in effect
      if (isAuthenticated) {
        (async () => {
          try {
            await apiAddFavorite(product.id);
          } catch (err) {
            // Treat duplicate-key / already-exists errors as benign (server already has it)
            const msg = err instanceof Error ? err.message : String(err);
            if (
              msg.includes("duplicate key") ||
              msg.includes("already exists") ||
              msg.includes("favorites_user_id_product_id_key")
            ) {
              // ignore - favorite already exists on server
            } else {
              console.error("Failed to add favorite on server:", err);
            }
          }
        })();
      }
      return next;
    });
  }, [isAuthenticated]);

  const removeFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      const next = prev.filter((fav) => fav.id !== productId);
      if (isAuthenticated) {
        (async () => {
          try {
            await apiRemoveFavorite(productId);
          } catch (err) {
            // Some backend errors indicate the row was already removed/updated elsewhere — treat as benign
            const msg = err instanceof Error ? err.message : String(err);
            if (
              msg.includes("Row was updated or deleted") ||
              msg.includes("not found") ||
              msg.includes("does not exist") ||
              msg.includes("No row")
            ) {
              // ignore - favorite already removed on server
            } else {
              console.error("Failed to remove favorite on server:", err);
            }
          }
        })();
      }
      return next;
    });
  }, [isAuthenticated]);

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
