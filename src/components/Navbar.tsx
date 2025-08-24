import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// BioLabs 로고 컴포넌트
const BioLabsLogo: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginRight: 2,
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onClick={() => navigate('/home')}
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
};

const Navbar: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(5px)',
        webkitBackdropFilter: 'blur(5px)',
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
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => navigate('/home')}
          >
            BioLabs
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#ffffff',
              opacity: 0.7,
              fontSize: '0.8rem',
              transition: 'all 0.3s ease'
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

