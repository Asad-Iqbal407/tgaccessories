'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalCategories: number;
  totalCarts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalCategories: 5,
    totalCarts: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      const [productsRes, usersRes, cartsRes] = await Promise.all([
        fetch('/api/admin/products', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/carts', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setStats(prev => ({ ...prev, totalProducts: productsData.products.length }));
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setStats(prev => ({ ...prev, totalUsers: usersData.users.length }));
      }

      if (cartsRes.ok) {
        const cartsData = await cartsRes.json();
        setStats(prev => ({ ...prev, totalCarts: cartsData.carts.length }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="mt-4 text-slate-600 font-medium">Loading Dashboard...</div>
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
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-500 hidden sm:block">Welcome back, Admin</span>
            </div>
          </div>
        </nav>

        <main className="p-8">
          <div className="mb-8">
            <p className="text-slate-500">Here&apos;s what&apos;s happening with your store today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Total</span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">Products</h3>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.totalProducts}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">Users</h3>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.totalUsers}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Types</span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">Categories</h3>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.totalCategories}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Pending</span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium">Active Carts</h3>
              <p className="text-3xl font-bold text-slate-800 mt-1">{stats.totalCarts}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 md:col-span-2">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/admin/products')}
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-blue-700">Manage Products</span>
              </button>
              
              <button
                onClick={() => router.push('/admin/carts')}
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
              >
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-orange-700">View Orders</span>
              </button>
            </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-4">System Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">Database Connected</span>
                  </div>
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-blue-700">Stripe Ready</span>
                  </div>
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 text-center">Last updated: {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}