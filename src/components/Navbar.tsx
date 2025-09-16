import React, { useState } from 'react';
import {
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme
} from '@mui/material';
import {
  Science as ScienceIcon,
  Assessment as AssessmentIcon,
  AccountTree as NetworkIcon,
  Biotech as DrugIcon,
  Timeline as TimelineIcon,
  Computer as ComputerIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, signOut } = useAuth();
  const { isDark, setThemeMode } = useTheme();
  const { t } = useLanguage();
  const muiTheme = useMuiTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // 반응형 브레이크포인트
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between('sm', 'md'));

  const menuItems = [
    { path: '/protein-simulation', text: t('navigation.proteinSimulation'), icon: <ScienceIcon /> },
    { path: '/molecular-interaction', text: t('navigation.molecularInteraction'), icon: <NetworkIcon /> },
    { path: '/diagnosis-ai', text: t('navigation.diagnosisAI'), icon: <AssessmentIcon /> },
    { path: '/drug-screening', text: t('navigation.drugScreening'), icon: <DrugIcon /> },
    { path: '/epidemiology-model', text: t('navigation.epidemiologyModel'), icon: <TimelineIcon /> }
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
    <Box sx={{ 
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1200,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: isMobile ? '12px' : '16px',
      // 안전 영역 고려 (iPhone 등)
      paddingBottom: isMobile ? 'calc(12px + env(safe-area-inset-bottom))' : '16px'
    }}>
      {/* 하단 네비게이션 바 - 중앙 정렬 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: isMobile ? 0.5 : 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: isMobile ? '20px' : '16px',
        py: isMobile ? 1.5 : 1,      // 모바일에서는 더 큰 패딩
        px: isMobile ? 1 : 2,        // 모바일에서는 적은 패딩
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        // 모바일에서 더 넓게
        minWidth: isMobile ? '90vw' : 'auto',
        maxWidth: isMobile ? '95vw' : '600px',
        justifyContent: isMobile ? 'space-around' : 'center',
        border: '0.7px solid #a4a4a4'
      }}>
        {/* 모바일에서는 아이콘만, 태블릿/데스크톱에서는 아이콘+텍스트 */}
        {menuItems.map((item) => (
          <Tooltip key={item.path} title={isMobile ? item.text : ''}>
            <IconButton
              onClick={() => navigate(item.path)}
              sx={{
                color: location.pathname === item.path ? '#ff6b35' : (isDark ? '#ffffff' : '#000000'),
                backgroundColor: 'transparent',
                borderRadius: isMobile ? '12px' : '8px',
                padding: isMobile ? '12px' : '8px',
                minWidth: isMobile ? '48px' : '40px',
                height: isMobile ? '48px' : '40px',
                border: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  color: '#ff6b35',
                  transform: 'none',
                  border: 'none'
                },
                '&.Mui-selected': {
                  backgroundColor: 'transparent',
                  color: '#ff6b35',
                  border: 'none'
                }
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
        

        {/* 사용자 메뉴 - 모바일에서는 숨김, 태블릿/데스크톱에서만 표시 */}
        {!isMobile && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center'
          }}>
            
            <Tooltip title={t('navigation.userProfile')}>
              <IconButton
                onClick={() => navigate('/user-profile')}
                sx={{
                  color: isDark ? '#ffffff' : '#000000',
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                <Avatar
                  src={userProfile?.photoURL || ''}
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
        )}

        {/* 모바일용 사용자 메뉴 버튼 */}
        {isMobile && (
          <Tooltip title={t('navigation.userProfile')}>
            <IconButton
              onClick={() => navigate('/user-profile')}
              sx={{
                color: isDark ? '#ffffff' : '#000000',
                backgroundColor: 'transparent',
                borderRadius: '12px',
                padding: '12px',
                minWidth: '48px',
                height: '48px',
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
            >
              <Avatar
                src={userProfile?.photoURL || ''}
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: isDark ? '#ffffff' : '#000000',
                  color: isDark ? '#000000' : '#ffffff',
                  fontSize: '0.7rem'
                }}
              >
                {userProfile?.displayName?.charAt(0) || userProfile?.email?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* 사용자 메뉴 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        // 모바일에서는 하단에서 위로 열리도록
        anchorOrigin={{
          vertical: isMobile ? 'top' : 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: isMobile ? 'bottom' : 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            backgroundColor: isDark ? '#000000' : '#ffffff',
            border: isDark ? '1px solid #ffffff' : '1px solid #000000',
            borderRadius: 0,
            minWidth: isMobile ? '90vw' : 200,
            maxWidth: isMobile ? '95vw' : 300,
            mt: isMobile ? 0 : 1,
            mb: isMobile ? 1 : 0
          }
        }}
      >
        
        {/* 테마 설정 */}
        <MenuItem onClick={() => handleThemeChange('light')} sx={{ color: isDark ? '#ffffff' : '#000000' }}>
          ☀️ {t('themes.light')}
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('dark')} sx={{ color: isDark ? '#ffffff' : '#000000' }}>
          🌙 {t('themes.dark')}
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('system')} sx={{ color: isDark ? '#ffffff' : '#000000' }}>
          <ComputerIcon sx={{ mr: 1, fontSize: '1rem' }} />
          {t('themes.system')}
        </MenuItem>
        
        <Divider sx={{ borderColor: isDark ? '#ffffff' : '#000000', my: 1 }} />
        
        {/* 사용자 설정 */}
        <MenuItem onClick={() => { navigate('/user-profile'); handleMenuClose(); }} sx={{ color: isDark ? '#ffffff' : '#000000' }}>
          <PersonIcon sx={{ mr: 1, fontSize: '1rem' }} />
          {t('navigation.userProfile')}
        </MenuItem>
        
        <Divider sx={{ borderColor: isDark ? '#ffffff' : '#000000', my: 1 }} />
        
        {/* 로그아웃 */}
        <MenuItem onClick={handleLogout} sx={{ color: isDark ? '#ffffff' : '#000000' }}>
          <LogoutIcon sx={{ mr: 1, fontSize: '1rem' }} />
          {t('navigation.logout')}
        </MenuItem>
      </Menu>

    </Box>
  );
};

export default Navbar;

