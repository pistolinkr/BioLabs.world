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
  Badge,
  Fade
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
    handleMenuClose();
  };

  const handleProfileClick = () => {
    navigate('/user-profile');
    handleMenuClose();
  };

  const handleSettingsClick = () => {
    navigate('/user-profile');
    handleMenuClose();
  };

  const isProfileMenuOpen = Boolean(anchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);

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
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: '#ffffff',
              fontWeight: 500,
              fontSize: '1.3rem',
              marginRight: 3
            }}
          >
            ProLab
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#ffffff',
              opacity: 0.7,
              fontSize: '0.8rem'
            }}
          >
            연구 통합 플랫폼
          </Typography>
        </Box>

        {/* 사용자 정보 및 메뉴 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* 알림 아이콘 */}
          <IconButton
            size="large"
            onClick={handleNotificationMenuOpen}
            sx={{
              color: '#ffffff',
              border: 'none',
              borderRadius: 0,
              padding: '8px',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'none'
              }
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* 사용자 프로필 버튼 */}
          <Box
            onClick={handleProfileMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: 0,
              cursor: 'pointer',
              backgroundColor: 'transparent',
              color: '#ffffff',
              transition: 'none',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'none'
              }
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.8rem',
                fontWeight: 400
              }}
            >
              {userProfile?.displayName || '사용자'} 계정
            </Typography>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: '#ffffff',
                color: '#000000',
                border: '1px solid #ffffff',
                fontSize: '0.9rem'
              }}
            >
              {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          </Box>
        </Box>

        {/* 알림 메뉴 */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={isNotificationMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              backgroundColor: '#000000',
              border: '1px solid #ffffff',
              borderRadius: 0,
              marginTop: 1,
              minWidth: 280
            }
          }}
        >
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              borderBottom: '1px solid #ffffff',
              padding: '12px 16px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#0066cc',
                  borderRadius: '50%'
                }}
              />
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                >
                  새 시뮬레이션 완료
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#ffffff',
                    opacity: 0.7,
                    fontSize: '0.75rem'
                  }}
                >
                  단백질 시뮬레이션이 성공적으로 완료되었습니다
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              borderBottom: '1px solid #ffffff',
              padding: '12px 16px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#00aa44',
                  borderRadius: '50%'
                }}
              />
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                >
                  AI 진단 결과 준비됨
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#ffffff',
                    opacity: 0.7,
                    fontSize: '0.75rem'
                  }}
                >
                  새로운 진단 결과를 확인할 수 있습니다
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              padding: '12px 16px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#cc6600',
                  borderRadius: '50%'
                }}
              />
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                >
                  시스템 업데이트
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#ffffff',
                    opacity: 0.7,
                    fontSize: '0.75rem'
                  }}
                >
                  새로운 기능이 추가되었습니다
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        </Menu>

        {/* 사용자 프로필 메뉴 */}
        <Menu
          anchorEl={anchorEl}
          open={isProfileMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              backgroundColor: '#000000',
              border: '1px solid #ffffff',
              borderRadius: 0,
              marginTop: 1,
              minWidth: 200
            }
          }}
        >
          {/* 사용자 정보 헤더 */}
          <Box
            sx={{
              padding: '16px',
              borderBottom: '1px solid #ffffff',
              backgroundColor: '#000000'
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: '#ffffff',
                fontWeight: 500,
                fontSize: '1rem',
                marginBottom: 0.5
              }}
            >
              {userProfile?.displayName || '사용자'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#ffffff',
                opacity: 0.7,
                fontSize: '0.8rem'
              }}
            >
              {userProfile?.email || 'user@example.com'}
            </Typography>
          </Box>

          {/* 메뉴 아이템들 */}
          <MenuItem
            onClick={handleProfileClick}
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              padding: '12px 16px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <PersonIcon sx={{ marginRight: 2, fontSize: '1.2rem' }} />
            내 프로필
          </MenuItem>
          <MenuItem
            onClick={handleSettingsClick}
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              padding: '12px 16px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <SettingsIcon sx={{ marginRight: 2, fontSize: '1.2rem' }} />
            설정
          </MenuItem>
          <MenuItem
            onClick={handleSignOut}
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              padding: '12px 16px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <LogoutIcon sx={{ marginRight: 2, fontSize: '1.2rem' }} />
            로그아웃
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
