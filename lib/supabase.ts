import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => !!supabase;
export const isDemoMode = () => !supabase;

// Storage bucket names
export const PRODUCT_IMAGES_BUCKET = 'product-images';
export const APPLICATION_FILES_BUCKET = 'application-files';

/**
 * Upload a file to Supabase Storage (product-images bucket).
 * Returns the public URL of the uploaded file.
 */
export async function uploadProductImage(file: File): Promise<string | null> {
  if (!supabase) return null;

  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(filePath, file, { upsert: true });

  if (error) {
    console.error('Storage upload error:', error);
    return null;
  }

  const { data } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function uploadApplicationFile(file: File, subfolder: string = 'general'): Promise<string | null> {
  if (!supabase) return null;

  const fileExt = file.name.split('.').pop() || 'bin';
  const fileName = `${subfolder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  const { error } = await supabase.storage
    .from(APPLICATION_FILES_BUCKET)
    .upload(fileName, file, { upsert: true });

  if (error) {
    console.error('Application file upload error:', error);
    return null;
  }

  const { data } = supabase.storage
    .from(APPLICATION_FILES_BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage by its path.
 */
export async function deleteProductImage(filePath: string): Promise<boolean> {
  if (!supabase) return false;

  // Extract the path from a full URL if needed
  const path = filePath.includes('supabase.co') 
    ? filePath.split('/product-images/')[1] 
    : filePath;

  if (!path) return false;

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .remove([path]);

  return !error;
}
