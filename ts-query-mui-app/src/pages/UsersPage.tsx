import React, { useContext } from 'react';
import { Box, Fade } from '@mui/material';
import UsersDataGrid from '../components/DataGrid/UsersDataGrid';
import { DataContext } from '../context/DataContext';

const UsersPage: React.FC = () => {
  const dataContext = useContext(DataContext);
  
  if (!dataContext) {
    throw new Error('UsersPage must be used within a DataProvider');
  }
  
  const { users, isLoading, error } = dataContext;
  
  return (
    <Fade in={true} timeout={500}>
      <Box>
        <UsersDataGrid 
          users={users} 
          isLoading={isLoading} 
          error={error} 
        />
      </Box>
    </Fade>
  );
};

export default UsersPage;