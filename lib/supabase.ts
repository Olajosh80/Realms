import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database Types
export interface Division {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image_url: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  category: string;
  division_id: string;
  division?: Division;
  in_stock: boolean;
  featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  author_image?: string;
  featured_image: string;
  category: string;
  tags: string[];
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed: boolean;
  created_at: string;
}

