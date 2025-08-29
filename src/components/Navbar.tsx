import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Computer as ComputerIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
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
  const { userProfile, signOut } = useAuth();
  const { themeMode, isDark, setThemeMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    handleMenuClose();
    navigate('/login');
  };

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'var(--bg-primary)',
        backdropFilter: 'blur(5px)',
        webkitBackdropFilter: 'blur(5px)',
        boxShadow: 'none',
        border: 'none',
        borderBottom: '1px solid var(--border-primary)',
        outline: 'none',
        zIndex: 1200,
        '& .MuiPaper-root': {
          border: 'none',
          borderBottom: 'none',
          outline: 'none'
        },
        '& .MuiAppBar-root': {
          border: 'none',
          borderBottom: 'none',
          outline: 'none'
        }
      }}
    >
      <Toolbar sx={{ 
        paddingLeft: '280px', 
        paddingRight: 2,
        border: 'none',
        borderBottom: 'none',
        outline: 'none',
        '& .MuiToolbar-root': {
          border: 'none',
          borderBottom: 'none',
          outline: 'none'
        }
      }}>
        {/* 로고 및 제목 */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <BioLabsLogo />
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: 'var(--text-primary)',
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
              color: 'var(--text-secondary)',
              opacity: 0.7,
              fontSize: '0.8rem',
              transition: 'all 0.3s ease'
            }}
          >
            연구 통합 플랫폼
          </Typography>
        </Box>

        {/* 테마 토글 버튼 */}
        <Tooltip title="테마 변경">
          <IconButton
            onClick={toggleTheme}
            sx={{
              color: 'var(--text-primary)',
              marginRight: 1,
              '&:hover': {
                backgroundColor: 'var(--bg-tertiary)'
              }
            }}
          >
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        {/* 사용자 메뉴 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: 'var(--text-secondary)',
              marginRight: 2,
              fontSize: '0.8rem'
            }}
          >
            {userProfile?.displayName || userProfile?.email || '사용자'}
          </Typography>
          
          <Tooltip title="사용자 메뉴">
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                color: 'var(--text-primary)',
                '&:hover': {
                  backgroundColor: 'var(--bg-tertiary)'
                }
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem'
                }}
              >
                {userProfile?.displayName?.charAt(0) || userProfile?.email?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 0,
                minWidth: 200,
                mt: 1
              }
            }}
          >
            {/* 테마 설정 */}
            <MenuItem onClick={() => handleThemeChange('light')} sx={{ color: 'var(--text-primary)' }}>
              <LightModeIcon sx={{ mr: 1, fontSize: '1rem' }} />
              라이트 모드
            </MenuItem>
            <MenuItem onClick={() => handleThemeChange('dark')} sx={{ color: 'var(--text-primary)' }}>
              <DarkModeIcon sx={{ mr: 1, fontSize: '1rem' }} />
              다크 모드
            </MenuItem>
            <MenuItem onClick={() => handleThemeChange('system')} sx={{ color: 'var(--text-primary)' }}>
              <ComputerIcon sx={{ mr: 1, fontSize: '1rem' }} />
              시스템 설정
            </MenuItem>
            
            <Divider sx={{ borderColor: 'var(--border-primary)', my: 1 }} />
            
            {/* 사용자 설정 */}
            <MenuItem onClick={() => { navigate('/user-profile'); handleMenuClose(); }} sx={{ color: 'var(--text-primary)' }}>
              <PersonIcon sx={{ mr: 1, fontSize: '1rem' }} />
              프로필 설정
            </MenuItem>
            
            <Divider sx={{ borderColor: 'var(--border-primary)', my: 1 }} />
            
            {/* 로그아웃 */}
            <MenuItem onClick={handleLogout} sx={{ color: 'var(--text-primary)' }}>
              <LogoutIcon sx={{ mr: 1, fontSize: '1rem' }} />
              로그아웃
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

