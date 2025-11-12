'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/ui/Hero';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Calendar, User, Tag } from 'lucide-react';

// Mock blog data - in production, this would come from Supabase
const blogPosts = [
  {
    id: 1,
    title: 'The Future of Sustainable Fashion',
    excerpt: 'Exploring how sustainable practices are reshaping the fashion industry and what it means for consumers.',
    author: 'Sarah Johnson',
    category: 'Fashion & Beauty',
    tags: ['Fashion', 'Sustainability', 'Trends'],
    publishedAt: '2024-01-15',
    featuredImage: '/placeholder-blog.jpg',
  },
  {
    id: 2,
    title: 'Digital Transformation in Agriculture',
    excerpt: 'How technology is revolutionizing farming practices and improving crop yields worldwide.',
    author: 'Michael Chen',
    category: 'Agriculture & Food',
    tags: ['Agriculture', 'Technology', 'Innovation'],
    publishedAt: '2024-01-10',
    featuredImage: '/placeholder-blog.jpg',
  },
  {
    id: 3,
    title: 'Cloud Computing Trends for 2024',
    excerpt: 'The latest developments in cloud technology and what businesses need to know.',
    author: 'Emily Rodriguez',
    category: 'Technology',
    tags: ['Cloud', 'Technology', 'Business'],
    publishedAt: '2024-01-05',
    featuredImage: '/placeholder-blog.jpg',
  },
  {
    id: 4,
    title: 'Global Trade in a Connected World',
    excerpt: 'Understanding the complexities of international trade and logistics in the modern era.',
    author: 'David Kim',
    category: 'Trade & Logistics',
    tags: ['Trade', 'Logistics', 'Global'],
    publishedAt: '2023-12-28',
    featuredImage: '/placeholder-blog.jpg',
  },
];

const categories = ['All', 'Fashion & Beauty', 'Agriculture & Food', 'Technology', 'Trade & Logistics', 'Business'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const filteredPosts = blogPosts.filter((post) => 
    selectedCategory === 'All' || post.category === selectedCategory
  );
  
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to Supabase
    setSubscribeStatus('success');
    setEmail('');
  };
  
  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <Hero
          badge="Insights & News"
          title="Stay Informed"
          description="Discover the latest insights, trends, and news from across our divisions"
          centered
        />
        
        {/* Newsletter Section */}
        <Section background="alt" padding="md">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-heading text-2xl md:text-3xl font-normal text-rare-primary mb-4">
                Subscribe to Our Newsletter
              </h2>
              <p className="font-body text-sm md:text-base text-rare-text-light mb-6">
                Get the latest insights and updates delivered to your inbox
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                />
                <Button type="submit" variant="primary" className="sm:w-auto whitespace-nowrap">
                  Subscribe
                </Button>
              </form>
              {subscribeStatus === 'success' && (
                <p className="mt-3 text-sm text-green-600">
                  Thank you for subscribing!
                </p>
              )}
            </div>
          </div>
        </Section>
        
        {/* Category Filter */}
        <Section background="default" padding="sm">
          <div className="container">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-xs font-body font-normal tracking-rare-nav uppercase whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-rare-primary text-white'
                      : 'bg-white text-rare-primary hover:bg-rare-primary-light border border-rare-border'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </Section>
        
        {/* Blog Posts Grid */}
        <Section background="gradient-soft" padding="lg" withTexture>
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} hover padding="none">
                  <div className="aspect-video bg-gradient-to-br from-rare-accent/30 to-rare-primary/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-rare-primary/10"></div>
                    <div className="w-full h-full bg-gradient-to-br from-rare-accent/20 to-rare-primary/5 relative z-10"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-body text-rare-text-light uppercase tracking-wide">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl font-normal text-rare-primary mb-3">
                      {post.title}
                    </h3>
                    <p className="font-body text-sm text-rare-text-light mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-rare-text-light mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-rare-primary-light text-rare-primary text-xs rounded"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" fullWidth>
                      Read More
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      </main>
      
      <Footer />
    </>
  );
}

