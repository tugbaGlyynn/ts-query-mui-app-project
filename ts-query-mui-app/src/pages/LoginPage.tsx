import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography,
} from '@mui/material';
import LoginForm from '../components/Auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Eğer kullanıcı zaten giriş yapmışsa, kullanıcılar sayfasına yönlendir
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/users');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        padding: 4,
        position: 'relative',
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(25, 118, 210, 0.2) 0%, rgba(25, 118, 210, 0) 70%)',
          top: '15%',
          left: '10%',
          opacity: 0.7,
          display: { xs: 'none', md: 'block' },
          zIndex: 0,
        }} 
      />
      
      <Box 
        sx={{ 
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(25, 118, 210, 0.2) 0%, rgba(25, 118, 210, 0) 70%)',
          bottom: '10%',
          right: '5%',
          opacity: 0.5,
          display: { xs: 'none', md: 'block' },
          zIndex: 0,
        }} 
      />
      
      <Container 
        maxWidth="sm"
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box 
          width="100%" 
          position="relative" 
          zIndex={1}
          sx={{
            animation: 'fadeInUp 0.6s ease-out',
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          <LoginForm />
        </Box>
        
        <Typography 
          variant="body2" 
          sx={{
            mt: 4,
            textAlign: 'center',
            color: 'rgba(0, 0, 0, 0.6)',
          }}
        >
          &copy; {new Date().getFullYear()} Kullanıcı Veri Portalı. Tüm hakları saklıdır.<br/>
          TanStack Query, Material UI ve TypeScript ile geliştirilmiştir.
        </Typography>
      </Container>
    </Box>
  );
};

export default LoginPage;