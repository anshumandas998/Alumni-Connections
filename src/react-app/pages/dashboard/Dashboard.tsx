import { useState, useEffect } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Users, Calendar, Briefcase, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/react-app/components/ui/button';
import { Event, JobPosting } from '@/shared/types';

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({
    alumni: 6,
    events: 4,
    jobs: 4,
    stories: 3
  });

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [recentJobs, setRecentJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    try {
      const savedAlumni = localStorage.getItem('alumni_directory');
      const savedEvents = localStorage.getItem('alumni_events');
      const savedJobs = localStorage.getItem('alumni_jobs');
      const savedStories = localStorage.getItem('alumni_stories');

      if (savedAlumni) setCounts(c => ({ ...c, alumni: JSON.parse(savedAlumni).length }));
      if (savedEvents) {
        const evs = JSON.parse(savedEvents);
        setCounts(c => ({ ...c, events: evs.length }));
        setUpcomingEvents(evs.slice(0, 2));
      }
      if (savedJobs) {
        const jbs = JSON.parse(savedJobs);
        setCounts(c => ({ ...c, jobs: jbs.length }));
        setRecentJobs(jbs.slice(0, 2));
      }
      if (savedStories) setCounts(c => ({ ...c, stories: JSON.parse(savedStories).length }));
    } catch (e) {
      console.error('Error loading dashboard data', e);
    }
  }, []);

  const stats = [
    { icon: Users, label: 'Alumni Network', value: counts.alumni.toString(), href: '/directory', desc: 'Graduates across industries' },
    { icon: Calendar, label: 'Upcoming Events', value: counts.events.toString(), href: '/events', desc: 'Reunions & Webinars' },
    { icon: Briefcase, label: 'Job Openings', value: counts.jobs.toString(), href: '/jobs', desc: 'Active career listings' },
    { icon: Star, label: 'Success Stories', value: counts.stories.toString(), href: '/stories', desc: 'Alumni spotlights' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-navy py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-bold uppercase tracking-widest mb-3">
                <Sparkles className="w-4 h-4" />
                Alumni Member Portal
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Welcome back, <span className="text-gold">{user?.name || 'Alumnus'}</span>
              </h1>
              <p className="text-white/70 text-base md:text-lg mt-1">
                Stay updated with upcoming campus reunions, alumni jobs, and networking opportunities.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {(user?.role === 'admin' || user?.role === 'super_admin') && (
                <Link to="/admin/dashboard">
                  <Button className="bg-gold hover:bg-gold/90 text-navy font-bold px-6 py-5 rounded-2xl shadow-xl transition-all flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Admin Portal
                  </Button>
                </Link>
              )}
              <Link to="/profile">
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold px-6 py-5 rounded-2xl transition-all">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-24">
        {/* Real-time Network Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} to={stat.href} className="group">
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-gold group-hover:scale-105 transition-all text-white group-hover:text-navy">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-black text-navy">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    {stat.desc} →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Content Split: Events Preview & Job Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Upcoming Events */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" />
                  Upcoming Gatherings
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Events scheduled for your network</p>
              </div>
              <Link to="/events" className="text-xs font-bold text-navy hover:text-gold">
                View All Events →
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <p className="text-slate-400 text-sm py-4">No events scheduled at the moment.</p>
              ) : (
                upcomingEvents.map((ev) => (
                  <div key={ev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <span className="px-2.5 py-0.5 bg-gold/10 text-gold text-[10px] font-bold rounded-full uppercase tracking-wider border border-gold/20">
                        {ev.category || 'Event'}
                      </span>
                      <h3 className="font-bold text-navy text-sm mt-1 truncate">{ev.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>{ev.date ? new Date(ev.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'TBD'}</span>
                        <span>•</span>
                        <span className="truncate">{ev.location}</span>
                      </div>
                    </div>
                    <Link to="/events">
                      <Button size="sm" className="bg-navy hover:bg-gold hover:text-navy text-white text-xs font-bold rounded-xl px-4 shrink-0">
                        RSVP
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gold" />
                  Alumni Career Board
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Opportunities from alumni-founded companies</p>
              </div>
              <Link to="/jobs" className="text-xs font-bold text-navy hover:text-gold">
                Explore Jobs →
              </Link>
            </div>

            <div className="space-y-4">
              {recentJobs.length === 0 ? (
                <p className="text-slate-400 text-sm py-4">No job openings posted yet.</p>
              ) : (
                recentJobs.map((jb) => (
                  <div key={jb.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-navy text-sm truncate">{jb.title}</h3>
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-md shrink-0">
                          {jb.type || 'Full Time'}
                        </span>
                      </div>
                      <p className="text-xs text-gold font-semibold mt-0.5">{jb.company} • <span className="text-slate-500 font-normal">{jb.location}</span></p>
                    </div>
                    <Link to="/jobs">
                      <Button size="sm" variant="outline" className="border-navy/20 text-navy hover:bg-navy hover:text-white text-xs font-bold rounded-xl px-4 shrink-0">
                        Apply
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Community Navigation Cards */}
        <div className="bg-gradient-to-br from-navy via-slate-900 to-navy-dark rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Connect with 50,000+ Alumni Worldwide</h2>
              <p className="text-white/70 text-sm max-w-xl leading-relaxed">
                Search alumni in your city, discover mutual connections, request mentorship, or share your own success story with incoming graduates.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <Link to="/directory">
                <Button className="bg-gold hover:bg-gold/90 text-navy font-bold px-6 py-6 rounded-2xl shadow-lg transition-all">
                  Browse Directory
                </Button>
              </Link>
              <Link to="/gallery">
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold px-6 py-6 rounded-2xl transition-all">
                  Photo Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
