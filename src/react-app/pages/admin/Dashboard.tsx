import { useState, useEffect } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Users, Calendar, Briefcase, FileText, BarChart3, UserPlus, Image as ImageIcon, ArrowUpRight, ShieldCheck, Activity, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/react-app/components/ui/button';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    alumni: 0,
    events: 0,
    jobs: 0,
    stories: 0
  });

  const [recentLogins, setRecentLogins] = useState<any[]>([]);

  useEffect(() => {
    try {
      const savedAlumni = localStorage.getItem('alumni_directory');
      const savedEvents = localStorage.getItem('alumni_events');
      const savedJobs = localStorage.getItem('alumni_jobs');
      const savedStories = localStorage.getItem('alumni_stories');
      const savedLogins = localStorage.getItem('login_history');

      setStats({
        alumni: savedAlumni ? JSON.parse(savedAlumni).length : 6,
        events: savedEvents ? JSON.parse(savedEvents).length : 4,
        jobs: savedJobs ? JSON.parse(savedJobs).length : 4,
        stories: savedStories ? JSON.parse(savedStories).length : 3
      });

      if (savedLogins) {
        setRecentLogins(JSON.parse(savedLogins).slice(0, 5));
      }
    } catch (e) {
      console.error('Error loading dashboard stats', e);
    }
  }, []);

  if (!user) return null;

  const statCards = [
    { 
      icon: Users, 
      label: 'Total Alumni', 
      value: stats.alumni, 
      change: 'Active Directory',
      to: '/admin/directory',
      color: 'from-blue-600 to-indigo-600'
    },
    { 
      icon: Calendar, 
      label: 'Scheduled Events', 
      value: stats.events, 
      change: 'Upcoming & Active',
      to: '/admin/events',
      color: 'from-amber-500 to-orange-600'
    },
    { 
      icon: Briefcase, 
      label: 'Job Opportunities', 
      value: stats.jobs, 
      change: 'Active Listings',
      to: '/admin/jobs',
      color: 'from-emerald-500 to-teal-600'
    },
    { 
      icon: FileText, 
      label: 'Success Stories', 
      value: stats.stories, 
      change: 'Community Spotlights',
      to: '/admin/stories',
      color: 'from-purple-500 to-pink-600'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-navy p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-bold uppercase tracking-widest mb-4">
              <ShieldCheck className="w-4 h-4" />
              Administrative Command Center
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
              {user.role === 'super_admin' ? 'Super Admin Overview' : `${user.adminCompany} Admin Console`}
            </h1>
            <p className="text-white/60">
              Welcome back, <span className="text-gold font-bold">{user.name}</span>. Real-time platform metrics and community oversight.
            </p>
          </div>

          <div className="flex gap-3">
            {user.role === 'super_admin' && (
              <Link to="/admin/admins">
                <Button className="bg-gold hover:bg-gold/90 text-navy font-bold px-6 py-6 rounded-2xl shadow-lg transition-all flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Manage Admins
                </Button>
              </Link>
            )}
            <Link to="/admin/events">
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold px-6 py-6 rounded-2xl transition-all">
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Real-time Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} to={stat.to} className="group">
              <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-gold transition-colors" />
                </div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-navy">{stat.value}</p>
                  <span className="text-[11px] font-semibold text-slate-400">{stat.change}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Quick Management & Recent Logins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gold" />
              Quick Actions
            </h2>
            <span className="text-xs text-slate-400 font-semibold">Instant Access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/admin/events" 
              className="p-5 rounded-2xl bg-slate-50 hover:bg-gold/10 border border-slate-100 hover:border-gold/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-colors">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-navy text-sm">Post New Event</h3>
                  <p className="text-xs text-slate-500">Plan reunion, gala, or webinar</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/admin/jobs" 
              className="p-5 rounded-2xl bg-slate-50 hover:bg-gold/10 border border-slate-100 hover:border-gold/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-colors">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-navy text-sm">Publish Job Opening</h3>
                  <p className="text-xs text-slate-500">Recruit alumni talent</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/admin/gallery" 
              className="p-5 rounded-2xl bg-slate-50 hover:bg-gold/10 border border-slate-100 hover:border-gold/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-colors">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-navy text-sm">Update Gallery</h3>
                  <p className="text-xs text-slate-500">Upload reunion & ceremony photos</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/admin/stories" 
              className="p-5 rounded-2xl bg-slate-50 hover:bg-gold/10 border border-slate-100 hover:border-gold/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-navy text-sm">Feature Story</h3>
                  <p className="text-xs text-slate-500">Spotlight distinguished alumni</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="p-5 bg-navy/5 rounded-2xl border border-navy/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-gold" />
              <div>
                <h4 className="text-sm font-bold text-navy">Public Web App Live Status</h4>
                <p className="text-xs text-slate-500">All data synced in real-time with alumni user portals.</p>
              </div>
            </div>
            <Link to="/" target="_blank">
              <Button size="sm" variant="outline" className="rounded-xl font-bold text-xs gap-1 border-navy/20">
                View Public Site
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Authentication Activity */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                <Activity className="w-5 h-5 text-gold" />
                Recent Logins
              </h2>
              {user.role === 'super_admin' && (
                <Link to="/admin/activity" className="text-xs font-bold text-navy hover:text-gold">
                  View All →
                </Link>
              )}
            </div>

            <div className="space-y-4">
              {recentLogins.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  No login history recorded yet.
                </div>
              ) : (
                recentLogins.map((log: any, idx: number) => (
                  <div key={log.id || idx} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-navy text-xs truncate">{log.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{log.email}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        log.role === 'super_admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : log.role === 'admin' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {log.role}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 text-center text-xs text-slate-400 font-medium">
            AlumniConnect Administration Engine v2.0
          </div>
        </div>
      </div>
    </div>
  );
}
