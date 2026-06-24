import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';
import type { FrontendUser } from '@/shared/types';


interface AuthContextType {
  user: FrontendUser | null;
  users: FrontendUser[];
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  createAdminUser: (username: string, email: string, password: string, name: string, permissions?: any[]) => Promise<boolean>;
  fetchUsers: () => Promise<void>;
  deleteUser: (id: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);




export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FrontendUser | null>(null);
  const [users, setUsers] = useState<FrontendUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch {
      setUser(null);
      localStorage.removeItem('jwt');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      getCurrentUser();
    }
    setIsLoading(false);
  }, []);


  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    try {
      const isEmail = usernameOrEmail.includes('@');
      const payload = isEmail 
        ? { email: usernameOrEmail, password } 
        : { username: usernameOrEmail, password };
      const { data } = await api.post('/auth/login', payload);
      localStorage.setItem('jwt', data.token);
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { data } = await api.post('/auth/register', { email, password, name });
      localStorage.setItem('jwt', data.token);
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  };

  const createAdminUser = async (username: string, email: string, password: string, name: string, permissions: any[] = []): Promise<boolean> => {
    if (user?.role !== 'superadmin') return false;
    try {
      await api.post('/admins', { username, email, password, name, permissions });
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jwt');
    api.defaults.headers.common['Authorization'] = '';
  };

  const isAuthenticated = !!localStorage.getItem('jwt') && !!user;

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admins');
      setUsers(data);
    } catch {
      setUsers([]);
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    if (user?.role !== 'superadmin') return false;
    try {
      await api.delete(`/admins/${id}`);
      setUsers(users.filter(u => u.id !== id));
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users,
      login, 
      register,
      createAdminUser, 
      fetchUsers,
      deleteUser,
      logout, 
      isLoading,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
}


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

