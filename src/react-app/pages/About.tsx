import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  GraduationCap, Mail, Phone, MapPin, Shield, HelpCircle, 
  FileText, Users, Send, CheckCircle2, ChevronDown 
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';

export default function About() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'faq' | 'privacy'>('about');
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('contact')) setActiveTab('contact');
    else if (path.includes('faq')) setActiveTab('faq');
    else if (path.includes('privacy') || path.includes('terms')) setActiveTab('privacy');
    else setActiveTab('about');
  }, [location.pathname]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setIsSubmitted(false);
    }, 4000);
  };

  const faqs = [
    {
      q: "How do I claim or update my Alumni profile?",
      a: "Simply sign up with your graduation email or university ID. Once registered, navigate to 'My Profile' where you can edit your current role, company, bio, skills, and social links in real time."
    },
    {
      q: "How can I post jobs or hire fellow alumni?",
      a: "Go to the Career Portal ('Jobs') and click 'Post a Job'. Fill in the company details, job description, and application URL. Postings are immediately visible to thousands of verified graduates."
    },
    {
      q: "Are the alumni reunions and events free to attend?",
      a: "Most alumni networking sessions, webinars, and regional chapter meetups are completely free. Special ticketed events such as Annual Galas will display explicit RSVP requirements and capacity limits."
    },
    {
      q: "How does AlumniConnect protect my personal contact information?",
      a: "We prioritize your privacy. Direct contact information is protected behind authenticated alumni credentials, and you can control what information appears publicly in the directory via your profile settings."
    },
    {
      q: "How do I submit an Alumni Success Story?",
      a: "Visit the 'Stories' section and click 'Share Your Story'. Our editorial team reviews community submissions to feature outstanding entrepreneurial, research, or career milestones."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Banner */}
      <div className="bg-navy text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gold text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
            <GraduationCap className="w-4 h-4" />
            Alumni Community Hub
          </div>
          <h1 
            className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {activeTab === 'about' && 'About AlumniConnect'}
            {activeTab === 'contact' && 'Contact & Support'}
            {activeTab === 'faq' && 'Frequently Asked Questions'}
            {activeTab === 'privacy' && 'Privacy Policy & Terms'}
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg">
            Connecting graduates, celebrating achievements, and fostering collaborative opportunities worldwide.
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {[
              { id: 'about', label: 'About Us', icon: Users },
              { id: 'contact', label: 'Contact Us', icon: Mail },
              { id: 'faq', label: 'FAQs', icon: HelpCircle },
              { id: 'privacy', label: 'Privacy & Terms', icon: Shield },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                    isActive 
                      ? 'bg-gold text-navy shadow-gold/20' 
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* TAB 1: ABOUT US */}
        {activeTab === 'about' && (
          <div className="space-y-12">
            <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-slate-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Our Mission & Vision
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                AlumniConnect was founded to bridge generations of graduates, creating an interactive, transparent, and vibrant network. We believe that a degree is just the beginning of a lifelong journey with your alma mater.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-gold/15 text-navy flex items-center justify-center font-black text-xl mb-4">
                    50K+
                  </div>
                  <h3 className="font-bold text-navy text-lg mb-2">Global Alumni</h3>
                  <p className="text-slate-500 text-sm">Graduates representing top engineering, leadership, medicine, and arts across 120+ countries.</p>
                </div>
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-gold/15 text-navy flex items-center justify-center font-black text-xl mb-4">
                    2,500+
                  </div>
                  <h3 className="font-bold text-navy text-lg mb-2">Opportunities Shared</h3>
                  <p className="text-slate-500 text-sm">Exclusive job openings, executive referrals, and direct mentorship initiatives shared yearly.</p>
                </div>
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-gold/15 text-navy flex items-center justify-center font-black text-xl mb-4">
                    500+
                  </div>
                  <h3 className="font-bold text-navy text-lg mb-2">Events & Chapters</h3>
                  <p className="text-slate-500 text-sm">Reunions, technical symposiums, webinars, and regional gatherings organized annually.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-navy to-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Ready to become an active contributor?</h3>
                <p className="text-white/70">Join our regional chapters, mentor upcoming graduates, or post opportunities.</p>
              </div>
              <a href="/register">
                <Button className="bg-gold text-navy hover:bg-gold/90 font-black px-8 py-6 text-base rounded-xl shrink-0 shadow-lg">
                  Join The Network
                </Button>
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT US */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
                <h3 className="text-xl font-bold text-navy mb-4">Direct Contact</h3>
                <div className="flex items-start gap-4 text-slate-600">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy text-sm">Campus Office</h4>
                    <p className="text-sm">Alumni Relations Center<br />123 University Ave, ST 12345</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-slate-600">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy text-sm">Email Support</h4>
                    <p className="text-sm">support@alumni-connections.org</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-slate-600">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy text-sm">Phone Inquiries</h4>
                    <p className="text-sm">+1 (555) 019-2834</p>
                    <p className="text-xs text-slate-400">Mon - Fri, 9am - 5pm EST</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200">
                <h3 className="text-2xl font-bold text-navy mb-2">Send Us a Message</h3>
                <p className="text-slate-500 text-sm mb-6">Have questions regarding membership, credentials, or organizing events? Reach out below.</p>
                
                {isSubmitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-bold">Message Sent Successfully!</h4>
                      <p className="text-sm">Thank you for getting in touch. Our alumni relations coordinator will respond shortly.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Your Name</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Jane Doe"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy/20 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="jane@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy/20 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Subject</label>
                      <input
                        type="text"
                        value={contactForm.subject}
                        onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder="Reunion inquiry / Profile verification"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy/20 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={contactForm.message}
                        onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="How can we help you?"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy/20 text-sm resize-none"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-navy hover:bg-slate-800 text-white font-bold py-3 rounded-xl gap-2 shadow-md">
                      <Send className="w-4 h-4" />
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FAQS */}
        {activeTab === 'faq' && (
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-2xl font-bold text-navy mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Common Inquiries
            </h2>
            <div className="divide-y divide-slate-100">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className="py-4">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 text-left font-bold text-slate-800 hover:text-gold transition-colors py-2"
                    >
                      <span className="text-base sm:text-lg">{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-gold' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed pl-1 animate-in fade-in duration-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PRIVACY & TERMS */}
        {activeTab === 'privacy' && (
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-slate-200 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-navy font-bold text-xl mb-4">
                <Shield className="w-6 h-6 text-gold" />
                Privacy Policy Summary
              </div>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Your data is stored securely. We do not sell alumni data or distribute private information to third-party advertisers. All member profiles are accessible exclusively by registered alumni and authorized administrators to facilitate professional networking.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 text-navy font-bold text-xl mb-4">
                <FileText className="w-6 h-6 text-gold" />
                Community Guidelines & Terms
              </div>
              <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm sm:text-base">
                <li>Respect fellow alumni and uphold professional standards of conduct across all messaging and forums.</li>
                <li>Job postings must reflect legitimate employment opportunities from verified organizations.</li>
                <li>Reunion photos and shared memories must adhere to community standards and avoid unauthorized copyrighted assets.</li>
                <li>Administrators reserve the right to suspend any accounts violating ethical conduct or engaging in spam.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
