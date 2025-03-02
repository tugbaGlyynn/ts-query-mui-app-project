// src/types/index.ts

// Kullanıcı tipi
export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address?: {
      street: string;
      suite: string;
      city: string;
      zipcode: string;
      geo: {
        lat: string;
        lng: string;
      };
    };
    phone?: string;
    website?: string;
    company?: {
      name: string;
      catchPhrase: string;
      bs: string;
    };
  }
  
  // Ürün tipi (JSONPlaceholder'da post olarak geçiyor)
  export interface Product {
    id: number;
    title: string;
    body: string;
    userId: number;
  }
  
  // Kimlik doğrulama için kullanıcı tipi
  export interface AuthUser {
    id: number;
    name: string;
    email: string;
    token: string;
  }
  
  // Login form değerleri
  export interface LoginFormValues {
    email: string;
    password: string;
  }
  
  // Context içinde saklayacağımız auth state
  export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  // API isteği durumları için interface
  export interface ApiState<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
  }