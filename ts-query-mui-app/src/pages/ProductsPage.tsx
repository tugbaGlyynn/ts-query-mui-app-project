import React, { useContext } from 'react';
import { Box, Fade } from '@mui/material';
import ProductsDataGrid from '../components/DataGrid/ProductsDataGrid';
import { DataContext } from '../context/DataContext';

const ProductsPage: React.FC = () => {
  const dataContext = useContext(DataContext);
  
  if (!dataContext) {
    throw new Error('ProductsPage must be used within a DataProvider');
  }
  
  const { products, isLoading, error } = dataContext;
  
  return (
    <Fade in={true} timeout={500}>
      <Box>
        <ProductsDataGrid 
          products={products} 
          isLoading={isLoading} 
          error={error} 
        />
      </Box>
    </Fade>
  );
};

export default ProductsPage;