import { useState } from 'react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';

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
];

export default function AdminGallery() {
  const [images, setImages] = useState(mockGallery);
  const [isCreating, setIsCreating] = useState(false);
  const [newImage, setNewImage] = useState({ src: '', alt: '', title: '', date: '', event: '', tags: '', photographer: '' });

  const createImage = () => {
    setImages([...images, { ...newImage, id: String(images.length + 1), tags: newImage.tags.split(',').map(t => t.trim()) }]);
    setIsCreating(false);
    setNewImage({ src: '', alt: '', title: '', date: '', event: '', tags: '', photographer: '' });
  };

  const deleteImage = (id: string) => {
    setImages(images.filter(i => i.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Manage Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setIsCreating(!isCreating)} className="mb-4">
          <PlusCircle className="w-4 h-4 mr-2" />
          {isCreating ? 'Cancel' : 'Add Image'}
        </Button>

        {isCreating && (
          <div className="space-y-4 mb-8 p-4 border rounded-lg">
            <Input placeholder="Image URL" value={newImage.src} onChange={(e) => setNewImage({ ...newImage, src: e.target.value })} />
            <Input placeholder="Alt Text" value={newImage.alt} onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })} />
            <Input placeholder="Title" value={newImage.title} onChange={(e) => setNewImage({ ...newImage, title: e.target.value })} />
            <Input type="date" value={newImage.date} onChange={(e) => setNewImage({ ...newImage, date: e.target.value })} />
            <Input placeholder="Event" value={newImage.event} onChange={(e) => setNewImage({ ...newImage, event: e.target.value })} />
            <Input placeholder="Tags (comma-separated)" value={newImage.tags} onChange={(e) => setNewImage({ ...newImage, tags: e.target.value })} />
            <Input placeholder="Photographer" value={newImage.photographer} onChange={(e) => setNewImage({ ...newImage, photographer: e.target.value })} />
            <Button onClick={createImage}>Save Image</Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img src={image.src} alt={image.alt} className="w-full h-48 object-cover rounded-lg" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div>
                  <h3 className="text-white font-bold">{image.title}</h3>
                  <p className="text-gray-300 text-sm">{image.date}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => deleteImage(image.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
