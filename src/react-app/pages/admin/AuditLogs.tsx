import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { Badge } from '@/react-app/components/ui/badge';
import { Activity, Clock, User, Target } from 'lucide-react';
import api from '@/react-app/lib/api';

interface AuditLog {
  _id: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: string;
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await api.get('/audit');
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch audit logs');
    }
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-center">Loading audit logs...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl flex items-center gap-2">
          <Activity className="w-8 h-8" />
          System Audit Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell className="text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{log.user.name}</span>
                    <span className="text-xs text-gray-500">{log.user.role}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{log.action}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-400" />
                    {log.resource}
                    {log.resourceId && <span className="text-xs text-gray-400">({log.resourceId})</span>}
                  </div>
                </TableCell>
                <TableCell>
                  <pre className="text-xs bg-gray-50 p-2 rounded max-w-xs overflow-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
