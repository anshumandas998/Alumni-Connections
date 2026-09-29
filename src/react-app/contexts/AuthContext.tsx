import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/shared/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  updateProfile: (updatedData: Partial<User>) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock load from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as User;
        setUser(parsed);
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const recordLogin = (loggedInUser: User) => {
    const history = localStorage.getItem('login_history');
    const logs = history ? JSON.parse(history) : [];
    logs.unshift({
      id: Date.now(),
      userId: loggedInUser.id,
      name: loggedInUser.name,
      email: loggedInUser.email,
      role: loggedInUser.role,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('login_history', JSON.stringify(logs.slice(0, 100))); // Keep last 100
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock auth
    if (email && password.length > 5) {
      // Check custom admins first
      const savedAdmins = localStorage.getItem('company_admins');
      if (savedAdmins) {
        const admins: User[] = JSON.parse(savedAdmins);
        const customAdmin = admins.find(a => a.email === email && a.password === password);
        if (customAdmin) {
          setUser(customAdmin);
          localStorage.setItem('user', JSON.stringify(customAdmin));
          localStorage.setItem('isAdmin', 'true');
          recordLogin(customAdmin);
          return true;
        }
      }

      // Check alumni directory for normal user login
      const savedAlumni = localStorage.getItem('alumni_directory');
      if (savedAlumni) {
        const alumni: any[] = JSON.parse(savedAlumni);
        const targetAlumni = alumni.find(a => a.email === email && a.password === password);
        if (targetAlumni) {
          const alumniUser: User = {
            id: targetAlumni.id,
            email: targetAlumni.email,
            name: targetAlumni.name,
            role: 'alumni',
            profile: {
              bio: targetAlumni.bio,
              location: targetAlumni.location,
              company: targetAlumni.company,
              jobTitle: targetAlumni.jobTitle,
              graduationYear: targetAlumni.graduationYear,
              skills: targetAlumni.skills
            }
          };
          setUser(alumniUser);
          localStorage.setItem('user', JSON.stringify(alumniUser));
          recordLogin(alumniUser);
          return true;
        }
      }

      let mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        role: 'alumni',
        profile: { bio: 'Experienced developer', location: 'San Francisco' }
      };

      if (email === 'admin@company.com' && password === 'password123') {
        mockUser = {
          ...mockUser,
          id: '2',
          name: 'Company Admin',
          role: 'admin',
          adminCompany: 'TechCorp'
        };
      } else if (email === 'superadmin@alumni.com' && password === 'password123') {
        mockUser = {
          ...mockUser,
          id: '3',
          name: 'Super Admin',
          role: 'super_admin'
        };
      } else {
        // If not custom admin and not hardcoded demo admin with correct password, fail
        if (email === 'admin@company.com' || email === 'superadmin@alumni.com') {
           return false;
        }
      }

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      if (mockUser.role === 'admin' || mockUser.role === 'super_admin') {
        localStorage.setItem('isAdmin', 'true');
      }
      recordLogin(mockUser);
      return true;
    }
    return false;
  };

  const register = async (email: string, _password: string, name: string): Promise<boolean> => {
    // Mock register
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'alumni'
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return true;
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      ...updatedData,
      profile: {
        ...user.profile,
        ...(updatedData.profile || {})
      }
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Also sync with alumni_directory if user exists there
    const savedAlumni = localStorage.getItem('alumni_directory');
    if (savedAlumni) {
      try {
        const alumniList = JSON.parse(savedAlumni);
        if (Array.isArray(alumniList)) {
          const index = alumniList.findIndex((a: any) => a.id === user.id || a.email === user.email);
          if (index !== -1) {
            alumniList[index] = {
              ...alumniList[index],
              name: updatedUser.name,
              bio: updatedUser.profile?.bio,
              location: updatedUser.profile?.location,
              company: updatedUser.profile?.company,
              jobTitle: updatedUser.profile?.jobTitle,
              graduationYear: updatedUser.profile?.graduationYear,
              skills: updatedUser.profile?.skills
            };
            localStorage.setItem('alumni_directory', JSON.stringify(alumniList));
          }
        }
      } catch (e) {
        console.error("Error syncing profile with directory:", e);
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

