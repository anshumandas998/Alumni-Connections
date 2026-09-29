import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Textarea } from '@/react-app/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { JobPosting } from '@/shared/types';
import { PlusCircle, Trash2, Edit2, Briefcase, Search, CheckCircle, XCircle, X } from 'lucide-react';
import { Badge } from '@/react-app/components/ui/badge';

const defaultJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechCorp',
    location: 'Bengaluru, India (Hybrid)',
    salary: '₹25,00,000 - ₹35,00,000',
    type: 'Full Time',
    description: 'Build responsive web applications using React, TypeScript, and modern tooling. Join our innovative engineering team building next-generation products.',
    postedBy: 'TechCorp Careers',
    applyUrl: '#',
    requirements: ['React', 'TypeScript', 'TailwindCSS', 'Node.js'],
    datePosted: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '2',
    title: 'Product Manager - Growth',
    company: 'StartupX',
    location: 'Remote (India / Global)',
    salary: '₹20,00,000 - ₹30,00,000',
    type: 'Remote',
    description: 'Drive user acquisition and retention strategies for our global SaaS platform. Collaborate cross-functionally with design, data, and engineering.',
    postedBy: 'StartupX HR',
    applyUrl: 'https://startupx.com/careers/pm-growth',
    requirements: ['Product Management', 'Data Analysis', 'Growth Experiments', 'SaaS'],
    datePosted: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '3',
    title: 'Lead AI / ML Research Engineer',
    company: 'NextGen AI Lab',
    location: 'San Francisco, CA (or Remote)',
    salary: '$180,000 - $220,000',
    type: 'Full Time',
    description: 'Work on cutting-edge LLM fine-tuning, retrieval algorithms, and agentic workflows. Founded by alumni from Class of 2018.',
    postedBy: 'David Lee',
    applyUrl: '#',
    requirements: ['PyTorch', 'LLMs', 'Python', 'Vector DBs'],
    datePosted: new Date().toISOString(),
    status: 'active'
  }
];

