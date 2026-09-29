import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, GraduationCap, Users, Send, CheckCircle2, X } from 'lucide-react';
import { AlumniProfile } from '@/shared/types';
import { Button } from '@/react-app/components/ui/button';

const defaultAlumniList: AlumniProfile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@techcorp.com',
    location: 'San Francisco, CA',
    company: 'TechCorp',
    jobTitle: 'VP of Engineering',
    graduationYear: 2018,
    skills: ['React', 'TypeScript', 'Distributed Systems', 'Cloud Architecture'],
    bio: 'Passionate engineering leader. Founded an EdTech startup right out of college, now leading core infrastructure at TechCorp.',
    password: 'password123'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@financehub.com',
    location: 'New York, NY',
    company: 'FinanceHub',
    jobTitle: 'Principal Product Manager',
    graduationYear: 2015,
    skills: ['Fintech', 'Product Strategy', 'Growth', 'Machine Learning'],
    bio: 'Building algorithmic wealth management solutions. Always eager to mentor graduating seniors interested in Wall Street and fintech.',
    password: 'password123'
  },
  {
    id: '3',
    name: 'Ananya Sharma',
    email: 'ananya@designstudio.io',
    location: 'Bengaluru, India',
    company: 'CreativeStudio',
    jobTitle: 'Design Director',
    graduationYear: 2019,
    skills: ['UX/UI Design', 'Design Systems', 'Design Thinking', 'Branding'],
    bio: 'Championing accessible and humane product design. Host of the Alumni Design Podcast.',
    password: 'password123'
  },
  {
    id: '4',
    name: 'David Lee',
    email: 'david.lee@nextgenai.org',
    location: 'Seattle, WA',
    company: 'NextGen AI Lab',
    jobTitle: 'Lead AI Researcher',
    graduationYear: 2017,
    skills: ['PyTorch', 'LLMs', 'NLP', 'Computer Vision'],
    bio: 'Author of 12 peer-reviewed papers on multimodal reasoning. Angel investor in alumni-founded startups.',
    password: 'password123'
  },
  {
    id: '5',
    name: 'Emily Watson',
    email: 'emily.w@bioventures.com',
    location: 'Boston, MA',
    company: 'BioVentures',
    jobTitle: 'Senior Clinical Data Scientist',
    graduationYear: 2020,
    skills: ['Bioinformatics', 'Python', 'Biostatistics', 'Healthcare AI'],
    bio: 'Applying statistical modeling and machine learning to accelerate clinical genomics testing.',
    password: 'password123'
  },
  {
    id: '6',
    name: 'Rahul Verma',
    email: 'rahul.v@cloudscale.io',
    location: 'London, UK',
    company: 'CloudScale Global',
    jobTitle: 'Head of Site Reliability',
    graduationYear: 2016,
    skills: ['Kubernetes', 'Go', 'DevOps', 'Cybersecurity'],
    bio: 'Scaling low-latency infrastructure across 45 worldwide data centers. Passionate about open-source.',
    password: 'password123'
  }
];

