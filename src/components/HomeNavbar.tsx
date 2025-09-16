import React from 'react';
import {
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';


const HomeNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isDark } = useCustomTheme();
  const { t } = useLanguage();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const handleStartNow = () => {
    if (currentUser) {
      navigate('/protein-simulation');
    } else {
      navigate('/login');
    }
  };

  const navigationItems = [
    { key: 'about', path: '#about' },
    { key: 'services', path: '#services' },
    { key: 'contact', path: '#contact' }
  ];


  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1200,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: isMobile ? '12px' : '16px',
      paddingTop: isMobile ? 'calc(12px + env(safe-area-inset-top))' : '16px'
    }}>
      {/* 상단 네비게이션 바 - 중앙 정렬 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12.5,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: isMobile ? '20px' : '16px',
        py: isMobile ? 1.5 : 1.5,
        px: isMobile ? 2 : 3,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        minWidth: isMobile ? '90vw' : 'auto',
        maxWidth: isMobile ? '95vw' : '800px',
        justifyContent: 'space-between',
          border: '0.15px solid #a4a4a4'
      }}>
        {/* Left: Logo and Brand */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              opacity: 1
            }
          }}
          onClick={() => navigate('/home')}
        >
          {/* Logo Icon */}
          <Box
            sx={{
              width: 24,
              height: 24,
              marginRight: 0.5,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src="/logo512.png"
              alt="BioLabs Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>

          {/* Brand Text */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: isMobile ? '0.9rem' : '1rem',
              color: isDark ? '#ffffff' : '#1a1a1a',
              letterSpacing: '-0.3px'
            }}
          >
            BioLabs
          </Typography>
        </Box>

        {/* Center: Navigation Items */}
        {!isMobile && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3
            }}
          >
            {navigationItems.map((item) => (
              <Button
                key={item.key}
                onClick={() => navigate(item.path)}
                sx={{
                  color: isDark ? '#ffffff' : '#1a1a1a',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  border: 'none',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: isDark ? '#ffffff' : '#1a1a1a',
                    boxShadow: 'none',
                    border: 'none',
                    outline: 'none',
                    transform: 'none'
                  },
                  '&:active': {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(26, 26, 26, 0.15)',
                    color: isDark ? '#ffffff' : '#1a1a1a',
                    boxShadow: isDark 
                      ? '0 4px 12px rgba(255, 255, 255, 0.3)' 
                      : '0 4px 12px rgba(0, 0, 0, 0.2)',
                    border: 'none',
                    outline: 'none',
                    transform: 'translateY(1px)'
                  },
                  '&:focus': {
                    backgroundColor: 'transparent',
                    color: isDark ? '#ffffff' : '#1a1a1a',
                    boxShadow: 'none',
                    border: 'none',
                    outline: 'none'
                  }
                }}
              >
                {t(`home.navigation.${item.key}`)}
              </Button>
            ))}
          </Box>
        )}

        {/* Right: CTA Button */}
        <Button
          variant="outlined"
          onClick={handleStartNow}
          sx={{
            borderColor: '#ff6b35',
            color: '#ff6b35',
            backgroundColor: 'transparent',
            borderRadius: '6px',
            padding: '8px 20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 107, 53, 0.1), transparent)',
              transition: 'left 0.5s ease'
            },
            '&:hover': {
              backgroundColor: '#ff6b35',
              color: '#ffffff',
              borderColor: '#ff6b35',
              transform: 'none',
              boxShadow: '0 2px 10px rgba(255, 107, 53, 0.2)',
              '&::before': {
                left: '100%'
              }
            },
            '&:active': {
              transform: 'translateY(1px)',
              boxShadow: '0 2px 8px rgba(255, 107, 53, 0.4)'
            }
          }}
        >
          {t('home.navigation.startNow')}
        </Button>
      </Box>
    </Box>
  );
};

export default HomeNavbar;
