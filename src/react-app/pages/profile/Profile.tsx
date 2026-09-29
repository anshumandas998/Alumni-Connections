import { useState, useEffect } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { User, Mail, MapPin, Briefcase, GraduationCap, Edit3, CheckCircle2, Save, X, Sparkles } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Textarea } from '@/react-app/components/ui/textarea';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    jobTitle: user?.profile?.jobTitle || 'Alumnus & Professional',
    company: user?.profile?.company || 'Industry Partner',
    location: user?.profile?.location || 'San Francisco, CA',
    graduationYear: String(user?.profile?.graduationYear || 2020),
    bio: user?.profile?.bio || 'Proud alumnus passionate about technology, professional mentorship, and continuous learning.',
    skills: (user?.profile?.skills || ['React', 'TypeScript', 'Problem Solving', 'Leadership']).join(', ')
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        jobTitle: user.profile?.jobTitle || 'Alumnus & Professional',
        company: user.profile?.company || (user.adminCompany || 'Industry Partner'),
        location: user.profile?.location || 'San Francisco, CA',
        graduationYear: String(user.profile?.graduationYear || 2020),
        bio: user.profile?.bio || 'Proud alumnus passionate about technology, professional mentorship, and continuous learning.',
        skills: (user.profile?.skills || ['React', 'TypeScript', 'Problem Solving', 'Leadership']).join(', ')
      });
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);

    updateProfile({
      name: formData.name,
      profile: {
        bio: formData.bio,
        location: formData.location,
        company: formData.company,
        jobTitle: formData.jobTitle,
        graduationYear: parseInt(formData.graduationYear) || 2020,
        skills: skillsArray
      }
    });

    setEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
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
              <User className="w-4 h-4" />
              Alumni Identity
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Your <span className="text-gold">Profile</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed">
              Manage your professional credentials, career timeline, and network visibility.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-24">
        {saveSuccess && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-800 animate-fadeIn">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Profile Updated Successfully!</p>
              <p className="text-xs text-emerald-700">Your profile changes are now visible across the global directory.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-navy/5">
          {/* Hero Banner */}
          <div className="bg-gradient-to-br from-navy via-slate-800 to-navy-dark px-8 py-14 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-3xl mx-auto mb-6 flex items-center justify-center relative z-10 shadow-2xl border-4 border-gold/30">
              <span className="text-gold font-black text-3xl">
                {(formData.name || 'Alumnus').split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-2 relative z-10 tracking-tight">
              {formData.name || 'Alumnus'}
            </h2>
            <p className="text-gold font-medium text-lg relative z-10">
              {formData.jobTitle} <span className="text-white/40 mx-2">@</span> {formData.company}
            </p>
            <p className="text-xs text-white/60 mt-1 relative z-10">
              Class of {formData.graduationYear} • {formData.location}
            </p>

            <div className="mt-8 relative z-10">
              <Button 
                onClick={() => setEditing(!editing)}
                className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-6 rounded-2xl shadow-xl transition-all"
              >
                {editing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel Editing
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="p-8 md:p-12 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-xl font-bold text-navy flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold" />
                  Edit Profile Information
                </h3>
                <span className="text-xs text-slate-400">All fields update in real-time</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Full Name *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl py-3"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Job Title</label>
                  <Input
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="rounded-xl py-3"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Current Company / Organization</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="rounded-xl py-3"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Location / City</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="rounded-xl py-3"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Graduation Year</label>
                  <Input
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    className="rounded-xl py-3"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Skills (Comma-separated)</label>
                  <Input
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="React, Python, Leadership, AI"
                    className="rounded-xl py-3"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Biography / About You</label>
                <Textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="rounded-xl leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setEditing(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="bg-navy hover:bg-navy/90 text-white font-bold px-8 rounded-xl flex items-center gap-2">
                  <Save className="w-4 h-4 text-gold" />
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-8 md:p-12 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="flex items-center gap-3 text-lg font-bold text-navy mb-6">
                    <Mail className="w-5 h-5 text-gold" />
                    Contact & Batch Info
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Mail className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase">Email Address</div>
                        <span className="font-bold text-navy text-sm">{user?.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <GraduationCap className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase">Graduation Class</div>
                        <span className="font-bold text-navy text-sm">Class of {formData.graduationYear}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-3 text-lg font-bold text-navy mb-6">
                    <Briefcase className="w-5 h-5 text-gold" />
                    Career & Location
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Briefcase className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase">Current Position</div>
                        <div className="font-bold text-navy text-sm">{formData.jobTitle}</div>
                        <div className="text-xs text-slate-500 font-medium">{formData.company}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <MapPin className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase">Current Residence</div>
                        <span className="font-bold text-navy text-sm">{formData.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-navy mb-4">About & Professional Bio</h3>
                <p className="text-base leading-relaxed text-slate-600 bg-slate-50 p-6 rounded-3xl italic border border-slate-100">
                  "{formData.bio}"
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-navy mb-4">Expertise & Skills</h3>
                <div className="flex flex-wrap gap-2.5">
                  {formData.skills.split(',').map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-5 py-2 bg-navy text-white text-xs font-bold rounded-xl shadow-md hover:bg-gold hover:text-navy transition-all cursor-default"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
