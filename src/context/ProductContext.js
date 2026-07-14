import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { boardingHouseProducts } from '../api/boardingHouseProducts';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(boardingHouseProducts);

  const addProduct = useCallback((newProduct) => {
    setProducts((prev) => [
      {
        id: Date.now(),
        rating: 5.0,
        discountPercentage: 0,
        isUserOwned: true, // Marker untuk mengidentifikasi barang jualan milik sendiri
        ...newProduct
      },
      ...prev
    ]);
  }, []);

  const getProductById = useCallback((id) => {
    return products.find(p => p.id === Number(id));
  }, [products]);

  const userProducts = useMemo(() => {
    return products.filter(p => p.isUserOwned);
  }, [products]);

  const value = useMemo(() => ({
    products,
    addProduct,
    getProductById,
    userProducts,
    userProductsCount: userProducts.length
  }), [products, addProduct, getProductById, userProducts]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts harus digunakan di dalam <ProductProvider>');
  return ctx;
}
