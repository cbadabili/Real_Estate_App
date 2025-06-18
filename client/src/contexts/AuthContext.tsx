import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'fsbo' | 'agent' | 'buyer';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, type: 'fsbo' | 'agent' | 'buyer') => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
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
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    type: 'fsbo',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  });

  const login = async (email: string, password: string, type: 'fsbo' | 'agent' | 'buyer') => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      id: '1',
      name: 'John Doe',
      email,
      type,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
    });
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      id: '1',
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      type: userData.type,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
    });
  };

  const value = {
    user,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};