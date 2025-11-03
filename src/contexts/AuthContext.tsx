'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'AUTH_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Update localStorage when authentication state changes
  useEffect(() => {
    if (state.isAuthenticated && !state.loading) {
      localStorage.setItem('isAuthenticated', 'true');
    } else if (!state.loading) {
      localStorage.removeItem('isAuthenticated');
    }
  }, [state.isAuthenticated, state.loading]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
      } else {
        dispatch({ type: 'AUTH_ERROR' });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
        return { success: true };
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
        return { success: true };
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      dispatch({ type: 'LOGOUT' });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}