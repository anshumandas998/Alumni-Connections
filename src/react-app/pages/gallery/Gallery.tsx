import { useState } from 'react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Badge } from '@/react-app/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/react-app/components/ui/card';
import { Search, Image as ImageIcon, Calendar, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  date: string;
  event?: string;
  tags: string[];
  photographer: string;
}

const mockGallery: GalleryImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=400&fit=crop',
    alt: 'Graduation ceremony',
    title: 'Class of 2023 Commencement',
    date: 'May 15, 2023',
    event: 'Annual Graduation',
    tags: ['graduation', 'ceremony', 'campus'],
    photographer: 'Campus Photography'
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop',
    alt: 'Networking event',
    title: 'Alumni Networking Night',
    date: 'March 22, 2023',
    event: 'Tech Networking',
    tags: ['networking', 'professional', 'tech'],
    photographer: 'Event Team'
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
    alt: 'Sports reunion',
    title: 'Alumni Sports Day 2023',
    date: 'June 10, 2023',
    event: 'Sports Reunion',
    tags: ['sports', 'reunion', 'athletics'],
    photographer: 'Sports Media'
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1519452634766-879ec7665b4a?w=600&h=400&fit=crop',
    alt: 'Holiday party',
    title: 'Holiday Alumni Party',
    date: 'December 8, 2022',
    event: 'Holiday Celebration',
    tags: ['holiday', 'party', 'social'],
    photographer: 'Holiday Crew'
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
    alt: 'Career fair',
    title: 'Spring Career Fair',
    date: 'April 5, 2023',
    event: 'Career Fair',
    tags: ['career', 'fair', 'professional'],
    photographer: 'Career Services'
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b7?w=600&h=400&fit=crop',
    alt: 'Welcome week',
    title: 'New Alumni Welcome',
    date: 'September 15, 2023',
    event: 'Welcome Week',
    tags: ['welcome', 'new-alumni', 'orientation'],
    photographer: 'Welcome Team'
  }
];

export default function Gallery() {
  const [images] = useState(mockGallery);

  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode] = useState<'grid' | 'masonry'>('grid');

  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  const allTags = Array.from(new Set(mockGallery.flatMap(img => img.tags)));

  const filteredImages = images.filter(img => {
    const matchesSearch = 
      img.title.toLowerCase().includes(search.toLowerCase()) ||
      img.event?.toLowerCase().includes(search.toLowerCase()) ||
      img.photographer.toLowerCase().includes(search.toLowerCase());

    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => img.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const handleImageClick = (imageId: string) => {
    navigate(`/gallery/${imageId}`);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                  <ImageIcon className="w-8 h-8" />
                  Alumni Gallery
                </h1>
                <p className="text-muted-foreground">Memories from events, reunions, and milestones</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setLayout('grid')}>
                  <Grid className="w-4 h-4 mr-1" />
                  Grid
                </Button>
                <Button variant="outline" size="sm" onClick={() => setLayout('list')}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  List
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search photos, events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 8).map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      setSelectedTags(prev => 
                        prev.includes(tag) 
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">
              {selectedTags.length > 0 && `Filtered by: ${selectedTags.join(', ')}`} ({filteredImages.length} photos)
            </p>
          </CardContent>
        </Card>

        {/* Gallery */}
        {layout === 'grid' ? (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer hover:shadow-2xl transition-all duration-300"
                onClick={() => handleImageClick(image.id)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="font-semibold text-white text-sm mb-1 truncate">{image.title}</h3>
                  <p className="text-white/90 text-xs mb-2">{image.date}</p>
                  {image.event && (
                    <Badge variant="secondary" className="text-xs">{image.event}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredImages.map((image) => (
              <Card key={image.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleImageClick(image.id)}>
                <div className="relative h-64 overflow-hidden rounded-t-lg">
                  <img src={image.src} alt={image.alt} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {image.date} • {image.photographer}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {image.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  {image.event && <Badge variant="secondary">{image.event}</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredImages.length === 0 && (
          <Card className="mt-12 text-center py-16">
            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No photos found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or tag filters</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setSearch('')}>
                Clear Search
              </Button>
              <Button variant="outline" onClick={() => setSelectedTags([])}>
                Clear Tags
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

