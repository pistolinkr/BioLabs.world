import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  keyframes
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

// Shimmer animation keyframes
const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

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
    { key: 'plans', path: '#plans' },
    { key: 'contact', path: '#contact' }
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        zIndex: 1200
      }}
    >
      <Toolbar
        sx={{
          padding: isMobile ? '8px 16px' : '12px 24px',
          minHeight: '64px !important',
          justifyContent: 'space-between'
        }}
      >
        {/* Left: Logo and Brand */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={() => navigate('/home')}
        >
          {/* Logo Icon */}
          <Box
            sx={{
              width: 32,
              height: 32,
              marginRight: 1,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 107, 53, 0.2) 50%, transparent 70%)',
                animation: `${shimmer} 3s infinite`,
                borderRadius: '8px'
              }
            }}
          >
            <img
              src="/logo512.png"
              alt="BioLabs Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 1
              }}
            />
          </Box>

          {/* Brand Text */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: isMobile ? '1.2rem' : '1.5rem',
              background: isDark 
                ? 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)'
                : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
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
              gap: 4
            }}
          >
            {navigationItems.map((item) => (
              <Button
                key={item.key}
                sx={{
                  color: isDark ? '#ffffff' : '#1a1a1a',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: 0,
                    height: '2px',
                    background: '#ff6b35',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)'
                  },
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    '&::before': {
                      width: '80%'
                    }
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
            borderRadius: '8px',
            padding: '10px 24px',
            fontSize: '0.9rem',
            fontWeight: 600,
            textTransform: 'none',
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
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(255, 107, 53, 0.3)',
              '&::before': {
                left: '100%'
              }
            },
            '&:active': {
              transform: 'translateY(0)'
            }
          }}
        >
          {t('home.navigation.startNow')}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default HomeNavbar;
