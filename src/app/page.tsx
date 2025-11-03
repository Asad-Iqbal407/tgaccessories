'use client';

import Link from 'next/link';
import { categories } from '@/lib/data';

export default function Home() {
  return (
    <div className="bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to TG Accessories</h2>
          <p className="text-xl text-gray-600">Discover our wide range of accessories for all your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/${category.id}`} className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <span className="text-blue-600 font-medium group-hover:text-blue-700">
                    View Products →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
