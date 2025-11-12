'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ShoppingCart } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Our Divisions', href: '/divisions' },
  { name: 'Products & Services', href: '/products' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // trigger after scrolling 50px
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        isScrolled
          ? 'bg-gradient-blue border-rare-border/30 shadow-md' // midnight blue
          : 'bg-rare-background border-rare-border/20'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 py-4 md:py-6">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-rare-primary-light rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className={`h-6 w-6 ${isScrolled ? 'text-white' : 'text-rare-primary'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${isScrolled ? 'text-white' : 'text-rare-primary'}`} />
              )}
            </button>
          </div>

          {/* Desktop Navigation (Left) */}
          <nav className="hidden md:flex gap-8 flex-1">
            {navigation.slice(0, 3).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-xs font-body font-normal tracking-rare-nav uppercase transition-opacity ${
                  isScrolled
                    ? 'text-white hover:opacity-80'
                    : 'text-rare-primary hover:opacity-70'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
               <img
                  src="/logo.png"
                  alt="Beyond Realms Logo"
                  className={`h-10 w-auto transition-transform duration-300 ${
                isScrolled ? 'brightness-200' : ''
                }`}
              />
           </Link>
          </div>

          {/* Desktop Navigation (Right) */}
          <nav className="hidden md:flex gap-8 flex-1 justify-end">
            {navigation.slice(3).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-xs font-body font-normal tracking-rare-nav uppercase transition-opacity ${
                  isScrolled
                    ? 'text-white hover:opacity-80'
                    : 'text-rare-primary hover:opacity-70'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button
              className="p-2 hover:bg-rare-primary-light rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search
                className={`h-5 w-5 transition-colors ${
                  isScrolled ? 'text-white' : 'text-rare-primary'
                }`}
              />
            </button>
            <button
              className="p-2 hover:bg-rare-primary-light rounded-lg transition-colors relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart
                className={`h-5 w-5 transition-colors ${
                  isScrolled ? 'text-white' : 'text-rare-primary'
                }`}
              />
              <span className="absolute -top-1 -right-1 bg-rare-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-body px-4 py-2 rounded-lg transition-colors ${
                    isScrolled
                      ? 'text-white hover:bg-white/10'
                      : 'text-rare-primary hover:bg-rare-primary-light'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
