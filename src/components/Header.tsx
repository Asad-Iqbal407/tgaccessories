'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { state, logout } = useAuth();
  const { user, isAuthenticated } = state;
  const { getItemCount } = useCart();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              TG Accessories
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/sims" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              SIMs
            </Link>
            <Link href="/smoking-papers" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Smoking Papers
            </Link>
            <Link href="/chargers" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Chargers
            </Link>
            <Link href="/cables" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Cables
            </Link>
            <Link href="/power" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Power
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  Welcome, {user.name}
                </span>
                <Link href="/cart" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
                  Cart ({getItemCount()})
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/cart" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Cart ({getItemCount()})
                </Link>
                <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <nav className="flex flex-col space-y-2 py-4 border-t border-gray-200">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
              Home
            </Link>
            <Link href="/sims" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
              SIMs
            </Link>
            <Link href="/smoking-papers" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
              Smoking Papers
            </Link>
            <Link href="/chargers" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
              Chargers
            </Link>
            <Link href="/cables" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
              Cables
            </Link>
            <Link href="/power" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
              Power
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">
              Contact
            </Link>

            {/* Mobile auth section */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="text-gray-700 font-medium py-2">
                    Welcome, {user.name}
                  </div>
                  <Link href="/cart" className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-center">
                    Cart ({getItemCount()})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/cart" className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2 text-center">
                    Cart ({getItemCount()})
                  </Link>
                  <Link href="/auth/login" className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2 text-center">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-center">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
