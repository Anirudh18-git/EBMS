
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';
import * as storage from '../services/storageService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<User | null>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'role'>) => Promise<User>;
  updateProfile: (updatedData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loggedInUser = storage.getAuthenticatedUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  const login = useCallback(async (identifier: string, password: string): Promise<User | null> => {
    try {
      const result = await storage.login(identifier, password);
      setUser(result.user);
      return result.user;
    } catch (error) {
      console.error('Login failed', error);
      return null;
    }
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id' | 'role'>): Promise<User> => {
    try {
      const result = await storage.register({ ...userData, role: UserRole.CUSTOMER });
      setUser(result.user);
      return result.user;
    } catch (error) {
      console.error('Register failed', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storage.saveAuthenticatedUser(null);
  }, []);
  
  const updateProfile = useCallback(async (updatedData: Partial<User>) => {
    if(!user) return;

    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    storage.saveAuthenticatedUser(updatedUser);

    // Note: In API mode, profile update would call a PUT /api/auth/me, but for now, local only
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
