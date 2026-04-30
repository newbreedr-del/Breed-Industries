'use client';

import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  description?: string;
  folder?: string;
}

export function ImageUpload({ 
  value, 
  onChange, 
  label, 
  description,
  folder = 'blog' 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-white/70 text-sm mb-2">{label}</label>
      
      {value ? (
        <div className="relative">
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10">
            <img 
              src={value} 
              alt="Uploaded" 
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-white/40 text-xs mt-2 break-all">{value}</p>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative w-full h-48 rounded-xl border-2 border-dashed border-white/20 hover:border-accent/50 bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex flex-col items-center justify-center"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-accent animate-spin mb-2" />
              <p className="text-white/60 text-sm">Uploading...</p>
            </>
          ) : (
            <>
              <ImageIcon className="w-10 h-10 text-white/30 mb-3" />
              <p className="text-white/60 text-sm font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-white/40 text-xs mt-1">
                JPG, PNG, WebP, GIF (max 5MB)
              </p>
            </>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}

      {description && !error && (
        <p className="text-white/40 text-xs mt-1">{description}</p>
      )}

      {/* Manual URL Input */}
      <div className="mt-3">
        <p className="text-white/50 text-xs mb-1">Or enter image URL manually:</p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., /assets/images/blog/my-image.jpg"
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent"
        />
      </div>
    </div>
  );
}
