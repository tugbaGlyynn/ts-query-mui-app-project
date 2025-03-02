import axios from 'axios';


const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // Örnek bir public API
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiService = {
  users: {
    getAll: () => api.get('/users'),
    getById: (id: number) => api.get(`/users/${id}`),
    create: (data: any) => api.post('/users', data),
    update: (id: number, data: any) => api.put(`/users/${id}`, data),
    delete: (id: number) => api.delete(`/users/${id}`),
  },
  
  products: {
    getAll: () => api.get('/posts'),
    getById: (id: number) => api.get(`/posts/${id}`),
    create: (data: any) => api.post('/posts', data),
    update: (id: number, data: any) => api.put(`/posts/${id}`, data),
    delete: (id: number) => api.delete(`/posts/${id}`),
  },
  
  auth: {
    login: (credentials: { email: string; password: string }) => {
      return new Promise((resolve, reject) => {
        if (credentials.email === 'user@example.com' && credentials.password === 'password') {
          const userData = {
            id: 1,
            name: 'Test User',
            email: credentials.email,
            token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 10),
          };
          
        
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', userData.token);
          
          setTimeout(() => {
            resolve({ data: userData });
          }, 800); 
        } else {
          setTimeout(() => {
            reject({ message: 'Invalid credentials' });
          }, 800);
        }
      });
    },
    
    logout: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return Promise.resolve({ success: true });
    },
    
    getCurrentUser: () => {
      const user = localStorage.getItem('user');
      return Promise.resolve({ data: user ? JSON.parse(user) : null });
    },
  },
};