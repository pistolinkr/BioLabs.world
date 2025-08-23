import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

// BioLabs 로고 컴포넌트
const BioLabsLogo: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      marginRight: 2,
      position: 'relative',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
        filter: 'drop-shadow(0 0 8px #3CD3FF)'
      }
    }}
  >
    <img
      src="/logo512.png"
      alt="BioLabs Logo"
      style={{
        width: '36px',
        height: '36px',
        objectFit: 'contain'
      }}
    />
  </Box>
);

const Navbar: React.FC = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        borderBottom: 'none',
        boxShadow: 'none',
        zIndex: 1200
      }}
    >
      <Toolbar sx={{ paddingLeft: '280px', paddingRight: 2 }}>
        {/* 로고 및 제목 */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <BioLabsLogo />
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: '#ffffff',
              fontWeight: 500,
              fontSize: '1.3rem',
              marginRight: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#3CD3FF',
                textShadow: '0 0 10px #3CD3FF'
              }
            }}
          >
            BioLabs
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#ffffff',
              opacity: 0.7,
              fontSize: '0.8rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#3CD3FF',
                opacity: 1
              }
            }}
          >
            연구 통합 플랫폼
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

