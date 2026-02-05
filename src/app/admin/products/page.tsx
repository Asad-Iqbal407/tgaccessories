'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/types';
import AdminSidebar from '@/components/AdminSidebar';

interface Category {
  id: string;
  name: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

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

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const url = editingProduct ? '/api/admin/products' : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const body = editingProduct
        ? { id: editingProduct.id, ...formData, price: parseFloat(formData.price) }
        : { ...formData, price: parseFloat(formData.price) };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchProducts();
        resetForm();
        alert(editingProduct ? 'Product updated successfully' : 'Product created successfully');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to save product'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('An unexpected error occurred while saving the product.');
    }
  };

  const handleEdit = (product: Product) => {
    router.push(`/admin/products/edit/${product.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
    });
    setEditingProduct(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="mt-4 text-slate-600 font-medium">Loading Products...</div>
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
            <h1 className="text-2xl font-bold text-slate-800">Products Management</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-500 hidden sm:block">Welcome back, Admin</span>
            </div>
          </div>
        </nav>

        <main className="p-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-slate-900">Catalog</h2>
              <p className="mt-1 text-sm text-slate-500">Manage your product inventory</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              {showAddForm ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Product
                </>
              )}
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === category.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
          {showAddForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-8"
            >
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingProduct ? 'Edit Product Details' : 'Add New Product'}
                  </h2>
                  <button 
                    onClick={resetForm}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
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
                      onClick={resetForm}
                      className="px-6 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-2.5 border border-transparent rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5"
                    >
                      {editingProduct ? 'Save Changes' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
          </AnimatePresence>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        No products found. Click &quot;Add Product&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    products
                      .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
                      .map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 relative">
                              <Image className="object-cover" src={product.image} alt={product.name} fill sizes="48px" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-slate-900">{product.name}</div>
                              <div className="text-sm text-slate-500 max-w-xs truncate">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-900 mr-4 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
