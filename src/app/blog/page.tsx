'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  createdAt: string;
  slug: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blogs');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.blogs);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Tips, Guides & Promotions</h1>
          <p className="text-lg md:text-xl text-slate-300">Upgrade your setup with expert advice and exclusive offers.</p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-xl">No posts found.</p>
            <p className="mt-2">Check back soon for new updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200 flex flex-col">
                <div className="h-48 bg-slate-100 overflow-hidden">
                  <img 
                    src={post.image || 'https://images.unsplash.com/photo-1499750310159-5b5f0d6920a9?w=800&h=600&fit=crop'} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-sm text-slate-500 mb-2">{new Date(post.createdAt).toLocaleDateString()}</div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-slate-600 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="text-blue-600 font-semibold hover:text-blue-800 transition-colors inline-flex items-center"
                    >
                      Read Article 
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/" className="inline-flex items-center text-slate-600 hover:text-slate-900">
            <span className="mr-2">←</span> Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
