import { useState, useEffect } from 'react';
import { Star, MessageCircle, Heart, PlusCircle, X, Sparkles, Send } from 'lucide-react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Story } from '@/shared/types';
import { Button } from '@/react-app/components/ui/button';

const fallbackStories: Story[] = [
  {
    id: '1',
    title: 'From Campus to CEO: My Startup Journey',
    author: 'Sarah Johnson',
    year: 2018,
    excerpt: 'How I turned my senior project into a $10M enterprise SaaS company in just 4 years.',
    industry: 'Technology',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop',
    fullContent: 'It all started during my final semester. A class hackathon led to a prototype for automating distributed workflows. With mentorship from our university alumni network, I secured initial angel funding, recruited fellow graduates, and scaled the platform globally. Never underestimate the power of reaching out to fellow alumni on this platform!',
    tags: ['entrepreneurship', 'startup', 'saas', 'leadership'],
    likes: 42,
    commentsCount: 15,
    datePosted: '2026-08-12'
  },
  {
    id: '2',
    title: 'Breaking into Clean Tech & Sustainable Energy',
    author: 'Michael Chang',
    year: 2016,
    excerpt: 'Transitioning from traditional consulting into a leading climate-tech venture.',
    industry: 'CleanTech',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    fullContent: 'After five years in management consulting, I knew I wanted to apply my skills to the climate crisis. Through AlumniConnect, I connected with an alumnus leading a solar battery startup in Berlin. What began as a 20-minute informational coffee chat blossomed into a VP of Operations role.',
    tags: ['cleantech', 'sustainability', 'career-shift'],
    likes: 38,
    commentsCount: 8,
    datePosted: '2026-07-20'
  },
  {
    id: '3',
    title: 'Designing for Over 100 Million Users',
    author: 'Priya Patel',
    year: 2020,
    excerpt: 'Reflections on scaling product design systems at a premier fintech unicorn.',
    industry: 'Design & Product',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=400&fit=crop',
    fullContent: 'Designing products that touch millions daily requires relentless empathy, rigorous user testing, and bulletproof accessibility standards. My university design studio foundation gave me the courage to challenge assumptions and champion user advocacy.',
    tags: ['product-design', 'fintech', 'ux-ui'],
    likes: 56,
    commentsCount: 22,
    datePosted: '2026-09-01'
  }
];

