import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Textarea } from '@/react-app/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { Story } from '@/shared/types';
import { PlusCircle, Trash2, Edit2, BookOpen, Search, Star, X } from 'lucide-react';

const defaultStories: Story[] = [
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

export default function AdminStories() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem('alumni_stories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load stories from storage', e);
    }
    return defaultStories;
  });

  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialNewStory = {
    title: '',
    author: user?.name || '',
    year: 2022,
    excerpt: '',
    industry: 'Technology',
    image: '',
    fullContent: '',
    tags: ''
  };

  const [newStory, setNewStory] = useState(initialNewStory);

  useEffect(() => {
    localStorage.setItem('alumni_stories', JSON.stringify(stories));
  }, [stories]);

  const filteredStories = useMemo(() => {
    if (!search.trim()) return stories;
    const q = search.toLowerCase();
    return stories.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.author.toLowerCase().includes(q) || 
      s.industry.toLowerCase().includes(q)
    );
  }, [stories, search]);

  const saveStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStory.title.trim() || !newStory.author.trim()) return;

    const tagsArray = typeof newStory.tags === 'string'
      ? newStory.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const storyData: Story = {
      id: editingId || `story-${Date.now()}`,
      title: newStory.title,
      author: newStory.author,
      year: Number(newStory.year) || 2022,
      excerpt: newStory.excerpt,
      industry: newStory.industry,
      image: newStory.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
      fullContent: newStory.fullContent,
      tags: tagsArray,
      likes: editingId ? (stories.find(s => s.id === editingId)?.likes || 0) : 0,
      commentsCount: editingId ? (stories.find(s => s.id === editingId)?.commentsCount || 0) : 0,
      datePosted: new Date().toISOString().split('T')[0]
    };

    if (editingId) {
      setStories(stories.map(s => s.id === editingId ? storyData : s));
      setEditingId(null);
    } else {
      setStories([storyData, ...stories]);
    }

    setIsCreating(false);
    setNewStory(initialNewStory);
  };

  const startEdit = (s: Story) => {
    setEditingId(s.id);
    setNewStory({
      title: s.title,
      author: s.author,
      year: s.year,
      excerpt: s.excerpt,
      industry: s.industry,
      image: s.image,
      fullContent: s.fullContent,
      tags: (s.tags || []).join(', ')
    });
    setIsCreating(true);
  };

  const deleteStory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this success story?')) {
      setStories(stories.filter(s => s.id !== id));
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-navy p-8 rounded-3xl relative overflow-hidden mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-bold uppercase tracking-widest mb-4">
            <BookOpen className="w-4 h-4" />
            Alumni Spotlight & Editorials
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                Success Stories Management
              </h1>
              <p className="text-white/60 mt-2">Publish inspiring career journeys and spotlight distinguished alumni.</p>
            </div>
            <Button 
              onClick={() => {
                setEditingId(null);
                setNewStory(initialNewStory);
                setIsCreating(!isCreating);
              }}
              className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-6 rounded-2xl shadow-lg transition-all flex items-center gap-2"
            >
              {isCreating ? <X className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
              {isCreating ? 'Cancel' : 'Publish Story'}
            </Button>
          </div>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={saveStory} className="bg-white rounded-3xl p-8 shadow-xl border border-navy/10 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-bold text-navy flex items-center gap-2">
              <Star className="w-5 h-5 text-gold" />
              {editingId ? 'Edit Success Story' : 'New Success Story'}
            </h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Story Title *</label>
              <Input 
                required 
                placeholder="e.g. Scaling My AI Venture to Series B" 
                value={newStory.title} 
                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })} 
                className="rounded-xl py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Featured Alumnus Name *</label>
              <Input 
                required 
                placeholder="e.g. Sarah Johnson" 
                value={newStory.author} 
                onChange={(e) => setNewStory({ ...newStory, author: e.target.value })} 
                className="rounded-xl py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Class / Graduation Year</label>
              <Input 
                type="number"
                value={newStory.year} 
                onChange={(e) => setNewStory({ ...newStory, year: parseInt(e.target.value) || 2022 })} 
                className="rounded-xl py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Industry / Sector</label>
              <Input 
                placeholder="e.g. Technology, Healthcare, Finance" 
                value={newStory.industry} 
                onChange={(e) => setNewStory({ ...newStory, industry: e.target.value })} 
                className="rounded-xl py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Cover Image URL</label>
              <Input 
                placeholder="https://images.unsplash.com/..." 
                value={newStory.image} 
                onChange={(e) => setNewStory({ ...newStory, image: e.target.value })} 
                className="rounded-xl py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tags (Comma Separated)</label>
              <Input 
                placeholder="startup, leadership, ai, career" 
                value={newStory.tags} 
                onChange={(e) => setNewStory({ ...newStory, tags: e.target.value })} 
                className="rounded-xl py-3"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Short Excerpt / Hook *</label>
            <Input 
              required
              placeholder="A compelling 1-2 sentence hook summarizing the alumnus milestone..." 
              value={newStory.excerpt} 
              onChange={(e) => setNewStory({ ...newStory, excerpt: e.target.value })} 
              className="rounded-xl py-3"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Story Content *</label>
            <Textarea 
              required
              rows={6}
              placeholder="Write the full inspiring narrative, background, advice to fresh graduates, and memorable college memories..." 
              value={newStory.fullContent} 
              onChange={(e) => setNewStory({ ...newStory, fullContent: e.target.value })} 
              className="rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="bg-navy hover:bg-navy/90 text-white font-bold px-8 rounded-xl">
              {editingId ? 'Save Changes' : 'Publish Story'}
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
            placeholder="Search stories by title, author, industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-gold/50 outline-none"
          />
        </div>
        <div className="text-xs font-bold text-slate-400">
          {filteredStories.length} published stories
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-navy/10">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Story & Author</TableHead>
              <TableHead className="font-bold">Industry</TableHead>
              <TableHead className="font-bold">Class</TableHead>
              <TableHead className="font-bold">Engagement</TableHead>
              <TableHead className="font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                  No stories found.
                </TableCell>
              </TableRow>
            ) : (
              filteredStories.map((story) => (
                <TableRow key={story.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      {story.image && (
                        <img 
                          src={story.image} 
                          alt={story.title} 
                          className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm"
                        />
                      )}
                      <div>
                        <div className="font-bold text-navy text-sm">{story.title}</div>
                        <div className="text-xs text-slate-500">By <span className="font-semibold text-slate-700">{story.author}</span></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                      {story.industry}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium text-sm">
                    Class of {story.year}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-slate-500 font-semibold">
                      ♥ {story.likes || 0} likes • {story.commentsCount || 0} comments
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => startEdit(story)} 
                        className="text-slate-600 hover:text-navy hover:bg-slate-100 rounded-xl"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteStory(story.id)} 
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
