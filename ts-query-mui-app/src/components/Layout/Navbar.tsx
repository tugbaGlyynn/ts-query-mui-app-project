import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Tooltip,
  Container,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../hooks/useAuth';

interface HideOnScrollProps {
  children: React.ReactElement;
}

function HideOnScroll(props: HideOnScrollProps) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  

  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMenuAnchor);
  
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const isUserMenuOpen = Boolean(userMenuAnchor);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };
  
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  const handleLogout = async () => {
    try {
      handleUserMenuClose();
      console.log("Çıkış yapılıyor...");
      await logout();
      console.log("Çıkış yapıldı, login sayfasına yönlendiriliyor");
      navigate('/login');
    } catch (error) {
      console.error("Çıkış yaparken hata:", error);
    }
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <HideOnScroll>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          color: 'primary.main',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
              sx={{
                mr: 2,
                display: { xs: 'block', sm: 'none' }
              }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                letterSpacing: 0.5,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                textDecoration: 'none'
              }}
            >
              Kullanıcı Veri Portalı
            </Typography>
            
            <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <Button
                component={RouterLink}
                to="/users"
                startIcon={<PersonIcon />}
                sx={{
                  mx: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  position: 'relative',
                  p: '0.6rem 1.2rem',
                  transition: 'all 0.2s ease',
                  color: isActive('/users') ? 'primary.main' : 'text.secondary',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: '50%',
                    bottom: 6,
                    transform: 'translateX(-50%)',
                    width: isActive('/users') ? '70%' : 0,
                    height: 3,
                    bgcolor: 'primary.main',
                    borderRadius: 3,
                    transition: 'width 0.3s ease'
                  },
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                    '&::after': {
                      width: '70%'
                    }
                  }
                }}
              >
                Kullanıcılar
              </Button>
              
              <Button
                component={RouterLink}
                to="/products"
                startIcon={<ShoppingCartIcon />}
                sx={{
                  mx: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  position: 'relative',
                  p: '0.6rem 1.2rem',
                  transition: 'all 0.2s ease',
                  color: isActive('/products') ? 'primary.main' : 'text.secondary',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: '50%',
                    bottom: 6,
                    transform: 'translateX(-50%)',
                    width: isActive('/products') ? '70%' : 0,
                    height: 3,
                    bgcolor: 'primary.main',
                    borderRadius: 3,
                    transition: 'width 0.3s ease'
                  },
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                    '&::after': {
                      width: '70%'
                    }
                  }
                }}
              >
                Ürünler
              </Button>
            </Box>
            
            <Box sx={{ ml: 2 }}>
              <Tooltip title={user?.name || 'Profil'}>
                <IconButton 
                  onClick={handleUserMenuOpen} 
                  sx={{ 
                    p: 0.5,
                    color: 'primary.main'
                  }}
                >
                  {user?.name ? (
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40,
                        bgcolor: 'rgba(25, 118, 210, 0.1)',
                        color: 'primary.main',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'rgba(25, 118, 210, 0.2)',
                          transform: 'scale(1.05)',
                        }
                      }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                  ) : (
                    <AccountCircleIcon fontSize="large" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
        
        <Menu
          anchorEl={mobileMenuAnchor}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{ 
            mt: 1.5,
            '& .MuiPaper-root': {
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            } 
          }}
        >
          <MenuItem
            onClick={() => {
              navigate('/users');
              handleMobileMenuClose();
            }}
            sx={{ 
              py: 1.5, 
              px: 2.5,
              borderLeft: isActive('/users') ? '3px solid #1976d2' : '3px solid transparent',
              '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
            }}
          >
            <PersonIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            <Typography variant="body1">Kullanıcılar</Typography>
          </MenuItem>
          
          <MenuItem
            onClick={() => {
              navigate('/products');
              handleMobileMenuClose();
            }}
            sx={{ 
              py: 1.5, 
              px: 2.5,
              borderLeft: isActive('/products') ? '3px solid #1976d2' : '3px solid transparent',
              '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
            }}
          >
            <ShoppingCartIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            <Typography variant="body1">Ürünler</Typography>
          </MenuItem>
          
          <Divider sx={{ my: 1 }} />
          
          <MenuItem 
            onClick={handleLogout}
            sx={{ 
              py: 1.5, 
              px: 2.5,
              color: 'error.main',
              '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.08)' }
            }}
          >
            <LogoutIcon sx={{ mr: 1.5 }} />
            <Typography variant="body1">Çıkış Yap</Typography>
          </MenuItem>
        </Menu>
        
        <Menu
          anchorEl={userMenuAnchor}
          open={isUserMenuOpen}
          onClose={handleUserMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{ 
            mt: 1.5,
            '& .MuiPaper-root': {
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            } 
          }}
        >
          <MenuItem 
            disabled 
            sx={{ 
              opacity: 1, 
              py: 1.5, 
              px: 2.5,
              backgroundColor: 'rgba(25, 118, 210, 0.05)'
            }}
          >
            <Box display="flex" flexDirection="column">
              <Typography variant="body1" fontWeight="500">
                {user?.name || 'Kullanıcı'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || ''}
              </Typography>
            </Box>
          </MenuItem>
          
          <Divider />
          
          <MenuItem 
            onClick={handleLogout}
            sx={{ 
              py: 1.5, 
              px: 2.5,
              '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.08)' },
              color: 'error.main'
            }}
          >
            <LogoutIcon sx={{ mr: 1.5 }} />
            <Typography variant="body1">Çıkış Yap</Typography>
          </MenuItem>
        </Menu>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;