export default function AdminJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>(() => {
    try {
      const saved = localStorage.getItem('alumni_jobs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load jobs from storage', e);
    }
    return defaultJobs;
  });

  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialNewJob = useMemo(() => ({
    title: '', 
    company: user?.role === 'admin' ? (user.adminCompany || '') : '', 
    location: '', 
    salary: '', 
    type: 'Full Time' as NonNullable<JobPosting['type']>,
    description: '', 
    postedBy: user?.name || '', 
    applyUrl: '',
    requirements: '',
    status: 'active' as 'active' | 'closed'
  }), [user]);

  const [newJob, setNewJob] = useState(initialNewJob);

  useEffect(() => {
    localStorage.setItem('alumni_jobs', JSON.stringify(jobs));
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (!user) return [];
    let list = user.role === 'super_admin' ? jobs : jobs.filter(j => j.company === user.adminCompany);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(j => 
        j.title.toLowerCase().includes(q) || 
        j.company.toLowerCase().includes(q) || 
        j.location.toLowerCase().includes(q)
      );
    }
    return list;
  }, [jobs, user, search]);

  const saveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title.trim() || !newJob.company.trim()) return;

    const requirementsList = typeof newJob.requirements === 'string' 
      ? newJob.requirements.split(',').map(r => r.trim()).filter(r => r !== '')
      : (newJob.requirements || []);

    const jobData: JobPosting = {
      id: editingId || `job-${Date.now()}`,
      title: newJob.title,
      company: newJob.company,
      location: newJob.location,
      salary: newJob.salary,
      type: newJob.type,
      description: newJob.description,
      postedBy: newJob.postedBy || user?.name || 'Admin',
      applyUrl: newJob.applyUrl || '#',
      requirements: requirementsList,
      datePosted: new Date().toISOString(),
      status: newJob.status
    };

    if (editingId) {
      setJobs(jobs.map(j => j.id === editingId ? jobData : j));
      setEditingId(null);
    } else {
      setJobs([jobData, ...jobs]);
    }
    
    setIsCreating(false);
    setNewJob(initialNewJob);
  };

  const startEdit = (job: JobPosting) => {
    setEditingId(job.id);
    setNewJob({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary || '',
      type: job.type || 'Full Time',
      description: job.description,
      postedBy: job.postedBy,
      applyUrl: job.applyUrl || '',
      requirements: (job.requirements || []).join(', '),
      status: job.status || 'active'
    });
    setIsCreating(true);
  };

  const toggleStatus = (id: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: j.status === 'closed' ? 'active' : 'closed' } : j));
  };

  const deleteJob = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-navy p-8 rounded-3xl relative overflow-hidden mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-bold uppercase tracking-widest mb-4">
            <Briefcase className="w-4 h-4" />
            Career Portal
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                Job Postings {user.role === 'admin' ? `for ${user.adminCompany}` : '(All Companies)'}
              </h1>
              <p className="text-white/60 mt-2">Publish and manage career opportunities for the alumni community.</p>
            </div>
            <Button 
              onClick={() => {
                setEditingId(null);
                setNewJob(initialNewJob);
                setIsCreating(!isCreating);
              }}
              className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-6 rounded-2xl shadow-lg transition-all flex items-center gap-2"
            >
              {isCreating ? <X className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
              {isCreating ? 'Cancel' : 'Post New Job'}
            </Button>
          </div>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={saveJob} className="bg-white rounded-3xl p-8 shadow-xl border border-navy/10 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-bold text-navy flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gold" />
              {editingId ? 'Edit Job Posting' : 'Post a New Job'}
            </h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Title *</label>
              <Input 
                required 
                placeholder="e.g. Senior Frontend Engineer" 
                value={newJob.title} 
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} 
                className="rounded-xl py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Name *</label>
              <Input 
                required 
                placeholder="e.g. TechCorp" 
                disabled={user.role === 'admin'}
                value={newJob.company} 
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} 
                className="rounded-xl py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Type</label>
              <select
                value={newJob.type}
                onChange={(e) => setNewJob({ ...newJob, type: e.target.value as any })}
                className="w-full h-11 px-4 border border-input rounded-xl bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="Full Time">Full Time</option>
                <option value="Remote">Remote</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Location *</label>
              <Input 
                required 
                placeholder="e.g. Bengaluru, India or Remote" 
                value={newJob.location} 
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} 
                className="rounded-xl py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Salary / Compensation</label>
              <Input 
                placeholder="e.g. ₹25L - ₹35L or $140,000/yr" 
                value={newJob.salary} 
                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} 
                className="rounded-xl py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">External Apply URL (Optional)</label>
              <Input 
                placeholder="e.g. https://company.com/apply" 
                value={newJob.applyUrl} 
                onChange={(e) => setNewJob({ ...newJob, applyUrl: e.target.value })} 
                className="rounded-xl py-3"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Skills & Requirements (Comma Separated)</label>
            <Input 
              placeholder="e.g. React, TypeScript, Next.js, Node.js" 
              value={newJob.requirements} 
              onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })} 
              className="rounded-xl py-3"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Description *</label>
            <Textarea 
              required
              rows={4}
              placeholder="Detailed description of responsibilities, qualifications, perks, and mission..." 
              value={newJob.description} 
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} 
              className="rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="bg-navy hover:bg-navy/90 text-white font-bold px-8 rounded-xl">
              {editingId ? 'Save Changes' : 'Publish Job'}
            </Button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs by title, company, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-gold/50 outline-none"
          />
        </div>
        <div className="text-xs font-bold text-slate-400">
          {filteredJobs.length} active listings
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-navy/10">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Role & Company</TableHead>
              <TableHead className="font-bold">Type</TableHead>
              <TableHead className="font-bold">Location</TableHead>
              <TableHead className="font-bold">Salary</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                  No jobs found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="font-bold text-navy text-base">{job.title}</div>
                    <div className="text-xs text-gold font-semibold">{job.company}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(job.requirements || []).slice(0, 3).map((req, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                          {req}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 font-bold text-xs">
                      {job.type || 'Full Time'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">{job.location}</TableCell>
                  <TableCell className="text-slate-800 font-semibold text-sm">
                    {job.salary || 'Competitive'}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleStatus(job.id)}
                      className="cursor-pointer"
                      title="Click to toggle status"
                    >
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${
                        job.status === 'closed' 
                          ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}>
                        {job.status === 'closed' ? (
                          <>
                            <XCircle className="w-3 h-3" />
                            Closed
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </>
                        )}
                      </span>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => startEdit(job)} 
                        className="text-slate-600 hover:text-navy hover:bg-slate-100 rounded-xl"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteJob(job.id)} 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
