
import { TokenStorage } from '@/lib/storage';

export const requireAuth = (action: string = 'perform this action'): void => {
  if (!TokenStorage.hasToken()) {
    throw new Error(`Please log in to ${action}`);
  }
};

export const isAuthenticated = (): boolean => {
  return TokenStorage.hasToken();
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = TokenStorage.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
