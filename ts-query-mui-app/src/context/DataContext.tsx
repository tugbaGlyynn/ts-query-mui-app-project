import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { User, Product } from '../types';
import { useUsers, useProducts } from '../hooks/useApi';
import { toast } from 'react-toastify';


interface DataContextType {
  users: User[];
  products: Product[];
  isLoading: boolean;
  error: string | null;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;

  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: number, updatedUser: Partial<User>) => void;
  deleteUser: (id: number) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
 
  // TanStack Query ile verileri çekme
  const usersQuery = useUsers();
  const productsQuery = useProducts();

  const isLoading = usersQuery.isLoading || productsQuery.isLoading;

  const error = usersQuery.error 
    ? String(usersQuery.error) 
    : productsQuery.error 
    ? String(productsQuery.error)
    : null;
  
  useEffect(() => {
    if (usersQuery.data?.data) {
      setUsers(usersQuery.data.data);
    }
  }, [usersQuery.data]);
  
  useEffect(() => {
    if (productsQuery.data?.data) {
      setProducts(productsQuery.data.data);
    }
  }, [productsQuery.data]);
  
  const addUser = (user: Omit<User, 'id'>) => {
    const newId = Math.max(...users.map(u => u.id), 0) + 1;
    const newUser = { ...user, id: newId } as User;
    setUsers(prev => [...prev, newUser]);
    toast.success("Kullanıcı başarıyla eklendi!");
  };
  
  const updateUser = (id: number, updatedUser: Partial<User>) => {
    setUsers(prev => 
      prev.map(user => user.id === id ? { ...user, ...updatedUser } : user)
    );
    toast.success("Kullanıcı başarıyla güncellendi!");

  };
  
  const deleteUser = (id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    toast.success("Kullanıcı başarıyla silindi!");

  };
  

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct = { ...product, id: newId } as Product;
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
    toast.success("Ürün Başarılyla eklendi !")

  };
  
  const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => product.id === id ? { ...product, ...updatedProduct } : product)
    );
    toast.success("Ürün Başarılyla güncellendi !")
  };
  
  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    toast.success("Ürün Başarılyla silindi !")

  };
  
  return (
    <DataContext.Provider
      value={{
        users,
        products,
        isLoading,
        error,
        setUsers,
        setProducts,
      
        addUser,
        updateUser,
        deleteUser,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};