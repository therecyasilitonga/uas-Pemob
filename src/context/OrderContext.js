import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  
  const [defaultAddress, setDefaultAddress] = useState({
    name: "Kost Griya Cantika",
    address: "Jl. Margonda Raya, Gang Kober No. 15, Beji",
    city: "Depok, Jawa Barat",
    detail: "Kamar B3 (Pagar warna biru sebelah laundry)",
    roadIcon: "map-outline"
  });

  const [defaultBiodata, setDefaultBiodata] = useState({
    name: "Emily Johnson",
    phone: "081298765432"
  });

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'gopay', name: 'GoPay', type: 'e-wallet', balance: 125000, active: true },
    { id: 'shopeepay', name: 'ShopeePay', type: 'e-wallet', balance: 45000, active: false },
    { id: 'cod', name: 'Bayar di Tempat (COD Kosan)', type: 'cash', active: false },
    { id: 'transfer_bni', name: 'Transfer BNI (Virtual Account)', type: 'bank', active: false }
  ]);

  const addOrder = useCallback((newOrder) => {
    setOrders((prev) => [
      {
        id: `KM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        date: new Date().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'Diproses', // Diproses | Dikirim | Selesai
        ...newOrder
      },
      ...prev
    ]);
  }, []);

  const updateDefaultAddress = useCallback((addr) => {
    setDefaultAddress(addr);
  }, []);

  const updateDefaultBiodata = useCallback((bio) => {
    setDefaultBiodata(bio);
  }, []);

  const togglePaymentMethodActive = useCallback((methodId) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        active: pm.id === methodId
      }))
    );
  }, []);

  const addPaymentMethod = useCallback((newMethod) => {
    setPaymentMethods((prev) => [...prev, newMethod]);
  }, []);

  const value = useMemo(() => ({
    orders,
    defaultAddress,
    defaultBiodata,
    paymentMethods,
    addOrder,
    updateDefaultAddress,
    updateDefaultBiodata,
    togglePaymentMethodActive,
    addPaymentMethod
  }), [
    orders,
    defaultAddress,
    defaultBiodata,
    paymentMethods,
    addOrder,
    updateDefaultAddress,
    updateDefaultBiodata,
    togglePaymentMethodActive,
    addPaymentMethod
  ]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders harus digunakan di dalam <OrderProvider>');
  return ctx;
}
