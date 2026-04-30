'use client';

import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2, ExternalLink } from 'lucide-react';
import { uploadImage, isSupabaseStorageUrl } from '@/lib/supabase-storage';

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
      // Upload directly to Supabase Storage
      const result = await uploadImage(file, folder);

      if (!result.success) {
        console.error('Upload failed:', result.error);
        throw new Error(result.error || 'Upload failed - check Supabase storage policies');
      }

      console.log('Upload successful:', result.url);
      onChange(result.url!);
    } catch (err) {
      console.error('Upload error:', err);
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
      // Upload directly to Supabase Storage
      const result = await uploadImage(file, folder);

      if (!result.success) {
        console.error('Upload failed:', result.error);
        throw new Error(result.error || 'Upload failed - check Supabase storage policies');
      }

      console.log('Upload successful:', result.url);
      onChange(result.url!);
    } catch (err) {
      console.error('Upload error:', err);
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
          <div className="absolute top-2 right-2 flex gap-2">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              title="View image"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={handleClear}
              className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-white/40 text-xs mt-2 break-all">
            {isSupabaseStorageUrl(value) ? '📦 Stored in Supabase' : '🔗 External URL'}
          </p>
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
        <p className="text-white/50 text-xs mb-1">Or enter external image URL:</p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent"
        />
      </div>
    </div>
  );
}
