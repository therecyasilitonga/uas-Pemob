import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../api/dummyjson';

const AuthContext = createContext(null);
const STORAGE_KEY = '@kampusmarket_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore sesi login dari penyimpanan lokal saat aplikasi dibuka lagi.
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setUser(JSON.parse(saved));
      } catch (e) {
        // Abaikan, anggap belum login
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await loginUser(username, password);
    const sessionUser = {
      id: data.id,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      image: data.image,
    };
    setUser(sessionUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  }, []);

  const register = useCallback(async (form) => {
    const data = await registerUser(form);
    // Setelah "daftar" berhasil, langsung anggap sesi aktif memakai data isian.
    const sessionUser = {
      id: data.id ?? Date.now(),
      username: form.username,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      image: `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(form.firstName)}`,
    };
    setUser(sessionUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateProfile = useCallback(async (updatedFields) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedFields };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser)).catch(() => {});
      return nextUser;
    });
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, isAuthenticated: !!user, login, register, logout, updateProfile }),
    [user, isLoading, login, register, logout, updateProfile]
  );


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}
