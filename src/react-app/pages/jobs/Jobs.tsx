import { useState, useEffect, useMemo } from 'react';
import { Briefcase, Search, ArrowRight, Bookmark, CheckCircle2, Building2, X, Send } from 'lucide-react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { JobPosting } from '@/shared/types';
import { Button } from '@/react-app/components/ui/button';

const fallbackJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechCorp',
    location: 'Bengaluru, India (Hybrid)',
    salary: '₹25L - ₹35L',
    type: 'Full Time',
    description: 'Build high-performance web applications using React, TypeScript, and modern tooling. Lead architecture discussions and mentor junior developers.',
    postedBy: 'John Smith (Class of 2017)',
    applyUrl: '#',
    requirements: ['React', 'TypeScript', 'Node.js', 'TailwindCSS'],
    datePosted: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '2',
    title: 'Product Manager - Growth',
    company: 'StartupX',
    location: 'Remote',
    salary: '₹20L - ₹30L',
    type: 'Remote',
    description: 'Drive user acquisition, retention experiments, and product roadmap. Cross-functional collaboration with growth engineering and product analytics.',
    postedBy: 'Sarah Lee (Class of 2015)',
    applyUrl: '#',
    requirements: ['Product Strategy', 'Growth Hacking', 'SQL', 'A/B Testing'],
    datePosted: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '3',
    title: 'Lead AI / ML Research Engineer',
    company: 'NextGen AI Lab',
    location: 'San Francisco, CA (or Remote)',
    salary: '$180K - $220K',
    type: 'Full Time',
    description: 'Work on cutting-edge LLM fine-tuning, retrieval algorithms, and agentic workflows. Direct mentorship from alumni founders.',
    postedBy: 'David Lee (Class of 2018)',
    applyUrl: '#',
    requirements: ['PyTorch', 'LLMs', 'Python', 'Vector DBs'],
    datePosted: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '4',
    title: 'UX/UI Designer & Design System Lead',
    company: 'CreativeStudio',
    location: 'Mumbai (Hybrid)',
    salary: '₹15L - ₹22L',
    type: 'Contract',
    description: 'Lead visual design and design tokens across mobile and web platforms. Partner directly with founders to craft delightful experiences.',
    postedBy: 'Ananya Sharma (Class of 2019)',
    applyUrl: '#',
    requirements: ['Figma', 'Design Systems', 'Micro-interactions', 'Prototyping'],
    datePosted: new Date().toISOString(),
    status: 'active'
  }
];

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [savedJobs, setSavedJobs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('saved_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [applyingJob, setApplyingJob] = useState<JobPosting | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('applied_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [applyForm, setApplyForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    linkedin: '',
    note: ''
  });

  const [applySubmitted, setApplySubmitted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('alumni_jobs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setJobs(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load jobs from storage', e);
    }
    setJobs(fallbackJobs);
  }, []);

  const toggleSaveJob = (id: string) => {
    let next: string[];
    if (savedJobs.includes(id)) {
      next = savedJobs.filter(jid => jid !== id);
    } else {
      next = [...savedJobs, id];
    }
    setSavedJobs(next);
    localStorage.setItem('saved_jobs', JSON.stringify(next));
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;

    const nextApplied = [...appliedJobs, applyingJob.id];
    setAppliedJobs(nextApplied);
    localStorage.setItem('applied_jobs', JSON.stringify(nextApplied));
    setApplySubmitted(true);

    setTimeout(() => {
      setApplySubmitted(false);
      setApplyingJob(null);
      setApplyForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        linkedin: '',
        note: ''
      });
    }, 2000);
  };

  const types = ['All', 'Full Time', 'Remote', 'Contract', 'Part Time', 'Internship'];

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const q = search.toLowerCase();
      const matchSearch = 
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        (job.requirements || []).some(r => r.toLowerCase().includes(q));

      const matchType = selectedType === 'All' || job.type === selectedType;
      return matchSearch && matchType;
    });
  }, [jobs, search, selectedType]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-navy py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-bold uppercase tracking-widest mb-6">
              <Briefcase className="w-4 h-4" />
              Alumni Career Network
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Job <span className="text-gold">Opportunities</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed">
              Discover high-impact roles posted directly by alumni founders, engineering managers, and corporate partners.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-24">
        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by job title, company name, skill (e.g. React, Python), or city..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-gold/50 transition-all outline-none text-slate-800 text-sm font-medium"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider ${
                  selectedType === t
                    ? 'bg-navy text-gold shadow-lg shadow-navy/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-navy'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No job openings found</h3>
              <p className="text-slate-400 mt-1">Try adjusting your keyword search or selected job type.</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isSaved = savedJobs.includes(job.id);
              const hasApplied = appliedJobs.includes(job.id);

              return (
                <div 
                  key={job.id} 
                  className="group bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 bg-navy/5 border border-navy/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-gold/10 group-hover:border-gold/30 transition-colors">
                        <Building2 className="w-8 h-8 text-navy group-hover:text-gold transition-colors" />
                      </div>

                      <div>
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <h2 className="text-xl font-bold text-navy group-hover:text-gold transition-colors">
                            {job.title}
                          </h2>
                          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                            {job.type || 'Full Time'}
                          </span>
                          {job.status === 'closed' && (
                            <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full border border-rose-200">
                              Position Filled
                            </span>
                          )}
                        </div>

                        <p className="text-gold font-bold text-sm mb-3">
                          {job.company} • <span className="text-slate-500 font-normal">{job.location}</span>
                        </p>

                        <p className="text-slate-600 text-sm leading-relaxed mb-4 max-w-3xl line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {(job.requirements || []).map((req, idx) => (
                            <span 
                              key={idx} 
                              className="text-xs font-semibold px-3 py-1 bg-slate-50 text-slate-700 rounded-xl border border-slate-100"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="text-right">
                        <div className="text-lg font-black text-navy">{job.salary || 'Competitive'}</div>
                        <div className="text-xs text-slate-400">Posted by {job.postedBy}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleSaveJob(job.id)}
                          title={isSaved ? 'Remove from saved' : 'Save job'}
                          className={`p-3 rounded-2xl border transition-all ${
                            isSaved 
                              ? 'bg-gold/20 text-gold border-gold/40' 
                              : 'bg-slate-50 text-slate-400 hover:text-navy hover:bg-slate-100 border-slate-100'
                          }`}
                        >
                          <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-gold' : ''}`} />
                        </button>

                        <Button
                          disabled={job.status === 'closed' || hasApplied}
                          onClick={() => setApplyingJob(job)}
                          className={`rounded-2xl px-6 py-6 font-bold shadow-md transition-all flex items-center gap-2 ${
                            hasApplied
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-navy hover:bg-gold hover:text-navy text-white'
                          }`}
                        >
                          {hasApplied ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Applied ✓
                            </>
                          ) : (
                            <>
                              Apply Now
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Application Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-bold rounded-full uppercase tracking-widest border border-gold/20">
                  {applyingJob.company}
                </span>
                <h3 className="text-2xl font-bold text-navy mt-2">Apply for {applyingJob.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{applyingJob.location} • {applyingJob.salary || 'Competitive'}</p>
              </div>
              <button 
                onClick={() => setApplyingJob(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {applySubmitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-xl font-bold text-navy">Application Submitted!</h4>
                <p className="text-sm text-slate-500">Your profile and application have been transmitted directly to the alumni hiring team.</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={applyForm.name}
                    onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-gold outline-none"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-gold outline-none"
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-gold outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">LinkedIn / Portfolio URL</label>
                  <input
                    type="url"
                    value={applyForm.linkedin}
                    onChange={(e) => setApplyForm({ ...applyForm, linkedin: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-gold outline-none"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Note to Alumni Hiring Lead</label>
                  <textarea
                    rows={3}
                    value={applyForm.note}
                    onChange={(e) => setApplyForm({ ...applyForm, note: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-gold outline-none"
                    placeholder="Share a brief intro, why this role excites you, or your graduation batch."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setApplyingJob(null)}
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gold hover:bg-gold/90 text-navy font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Application
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
