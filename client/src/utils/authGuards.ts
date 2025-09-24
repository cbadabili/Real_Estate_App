import { getToken } from '@/lib/storage';
export const requireAuth = (action: string = 'perform this action'): void => {
  if (!getToken()) {
    throw new Error(`Please log in to ${action}`);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