export default function Stories() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [likedStories, setLikedStories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('liked_stories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSubmittingStory, setIsSubmittingStory] = useState(false);
  const [userStoryForm, setUserStoryForm] = useState({
    title: '',
    industry: 'Technology',
    excerpt: '',
    fullContent: '',
    image: ''
  });
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('alumni_stories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStories(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load stories', e);
    }
    setStories(fallbackStories);
  }, []);

  const handleLike = (id: string) => {
    const isLiked = likedStories.includes(id);
    let nextLiked: string[];
    let diff = 1;

    if (isLiked) {
      nextLiked = likedStories.filter(sid => sid !== id);
      diff = -1;
    } else {
      nextLiked = [...likedStories, id];
    }

    setLikedStories(nextLiked);
    localStorage.setItem('liked_stories', JSON.stringify(nextLiked));

    const updated = stories.map(s => {
      if (s.id === id) {
        return { ...s, likes: Math.max(0, (s.likes || 0) + diff) };
      }
      return s;
    });

    setStories(updated);
    localStorage.setItem('alumni_stories', JSON.stringify(updated));

    if (selectedStory && selectedStory.id === id) {
      setSelectedStory({ ...selectedStory, likes: Math.max(0, (selectedStory.likes || 0) + diff) });
    }
  };

  const handleUserStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userStoryForm.title || !userStoryForm.fullContent) return;

    const newStory: Story = {
      id: `story-user-${Date.now()}`,
      title: userStoryForm.title,
      author: user?.name || 'Alumnus',
      year: user?.profile?.graduationYear || 2022,
      industry: userStoryForm.industry,
      excerpt: userStoryForm.excerpt || userStoryForm.fullContent.slice(0, 120) + '...',
      fullContent: userStoryForm.fullContent,
      image: userStoryForm.image || 'https://images.unsplash.com/photo-152202176988-66273c2fd55f?w=600&h=400&fit=crop',
      tags: [userStoryForm.industry.toLowerCase(), 'community'],
      likes: 1,
      commentsCount: 0,
      datePosted: new Date().toISOString().split('T')[0]
    };

    const nextStories = [newStory, ...stories];
    setStories(nextStories);
    localStorage.setItem('alumni_stories', JSON.stringify(nextStories));

    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
      setIsSubmittingStory(false);
      setUserStoryForm({
        title: '',
        industry: 'Technology',
        excerpt: '',
        fullContent: '',
        image: ''
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-navy py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-bold uppercase tracking-widest mb-6">
              <Star className="w-4 h-4" />
              Alumni Success & Spotlights
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Inspiring <span className="text-gold">Stories</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed">
              Read how fellow graduates transformed ideas into global ventures, innovative discoveries, and leadership journeys.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => setIsSubmittingStory(true)}
                className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-6 rounded-2xl shadow-xl transition-all flex items-center gap-2 text-base"
              >
                <PlusCircle className="w-5 h-5" />
                Share Your Journey
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => {
            const isLiked = likedStories.includes(story.id);

            return (
              <div 
                key={story.id} 
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 group transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={story.image} 
                      alt={story.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-navy/80 backdrop-blur-md text-gold text-xs font-bold rounded-full uppercase tracking-wider border border-gold/20">
                        {story.industry}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-medium">
                      <span>{story.author}</span>
                      <span>•</span>
                      <span>Class of {story.year}</span>
                    </div>

                    <h2 
                      onClick={() => setSelectedStory(story)}
                      className="text-xl font-bold text-navy group-hover:text-gold transition-colors mb-3 cursor-pointer line-clamp-2"
                    >
                      {story.title}
                    </h2>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      "{story.excerpt}"
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {(story.tags || []).map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg border border-slate-100 font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-8 pt-0 flex items-center justify-between border-t border-slate-100 mt-auto pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStory(story)}
                    className="p-0 text-navy hover:text-gold font-bold text-xs"
                  >
                    Read Full Story →
                  </Button>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleLike(story.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                        isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{story.likes || 0}</span>
                    </button>
                    <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                      <MessageCircle className="w-4 h-4" />
                      <span>{story.commentsCount || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Reader Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl border relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-bold rounded-full uppercase tracking-wider border border-gold/20">
                  {selectedStory.industry}
                </span>
                <h3 className="text-2xl font-bold text-navy mt-3">{selectedStory.title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  By {selectedStory.author} (Class of {selectedStory.year})
                </p>
              </div>
              <button 
                onClick={() => setSelectedStory(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedStory.image && (
              <img 
                src={selectedStory.image} 
                alt={selectedStory.title} 
                className="w-full h-64 object-cover rounded-2xl mb-6 shadow-md"
              />
            )}

            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 mb-8">
              <p className="text-lg font-semibold text-navy italic border-l-4 border-gold pl-4 py-1">
                "{selectedStory.excerpt}"
              </p>
              <div className="text-base whitespace-pre-line">
                {selectedStory.fullContent}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button 
                onClick={() => handleLike(selectedStory.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                  likedStories.includes(selectedStory.id)
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${likedStories.includes(selectedStory.id) ? 'fill-rose-600' : ''}`} />
                <span>{selectedStory.likes || 0} Likes</span>
              </button>

              <Button
                variant="outline"
                onClick={() => setSelectedStory(null)}
                className="rounded-xl px-6"
              >
                Close Story
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Story Modal */}
      {isSubmittingStory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-navy">Share Your Journey</h3>
                <p className="text-xs text-slate-400 mt-1">Inspire fellow graduates and incoming students with your milestone.</p>
              </div>
              <button 
                onClick={() => setIsSubmittingStory(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submissionSuccess ? (
              <div className="py-12 text-center space-y-3">
                <Sparkles className="w-16 h-16 text-gold mx-auto animate-bounce" />
                <h4 className="text-xl font-bold text-navy">Story Published!</h4>
                <p className="text-sm text-slate-500">Your story is now live in the AlumniConnect spotlight gallery.</p>
              </div>
            ) : (
              <form onSubmit={handleUserStorySubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Story Title *</label>
                  <input
                    type="text"
                    required
                    value={userStoryForm.title}
                    onChange={(e) => setUserStoryForm({ ...userStoryForm, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-gold outline-none"
                    placeholder="e.g. Building an EdTech Platform from my Dorm Room"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Industry</label>
                    <select
                      value={userStoryForm.industry}
                      onChange={(e) => setUserStoryForm({ ...userStoryForm, industry: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-gold outline-none"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="CleanTech">CleanTech</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Creative & Media">Creative & Media</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Photo Image URL</label>
                    <input
                      type="url"
                      value={userStoryForm.image}
                      onChange={(e) => setUserStoryForm({ ...userStoryForm, image: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-gold outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Short Summary *</label>
                  <input
                    type="text"
                    required
                    value={userStoryForm.excerpt}
                    onChange={(e) => setUserStoryForm({ ...userStoryForm, excerpt: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-gold outline-none"
                    placeholder="1-2 sentences summarizing your achievement or transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Full Story Narrative *</label>
                  <textarea
                    required
                    rows={4}
                    value={userStoryForm.fullContent}
                    onChange={(e) => setUserStoryForm({ ...userStoryForm, fullContent: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-gold outline-none"
                    placeholder="Share what challenges you faced, key lessons learned, and how alumni can connect with you."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSubmittingStory(false)}
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gold hover:bg-gold/90 text-navy font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Publish Story
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
