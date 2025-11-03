'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  addedAt: string;
}

interface Cart {
  id: string;
  sessionId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCarts() {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  router.push('/admin/login');
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Carts Management</h1>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {carts.length === 0 ? (
                <li className="px-6 py-4 text-center text-gray-500">
                  No carts found
                </li>
              ) : (
                carts.map((cart) => (
                  <li key={cart.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          Session: {cart.sessionId}
                        </div>
                        <div className="text-sm text-gray-500">
                          Items: {cart.items.length} | Total: ${cart.total.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">
                          Created: {new Date(cart.createdAt).toLocaleDateString()} |
                          Updated: {new Date(cart.updatedAt).toLocaleDateString()}
                        </div>
                        {cart.items.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-500 mb-1">Items:</div>
                            <div className="space-y-1">
                              {cart.items.map((item, index) => (
                                <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                  {item.name} (x{item.quantity}) - ${item.price.toFixed(2)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
