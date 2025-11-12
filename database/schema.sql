-- Beyond Realms Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Divisions Table
CREATE TABLE IF NOT EXISTS divisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  image_url TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  images TEXT[] DEFAULT '{}',
  category VARCHAR(100),
  division_id UUID REFERENCES divisions(id) ON DELETE SET NULL,
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  author_image TEXT,
  featured_image TEXT,
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_division ON products(division_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_divisions_slug ON divisions(slug);

-- Insert default divisions
INSERT INTO divisions (name, slug, description, icon, "order") VALUES
  ('Fashion & Beauty', 'fashion-beauty', 'Premium fashion and beauty products including bags, clothing, and accessories', '👗', 1),
  ('Agriculture & Food', 'agriculture-food', 'Sustainable agriculture, crops, farms, and food logistics', '🌾', 2),
  ('Technology & Digital Solutions', 'technology', 'Cutting-edge technology and digital transformation services', '💻', 3),
  ('Trade & Logistics', 'trade-logistics', 'Global trade and efficient logistics solutions', '🚢', 4),
  ('Business Consulting & Investments', 'business-consulting', 'Strategic business consulting and investment opportunities', '💼', 5)
ON CONFLICT (slug) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_divisions_updated_at BEFORE UPDATE ON divisions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view divisions" ON divisions FOR SELECT USING (true);
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (published = true);

-- Create policies for contact submissions (insert only)
CREATE POLICY "Anyone can submit contact form" ON contact_submissions FOR INSERT WITH CHECK (true);

-- Create policies for newsletter subscribers
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view their subscription" ON newsletter_subscribers FOR SELECT USING (true);

