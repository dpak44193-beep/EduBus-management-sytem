import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (profile: { name: string; phone: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('bms_user');
    const token = localStorage.getItem('bms_token');
    return stored && token ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return { success: false, error: data.error ?? 'Invalid credentials. Please try again.' };
      }

      const user = data.user as User;
      setCurrentUser(user);
      localStorage.setItem('bms_user', JSON.stringify(user));
      localStorage.setItem('bms_token', data.token);
      return { success: true };
    } catch {
      return { success: false, error: 'The API server is unavailable. Please start the backend and try again.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bms_user');
    localStorage.removeItem('bms_token');
  };

  const updateProfile = async (profile: { name: string; phone: string }) => {
    const token = localStorage.getItem('bms_token');
    if (!token) return { success: false, error: 'Your session has expired. Please sign in again.' };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}/api/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      if (!response.ok || !data.success) return { success: false, error: data.error ?? 'Unable to update profile.' };
      setCurrentUser(data.data as User);
      return { success: true };
    } catch {
      return { success: false, error: 'The API server is unavailable. Please try again.' };
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('bms_token');
    if (!currentUser || !token) return;

    localStorage.setItem('bms_user', JSON.stringify(currentUser));
    fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(async (response) => {
      if (!response.ok) {
        setCurrentUser(null);
        localStorage.removeItem('bms_user');
        localStorage.removeItem('bms_token');
        return;
      }
      const data = await response.json();
      setCurrentUser(data.data as User);
    }).catch(() => {
      setCurrentUser(null);
      localStorage.removeItem('bms_user');
      localStorage.removeItem('bms_token');
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, updateProfile, logout, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
