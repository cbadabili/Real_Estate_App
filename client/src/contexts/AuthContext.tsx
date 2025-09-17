import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Added to track authentication status
  const [token, setToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  );
  const [userId, setUserId] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null
  );

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        console.log('Checking auth with token:', token.substring(0, 20) + '...');

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
      } catch (error) {
        console.error('Auth check failed:', error);

        // Only clear token if it's actually invalid (401), not for network errors
        if (error?.message === 'User not authenticated' || error?.status === 401) {
          console.log('Clearing invalid token');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setUser(null);
          setIsAuthenticated(false);
        } else {
          console.log('Auth check failed due to network/other error, keeping token');
          // Don't clear the token for network errors, user might be offline
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []); // Dependency array is empty to run only once on mount

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null); // Assuming setError is a state variable managed elsewhere, or a placeholder

      const response = await apiRequest('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.token && response.id) {
        // Store the JWT token - this is the key fix
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.id.toString());

        // Set user state and authentication status
        setUser(response);
        setIsAuthenticated(true);
        setToken(response.token); // Update local state
        setUserId(response.id.toString()); // Update local state

        console.log('Login successful, token stored:', response.token.substring(0, 20) + '...');
        return response;
      } else {
        throw new Error('Invalid login response: missing token or user ID');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Login failed';
      setError(errorMessage); // Assuming setError is a state variable managed elsewhere
      throw new Error(errorMessage);
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
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
    setIsAuthenticated(false);
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
      setUser({ ...user, ...updates });
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