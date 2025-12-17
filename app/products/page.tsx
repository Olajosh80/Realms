'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/ui/Hero';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Filter, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  category?: string;
  division_id?: string;
  in_stock: boolean;
  featured: boolean;
  division?: {
    name: string;
    slug: string;
  };
}

const categories = [
  'All Products',
  'Fashion & Beauty',
  'Agriculture & Food',
  'Technology',
  'Trade & Logistics',
  'Business Consulting',
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/products?in_stock=true');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Unable to load products right now. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All Products' ||
      product.division?.name === selectedCategory ||
      product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        {/* <Hero
          badge="Products & Services"
          title="Discover Our Offerings"
          description="Explore our diverse range of products and services across all divisions"
          centered
        /> */}

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
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-rare-primary" />
                <span className="ml-2 text-rare-text-light">Loading products...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="font-body text-lg text-red-600 mb-2">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-md border border-rare-primary text-rare-primary font-body text-sm hover:bg-rare-primary/5 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-body text-lg text-rare-text-light">
                  No products found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProducts.map((product) => (
                  <Card key={product.id} hover padding="none" className="relative group cursor-pointer">
                    {/* Product Image */}
                    <a href={`/products/${product.slug}`} className="block">
                      <div className="aspect-square overflow-hidden rounded-t-xl">
                        <img
                          src={product.images?.[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </a>

                    {/* Product Info */}
                    <div className="p-6 relative z-10">
                      <div className="mb-2">
                        <span className="text-xs font-body text-rare-text-light uppercase tracking-wide">
                          {product.division?.name || product.category || 'Product'}
                        </span>
                      </div>
                      <a href={`/products/${product.slug}`}>
                        <h3 className="font-heading text-xl font-normal text-rare-primary mb-2 hover:text-rare-secondary transition-colors">
                          {product.name}
                        </h3>
                      </a>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="font-body text-lg font-semibold text-rare-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.compare_at_price && (
                          <span className="font-body text-sm text-rare-text-light line-through">
                            ${product.compare_at_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 pointer-events-auto">
                        <Button variant="primary" size="sm" fullWidth onClick={() => console.log('Add to cart:', product.id)}>
                          Add to Cart
                        </Button>
                        <Button variant="outline" size="sm" href={`/products/${product.slug}`}>
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
