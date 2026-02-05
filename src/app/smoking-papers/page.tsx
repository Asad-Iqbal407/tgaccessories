'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useEffect, useState } from 'react';
import { Product } from '@/types';

export default function SmokingPapersPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const filtered = (data.products || []).filter((p: Product) => p.category === 'smoking-papers');
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Smoking Papers</h2>
          <p className="text-xl text-gray-600">High-quality papers for rolling</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 text-center text-gray-500">Loading...</div>
          ) : products.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500">No products found</div>
          ) : products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
              <Link href={`/product/${product.id}`} className="block cursor-pointer">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>
              </Link>
              <div className="p-6">
                <Link href={`/product/${product.id}`} className="block cursor-pointer">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addItem(product);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors z-10 relative"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
