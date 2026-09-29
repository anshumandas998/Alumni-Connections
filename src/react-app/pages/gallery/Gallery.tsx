import { useState, useEffect, useMemo } from 'react';
import { Heart, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category?: string;
  uploadedAt?: string;
  likes?: number;
}

const defaultImages: GalleryItem[] = [
  { 
    id: 'd1', 
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&h=700&fit=crop', 
    title: 'Grand Alumni Reunion Gala 2026',
    category: 'Reunions',
    uploadedAt: '2026-08-15',
    likes: 124
  },
  { 
    id: 'd2', 
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd458720e?w=1000&h=700&fit=crop', 
    title: 'Global Tech & Innovation Symposium',
    category: 'Networking',
    uploadedAt: '2026-07-22',
    likes: 89
  },
  { 
    id: 'd3', 
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=700&fit=crop', 
    title: 'University Courtyard & Clocktower Sunrise',
    category: 'Campus',
    uploadedAt: '2026-06-10',
    likes: 210
  },
  { 
    id: 'd4', 
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&h=700&fit=crop', 
    title: 'Commencement Ceremony & Hat Toss',
    category: 'Ceremonies',
    uploadedAt: '2026-05-30',
    likes: 345
  },
  { 
    id: 'd5', 
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1000&h=700&fit=crop', 
    title: 'Alumni Founders Pitch & Demo Day',
    category: 'Networking',
    uploadedAt: '2026-04-18',
    likes: 76
  },
  { 
    id: 'd6', 
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&h=700&fit=crop', 
    title: 'Annual Alumni Chapter Dinner & Awards',
    category: 'Reunions',
    uploadedAt: '2026-03-12',
    likes: 154
  },
  { 
    id: 'd7', 
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1000&h=700&fit=crop', 
    title: 'Alumni Inter-College Basketball Championship',
    category: 'Sports',
    uploadedAt: '2026-02-28',
    likes: 98
  },
  { 
    id: 'd8', 
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&h=700&fit=crop', 
    title: 'Spring Campus Walk & Cherry Blossoms',
    category: 'Campus',
    uploadedAt: '2026-04-05',
    likes: 182
  }
];

export default function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('gallery_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin_gallery');
      if (saved) {
        const customImages = JSON.parse(saved);
        if (Array.isArray(customImages) && customImages.length > 0) {
          setImages([...customImages, ...defaultImages]);
          return;
        }
      }
    } catch (e) {
      console.error('Error loading gallery images', e);
    }
    setImages(defaultImages);
  }, []);

  const categories = ['All', 'Reunions', 'Campus', 'Networking', 'Ceremonies', 'Sports'];

  const filteredImages = useMemo(() => {
    if (selectedCategory === 'All') return images;
    return images.filter(img => img.category === selectedCategory);
  }, [images, selectedCategory]);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const isLiked = !!likedMap[id];
    const newLikedMap = { ...likedMap, [id]: !isLiked };
    setLikedMap(newLikedMap);
    localStorage.setItem('gallery_likes', JSON.stringify(newLikedMap));

    setImages(prev => prev.map(img => {
      if (img.id === id) {
        return { ...img, likes: (img.likes || 0) + (isLiked ? -1 : 1) };
      }
      return img;
    }));
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
  };

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
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
              <ImageIcon className="w-4 h-4" />
              Moments & Memories
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Photo <span className="text-gold">Gallery</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed">
              Relive unforgettable memories from campus convocations, chapter reunions, and global alumni celebrations.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-24">
        {/* Category Filters */}
        <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 mb-10 flex items-center justify-between overflow-x-auto">
          <div className="flex gap-2 w-full justify-center flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-navy text-gold shadow-lg shadow-navy/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-navy'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => {
            const isLiked = !!likedMap[image.id];

            return (
              <div 
                key={image.id || index} 
                onClick={() => setLightboxIndex(index)}
                className="group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-navy cursor-pointer aspect-square"
              >
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
                      {image.category || 'Alumni'}
                    </span>
                    <button
                      onClick={(e) => toggleLike(e, image.id)}
                      className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-rose-500 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-base line-clamp-2 drop-shadow-md mb-1">
                      {image.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span>{image.uploadedAt ? new Date(image.uploadedAt).toLocaleDateString() : 'Archive'}</span>
                      <span>♥ {image.likes || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && filteredImages[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button 
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Nav Prev */}
          <button 
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Nav Next */}
          <button 
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Content */}
          <div 
            className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={filteredImages[lightboxIndex].url} 
              alt={filteredImages[lightboxIndex].title}
              className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <div className="w-full text-center mt-4">
              <h3 className="text-xl font-bold text-white mb-1">
                {filteredImages[lightboxIndex].title}
              </h3>
              <p className="text-sm text-gold">
                {filteredImages[lightboxIndex].category || 'Alumni Moments'} • {filteredImages[lightboxIndex].uploadedAt ? new Date(filteredImages[lightboxIndex].uploadedAt!).toLocaleDateString() : 'Official Gallery'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
