// @ts-nocheck

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { TokenStorage } from '@/lib/storage';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    ...context,
    // Additional convenience methods
    hasValidToken: () => TokenStorage.hasToken(),
    getToken: () => TokenStorage.getToken(),
  };
};
