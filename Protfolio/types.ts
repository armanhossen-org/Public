
import type { Session, User } from '@supabase/supabase-js';

export enum StorageProvider {
  SUPABASE = 'Supabase',
  GOOGLE_DRIVE = 'Google Drive',
  MEGA = 'Mega',
  DROPBOX = 'Dropbox',
  PCLOUD = 'pCloud',
  CLOUDFLARE_R2 = 'Cloudflare R2',
  CLOUDINARY = 'Cloudinary',
}

export interface Project {
  id: number;
  created_at: string;
  title: string;
  description: string;
  tags: string[];
  media_urls: string[];
  storage_provider: StorageProvider;
  thumbnail_url: string;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}
