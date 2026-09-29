import { useState, useEffect } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { Badge } from '@/react-app/components/ui/badge';
import { Activity, User as UserIcon, Clock, Mail } from 'lucide-react';

interface LoginLog {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: string;
  timestamp: string;
}

export default function AdminActivity() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LoginLog[]>([]);

  useEffect(() => {
    const history = localStorage.getItem('login_history');
    if (history) {
      try {
        const parsed = JSON.parse(history);
        if (Array.isArray(parsed)) {
          setLogs(parsed);
        }
      } catch (e) {
        console.error("Error parsing login history:", e);
      }
    }
  }, []);

  if (!user || user.role !== 'super_admin') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="text-gray-600">Only Super Admins can view login activity.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-navy p-8 rounded-3xl relative overflow-hidden mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-bold uppercase tracking-widest mb-4">
            <Activity className="w-4 h-4" />
            System Audit
          </div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            User Login Activity
          </h1>
          <p className="text-white/60 mt-2">Monitor authentication events across the platform.</p>
        </div>
      </div>

      <Card className="border-navy/10 shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-navy text-white">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Authentication Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold">User</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Role</TableHead>
                <TableHead className="font-bold text-right">Login Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="font-medium text-slate-900">{log.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Mail className="w-4 h-4" />
                      {log.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={log.role === 'super_admin' ? 'default' : log.role === 'admin' ? 'secondary' : 'outline'}
                      className="capitalize"
                    >
                      {log.role.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-slate-500 font-mono text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-slate-400 italic">
                    No login activity recorded yet.
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
