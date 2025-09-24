// @ts-nocheck
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useQueryClient } from '@tanstack/react-query';
import { TokenStorage, SafeStorage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/constants/storageKeys';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: 'buyer' | 'seller' | 'agent' | 'fsbo' | 'admin';
  role: 'user' | 'moderator' | 'admin' | 'super_admin';
  permissions: string[];
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  isActive: boolean;
  reacNumber?: string;
  lastLoginAt?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  subscription: any | null;
  entitlements: Record<string, any> | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  refreshBilling: () => Promise<void>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: 'buyer' | 'seller' | 'agent' | 'fsbo';
  bio?: string;
  reacNumber?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [entitlements, setEntitlements] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? TokenStorage.getToken() : null
  );
  const [userId, setUserId] = useState<string | null>(
    typeof window !== 'undefined' ? SafeStorage.get(STORAGE_KEYS.USER_ID) : null
  );
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = TokenStorage.getToken();
        const userId = SafeStorage.get(STORAGE_KEYS.USER_ID);

        if (!token || !userId) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        // Validate token with server
        const userData = await apiRequest('/api/auth/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Auth check successful:', userData.email);
        setUser(userData);
        setIsAuthenticated(true);
        // Ensure token state is also updated if it was retrieved from local storage
        if (token) {
          setToken(token);
        }
        // Store user data using react-query
        queryClient.setQueryData(['user'], userData);
      } catch (error) {
        console.error('Auth check failed:', error);

        // Only clear token if it's actually invalid (401), not for network errors
        if (error?.message === 'User not authenticated' || error?.status === 401) {
          console.log('Clearing invalid token');
          TokenStorage.removeToken();
          SafeStorage.remove(STORAGE_KEYS.USER_ID);
          setUser(null);
          setIsAuthenticated(false);
          setToken(null);
        } else {
          console.log('Auth check failed due to network/other error, keeping token');
          // Don't clear the token for network errors, user might be offline
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [queryClient]); // Add queryClient to dependency array

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login for:', email);
      
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed with response:', errorText);
        let errorMessage = 'Login failed';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Login response data keys:', Object.keys(data));

      // More flexible response handling
      if (data.success === false) {
        throw new Error(data.message || 'Login failed');
      }

      // Check for token and user in various response formats
      const token = data.token || data.accessToken;
      const user = data.user || data.data?.user || data;

      if (token && user && user.id) {
        // Store the raw token (without Bearer prefix in storage)
        const cleanToken = token.replace('Bearer ', '');
        TokenStorage.setToken(cleanToken);
        queryClient.setQueryData(['user'], user);
        setUser(user);
        setToken(cleanToken);
        setUserId(user.id.toString());
        SafeStorage.set(STORAGE_KEYS.USER_ID, user.id.toString());
        setIsAuthenticated(true);
        console.log('Login successful for user:', user.email);
        return user;
      } else {
        console.error('Invalid response structure:', { token: !!token, user: !!user, userId: user?.id });
        throw new Error('Invalid response from server - missing token or user data');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setSubscription(null);
    setEntitlements(null);
    setToken(null);
    setUserId(null);
    if (typeof window !== 'undefined') {
      TokenStorage.removeToken();
      SafeStorage.remove(STORAGE_KEYS.USER_ID);
    }
    setIsAuthenticated(false);
    // Invalidate user query on logout
    queryClient.invalidateQueries(['user']);
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      await apiRequest('/api/users/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      // Registration successful, user needs to login manually
      // (This is more secure than auto-login)
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      // Update react-query cache as well
      queryClient.setQueryData(['user'], updatedUser);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const isAdmin = (): boolean => {
    if (!user) return false;
    return ['admin', 'super_admin'].includes(user.role) || user.userType === 'admin';
  };

  const isModerator = (): boolean => {
    if (!user) return false;
    return ['moderator', 'admin', 'super_admin'].includes(user.role) || user.userType === 'admin';
  };

  const refreshBilling = async () => {
    if (!token || !user) return; // Use token state

    try {
      // Assuming apiRequest handles the Authorization header correctly if not passed explicitly
      const response = await apiRequest('/api/billing/me', {
        headers: { 'Authorization': `Bearer ${token}` }, // Use token state
      });

      // Assuming apiRequest returns the response object directly, and we need to check its status
      if (response && response.ok) { // Check if response is valid and has 'ok' property
        const data = await response.json();
        if (data.success) {
          setSubscription(data.data.subscription);
          setEntitlements(data.data.entitlements);
        }
      } else {
        // Handle cases where response.ok is false or response is null/undefined
        console.error('Failed to fetch billing data:', response);
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
    }
  };


  const value: AuthContextType = {
    user,
    subscription,
    entitlements,
    isLoading,
    login,
    logout,
    register,
    updateUser,
    hasPermission,
    isAdmin,
    isModerator,
    refreshBilling,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};