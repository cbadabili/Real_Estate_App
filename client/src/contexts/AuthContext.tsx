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
  const [authToken, setAuthToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  );

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!authToken) {
        setIsLoading(false);
        return;
      }

      try {
        // The token is simply the user ID
        const userId = authToken;
        if (!userId || isNaN(Number(userId))) {
          throw new Error('Invalid token format');
        }

        const userData = await apiRequest(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        setUser(userData);
        // Fetch billing data after setting user
        setTimeout(() => {
          refreshBilling();
        }, 100);
      } catch (error) {
        console.error('Auth check failed:', error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
        }
        setAuthToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [authToken]);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    setIsLoading(true);
    try {
      console.log('Attempting login for:', email.trim());

      const response = await apiRequest('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password: password.trim() 
        })
      });

      console.log('Login response received:', { 
        id: response.id, 
        email: response.email, 
        userType: response.userType 
      });

      // Validate response
      if (!response.id || !response.email) {
        throw new Error('Invalid login response from server');
      }

      // Set user data
      setUser(response);

      // Use the JWT token returned from the server, or fall back to simple ID token
      const token = response.token || response.id.toString();
      setAuthToken(token);

      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        console.log('Auth token stored:', token);
      }

      // Fetch billing data after login
      setTimeout(() => refreshBilling(), 100);
    } catch (error) {
      console.error('Login failed:', error);

      // Clear any existing auth state on login failure
      setUser(null);
      setAuthToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }

      // Re-throw with more specific error message
      if (error.message?.includes('Invalid credentials')) {
        throw new Error('Invalid email or password');
      } else if (error.message?.includes('Account is inactive')) {
        throw new Error('Your account has been deactivated. Please contact support.');
      } else {
        throw new Error('Login failed. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setSubscription(null);
    setEntitlements(null);
    setAuthToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
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
    const token = localStorage.getItem('authToken'); // Use authToken state
    if (!token || !user) return;

    try {
      const response = await apiRequest('/api/billing/me', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSubscription(data.data.subscription);
          setEntitlements(data.data.entitlements);
        }
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