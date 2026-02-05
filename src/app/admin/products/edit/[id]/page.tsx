'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import AdminSidebar from '@/components/AdminSidebar';

interface Category {
  id: string;
  name: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchProduct();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      // We might need a specific endpoint for fetching one product or filter the list
      // The current API might support getting all. Let's assume we can fetch all and find one, 
      // or better, let's see if we can use a specific endpoint. 
      // Looking at previous context, there is /api/admin/products?id=... support for DELETE, 
      // maybe GET supports it too?
      // Let's check src/app/api/admin/products/route.ts from previous context...
      // It seemed to only have GET for all products.
      // However, usually detailed fetching is needed. 
      // Let's try fetching all and filtering for now to be safe, or I can add a GET param support.
      // Actually, looking at the code I read earlier, GET returns all products.
      // I'll fetch all and find the one matching ID.
      
      const response = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const product = data.products.find((p: Product) => p.id === id);
        
        if (product) {
          setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            image: product.image,
            category: product.category,
          });
        } else {
          alert('Product not found');
          router.push('/admin/products');
        }
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, ...formData, price: parseFloat(formData.price) }),
      });

      if (response.ok) {
        alert('Product updated successfully');
        router.push('/admin/products');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to update product'}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('An unexpected error occurred while updating the product.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="mt-4 text-slate-600 font-medium">Loading Product Details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      
      <div className="md:pl-64 transition-all duration-300">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800">Edit Product</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-sm text-slate-500 hover:text-slate-700 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Products
              </button>
            </div>
          </div>
        </nav>

        <main className="p-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden max-w-5xl mx-auto"
          >
            <div className="p-6 sm:p-8">
              <div className="mb-8 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Update Product Information
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Make changes to the product details below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Main Info */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                          placeholder="e.g., Ultra Fast Charger"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                        <div className="relative">
                          <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all bg-slate-50 focus:bg-white"
                          >
                            <option value="">Select a category...</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={6}
                        className="block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white resize-none"
                        placeholder="Detailed product description..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Price ($)</label>
                      <div className="relative rounded-xl shadow-sm max-w-xs">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="text-slate-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="block w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Image & Preview */}
                  <div className="lg:col-span-1">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-full">
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Product Image</label>
                      
                      {/* Image Preview Area */}
                      <div className="relative w-full aspect-square bg-white rounded-xl border-2 border-dashed border-slate-300 mb-4 flex flex-col items-center justify-center overflow-hidden group transition-all hover:border-blue-400">
                        {formData.image ? (
                          <>
                            <Image 
                              src={formData.image} 
                              alt="Preview" 
                              fill
                              className="object-contain p-2"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                          </>
                        ) : (
                          <div className="text-center p-6 text-slate-400">
                            <svg className="mx-auto h-12 w-12 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium">Image preview</span>
                            <p className="text-xs mt-1 text-slate-400">Enter URL below to see preview</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Image URL</label>
                        <input
                          type="url"
                          required
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                          placeholder="https://..."
                        />
                        <p className="text-xs text-slate-400">
                          Paste a direct link to your product image (JPG, PNG, WebP)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 border border-transparent rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5"
                  >
                    Update Product
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}