import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/react-app/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';
import { BookOpen, Search, Filter, Calendar, Users, MessageSquare } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  author: string;
  year: number;
  excerpt: string;
  industry: string;
  image: string;
  fullContent: string;
  tags: string[];
}

const mockStories: Story[] = [
  {
    id: '1',
    title: 'From Campus to CEO: My Startup Journey',
    author: 'Sarah Johnson',
    year: 2022,
    excerpt: "How I turned my senior project into a $10M SaaS company in just 3 years.",
    industry: 'Technology',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    fullContent: 'It all started in my dorm room with a simple idea...',
    tags: ['entrepreneurship', 'startup', 'saas']
  },
  {
    id: '2',
    title: 'Breaking into Finance Without Wall Street',
    author: 'Mike Chen',
    year: 2021,
    excerpt: 'Building a successful fintech career through alumni connections and persistence.',
    industry: 'Finance',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    fullContent: 'Wall Street isn\'t the only path to finance success...',
    tags: ['finance', 'networking', 'career']
  },
  {
    id: '3',
    title: 'From Biology to UX Design: My Career Pivot',
    author: 'Emily Davis',
    year: 2023,
    excerpt: 'How I transitioned from lab research to leading design teams at top startups.',
    industry: 'Design',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    fullContent: 'Science taught me rigor, design taught me creativity...',
    tags: ['career-change', 'design', 'ux']
  },
  {
    id: '4',
    title: 'Global Impact Through Non-Profit Work',
    author: 'David Rodriguez',
    year: 2020,
    excerpt: 'Using business skills to solve healthcare challenges in developing countries.',
    industry: 'Non-Profit',
    image: 'https://images.unsplash.com/photo-1576091160399-1b402af794a5?w=400&h=300&fit=crop',
    fullContent: 'MBA skills + passion = global change...',
    tags: ['nonprofit', 'social-impact', 'leadership']
  },
  {
    id: '5',
    title: 'Engineering Leadership at FAANG Scale',
    author: 'Priya Patel',
    year: 2024,
    excerpt: 'Lessons from managing 100+ engineers at the world\'s largest tech companies.',
    industry: 'Technology',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
    fullContent: 'Scale isn\'t just about code, it\'s about people...',
    tags: ['leadership', 'engineering', 'management']
  }
];

export default function Stories() {
  const [stories, setStories] = useState(mockStories);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    let filtered = [...mockStories];

    if (search) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(search.toLowerCase()) ||
        story.author.toLowerCase().includes(search.toLowerCase()) ||
        story.excerpt.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (industryFilter !== 'all') {
      filtered = filtered.filter(story => story.industry === industryFilter);
    }

    if (yearFilter !== 'all') {
      filtered = filtered.filter(story => story.year === parseInt(yearFilter));
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'newest') return b.year - a.year;
      if (sortBy === 'oldest') return a.year - b.year;
      return 0;
    });

    setStories(filtered);
  }, [search, industryFilter, yearFilter, sortBy]);

  const industries = Array.from(new Set(mockStories.map(s => s.industry)));
  const years = Array.from(new Set(mockStories.map(s => s.year.toString()))).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-3xl">Alumni Success Stories</CardTitle>
                <p className="text-muted-foreground">Inspiring journeys from your fellow graduates</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters ({stories.length} stories)
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => {
              setSearch('');
              setIndustryFilter('all');
              setYearFilter('all');
              setSortBy('newest');
            }}>
              Clear All
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search stories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map(ind => (
                  <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <Card key={story.id} className="group hover:shadow-xl transition-all overflow-hidden">
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-muted to-background group-hover:scale-105 transition-transform">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge variant="secondary" className="mb-2">{story.industry}</Badge>
                </div>
              </div>
              <CardContent className="p-6 pt-0">
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {story.author} • {story.year}
                </div>
                <CardTitle className="text-xl mb-3 leading-tight group-hover:text-primary transition-colors">
                  {story.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 mb-4">
                  {story.excerpt}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mb-4">
                  {story.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/stories/${story.id}`}>Read Full Story</Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {stories.length === 0 && (
          <Card className="mt-12 text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No stories found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
            <Button variant="outline" asChild>
              <Link to="/profile">Share Your Story</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

