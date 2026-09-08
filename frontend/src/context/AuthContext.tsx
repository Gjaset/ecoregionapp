import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ecoregion_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('ecoregion_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = JSON.parse(localStorage.getItem('ecoregion_users') || '[]');
    const found = users.find((u: any) => u.email === email && u.password === password);
    
    if (!found) {
      setIsLoading(false);
      throw new Error('Credenciales inválidas');
    }
    
    const { password: _, ...userData } = found;
    setUser(userData);
    localStorage.setItem('ecoregion_user', JSON.stringify(userData));
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = JSON.parse(localStorage.getItem('ecoregion_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      setIsLoading(false);
      throw new Error('El email ya está registrado');
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role: users.length === 0 ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
    };
    
    users.push({ ...newUser, password });
    localStorage.setItem('ecoregion_users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('ecoregion_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecoregion_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}