'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '@services/api';
import { UserProfile, LoginFormInput } from '@services/types';
import { useRouter } from 'next/navigation';

// 1. Define the shape of the context data
interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (credentials: LoginFormInput) => Promise<void>;
  logout: () => void;
  isLoading: boolean; // To handle initial auth check
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Create the Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for token on initial load
    const checkUserStatus = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const profile = await api.getMyProfile();
          setUser(profile);
        } catch (error) {
          console.error('Failed to fetch profile with existing token', error);
          localStorage.removeItem('accessToken'); // Token might be invalid
        }
      }
      setIsLoading(false);
    };
    checkUserStatus();
  }, []);

  const login = async (credentials: LoginFormInput) => {
    try {
      await api.login(credentials);
      const profile = await api.getMyProfile();
      setUser(profile);
    } catch (error) {
      console.error('Login failed', error);
      throw error; // Re-throw error to be handled by the login form
    }
  };

  const logout = () => {
    api.logout(); // This just removes the token from localStorage
    setUser(null);
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      logout();
      router.push('/login');
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [router]);

  const value = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create the custom hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
