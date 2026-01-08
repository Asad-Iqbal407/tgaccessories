import { Category, Product } from '@/types';

export const categories: Category[] = [
  {
    id: 'sims',
    name: 'SIMs',
    description: 'SIM cards and accessories for your devices',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    products: [
      {
        id: 'sim-1',
        name: 'Standard SIM Card',
        description: 'Regular size SIM card for older devices',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        category: 'sims',
      },
      {
        id: 'sim-2',
        name: 'Micro SIM Card',
        description: 'Micro size SIM card for modern smartphones',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
        category: 'sims',
      },
      {
        id: 'sim-3',
        name: 'Nano SIM Card',
        description: 'Nano size SIM card for latest devices',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
        category: 'sims',
      },
    ],
  },
  {
    id: 'smoking-papers',
    name: 'Smoking Papers',
    description: 'High-quality papers for rolling',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    products: [
      {
        id: 'paper-1',
        name: 'Classic Rolling Papers',
        description: 'Traditional rolling papers, pack of 50',
        price: 2.99,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        category: 'smoking-papers',
      },
      {
        id: 'paper-2',
        name: 'Ultra Thin Papers',
        description: 'Extra thin papers for smooth burn, pack of 50',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1582560469781-1965b9af9034?w=400&h=300&fit=crop',
        category: 'smoking-papers',
      },
      {
        id: 'paper-3',
        name: 'Organic Papers',
        description: 'Natural organic papers, pack of 50',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        category: 'smoking-papers',
      },
      {
        id: 'paper-4',
        name: 'Flavored Papers',
        description: 'Assorted flavored rolling papers, pack of 32',
        price: 5.49,
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=300&fit=crop',
        category: 'smoking-papers',
      },
    ],
  },
  {
    id: 'chargers',
    name: 'Chargers',
    description: 'Chargers and power adapters for all devices',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
    products: [
      {
        id: 'charger-1',
        name: 'USB Wall Charger',
        description: 'Fast charging wall adapter, 18W',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
        category: 'chargers',
      },
      {
        id: 'charger-2',
        name: 'Wireless Charger',
        description: 'Qi wireless charging pad, 10W',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1609592806580-3e5b6e9b3c8a?w=400&h=300&fit=crop',
        category: 'chargers',
      },
      {
        id: 'charger-3',
        name: 'Car Charger',
        description: 'USB car charger with dual ports',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
        category: 'chargers',
      },
      {
        id: 'charger-4',
        name: 'GaN Fast Charger 65W',
        description: 'Compact GaN charger with USB-C PD',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1609592806580-3e5b6e9b3c8a?w=400&h=300&fit=crop',
        category: 'chargers',
      },
    ],
  },
  {
    id: 'cables',
    name: 'Cables',
    description: 'Data and charging cables for connectivity',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
    products: [
      {
        id: 'cable-1',
        name: 'USB-C to USB-A Cable',
        description: '1m braided cable for data transfer',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
        category: 'cables',
      },
      {
        id: 'cable-2',
        name: 'Lightning Cable',
        description: '1m Apple Lightning cable',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=300&fit=crop',
        category: 'cables',
      },
      {
        id: 'cable-3',
        name: 'HDMI Cable',
        description: '2m HDMI 2.0 cable for 4K',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
        category: 'cables',
      },
      {
        id: 'cable-4',
        name: 'USB-C to HDMI Adapter',
        description: '4K 60Hz adapter for laptops and phones',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
        category: 'cables',
      },
    ],
  },
  {
    id: 'power',
    name: 'Power',
    description: 'Power banks, adapters, and portable charging solutions',
    image: 'https://images.unsplash.com/photo-1609592806580-3e5b6e9b3c8a?w=400&h=300&fit=crop',
    products: [
      {
        id: 'power-1',
        name: 'Portable Power Bank 10000mAh',
        description: 'High-capacity power bank with fast charging',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1609592806580-3e5b6e9b3c8a?w=400&h=300&fit=crop',
        category: 'power',
      },
      {
        id: 'power-2',
        name: 'Wireless Power Bank 20000mAh',
        description: 'Wireless charging power bank with LED display',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
        category: 'power',
      },
      {
        id: 'power-3',
        name: 'Travel Adapter Kit',
        description: 'Universal travel adapter for international use',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop',
        category: 'power',
      },
      {
        id: 'power-4',
        name: 'Solar Power Bank 15000mAh',
        description: 'Solar-charging power bank with dual USB ports',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1609592806580-3e5b6e9b3c8a?w=400&h=300&fit=crop',
        category: 'power',
      },
    ],
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getProductById = (id: string): Product | undefined => {
  for (const category of categories) {
    const product = category.products.find(p => p.id === id);
    if (product) return product;
  }
  return undefined;
};
