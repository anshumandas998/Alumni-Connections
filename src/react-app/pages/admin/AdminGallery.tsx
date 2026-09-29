import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Button } from '@/react-app/components/ui/button';
import { Card } from '@/react-app/components/ui/card';
import { Input } from '@/react-app/components/ui/input';
import { Image as ImageIcon, Upload, Trash2, Plus, Shield, Link2, X } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category?: string;
  uploadedAt: string;
}

export default function AdminGallery() {
  const { user } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlForm, setUrlForm] = useState({
    title: '',
    url: '',
    category: 'Campus'
  });

  useEffect(() => {
    const saved = localStorage.getItem('admin_gallery');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setImages(parsed);
      } catch (e) {
        console.error('Failed to parse admin gallery', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('admin_gallery', JSON.stringify(images));
  }, [images]);

  const processFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      
      fileList.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImage: GalleryImage = {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: reader.result as string,
            title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            category: 'Campus',
            uploadedAt: new Date().toISOString()
          };
          setImages(prev => [newImage, ...prev]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(event.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlForm.url.trim() || !urlForm.title.trim()) return;

    const newImage: GalleryImage = {
      id: `img-url-${Date.now()}`,
      url: urlForm.url.trim(),
      title: urlForm.title.trim(),
      category: urlForm.category,
      uploadedAt: new Date().toISOString()
    };

    setImages([newImage, ...images]);
    setUrlForm({ title: '', url: '', category: 'Campus' });
    setShowUrlModal(false);
  };

  const deleteImage = (id: string) => {
    if (window.confirm('Are you sure you want to remove this image from the gallery?')) {
      setImages(images.filter(img => img.id !== id));
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl shadow-sm">
        <Shield className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-navy">Access Denied</h2>
        <p className="text-slate-500 mt-2">Only administrators can manage the community photo gallery.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-navy p-8 rounded-3xl relative overflow-hidden mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-bold uppercase tracking-widest mb-4">
              <ImageIcon className="w-4 h-4" />
              Media Center
            </div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Photo Gallery Management
            </h1>
            <p className="text-white/60 mt-2">Upload and curate official photos for community celebrations, reunions, and events.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button 
              onClick={() => setShowUrlModal(true)}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold h-12 px-5 rounded-2xl transition-all flex items-center gap-2"
            >
              <Link2 className="w-4 h-4 text-gold" />
              Add Image URL
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-gold hover:bg-gold/90 text-navy font-bold h-12 px-6 rounded-2xl shadow-lg transition-all flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload from My PC
            </Button>
          </div>
        </div>
      </div>

      {/* Add URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-navy flex items-center gap-2">
                <Link2 className="w-5 h-5 text-gold" />
                Add Image from URL
              </h3>
              <button 
                onClick={() => setShowUrlModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUrl} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Image Title *</label>
                <Input
                  required
                  placeholder="e.g. Alumni Founders Summit 2026"
                  value={urlForm.title}
                  onChange={(e) => setUrlForm({ ...urlForm, title: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Image URL *</label>
                <Input
                  required
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={urlForm.url}
                  onChange={(e) => setUrlForm({ ...urlForm, url: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Category</label>
                <select
                  value={urlForm.category}
                  onChange={(e) => setUrlForm({ ...urlForm, category: e.target.value })}
                  className="w-full h-10 px-3 border border-input rounded-xl bg-background text-sm font-medium focus:ring-2 focus:ring-gold outline-none"
                >
                  <option value="Campus">Campus</option>
                  <option value="Reunions">Reunions</option>
                  <option value="Networking">Networking</option>
                  <option value="Ceremonies">Ceremonies</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <Button type="button" variant="outline" onClick={() => setShowUrlModal(false)} className="flex-1 rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-navy hover:bg-navy/90 text-white font-bold rounded-xl">
                  Add to Gallery
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 rounded-3xl transition-all ${
          isDragging ? 'bg-gold/10 ring-4 ring-dashed ring-gold ring-inset scale-[0.99]' : ''
        }`}
      >
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-gold hover:bg-gold/5 transition-all group relative overflow-hidden bg-white shadow-sm"
        >
          {isDragging && (
            <div className="absolute inset-0 bg-gold/20 flex items-center justify-center z-10">
              <Upload className="w-12 h-12 text-gold animate-bounce" />
            </div>
          )}
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-gold/20 transition-colors">
            <Plus className="w-8 h-8 text-slate-400 group-hover:text-gold" />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-700 group-hover:text-gold">Add New Photo</p>
            <p className="text-xs text-slate-400 mt-1">or drag and drop here</p>
          </div>
        </button>

        {images.map((image) => (
          <Card key={image.id} className="group overflow-hidden rounded-3xl border-none shadow-md hover:shadow-2xl transition-all relative aspect-square">
            <img 
              src={image.url} 
              alt={image.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
              <span className="px-3 py-1 bg-gold/20 text-gold text-[10px] font-bold uppercase rounded-full tracking-wider mb-2">
                {image.category || 'Campus'}
              </span>
              <p className="text-white font-bold mb-1 truncate w-full text-sm">{image.title}</p>
              <p className="text-white/60 text-xs mb-6">
                {new Date(image.uploadedAt).toLocaleDateString()}
              </p>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => deleteImage(image.id)}
                className="rounded-xl gap-2 font-bold px-4"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-400">Your gallery is empty</h3>
          <p className="text-slate-400 mt-2">Start by uploading photos from your PC or adding web image URLs.</p>
        </div>
      )}
    </div>
  );
}
