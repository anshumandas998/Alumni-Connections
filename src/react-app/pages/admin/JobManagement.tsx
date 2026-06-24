import { useState, useEffect } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/react-app/components/ui/dialog';

import { Briefcase, Plus, Edit3, Trash2, Search } from 'lucide-react';
import api from '@/react-app/lib/api';
import type { JobPosting } from '@/shared/types';

export default function JobManagement() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editJob, setEditJob] = useState<Partial<JobPosting> | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []); 

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/jobs');
      setJobs(data || []);
    } catch (error) {
      console.error('Failed to fetch jobs');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!isSuperAdmin) {
      alert('Super Admin only');
      return;
    }
    if (confirm('Delete this job?')) {
      try {
        await api.delete(`/jobs/${id}`);
        fetchJobs();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const handleSave = async () => {
    if (!editJob) return;
    if (editJob.id && !isSuperAdmin) {
      alert('Super Admin only');
      return;
    }
    try {
      if (editJob.id) {
        await api.put(`/jobs/${editJob.id}`, editJob);
      } else {
        await api.post('/jobs', editJob);
      }
      setIsDialogOpen(false);
      setEditJob(null);
      fetchJobs();
    } catch (error) {
      alert('Save failed');
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-8 h-8" />
            Job Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Job
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editJob?.id ? 'Edit Job' : 'Add Job'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Title" value={editJob?.title || ''} onChange={(e) => setEditJob({...editJob, title: e.target.value})} />
                <Input placeholder="Company" value={editJob?.company || ''} onChange={(e) => setEditJob({...editJob, company: e.target.value})} />
                <Input placeholder="Location" value={editJob?.location || ''} onChange={(e) => setEditJob({...editJob, location: e.target.value})} />
                <Input placeholder="Salary" value={editJob?.salary || ''} onChange={(e) => setEditJob({...editJob, salary: e.target.value})} />
                <Input placeholder="Description" value={editJob?.description || ''} onChange={(e) => setEditJob({...editJob, description: e.target.value})} />
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
              placeholder="Search jobs..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : filteredJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.location}</TableCell>
              <TableCell className="space-x-2">
                  {(isSuperAdmin || job.postedBy === user?.id) && (
                    <Button variant="outline" size="sm" onClick={() => setEditJob(job)}>
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  )}
                  {isSuperAdmin && (
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(job.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

