import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LoginFormValues } from '../types';
import { apiService } from '../api/apiService';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  const { authState, setAuthState } = context;
  
  const login = async (values: LoginFormValues) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await apiService.auth.login(values);
      const userData = response.data;
      
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return userData;
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Login failed',
      }));
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Logout failed',
      }));
      throw error;
    }
  };
  
  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const userData = JSON.parse(localStorage.getItem('user') || 'null');
      
      setAuthState({
        user: userData,
        isAuthenticated: !!userData,
        isLoading: false,
        error: null,
      });
      
      return userData;
    } catch (error: any) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || 'Failed to get current user',
      });
      return null;
    }
  };
  
  return {
    ...authState,
    login,
    logout,
    checkAuthStatus,
  };
};