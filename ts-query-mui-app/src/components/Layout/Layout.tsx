import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, useTheme } from '@mui/material';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      <Navbar />
      <Box 
        component="main" 
        sx={{
          flexGrow: 1,
          paddingTop: 4,
          paddingBottom: 4,
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;