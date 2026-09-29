import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Users, Calendar, Briefcase, BookOpen, Image, LogOut, ShieldCheck, Activity } from 'lucide-react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { useMemo } from 'react';
import { Button } from '@/react-app/components/ui/button';

const navItems = [
  { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/admin/admins', icon: ShieldCheck, label: 'Admins', superOnly: true },
  { to: '/admin/directory', icon: Users, label: 'Directory', superOnly: true },
  { to: '/admin/activity', icon: Activity, label: 'Activity', superOnly: true },
  { to: '/admin/events', icon: Calendar, label: 'Events' },
  { to: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/admin/stories', icon: BookOpen, label: 'Stories', superOnly: true },
  { to: '/admin/gallery', icon: Image, label: 'Gallery', superOnly: true },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  const filteredNavItems = useMemo(() => {
    if (!user) return [];
    if (user.role === 'super_admin') return navItems;
    return navItems.filter(item => !item.superOnly);
  }, [user]);

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You do not have permission to access the admin panel.</p>
          <Button onClick={() => navigate('/admin/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-navy shadow-2xl flex-shrink-0 flex flex-col text-white sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10 bg-navy-dark">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6 text-navy" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
          </div>
          {user && (
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="font-bold text-gold text-sm truncate">{user.name}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">
                {user.role === 'super_admin' ? 'Super Admin' : `Admin: ${user.adminCompany}`}
              </p>
            </div>
          )}
        </div>
        <nav className="mt-6 flex-grow px-4">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-gold text-navy font-bold shadow-lg' 
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-navy' : 'group-hover:text-gold'}`} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-6 border-t border-white/10">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl font-bold"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8 min-w-0">
        <div className="animate-fadeIn">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

