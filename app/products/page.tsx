'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/ui/Hero';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Filter } from 'lucide-react';

// Mock product data - in production, this would come from Supabase
const products = [
  {
    id: 1,
    name: 'Designer Leather Bag',
    category: 'Fashion & Beauty',
    price: 299.99,
    compareAtPrice: 399.99,
    image: '/placeholder-product.jpg',
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: 'Premium Organic Coffee',
    category: 'Agriculture & Food',
    price: 24.99,
    image: '/placeholder-product.jpg',
    inStock: true,
    featured: true,
  },
  {
    id: 3,
    name: 'Cloud Hosting Package',
    category: 'Technology',
    price: 99.99,
    image: '/placeholder-product.jpg',
    inStock: true,
    featured: false,
  },
  {
    id: 4,
    name: 'Luxury Skincare Set',
    category: 'Fashion & Beauty',
    price: 149.99,
    compareAtPrice: 199.99,
    image: '/placeholder-product.jpg',
    inStock: true,
    featured: true,
  },
  {
    id: 5,
    name: 'Fresh Produce Box',
    category: 'Agriculture & Food',
    price: 39.99,
    image: '/placeholder-product.jpg',
    inStock: true,
    featured: false,
  },
  {
    id: 6,
    name: 'Business Consulting Package',
    category: 'Business Consulting',
    price: 499.99,
    image: '/placeholder-product.jpg',
    inStock: true,
    featured: true,
  },
];

const categories = [
  'All Products',
  'Fashion & Beauty',
  'Agriculture & Food',
  'Technology',
  'Trade & Logistics',
  'Business Consulting',
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All Products' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <Hero
          badge="Products & Services"
          title="Discover Our Offerings"
          description="Explore our diverse range of products and services across all divisions"
          centered
        />
        
        {/* Filters Section */}
        <Section background="alt" padding="md">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-rare-text-light" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-rare-border rounded-lg font-body text-rare-text placeholder:text-rare-text-light/50 focus:outline-none focus:ring-2 focus:ring-rare-primary focus:border-transparent"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <Filter className="h-5 w-5 text-rare-text-light flex-shrink-0" />
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-xs font-body font-normal tracking-rare-nav uppercase whitespace-nowrap transition-all ${
                        selectedCategory === category
                          ? 'bg-rare-primary text-white'
                          : 'bg-white text-rare-primary hover:bg-rare-primary-light'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>
        
        {/* Products Grid */}
        <Section background="gradient-soft" padding="lg" withTexture>
          <div className="container">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-body text-lg text-rare-text-light">
                  No products found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProducts.map((product) => (
                  <Card key={product.id} hover padding="none">
                    <div className="aspect-square bg-gradient-to-br from-rare-accent/30 to-rare-primary/10 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-rare-primary/10"></div>
                      <div className="w-full h-full bg-gradient-to-br from-rare-accent/20 to-rare-primary/5 relative z-10"></div>
                    </div>
                    <div className="p-6">
                      <div className="mb-2">
                        <span className="text-xs font-body text-rare-text-light uppercase tracking-wide">
                          {product.category}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl font-normal text-rare-primary mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-body text-lg font-semibold text-rare-primary">
                          ${product.price}
                        </span>
                        {product.compareAtPrice && (
                          <span className="font-body text-sm text-rare-text-light line-through">
                            ${product.compareAtPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="primary" size="sm" fullWidth>
                          Add to Cart
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Section>
        
        {/* CTA Section */}
        <Section background="alt" padding="lg">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-heading text-3xl md:text-5xl font-normal text-rare-primary mb-6">
                Need Custom Solutions?
              </h2>
              <p className="font-body text-base md:text-lg text-rare-text-light mb-8">
                Contact us for tailored products and services that meet your specific needs
              </p>
              <Button href="/contact" variant="primary" size="lg">
                Get in Touch
              </Button>
            </div>
          </div>
        </Section>
      </main>
      
      <Footer />
    </>
  );
}

