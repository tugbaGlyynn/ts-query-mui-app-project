import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../api/apiService';
import { User, Product } from '../types';


export const useUsers = () => {
  return useQuery<{ data: User[] }>({
    queryKey: ['users'],
    queryFn: () => apiService.users.getAll(),
  });
};

export const useUser = (id: number) => {
  return useQuery<{ data: User }>({
    queryKey: ['users', id],
    queryFn: () => apiService.users.getById(id),
    enabled: !!id, 
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newUser: Omit<User, 'id'>) => apiService.users.create(newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => 
      apiService.users.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiService.users.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useProducts = () => {
  return useQuery<{ data: Product[] }>({
    queryKey: ['products'],
    queryFn: () => apiService.products.getAll(),
  });
};

export const useProduct = (id: number) => {
  return useQuery<{ data: Product }>({
    queryKey: ['products', id],
    queryFn: () => apiService.products.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newProduct: Omit<Product, 'id'>) => 
      apiService.products.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) => 
      apiService.products.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiService.products.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};