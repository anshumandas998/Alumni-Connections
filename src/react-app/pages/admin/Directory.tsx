import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/react-app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Users, Search, Filter, MapPin, Briefcase, GraduationCap, Trash2, PlusCircle } from 'lucide-react';
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
    bio: 'Passionate full-stack developer with 5+ years experience.'
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
    bio: 'Building innovative fintech solutions.'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@example.com',
    location: 'Austin, TX',
    company: 'StartupX',
    jobTitle: 'Marketing Lead',
    graduationYear: 2020,
    skills: ['Marketing', 'Growth', 'SEO'],
    bio: 'Driving user growth for early-stage startups.'
  }
];

export default function AdminDirectory() {
  const [alumni, setAlumni] = useState(mockAlumni);
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newAlumni, setNewAlumni] = useState({ name: '', email: '', location: '', company: '', jobTitle: '', graduationYear: 2024, skills: '', bio: '' });

  const createAlumni = () => {
    setAlumni([...alumni, { ...newAlumni, id: String(alumni.length + 1), skills: newAlumni.skills.split(',').map(s => s.trim()) }]);
    setIsCreating(false);
    setNewAlumni({ name: '', email: '', location: '', company: '', jobTitle: '', graduationYear: 2024, skills: '', bio: '' });
  };

  const deleteUser = (id: string) => {
    setAlumni(alumni.filter(a => a.id !== id));
  };

  useEffect(() => {
    let filtered = mockAlumni;

    if (search) {
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
        a.company?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setAlumni(filtered);
  }, [search]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Admin Alumni Directory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search by name, email, company, or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={() => setIsCreating(!isCreating)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            {isCreating ? 'Cancel' : 'Create Alumni'}
          </Button>
        </div>

        {isCreating && (
          <div className="space-y-4 mb-8 p-4 border rounded-lg">
            <Input placeholder="Name" value={newAlumni.name} onChange={(e) => setNewAlumni({ ...newAlumni, name: e.target.value })} />
            <Input placeholder="Email" value={newAlumni.email} onChange={(e) => setNewAlumni({ ...newAlumni, email: e.target.value })} />
            <Input placeholder="Location" value={newAlumni.location} onChange={(e) => setNewAlumni({ ...newAlumni, location: e.target.value })} />
            <Input placeholder="Company" value={newAlumni.company} onChange={(e) => setNewAlumni({ ...newAlumni, company: e.target.value })} />
            <Input placeholder="Job Title" value={newAlumni.jobTitle} onChange={(e) => setNewAlumni({ ...newAlumni, jobTitle: e.target.value })} />
            <Input type="number" placeholder="Graduation Year" value={newAlumni.graduationYear} onChange={(e) => setNewAlumni({ ...newAlumni, graduationYear: Number(e.target.value) })} />
            <Input placeholder="Skills (comma-separated)" value={newAlumni.skills} onChange={(e) => setNewAlumni({ ...newAlumni, skills: e.target.value })} />
            <Input placeholder="Bio" value={newAlumni.bio} onChange={(e) => setNewAlumni({ ...newAlumni, bio: e.target.value })} />
            <Button onClick={createAlumni}>Save Alumni</Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Graduation Year</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alumni.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell>{user.jobTitle}</TableCell>
                <TableCell>{user.graduationYear}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
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
