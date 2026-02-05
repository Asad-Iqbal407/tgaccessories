'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminSidebar from '@/components/AdminSidebar';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  _id?: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  
  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    fetchCategories();
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
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category?: Category, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (category) {
      setIsEditMode(true);
      setCurrentCategory(category);
      setFormData({
        id: category.id || '',
        name: category.name || '',
        description: category.description || '',
        image: category.image || ''
      });
    } else {
      setIsEditMode(false);
      setCurrentCategory({});
      setFormData({
        id: '',
        name: '',
        description: '',
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentCategory({});
    setFormData({
      id: '',
      name: '',
      description: '',
      image: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditMode && currentCategory.id) {
        // Update existing category
        const response = await fetch(`/api/categories/${currentCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            image: formData.image
          })
        });
        
        const data = await response.json();

        if (response.ok) {
          alert('Category updated successfully');
          await fetchCategories();
          handleCloseModal();
        } else {
          alert(`Failed to update category: ${data.error || 'Unknown error'}`);
        }
      } else {
        // Create new category
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        const data = await response.json();

        if (response.ok) {
          alert('Category created successfully');
          await fetchCategories();
          handleCloseModal();
        } else {
          alert(`Failed to create category: ${data.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please check console.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Category deleted successfully');
        fetchCategories();
      } else {
        alert('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="mt-4 text-slate-600 font-medium">Loading Categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      
      <div className="md:pl-64 transition-all duration-300">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800">Categories Management</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  setLoading(true);
                  fetchCategories();
                }}
                className="p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-100"
                title="Refresh Data"
              >
                <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <span className="text-sm text-slate-500 hidden sm:block">Welcome back, Admin</span>
            </div>
          </div>
        </nav>

        <main className="p-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-slate-900">Categories</h2>
              <p className="mt-1 text-sm text-slate-500">Manage your product categories</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all">
                <div className="h-48 overflow-hidden relative">
                  <Image 
                    src={category.image} 
                    alt={category.name} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                    <button 
                      onClick={(e) => handleOpenModal(category, e)}
                      className="p-2 bg-white rounded-lg text-blue-600 hover:text-blue-700 shadow-lg"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      className="p-2 bg-white rounded-lg text-red-600 hover:text-red-700 shadow-lg"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{category.name}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      ID: {category.id}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={handleCloseModal}
          />
          
          {/* Content */}
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
            <div className="px-8 pt-8 pb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900" id="modal-title">
                  {isEditMode ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" key={isEditMode ? `edit-${formData.id}` : 'add'}>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div>
                    <label htmlFor="id" className="block text-sm font-semibold text-slate-700 mb-1">Category ID (URL Slug)</label>
                    <input
                      type="text"
                      name="id"
                      id="id"
                      required
                      disabled={isEditMode}
                      value={formData.id || ''}
                      onChange={handleInputChange}
                      className={`block w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${isEditMode ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-900'}`}
                      placeholder="e.g. mobile-phones"
                    />
                    <p className="mt-1.5 text-xs text-slate-500">
                      {isEditMode ? 'ID cannot be changed' : 'Must be unique. Used in the page URL.'}
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">Category Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      autoFocus
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="e.g. Mobile Phones"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-semibold text-slate-700 mb-1">Image URL</label>
                    <div className="space-y-3">
                      <input
                        type="url"
                        name="image"
                        id="image"
                        required
                        value={formData.image || ''}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        placeholder="https://images.unsplash.com/..."
                      />
                      {formData.image && (
                        <div className="h-32 w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50 relative">
                          <Image src={formData.image} alt="Preview" fill className="object-cover" unoptimized />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      id="description"
                      rows={4}
                      required
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                      placeholder="Enter a brief description of this category..."
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex flex-col-reverse sm:flex-row sm:gap-3 pt-4 border-t border-slate-100 mt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mt-3 sm:mt-0 w-full inline-flex justify-center items-center px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg shadow-blue-200"
                  >
                    {isEditMode ? 'Save Changes' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
