'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function CartPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleCheckout = async () => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.address) {
      alert('Please fill in all customer details including address before checking out.');
      return;
    }

    setIsLoading(true);
    try {
      // First, save customer details to the cart in database
      const detailsResponse = await fetch('/api/cart/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerDetails)
      });

      if (!detailsResponse.ok) {
        throw new Error('Failed to save customer details');
      }

      // Then proceed to Stripe checkout
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
          customerEmail: customerDetails.email
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
      <div className="min-h-screen bg-slate-50 py-20 flex items-center justify-center">
        <div className="max-w-md w-full text-center px-4">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h1>
          <p className="text-slate-500 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 font-medium"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8 space-y-4">
            {state.items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-shadow hover:shadow-md">
                <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-slate-100 rounded-xl overflow-hidden relative">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-slate-500 capitalize">{item.product.category}</p>
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3 bg-slate-50 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-slate-600 shadow-sm hover:text-primary transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-slate-900 font-medium w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-slate-600 shadow-sm hover:text-primary transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Customer Details</h2>
              <div className="space-y-4 mb-8">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">Shipping Address</label>
                  <textarea
                    id="address"
                    value={customerDetails.address}
                    onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="123 Main St, City, Country"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-6 border-t border-slate-100 pt-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-primary">${state.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-primary text-white py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Checkout Securely'}
              </button>
              
              <div className="mt-6 text-center">
                <button
                  onClick={clearCart}
                  className="text-sm text-slate-400 hover:text-slate-600 underline decoration-slate-300 underline-offset-2 transition-colors"
                >
                  Clear Shopping Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
