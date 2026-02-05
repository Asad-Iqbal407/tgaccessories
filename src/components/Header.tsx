'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useState, useRef } from 'react';

export default function Header() {
  const { getItemCount } = useCart();
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShopOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShopOpen(false);
    }, 200);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'SIMs', href: '/sims' },
    { name: 'Smoking Papers', href: '/smoking-papers' },
    { name: 'Chargers', href: '/chargers' },
    { name: 'Cables', href: '/cables' },
    { name: 'Power', href: '/power' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-subtle border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-gradient-to-br from-primary via-accent to-secondary p-0.5 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center overflow-hidden">
                <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 group-hover:text-gradient-primary transition-all duration-300">
              TG Accessories
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200">
              Home
            </Link>

            {/* Shop Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200 flex items-center"
                aria-expanded={shopOpen}
              >
                Shop
                <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd"/>
                </svg>
              </button>
              
              <div 
                className={`absolute left-0 top-full pt-2 w-80 transition-all duration-200 origin-top-left ${
                  shopOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'SIMs', href: '/sims', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                      { name: 'Smoking Papers', href: '/smoking-papers', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                      { name: 'Chargers', href: '/chargers', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                      { name: 'Cables', href: '/cables', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
                      { name: 'Power', href: '/power', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
                      { name: 'Contact', href: '/contact', icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                    ].map((item) => (
                      <Link 
                        key={item.name} 
                        href={item.href} 
                        className="flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group/item"
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                          <svg className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover/item:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-primary">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link href="/blog" className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200">
              Blog
            </Link>
            <Link href="/contact" className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200">
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart Button */}
            <Link href="/cart" className="relative p-2.5 text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200 group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {getItemCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900 animate-scale-in">
                  {getItemCount() > 99 ? '99+' : getItemCount()}
                </span>
              )}
            </Link>
            
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2.5 text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="flex flex-col space-y-1 py-4 border-t border-slate-200 dark:border-slate-800">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href} 
                className="px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
