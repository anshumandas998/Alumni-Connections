import { useState } from 'react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Textarea } from '@/react-app/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { PlusCircle, Trash2 } from 'lucide-react';


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
];

export default function AdminStories() {
  const [stories, setStories] = useState(mockStories);
  const [isCreating, setIsCreating] = useState(false);
  const [newStory, setNewStory] = useState({ title: '', author: '', year: 2024, excerpt: '', industry: '', image: '', fullContent: '', tags: '' });

  const createStory = () => {
    setStories([...stories, { ...newStory, id: String(stories.length + 1), tags: newStory.tags.split(',').map(t => t.trim()) }]);
    setIsCreating(false);
    setNewStory({ title: '', author: '', year: 2024, excerpt: '', industry: '', image: '', fullContent: '', tags: '' });
  };

  const deleteStory = (id: string) => {
    setStories(stories.filter(s => s.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Manage Stories</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setIsCreating(!isCreating)} className="mb-4">
          <PlusCircle className="w-4 h-4 mr-2" />
          {isCreating ? 'Cancel' : 'Create Story'}
        </Button>

        {isCreating && (
          <div className="space-y-4 mb-8 p-4 border rounded-lg">
            <Input placeholder="Title" value={newStory.title} onChange={(e) => setNewStory({ ...newStory, title: e.target.value })} />
            <Input placeholder="Author" value={newStory.author} onChange={(e) => setNewStory({ ...newStory, author: e.target.value })} />
            <Input type="number" placeholder="Year" value={newStory.year} onChange={(e) => setNewStory({ ...newStory, year: Number(e.target.value) })} />
            <Input placeholder="Industry" value={newStory.industry} onChange={(e) => setNewStory({ ...newStory, industry: e.target.value })} />
            <Input placeholder="Image URL" value={newStory.image} onChange={(e) => setNewStory({ ...newStory, image: e.target.value })} />
            <Input placeholder="Tags (comma-separated)" value={newStory.tags} onChange={(e) => setNewStory({ ...newStory, tags: e.target.value })} />
            <Textarea placeholder="Excerpt" value={newStory.excerpt} onChange={(e) => setNewStory({ ...newStory, excerpt: e.target.value })} />
            <Textarea placeholder="Full Content" value={newStory.fullContent} onChange={(e) => setNewStory({ ...newStory, fullContent: e.target.value })} />
            <Button onClick={createStory}>Save Story</Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories.map((story) => (
              <TableRow key={story.id}>
                <TableCell>{story.title}</TableCell>
                <TableCell>{story.author}</TableCell>
                <TableCell>{story.year}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => deleteStory(story.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
