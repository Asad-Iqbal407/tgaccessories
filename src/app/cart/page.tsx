'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function CartPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items.map(item => ({
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
          })),
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
            <p className="text-gray-600 mb-8">Your cart is empty</p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {state.items.map((item) => (
              <div key={item.product.id} className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500">{item.product.description}</p>
                        <p className="text-sm text-gray-500">Category: {item.product.category}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="bg-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="text-gray-900 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="bg-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-lg font-medium text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium text-gray-900">
                Total: ${state.total.toFixed(2)}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={clearCart}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
