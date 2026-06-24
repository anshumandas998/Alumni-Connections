import { useState, useEffect } from 'react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/react-app/components/ui/dialog';

import { Users, Plus, Edit3, Trash2, Search } from 'lucide-react';
import api from '@/react-app/lib/api';
import type { AlumniProfile } from '@/shared/types';

export default function AlumniManagement() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editAlumni, setEditAlumni] = useState<Partial<AlumniProfile> | null>(null);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/alumni');
      setAlumni(data.alumni || data);
    } catch (error) {
      console.error('Failed to fetch alumni');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this alumni?')) {
      try {
        await api.delete(`/alumni/${id}`);
        fetchAlumni();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const handleSave = async () => {
    if (!editAlumni) return;
    try {
      if (editAlumni.id) {
        await api.put(`/alumni/${editAlumni.id}`, editAlumni);
      } else {
        await api.post('/alumni', editAlumni);
      }
      setIsDialogOpen(false);
      setEditAlumni(null);
      fetchAlumni();
    } catch (error) {
      alert('Save failed');
    }
  };

  const filteredAlumni = alumni.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-8 h-8" />
            Alumni Directory Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Alumni
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editAlumni?.id ? 'Edit Alumni' : 'Add Alumni'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Name" value={editAlumni?.name || ''} onChange={(e) => setEditAlumni({...editAlumni, name: e.target.value})} />
                <Input placeholder="Email" type="email" value={editAlumni?.email || ''} onChange={(e) => setEditAlumni({...editAlumni, email: e.target.value})} />
                <Input placeholder="Location" value={editAlumni?.location || ''} onChange={(e) => setEditAlumni({...editAlumni, location: e.target.value})} />
                <Input placeholder="Company" value={editAlumni?.company || ''} onChange={(e) => setEditAlumni({...editAlumni, company: e.target.value})} />
              </div>
              <DialogFooter>
                <Button onClick={handleSave}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search alumni..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : filteredAlumni.map((alum) => (
              <TableRow key={alum.id}>
                <TableCell>{alum.name}</TableCell>
                <TableCell>{alum.email}</TableCell>
                <TableCell>{alum.company}</TableCell>
                <TableCell>{alum.location}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditAlumni(alum)}>
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(alum.id)}>
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

