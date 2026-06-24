import { useState } from 'react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Textarea } from '@/react-app/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { JobPosting } from '@/shared/types';
import { PlusCircle, Trash2 } from 'lucide-react';


const mockJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechCorp',
    location: 'Bengaluru, India (Hybrid)',
    salary: '₹25,00,000 - ₹35,00,000',
    description: 'Build responsive web applications using React, TypeScript, and modern tooling. Join our innovative team shaping the future of edtech.',
    postedBy: 'John Smith',
    applyUrl: '#'
  },
  {
    id: '2',
    title: 'Product Manager - Growth',
    company: 'StartupX',
    location: 'Remote (India)',
    salary: '₹20,00,000 - ₹30,00,000',
    description: 'Drive user acquisition and retention strategies for our SaaS platform. Work cross-functionally with engineering and design.',
    postedBy: 'Sarah Lee',
    applyUrl: 'https://startupx.com/careers/pm-growth'
  },
];

export default function AdminJobs() {
  const [jobs, setJobs] = useState(mockJobs);
  const [isCreating, setIsCreating] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', salary: '', description: '', postedBy: '', applyUrl: '' });

  const createJob = () => {
    setJobs([...jobs, { ...newJob, id: String(jobs.length + 1) }]);
    setIsCreating(false);
    setNewJob({ title: '', company: '', location: '', salary: '', description: '', postedBy: '', applyUrl: '' });
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Manage Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setIsCreating(!isCreating)} className="mb-4">
          <PlusCircle className="w-4 h-4 mr-2" />
          {isCreating ? 'Cancel' : 'Create Job'}
        </Button>

        {isCreating && (
          <div className="space-y-4 mb-8 p-4 border rounded-lg">
            <Input placeholder="Title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} />
            <Input placeholder="Company" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} />
            <Input placeholder="Location" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
            <Input placeholder="Salary" value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} />
            <Textarea placeholder="Description" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} />
            <Input placeholder="Posted By" value={newJob.postedBy} onChange={(e) => setNewJob({ ...newJob, postedBy: e.target.value })} />
            <Input placeholder="Apply URL" value={newJob.applyUrl} onChange={(e) => setNewJob({ ...newJob, applyUrl: e.target.value })} />
            <Button onClick={createJob}>Save Job</Button>
          </div>
        )}

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
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => deleteJob(job.id)}>
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
