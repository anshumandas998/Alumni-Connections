import { useState, useEffect } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/react-app/components/ui/dialog';
import { Badge } from '@/react-app/components/ui/badge';
import { Switch } from '@/react-app/components/ui/switch';
import { Users, Plus, Edit3, Trash2, UserPlus } from 'lucide-react';
import type { User } from '@/shared/types';
import api from '@/react-app/lib/api';

export default function AdminUsers() {
  const { users, createAdminUser, user: currentUser, fetchUsers, deleteUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateAdmin = async () => {
    setLoading(true);
    const success = await createAdminUser(newUsername, newEmail, newPassword, newName);
    if (success) {
      setIsDialogOpen(false);
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setNewName('');
      fetchUsers();
    }
    setLoading(false);
  };

  const toggleUserStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/admins/${id}`, { isActive: !currentStatus });
      fetchUsers();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (currentUser?.id === id) {
      alert('Cannot delete yourself!');
      return;
    }
    if (!confirm('Delete this user?')) return;
    const success = await deleteUser(id);
    if (success) {
      alert('User deleted');
    } else {
      alert('Delete failed');
    }
  };

  if (currentUser?.role !== 'superadmin') {
    return <div>Access denied. Superadmin only.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl flex items-center gap-2">
          <Users className="w-8 h-8" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Admin User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Admin</DialogTitle>
                <DialogDescription>
                  Superadmin can create admin accounts.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <Input
                  placeholder="Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Input
                  placeholder="Password (demo: password123)"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleCreateAdmin} disabled={loading}>
                  {loading ? 'Creating...' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u: User) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant={u.role === 'superadmin' ? 'default' : u.role === 'admin' ? 'secondary' : 'outline'}>
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={u.isActive !== false}
                      onCheckedChange={() => toggleUserStatus(u.id as string, u.isActive !== false)}
                      disabled={currentUser?.id === u.id}
                    />
                    <span className="text-sm">
                      {u.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(u.id as string)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

