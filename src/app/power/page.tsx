'use client';

import Link from 'next/link';
import { getCategoryById } from '@/lib/data';
import { useCart } from '@/contexts/CartContext';

export default function PowerPage() {
  const category = getCategoryById('power');
  const { addItem } = useCart();

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h2>
          <p className="text-xl text-gray-600">{category.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() => addItem(product)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
