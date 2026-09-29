import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Trash2, PlusCircle, Edit2 } from 'lucide-react';
import { AlumniProfile } from '@/shared/types';

const mockAlumni: AlumniProfile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    location: 'San Francisco, CA',
    company: 'TechCorp',
    jobTitle: 'Senior Developer',
    graduationYear: 2018,
    skills: ['React', 'Node.js', 'Leadership'],
    bio: 'Passionate full-stack developer with 5+ years experience.',
    password: 'password123'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    location: 'New York, NY',
    company: 'FinanceHub',
    jobTitle: 'Product Manager',
    graduationYear: 2015,
    skills: ['Product', 'Strategy', 'Analytics'],
    bio: 'Building innovative fintech solutions.',
    password: 'password123'
  }
];

export default function AdminDirectory() {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState<AlumniProfile[]>(() => {
    try {
      const saved = localStorage.getItem('alumni_directory');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : mockAlumni;
      }
    } catch (e) {
      console.error("Error loading alumni from localStorage:", e);
    }
    return mockAlumni;
  });
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAlumni, setNewAlumni] = useState({ name: '', email: '', location: '', company: '', jobTitle: '', graduationYear: 2024, skills: '', bio: '', password: '' });

  useEffect(() => {
    localStorage.setItem('alumni_directory', JSON.stringify(alumni));
  }, [alumni]);

  const isSuperAdmin = user?.role === 'super_admin';

  const createAlumni = () => {
    if (editingId) {
      setAlumni(alumni.map(a => a.id === editingId ? { ...newAlumni, id: editingId, skills: newAlumni.skills.split(',').map(s => s.trim()) } : a));
      setEditingId(null);
    } else {
      setAlumni([...alumni, { ...newAlumni, id: String(Date.now()), skills: newAlumni.skills.split(',').map(s => s.trim()) }]);
    }
    setIsCreating(false);
    setNewAlumni({ name: '', email: '', location: '', company: '', jobTitle: '', graduationYear: 2024, skills: '', bio: '', password: '' });
  };

  const startEdit = (a: AlumniProfile) => {
    setEditingId(a.id);
    setNewAlumni({
      name: a.name,
      email: a.email,
      location: a.location || '',
      company: a.company || '',
      jobTitle: a.jobTitle || '',
      graduationYear: a.graduationYear || 2024,
      skills: a.skills?.join(', ') || '',
      bio: a.bio || '',
      password: a.password || ''
    });
    setIsCreating(true);
  };

  const deleteUser = (id: string) => {
    setAlumni(alumni.filter(a => a.id !== id));
  };

  const filteredAlumni = useMemo(() => {
    return alumni.filter(a => 
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      a.company?.toLowerCase().includes(search.toLowerCase())
    );
  }, [alumni, search]);

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Access Restricted</h2>
        <p className="text-muted-foreground">Only Super Admins can manage the global alumni directory.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Admin Alumni Directory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search alumni..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={() => {
            if (isCreating) {
              setEditingId(null);
              setNewAlumni({ name: '', email: '', location: '', company: '', jobTitle: '', graduationYear: 2024, skills: '', bio: '', password: '' });
            }
            setIsCreating(!isCreating);
          }}>
            <PlusCircle className="w-4 h-4 mr-2" />
            {isCreating ? 'Cancel' : 'Create Alumni'}
          </Button>
        </div>

        {isCreating && (
          <div className="space-y-4 mb-8 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-bold">{editingId ? 'Edit Alumni' : 'Create New Alumni'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Name" value={newAlumni.name} onChange={(e) => setNewAlumni({ ...newAlumni, name: e.target.value })} />
              <Input placeholder="Email" value={newAlumni.email} onChange={(e) => setNewAlumni({ ...newAlumni, email: e.target.value })} />
              <Input placeholder="Location" value={newAlumni.location} onChange={(e) => setNewAlumni({ ...newAlumni, location: e.target.value })} />
              <Input placeholder="Company" value={newAlumni.company} onChange={(e) => setNewAlumni({ ...newAlumni, company: e.target.value })} />
              <Input placeholder="Job Title" value={newAlumni.jobTitle} onChange={(e) => setNewAlumni({ ...newAlumni, jobTitle: e.target.value })} />
              <Input type="number" placeholder="Graduation Year" value={newAlumni.graduationYear} onChange={(e) => setNewAlumni({ ...newAlumni, graduationYear: parseInt(e.target.value) })} />
              <Input placeholder="Password" value={newAlumni.password} onChange={(e) => setNewAlumni({ ...newAlumni, password: e.target.value })} />
            </div>
            <Input placeholder="Skills (comma separated)" value={newAlumni.skills} onChange={(e) => setNewAlumni({ ...newAlumni, skills: e.target.value })} />
            <Input placeholder="Bio" value={newAlumni.bio} onChange={(e) => setNewAlumni({ ...newAlumni, bio: e.target.value })} />
            <Button onClick={createAlumni} className="w-full bg-navy hover:bg-navy/90">{editingId ? 'Update Alumni' : 'Save Alumni'}</Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Password</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlumni.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.name}</TableCell>
                <TableCell>{a.email}</TableCell>
                <TableCell>{a.company}</TableCell>
                <TableCell>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">{a.password}</code>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(a)}>
                    <Edit2 className="w-4 h-4 text-navy" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteUser(a.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
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
