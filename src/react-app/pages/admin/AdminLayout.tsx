import { NavLink, Outlet } from 'react-router-dom';
import { Home, Users, Calendar, Briefcase, UserPlus, Activity, Settings } from 'lucide-react';

import { useAuth } from '@/react-app/contexts/AuthContext';


export default function AdminLayout() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';

const navItems = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/alumni', icon: Users, label: 'Alumni Directory' },
    { to: '/admin/events', icon: Calendar, label: 'Events' },
    { to: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
  ];

  if (isSuperAdmin) {
    navItems.push({ to: '/admin/users', icon: UserPlus, label: 'Users' });
    navItems.push({ to: '/admin/audit', icon: Activity, label: 'Audit Logs' });
    navItems.push({ to: '/admin/settings', icon: Settings, label: 'Settings' });
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex-shrink-0">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-gray-600 hover:bg-gray-200 transition-colors duration-200 ${
                      isActive ? 'bg-gray-300 font-bold' : ''
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <div className="animate-fadeIn">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
