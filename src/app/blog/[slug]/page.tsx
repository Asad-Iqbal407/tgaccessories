'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  author: string;
  category: string;
}

export default function SingleBlogPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.slug}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data.blog);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Post Not Found</h1>
        <Link href="/blog" className="text-blue-600 hover:underline">
          Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative h-[400px] w-full">
        <div className="absolute inset-0 bg-slate-900/50 z-10" />
        <img 
          src={post.image || 'https://images.unsplash.com/photo-1499750310159-5b5f0d6920a9?w=1600&h=900&fit=crop'} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 max-w-4xl mx-auto w-full">
          <div className="mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {post.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {post.title}
          </h1>
          <div className="flex items-center text-slate-200 text-sm md:text-base">
            <span className="mr-4">By {post.author}</span>
            <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <article className="prose prose-lg max-w-none prose-slate prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-800">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </article>

          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
            <Link 
              href="/blog"
              className="inline-flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to All Posts
            </Link>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Share this post"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}