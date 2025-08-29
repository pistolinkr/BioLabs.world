import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Home as HomeIcon,
  Science as ScienceIcon,
  Assessment as AssessmentIcon,
  AccountTree as NetworkIcon,
  Biotech as DrugIcon,
  Timeline as TimelineIcon,
  Computer as ComputerIcon,
  Person as PersonIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, signOut } = useAuth();
  const { isDark, setThemeMode } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuItems = [
    { path: '/', text: '홈', icon: <HomeIcon /> },
    { path: '/protein-simulation', text: '단백질 시뮬레이션', icon: <ScienceIcon /> },
    { path: '/diagnosis-ai', text: 'AI 진단', icon: <AssessmentIcon /> },
    { path: '/interaction-network', text: '상호작용 네트워크', icon: <NetworkIcon /> },
    { path: '/drug-screening', text: '약물 스크리닝', icon: <DrugIcon /> },
    { path: '/epidemiology-model', text: '역학 모델링', icon: <TimelineIcon /> }
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut();
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
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: 'none',
        border: 'none',
        borderBottom: 'none',
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
        paddingLeft: 2, 
        paddingRight: 2,
        border: 'none',
        borderBottom: 'none',
        outline: 'none',
        justifyContent: 'space-between',
        '& .MuiToolbar-root': {
          border: 'none',
          borderBottom: 'none',
          outline: 'none'
        }
      }}>

        {/* 왼쪽 여백 (균형을 위한 공간) */}
        <Box sx={{ width: '120px' }} />

        {/* 페이지 네비게이션 버튼들과 사용자 메뉴 - 중앙 정렬 */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          flex: 1,
          justifyContent: 'center'
        }}>
          {menuItems.map((item) => (
            <Tooltip key={item.path} title={item.text}>
              <IconButton
                onClick={() => navigate(item.path)}
                sx={{
                  color: isDark ? '#ffffff' : '#000000',
                  backgroundColor: 'transparent',
                  borderRadius: '8px',
                  padding: '8px',
                  minWidth: '40px',
                  height: '40px',
                  border: location.pathname === item.path ? (isDark ? '2px solid #ffffff' : '2px solid #000000') : 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: isDark ? '#ffffff' : '#000000',
                    transform: 'translateY(-2px)'
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'transparent',
                    color: isDark ? '#ffffff' : '#000000',
                    border: isDark ? '2px solid #ffffff' : '2px solid #000000'
                  }
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          ))}
          
          {/* 사용자 이름과 프로필 버튼 - 네비게이션 버튼들 오른쪽에 배치 */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            marginLeft: 3
          }}>
            <Typography
              variant="body2"
              sx={{
                color: isDark ? '#ffffff' : '#000000',
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
                  color: isDark ? '#ffffff' : '#000000',
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: isDark ? '#ffffff' : '#000000',
                    color: isDark ? '#000000' : '#ffffff',
                    fontSize: '0.8rem'
                  }}
                >
                  {userProfile?.displayName?.charAt(0) || userProfile?.email?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* 오른쪽 여백 (균형을 위한 공간) */}
        <Box sx={{ width: '120px' }} />
      </Toolbar>

      {/* 사용자 메뉴 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: isDark ? '#000000' : '#ffffff',
            border: isDark ? '1px solid #ffffff' : '1px solid #000000',
            borderRadius: 0,
            minWidth: 200,
            mt: 1
          }
        }}
      >
        {/* 테마 설정 */}
        <MenuItem onClick={() => handleThemeChange('light')} sx={{ color: isDark ? '#ffffff' : '#000000' }}>
          ☀️ 라이트 모드
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('dark')} sx={{ color: isDark ? '#ffffff' : '#000000' }}>
          🌙 다크 모드
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('system')} sx={{ color: isDark ? '#ffffff' : '#000000' }}>
          <ComputerIcon sx={{ mr: 1, fontSize: '1rem' }} />
          시스템 설정
        </MenuItem>
        
        <Divider sx={{ borderColor: isDark ? '#ffffff' : '#000000', my: 1 }} />
        
        {/* 사용자 설정 */}
        <MenuItem onClick={() => { navigate('/user-profile'); handleMenuClose(); }} sx={{ color: isDark ? '#ffffff' : '#000000' }}>
          <PersonIcon sx={{ mr: 1, fontSize: '1rem' }} />
          프로필 설정
        </MenuItem>
        
        <Divider sx={{ borderColor: isDark ? '#ffffff' : '#000000', my: 1 }} />
        
        {/* 로그아웃 */}
        <MenuItem onClick={handleLogout} sx={{ color: isDark ? '#ffffff' : '#000000' }}>
          <LogoutIcon sx={{ mr: 1, fontSize: '1rem' }} />
          로그아웃
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;

