'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MdShoppingCart, MdFavoriteBorder, MdShare, MdStar } from 'react-icons/md';

// Dummy product data - will be replaced with Supabase data later
const dummyProducts = [
  {
    id: '1',
    name: 'Designer Leather Bag',
    category: 'Fashion & Beauty',
    price: 299.99,
    compareAtPrice: 399.99,
    image: '/ProductsImg/fash1.jpg',
    images: ['/ProductsImg/fash1.jpg', '/ProductsImg/fash2.jpg'],
    description: 'Luxurious handcrafted leather bag made from premium Italian leather. Features multiple compartments, gold-plated hardware, and a timeless design that complements any outfit.',
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: 128,
    sku: 'LB-001',
  },
  {
    id: '2',
    name: 'Premium Organic Coffee',
    category: 'Agriculture & Food',
    price: 24.99,
    image: '/ProductsImg/agro1.jpg',
    images: ['/ProductsImg/agro1.jpg'],
    description: 'Single-origin organic coffee beans from the highlands of Ethiopia. Rich, smooth flavor with notes of chocolate and berries. Perfect for your morning ritual.',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 256,
    sku: 'CF-002',
  },
  {
    id: '3',
    name: 'Cloud Hosting Package',
    category: 'Technology',
    price: 99.99,
    image: '/ProductsImg/tech1.jpg',
    images: ['/ProductsImg/tech1.jpg'],
    description: 'Enterprise-grade cloud hosting with 99.9% uptime guarantee. Includes 100GB SSD storage, unlimited bandwidth, and 24/7 expert support.',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 89,
    sku: 'CH-003',
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching product data
    const foundProduct = dummyProducts.find(p => p.id === params.id);
    setProduct(foundProduct || dummyProducts[0]);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl">Loading product...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button href="/products" variant="primary">Back to Products</Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-rare-accent/5 to-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-rare-text-light">
            <a href="/" className="hover:text-rare-primary">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-rare-primary">Products</a>
            <span>/</span>
            <span className="text-rare-primary">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <Card padding="none" className="overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-4">
                  {product.images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-rare-primary'
                          : 'border-transparent hover:border-rare-border'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category */}
              <div>
                <span className="text-xs font-body text-rare-text-light uppercase tracking-wide">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-4xl font-normal text-rare-primary">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-rare-text-light">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="font-heading text-4xl font-normal text-rare-primary">
                  ${product.price}
                </span>
                {product.compareAtPrice && (
                  <span className="font-body text-xl text-rare-text-light line-through">
                    ${product.compareAtPrice}
                  </span>
                )}
                {product.compareAtPrice && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Save ${(product.compareAtPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div>
                {product.inStock ? (
                  <span className="text-green-600 font-medium">✓ In Stock</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
                <span className="text-sm text-rare-text-light ml-4">SKU: {product.sku}</span>
              </div>

              {/* Description */}
              <div className="border-t border-b border-rare-border py-6">
                <p className="font-body text-rare-text leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-medium text-rare-text">Quantity:</span>
                <div className="flex items-center border border-rare-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-rare-primary-light transition"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 border-x border-rare-border">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-rare-primary-light transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 relative z-20">
                <div className="flex gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => alert(`Added ${quantity} x ${product.name} to cart!`)}
                    className="relative z-30"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <button className="px-6 border border-rare-border rounded-lg hover:bg-rare-primary-light transition relative z-30">
                    <Heart className="w-6 h-6 text-rare-primary" />
                  </button>
                  <button className="px-6 border border-rare-border rounded-lg hover:bg-rare-primary-light transition relative z-30">
                    <Share2 className="w-6 h-6 text-rare-primary" />
                  </button>
                </div>
                <Button variant="outline" size="lg" fullWidth href="/checkout" className="relative z-30">
                  Buy Now
                </Button>
              </div>

              {/* Product Features */}
              <Card className="bg-rare-accent/10 border-rare-accent/20">
                <h3 className="font-heading text-xl mb-4">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-rare-primary mt-1">✓</span>
                    <span className="text-rare-text">Premium quality materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rare-primary mt-1">✓</span>
                    <span className="text-rare-text">Handcrafted with attention to detail</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rare-primary mt-1">✓</span>
                    <span className="text-rare-text">30-day money-back guarantee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rare-primary mt-1">✓</span>
                    <span className="text-rare-text">Free shipping on orders over $100</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="font-heading text-3xl font-normal text-rare-primary mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dummyProducts.slice(0, 3).map((relatedProduct) => (
                <Card key={relatedProduct.id} hover padding="none">
                  <a href={`/products/${relatedProduct.id}`}>
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-lg font-normal text-rare-primary mb-2">
                        {relatedProduct.name}
                      </h3>
                      <p className="font-body text-lg font-semibold text-rare-primary">
                        ${relatedProduct.price}
                      </p>
                    </div>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
