'use client';

import Link from 'next/link';
import { categories } from '@/lib/data';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600&h=900&fit=crop',
    title: 'Premium Tech Accessories',
    subtitle: 'Elevate Your Digital Life',
    description: 'Discover our curated collection of high-performance accessories designed to keep you connected.',
    cta: 'Shop Now',
    link: '/sims'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1600&h=900&fit=crop',
    title: 'Power Solutions',
    subtitle: 'Stay Charged Anywhere',
    description: 'From fast chargers to high-capacity power banks, never run out of battery again.',
    cta: 'View Chargers',
    link: '/chargers'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1600&h=900&fit=crop',
    title: 'Connectivity',
    subtitle: 'Cables & Adapters',
    description: 'Premium cables built to last. Fast data transfer and durable design.',
    cta: 'Browse Cables',
    link: '/cables'
  }
];

function PaymentHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    // Check for payment success
    if (searchParams.get('payment_success') === 'true') {
      const finalizeOrder = async () => {
        try {
          await fetch('/api/orders/create', { method: 'POST' });
          clearCart();
          alert('Order placed successfully! Thank you for your purchase.');
          router.replace('/');
        } catch (error) {
          console.error('Error finalizing order:', error);
        }
      };
      
      finalizeOrder();
    }
  }, [searchParams, router, clearCart]);

  return null;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch('/api/products').catch(() => {});
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <Suspense fallback={null}>
        <PaymentHandler />
      </Suspense>
      {/* Hero Slider */}
      <section className="relative h-[600px] overflow-hidden bg-slate-900">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
              <div className="max-w-4xl mx-auto transform transition-all duration-700 translate-y-0 opacity-100">
                <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-indigo-300 uppercase bg-indigo-900/50 rounded-full border border-indigo-700/50 backdrop-blur-sm animate-fade-in-up">
                  {slide.title}
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
                  {slide.subtitle}
                </h1>
                <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl mx-auto font-light">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={slide.link} className="px-8 py-4 bg-primary hover:bg-primary/90 text-white text-lg font-semibold rounded-full shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1">
                    {slide.cta}
                  </Link>
                  <Link href="/contact" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-full backdrop-blur-md border border-white/10 transition-all duration-300">
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Explore Categories</h2>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Find exactly what you need from our extensive range of quality products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/${category.id}`} className="group relative block h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-slate-900 group-hover:scale-105 transition-transform duration-700 z-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-90"></div>
              </div>

              <div className="absolute inset-0 z-10 flex flex-col justify-end p-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-slate-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center text-primary font-semibold group-hover:text-white transition-colors">
                    Explore Products
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Promotions</h3>
            <Link href="/blog" className="text-primary font-semibold hover:text-primary/80 transition-colors">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/blog" className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all h-64">
              <img src="https://images.unsplash.com/photo-1582560469781-1965b9af9034?w=800&h=600&fit=crop" alt="Thin Papers Promo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <div className="text-white text-xl font-bold mb-1">Save 20% on Ultra Thin Papers</div>
                <div className="text-white/80 text-sm font-medium bg-red-500/20 inline-block px-2 py-1 rounded backdrop-blur-sm">Limited-time offer</div>
              </div>
            </Link>
            <Link href="/blog" className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all h-64">
              <img src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop" alt="HDMI Promo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <div className="text-white text-xl font-bold mb-1">Bundle Deal: Cables + Chargers</div>
                <div className="text-white/80 text-sm font-medium bg-blue-500/20 inline-block px-2 py-1 rounded backdrop-blur-sm">Free shipping</div>
              </div>
            </Link>
            <Link href="/blog" className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all h-64">
              <img src="https://images.unsplash.com/photo-1609592806580-3e5b6e9b3c8a?w=800&h=600&fit=crop" alt="Wireless Promo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <div className="text-white text-xl font-bold mb-1">Wireless Power Week</div>
                <div className="text-white/80 text-sm font-medium bg-green-500/20 inline-block px-2 py-1 rounded backdrop-blur-sm">New arrivals</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-t border-slate-200 dark:border-slate-800 pt-16">
          <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Fast Delivery</h3>
            <p className="text-slate-600 dark:text-slate-400">Quick shipping on all orders directly to your doorstep.</p>
          </div>
          <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Quality Guarantee</h3>
            <p className="text-slate-600 dark:text-slate-400">Authentic products with manufacturer warranty.</p>
          </div>
          <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-16 h-16 mx-auto bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">24/7 Support</h3>
            <p className="text-slate-600 dark:text-slate-400">Dedicated customer support team ready to assist you.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