export default function Directory() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [selectedAlumnus, setSelectedAlumnus] = useState<AlumniProfile | null>(null);
  const [connectingAlumnus, setConnectingAlumnus] = useState<AlumniProfile | null>(null);
  const [connectMessage, setConnectMessage] = useState('');
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [connectedIds, setConnectedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('connected_alumni');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('alumni_directory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAlumni(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load alumni directory', e);
    }
    setAlumni(defaultAlumniList);
  }, []);

  const years = useMemo(() => {
    const list = Array.from(new Set(alumni.map(a => a.graduationYear).filter(Boolean)));
    return ['All', ...list.sort((a, b) => (b as number) - (a as number)).map(String)];
  }, [alumni]);

  const companies = useMemo(() => {
    const list = Array.from(new Set(alumni.map(a => a.company).filter(Boolean))) as string[];
    return ['All', ...list.sort()];
  }, [alumni]);

  const filteredAlumni = useMemo(() => {
    return alumni.filter(a => {
      const q = search.toLowerCase();
      const matchSearch = 
        a.name.toLowerCase().includes(q) ||
        (a.company && a.company.toLowerCase().includes(q)) ||
        (a.jobTitle && a.jobTitle.toLowerCase().includes(q)) ||
        (a.location && a.location.toLowerCase().includes(q)) ||
        (a.skills && a.skills.some(s => s.toLowerCase().includes(q)));

      const matchYear = yearFilter === 'All' || String(a.graduationYear) === yearFilter;
      const matchCompany = companyFilter === 'All' || a.company === companyFilter;

      return matchSearch && matchYear && matchCompany;
    });
  }, [alumni, search, yearFilter, companyFilter]);

  const handleSendConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectingAlumnus) return;

    const next = [...connectedIds, connectingAlumnus.id];
    setConnectedIds(next);
    localStorage.setItem('connected_alumni', JSON.stringify(next));

    setConnectSuccess(true);
    setTimeout(() => {
      setConnectSuccess(false);
      setConnectingAlumnus(null);
      setConnectMessage('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-navy py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-bold uppercase tracking-widest mb-6">
              <Users className="w-4 h-4" />
              Global Alumni Network
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Alumni <span className="text-gold">Directory</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed">
              Connect with 50,000+ alumni worldwide across tech, finance, research, and creative industries.
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
              placeholder="Search by name, company, job title, skills, or city..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-gold/50 transition-all outline-none text-slate-800 text-sm font-medium"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="px-4 py-3.5 bg-slate-50 rounded-2xl text-xs font-bold text-navy outline-none border-none cursor-pointer"
            >
              <option value="All">All Companies</option>
              {companies.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-4 py-3.5 bg-slate-50 rounded-2xl text-xs font-bold text-navy outline-none border-none cursor-pointer"
            >
              <option value="All">All Batches</option>
              {years.filter(y => y !== 'All').map(y => (
                <option key={y} value={y}>Class of {y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAlumni.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No alumni found</h3>
              <p className="text-slate-400 mt-1">Try widening your search terms or resetting batch/company filters.</p>
            </div>
          ) : (
            filteredAlumni.map((alum) => {
              const isConnected = connectedIds.includes(alum.id);
              const initials = alum.name.split(' ').map(n => n[0]).join('').slice(0, 2);

              return (
                <div 
                  key={alum.id} 
                  className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-navy via-slate-800 to-navy-dark rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0 border-2 border-gold/30">
                        <span className="text-gold font-black text-xl tracking-wider">{initials}</span>
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-bold text-xl text-navy group-hover:text-gold transition-colors truncate">
                          {alum.name}
                        </h2>
                        <p className="text-slate-600 font-medium text-xs truncate">
                          {alum.jobTitle || 'Alumnus'} {alum.company ? `@ ${alum.company}` : ''}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                          <GraduationCap className="w-3.5 h-3.5 text-gold" />
                          <span>Class of {alum.graduationYear}</span>
                        </div>
                      </div>
                    </div>

                    {alum.bio && (
                      <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2 italic">
                        "{alum.bio}"
                      </p>
                    )}

                    <div className="space-y-2 mb-6 text-xs text-slate-500">
                      {alum.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gold shrink-0" />
                          <span className="truncate">{alum.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {(alum.skills || []).slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="text-[11px] font-semibold px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg border border-slate-100">
                          {skill}
                        </span>
                      ))}
                      {(alum.skills || []).length > 3 && (
                        <span className="text-[11px] text-slate-400 self-center">
                          +{alum.skills!.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAlumnus(alum)}
                      className="text-xs font-bold text-navy hover:text-gold p-0 h-auto"
                    >
                      View Profile →
                    </Button>

                    <Button
                      onClick={() => setConnectingAlumnus(alum)}
                      className={`rounded-xl px-5 py-2 text-xs font-bold transition-all shadow-sm ${
                        isConnected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-navy hover:bg-gold hover:text-navy text-white'
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Connected
                        </>
                      ) : (
                        'Connect'
                      )}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Profile Details Modal */}
      {selectedAlumnus && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border relative">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center text-gold font-black text-2xl border-2 border-gold/30 shadow-lg">
                  {selectedAlumnus.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-navy">{selectedAlumnus.name}</h3>
                  <p className="text-sm text-gold font-semibold">
                    {selectedAlumnus.jobTitle} @ {selectedAlumnus.company}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Class of {selectedAlumnus.graduationYear}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAlumnus(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mb-6 text-sm">
              {selectedAlumnus.bio && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Biography</h4>
                  <p className="text-slate-700 leading-relaxed italic">"{selectedAlumnus.bio}"</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Location</div>
                  <div className="font-semibold text-navy text-xs mt-0.5">{selectedAlumnus.location || 'Worldwide'}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Email</div>
                  <div className="font-semibold text-navy text-xs mt-0.5 truncate">{selectedAlumnus.email}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Core Competencies & Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedAlumnus.skills || []).map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-navy text-white text-xs font-bold rounded-xl shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedAlumnus(null)}
                className="flex-1 rounded-xl"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  const target = selectedAlumnus;
                  setSelectedAlumnus(null);
                  setConnectingAlumnus(target);
                }}
                className="flex-1 bg-gold text-navy font-bold rounded-xl hover:bg-gold/90"
              >
                Send Connection Note
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {connectingAlumnus && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-navy">Connect with {connectingAlumnus.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{connectingAlumnus.jobTitle} at {connectingAlumnus.company}</p>
              </div>
              <button 
                onClick={() => setConnectingAlumnus(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {connectSuccess ? (
              <div className="py-10 text-center space-y-3">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-xl font-bold text-navy">Invitation Sent!</h4>
                <p className="text-sm text-slate-500">Your connection request and note have been forwarded to {connectingAlumnus.name}.</p>
              </div>
            ) : (
              <form onSubmit={handleSendConnection} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Add a Personal Note</label>
                  <textarea
                    rows={4}
                    required
                    value={connectMessage}
                    onChange={(e) => setConnectMessage(e.target.value)}
                    placeholder={`Hi ${connectingAlumnus.name.split(' ')[0]}, I would love to connect with you regarding your career at ${connectingAlumnus.company}...`}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-gold outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setConnectingAlumnus(null)}
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gold hover:bg-gold/90 text-navy font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Request
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
