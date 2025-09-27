
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';
import * as storage from '../services/storageService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string, role: UserRole) => Promise<User | null>;
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
    // Initialize users if not present
    storage.getUsers();
  }, []);

  const login = useCallback(async (identifier: string, password: string, role: UserRole): Promise<User | null> => {
    const users = storage.getUsers();
    const userFound = users.find(u => 
        u.role === role && 
        (u.email === identifier || u.meterNumber === identifier) && 
        u.password === password
    );

    if (userFound) {
      const userToStore = { ...userFound };
      delete userToStore.password;
      setUser(userToStore);
      storage.saveAuthenticatedUser(userToStore);
      return userToStore;
    }
    
    return null;
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id' | 'role'>): Promise<User> => {
    const users = storage.getUsers();
    const newUser: User = {
        ...userData,
        id: `user_${new Date().getTime()}`,
        role: UserRole.CUSTOMER
    };
    storage.addUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storage.saveAuthenticatedUser(null);
  }, []);
  
  const updateProfile = useCallback((updatedData: Partial<User>) => {
    if(!user) return;

    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    storage.saveAuthenticatedUser(updatedUser);

    const allUsers = storage.getUsers();
    const userIndex = allUsers.findIndex(u => u.id === user.id);
    if(userIndex > -1) {
        allUsers[userIndex] = { ...allUsers[userIndex], ...updatedData };
        storage.saveUsers(allUsers);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
