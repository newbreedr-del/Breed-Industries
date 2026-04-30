import { supabase } from './supabase';

const BUCKET_NAME = 'Blog and Site';

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload
 * @param folder - Subfolder within the bucket (e.g., 'blog', 'portfolio')
 * @returns UploadResult with public URL or error
 */
export async function uploadImage(
  file: File,
  folder: string = 'uploads'
): Promise<UploadResult> {
  try {
    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only JPG, PNG, WebP, GIF allowed.',
      };
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File too large. Max 5MB.',
      };
    }

    // Create unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
    const filePath = `${folder}/${timestamp}-${safeName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return {
        success: false,
        error: uploadError.message,
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Unexpected upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Delete an image from Supabase Storage
 * @param path - The file path to delete
 */
export async function deleteImage(path: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}

/**
 * List all images in a folder
 * @param folder - Folder to list
 */
export async function listImages(folder: string = 'uploads'): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder);

    if (error) {
      console.error('List error:', error);
      return [];
    }

    return (data || [])
      .filter(item => !item.id.endsWith('/')) // Filter out folders
      .map(item => {
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(`${folder}/${item.name}`);
        return publicUrl;
      });
  } catch (error) {
    console.error('Unexpected list error:', error);
    return [];
  }
}

/**
 * Check if a URL is a Supabase Storage URL or external URL
 */
export function isSupabaseStorageUrl(url: string): boolean {
  return url.includes('.supabase.co/storage/v1/object/public/');
}

/**
 * Extract the path from a Supabase Storage URL
 */
export function getPathFromUrl(url: string): string | null {
  if (!isSupabaseStorageUrl(url)) return null;
  
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/object\/public\/[^/]+\/(.+)/);
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
}
