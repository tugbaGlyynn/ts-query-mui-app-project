import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../hooks/useAuth';
import { LoginFormValues } from '../../types';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  
  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    

    if (name === 'email' && !value) {
      setFormErrors({
        ...formErrors,
        [name]: 'Email zorunludur',
      });
    } else if (name === 'password' && !value) {
      setFormErrors({
        ...formErrors,
        [name]: 'Şifre zorunludur',
      });
    } else {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    let isValid = true;
    const newErrors = { ...formErrors };
    
    if (!formValues.email) {
      newErrors.email = 'Email zorunludur';
      isValid = false;
    }
    
    if (!formValues.password) {
      newErrors.password = 'Şifre zorunludur';
      isValid = false;
    }
    
    setFormErrors(newErrors);
    
    if (!isValid) return;
    
    try {
      await login(formValues);
      navigate('/users');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <Paper 
      elevation={4}
      sx={{
        width: '100%',
        maxWidth: 450,
        margin: '0 auto',
        padding: 5,
        borderRadius: 3,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ 
        mb: 4, 
        textAlign: 'center'
      }}>
        <Typography variant="h4" 
          sx={{ 
            fontWeight: 700, 
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 1
          }}
        >
          Kullanıcı Veri Portalı
        </Typography>
        <Typography variant="body2" color="text.secondary">
          TanStack Query, Material UI ve TypeScript ile Geliştirilmiş Uygulama
        </Typography>
      </Box>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            width: '100%',
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': { fontSize: 24 } 
          }}
        >
          {error}
        </Alert>
      )}
      
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <TextField
          fullWidth
          label="Email Adresi"
          name="email"
          type="email"
          variant="outlined"
          value={formValues.email}
          onChange={handleChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
          disabled={isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        
        <TextField
          fullWidth
          label="Şifre"
          name="password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          value={formValues.password}
          onChange={handleChange}
          error={!!formErrors.password}
          helperText={formErrors.password}
          disabled={isLoading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          sx={{ 
            mt: 2,
            py: 1.5,
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
            }
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Giriş Yap'}
        </Button>
        
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          bgcolor: 'rgba(25, 118, 210, 0.05)', 
          borderRadius: 2,
          border: '1px dashed rgba(25, 118, 210, 0.3)'
        }}>
          <Typography variant="body2" align="center" sx={{ color: '#666' }}>
            <strong>Demo Giriş Bilgileri:</strong><br />
            Email: <strong>user@example.com</strong><br />
            Şifre: <strong>password</strong>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LoginForm;