'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  addedAt: string;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

interface Cart {
  id: string;
  sessionId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
  customerDetails?: CustomerDetails;
}

export default function AdminOrders() {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchCarts();
  }, [router]);

  const fetchCarts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/carts', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched carts:', data.carts); // Debug log
        setCarts(data.carts);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching carts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="mt-4 text-slate-600 font-medium">Loading Orders...</div>
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
            <h1 className="text-2xl font-bold text-slate-800">Orders Management</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-500 hidden sm:block">Welcome back, Admin</span>
            </div>
          </div>
        </nav>

        <main className="p-8">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-slate-900">Active Orders</h2>
            <p className="mt-1 text-sm text-slate-500">Track and manage customer carts and orders</p>
          </div>

          <div className="grid gap-6">
            {carts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="mx-auto h-12 w-12 text-slate-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-slate-900">No active orders</h3>
                <p className="mt-1 text-sm text-slate-500">New orders will appear here.</p>
              </div>
            ) : (
              carts.map((cart) => (
                <div key={cart.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Order #{cart.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-slate-500">Session: {cart.sessionId.slice(0, 8)}...</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Date Placed</p>
                        <p className="text-sm font-medium text-slate-900">{new Date(cart.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Total Amount</p>
                        <p className="text-lg font-bold text-blue-600">${cart.total.toFixed(2)}</p>
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        Active
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100">
                    {cart.customerDetails ? (
                      <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center text-slate-600">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium text-slate-900 mr-1">Customer:</span> {cart.customerDetails.name}
                        </div>
                        <div className="flex items-center text-slate-600">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium text-slate-900 mr-1">Email:</span> {cart.customerDetails.email}
                        </div>
                        <div className="flex items-center text-slate-600">
                          <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="font-medium text-slate-900 mr-1">Phone:</span> {cart.customerDetails.phone}
                        </div>
                        {cart.customerDetails.address && (
                          <div className="flex items-center text-slate-600 w-full mt-2 pt-2 border-t border-slate-200/50">
                            <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium text-slate-900 mr-1">Address:</span> {cart.customerDetails.address}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center text-slate-500 text-sm italic">
                        <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Guest User (No details provided)
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h4 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Order Items</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cart.items.map((item, index) => (
                        <div key={index} className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                          <div className="h-16 w-16 rounded-lg bg-white border border-slate-200 overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-bold text-slate-900 line-clamp-1" title={item.name}>{item.name}</p>
                                <p className="text-xs text-slate-500">Unit: ${item.price.toFixed(2)}</p>
                              </div>
                              <div className="text-right">
                                <span className="block text-sm font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                                <span className="block text-xs text-slate-500">Qty: {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
