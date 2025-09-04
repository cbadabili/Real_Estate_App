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
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isModerator: () => boolean;
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
        // Extract user ID from token
        const userId = authToken.split('_')[1];
        if (!userId) {
          throw new Error('Invalid token format');
        }

        const userData = await apiRequest(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        setUser(userData);
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
      const response = await apiRequest('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password.trim() 
        })
      });

      // Set user data
      setUser(response);
      
      // Create a token that the middleware can understand
      const token = response.id.toString();
      setAuthToken(token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
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

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register,
    updateUser,
    hasPermission,
    isAdmin,
    isModerator
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};