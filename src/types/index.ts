export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  products: Product[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt?: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  password: string;
  role: 'admin';
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
