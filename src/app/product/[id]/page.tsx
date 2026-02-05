'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import Product3DCard from '@/components/Product3DCard';
import { Product } from '@/types';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.id) return;
      
      try {
        // Fetch all products and find the matching one
        // Ideally we would have a specific API endpoint for single product: /api/products/[id]
        // But for now we'll search through the list or try to fetch from categories
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        
        const data = await res.json();
        const allProducts = data.products || [];
        const found = allProducts.find((p: Product) => p.id === params.id);
        
        if (found) {
          setProduct(found);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error(err);
        setError('Error loading product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Product not found'}</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m15 18-6-6 6-6"/></svg>
            Back
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">
            {/* Left Column: 3D Product View */}
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-8">
              <Product3DCard image={product.image} name={product.name} />
              <p className="mt-6 text-sm text-gray-500 text-center">
                Move your mouse to rotate • Click to zoom
              </p>
            </div>

            {/* Right Column: Product Details */}
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full capitalize">
                  {product.category.replace('-', ' ')}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-blue-600 mb-6">${product.price.toFixed(2)}</p>
              
              <div className="prose prose-lg text-gray-600 mb-8">
                <p>{product.description}</p>
                <p>
                  Experience the best quality with our {product.name}. 
                  Designed for durability and performance, it&apos;s the perfect choice for your needs.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-8 mt-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => addItem(product)}
                    className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-200 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    Add to Cart
                  </button>
                  <button 
                    className="px-8 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    Buy Now
                  </button>
                </div>
                
                <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-50 p-2 rounded-full mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/><line x1="3.27" y1="6.96" x2="12" y2="12.01"/><line x1="20.73" y1="6.96" x2="12" y2="12.01"/></svg>
                    </div>
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-50 p-2 rounded-full mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-50 p-2 rounded-full mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <span>Track Order</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
