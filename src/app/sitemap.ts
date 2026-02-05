import { MetadataRoute } from 'next';
import { categories } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tgaccessories.com';
  
  // Static routes
  const routes = [
    '',
    '/contact',
    '/cart',
    '/blog',
    '/cables',
    '/chargers',
    '/power',
    '/sims',
    '/smoking-papers',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic category routes
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/category/${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic product routes
  const productRoutes = categories.flatMap((category) => 
    category.products.map((product) => ({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  );

  return [...routes, ...categoryRoutes, ...productRoutes];
}
