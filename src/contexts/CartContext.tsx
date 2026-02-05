'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TOTAL'; payload: number };

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      let newItems: CartItem[];

      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { product: action.payload, quantity: 1 }];
      }

      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      return { items: newItems, total, loading: false };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.payload);
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      return { items: newItems, total, loading: false };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.productId });
      }

      const newItems = state.items.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      return { items: newItems, total, loading: false };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'LOAD_CART': {
      const total = action.payload.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return { items: action.payload, total, loading: false };
    }

    case 'SET_LOADING': {
      return { ...state, loading: action.payload };
    }

    case 'SET_TOTAL': {
      return { ...state, total: action.payload };
    }

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from database on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          // Transform database cart items to match our CartItem format
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cartItems: CartItem[] = data.items.map((item: any) => ({
            product: {
              id: item.productId,
              name: item.name,
              description: '', // We don't store description in cart
              price: item.price,
              image: item.image,
              category: '' // We don't store category in cart
            },
            quantity: item.quantity
          }));
          dispatch({ type: 'LOAD_CART', payload: cartItems });
        }
      } catch (error) {
        console.error('Error loading cart from database:', error);
        // Fallback to localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const cartItems: CartItem[] = JSON.parse(savedCart);
            dispatch({ type: 'LOAD_CART', payload: cartItems });
          } catch (localError) {
            console.error('Error loading cart from localStorage:', localError);
          }
        }
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadCart();
  }, []);

  const addItem = async (product: Product) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Transform database cart items to match our CartItem format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cartItems: CartItem[] = data.items.map((item: any) => ({
          product: {
            id: item.productId,
            name: item.name,
            description: '',
            price: item.price,
            image: item.image,
            category: ''
          },
          quantity: item.quantity
        }));
        dispatch({ type: 'LOAD_CART', payload: cartItems });
        dispatch({ type: 'SET_TOTAL', payload: data.total });
        
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const errorData = await response.json();
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeItem = async (productId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        // Transform database cart items to match our CartItem format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cartItems: CartItem[] = data.items.map((item: any) => ({
          product: {
            id: item.productId,
            name: item.name,
            description: '',
            price: item.price,
            image: item.image,
            category: ''
          },
          quantity: item.quantity
        }));
        dispatch({ type: 'LOAD_CART', payload: cartItems });
        dispatch({ type: 'SET_TOTAL', payload: data.total });
        alert('Product removed from cart successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to remove product from cart: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      alert('Failed to remove product from cart. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Transform database cart items to match our CartItem format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cartItems: CartItem[] = data.items.map((item: any) => ({
          product: {
            id: item.productId,
            name: item.name,
            description: '',
            price: item.price,
            image: item.image,
            category: ''
          },
          quantity: item.quantity
        }));
        dispatch({ type: 'LOAD_CART', payload: cartItems });
        dispatch({ type: 'SET_TOTAL', payload: data.total });
        alert('Cart updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update cart: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      alert('Failed to update cart. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = async () => {
    try {
      // Clear from database
      await fetch('/api/cart/clear', { method: 'POST' });
    } catch (error) {
      console.error('Error clearing cart from database:', error);
    }
    // Clear local state
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
