import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]); // array of product objects

  const isInWishlist = useCallback(
    (productId) => items.some((p) => p.id === productId),
    [items]
  );

  const toggleWishlist = useCallback((product) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const clearWishlist = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: items.length, isInWishlist, toggleWishlist, removeFromWishlist, clearWishlist }),
    [items, isInWishlist, toggleWishlist, removeFromWishlist, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist harus dipakai di dalam <WishlistProvider>');
  return ctx;
}
