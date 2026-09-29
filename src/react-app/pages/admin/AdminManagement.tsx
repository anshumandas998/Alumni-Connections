import { useState, useMemo, useEffect, FormEvent } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { UserPlus, Shield, Trash2, Mail, Building2 } from 'lucide-react';
import { User } from '@/shared/types';

// Mock existing admins
const initialAdmins: User[] = [
  {
    id: 'admin-1',
    email: 'admin@company.com',
    name: 'TechCorp Admin',
    role: 'admin',
    adminCompany: 'TechCorp',
    password: 'password123'
  },
  {
    id: 'admin-2',
    email: 'hr@startupx.com',
    name: 'StartupX HR',
    role: 'admin',
    adminCompany: 'StartupX',
    password: 'password123'
  }
];

export default function AdminManagement() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('company_admins');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : initialAdmins;
      }
    } catch (e) {
      console.error("Error loading admins from localStorage:", e);
    }
    return initialAdmins;
  });
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    adminCompany: '',
    password: '',
    adminId: ''
  });

  useEffect(() => {
    localStorage.setItem('company_admins', JSON.stringify(admins));
  }, [admins]);

  const filteredAdmins = useMemo(() => {
    return admins.filter(a => 
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.adminCompany?.toLowerCase().includes(search.toLowerCase())
    );
  }, [admins, search]);

  const handleCreateAdmin = (e: FormEvent) => {
    e.preventDefault();
    const createdAdmin: User = {
      id: newAdmin.adminId || `admin-${Date.now()}`,
      name: newAdmin.name,
      email: newAdmin.email,
      role: 'admin',
      adminCompany: newAdmin.adminCompany,
      password: newAdmin.password
    };
    setAdmins([...admins, createdAdmin]);
    setNewAdmin({ name: '', email: '', adminCompany: '', password: '', adminId: '' });
    setIsCreating(false);
  };

  const deleteAdmin = (id: string) => {
    setAdmins(admins.filter(a => a.id !== id));
  };

  if (!user || user.role !== 'super_admin') {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">Only Super Admins can manage other admins.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-navy p-8 rounded-3xl relative overflow-hidden mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-bold uppercase tracking-widest mb-4">
            <Shield className="w-4 h-4" />
            Security & Access
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                Admin Management
              </h1>
              <p className="text-white/60 mt-2">Manage access and permissions for company administrators.</p>
            </div>
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-6 rounded-2xl shadow-lg transition-all flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Create New Admin
            </Button>
          </div>
        </div>
      </div>

      {isCreating && (
        <Card className="border-gold/30 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader className="bg-navy text-white rounded-t-xl">
            <CardTitle className="text-xl flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gold" />
              Add New Company Admin Account
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleCreateAdmin} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Admin Name</label>
                  <Input 
                    placeholder="e.g. Rahul Sharma" 
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                    className="h-12 rounded-xl border-slate-200 focus:border-gold focus:ring-gold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Admin Email (for Login)</label>
                  <Input 
                    type="email"
                    placeholder="e.g. rahul@company.com" 
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    className="h-12 rounded-xl border-slate-200 focus:border-gold focus:ring-gold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Assigned Company</label>
                  <Input 
                    placeholder="e.g. Google, Microsoft, etc." 
                    value={newAdmin.adminCompany}
                    onChange={(e) => setNewAdmin({...newAdmin, adminCompany: e.target.value})}
                    className="h-12 rounded-xl border-slate-200 focus:border-gold focus:ring-gold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Custom Admin ID (Optional)</label>
                  <Input 
                    placeholder="e.g. ADM-001" 
                    value={newAdmin.adminId}
                    onChange={(e) => setNewAdmin({...newAdmin, adminId: e.target.value})}
                    className="h-12 rounded-xl border-slate-200 focus:border-gold focus:ring-gold"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Create Password</label>
                  <Input 
                    type="text"
                    placeholder="Enter secure password" 
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                    className="h-12 rounded-xl border-slate-200 focus:border-gold focus:ring-gold font-mono"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-navy font-black h-14 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all uppercase tracking-widest">
                Confirm & Create Admin
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-navy/10 shadow-xl">
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between items-md-center gap-4">
            <CardTitle className="text-navy">Active Company Admins</CardTitle>
            <div className="relative max-w-xs">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search by name or company..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 rounded-lg border-slate-200"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold text-navy">Admin ID</TableHead>
                <TableHead className="font-bold text-navy">Name</TableHead>
                <TableHead className="font-bold text-navy">Email</TableHead>
                <TableHead className="font-bold text-navy">Company</TableHead>
                <TableHead className="font-bold text-navy">Password</TableHead>
                <TableHead className="text-right font-bold text-navy">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map((admin) => (
                <TableRow key={admin.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-slate-500">{admin.id}</TableCell>
                  <TableCell className="font-bold text-slate-900">{admin.name}</TableCell>
                  <TableCell className="text-slate-600">{admin.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gold" />
                      <span className="font-medium text-navy">{admin.adminCompany}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="bg-slate-100 text-gold px-2 py-1 rounded-md text-xs font-bold border border-slate-200">
                      {admin.password}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteAdmin(admin.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAdmins.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-400 italic">
                    No matching admin accounts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
