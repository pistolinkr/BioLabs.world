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
  Badge
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// ProLab 로고 컴포넌트
const ProLabLogo: React.FC = () => (
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
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 배경 원 */}
      <circle
        cx="18"
        cy="18"
        r="17"
        fill="rgba(60, 211, 255, 0.1)"
        stroke="rgba(60, 211, 255, 0.3)"
        strokeWidth="0.5"
      />
      
      {/* 외부 육각형 - 실험실/연구소 상징 */}
      <path
        d="M18 3L30.588 12.5V25.5L18 33L5.412 25.5V12.5L18 3Z"
        stroke="#3CD3FF"
        strokeWidth="1.2"
        fill="none"
        opacity="0.8"
      />
      
      {/* 내부 육각형 - 분자 구조 상징 */}
      <path
        d="M18 8L26.588 15.5V24.5L18 29L9.412 24.5V15.5L18 8Z"
        stroke="#3CD3FF"
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />
      
      {/* 중앙 핵심 - DNA/단백질 상징 */}
      <circle
        cx="18"
        cy="18"
        r="5"
        fill="#3CD3FF"
        opacity="0.9"
      />
      
      {/* DNA 나선 구조 상징 */}
      <path
        d="M18 13L18 23M15 16L21 16M15 20L21 20"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.9"
      />
      
      {/* 작은 분자들 - 연구 요소들 */}
      <circle
        cx="12"
        cy="12"
        r="1.5"
        fill="#3CD3FF"
        opacity="0.7"
      />
      <circle
        cx="24"
        cy="12"
        r="1.5"
        fill="#3CD3FF"
        opacity="0.7"
      />
      <circle
        cx="12"
        cy="24"
        r="1.5"
        fill="#3CD3FF"
        opacity="0.7"
      />
      <circle
        cx="24"
        cy="24"
        r="1.5"
        fill="#3CD3FF"
        opacity="0.7"
      />
      
      {/* 연결선들 - 네트워크 상징 */}
      <path
        d="M12 12L24 12M12 24L24 24M12 12L12 24M24 12L24 24"
        stroke="rgba(60, 211, 255, 0.4)"
        strokeWidth="0.5"
        strokeDasharray="1,1"
      />
    </svg>
  </Box>
);

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

  const handleDashboardClick = () => {
    navigate('/dashboard');
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
          <ProLabLogo />
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
            ProLab
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
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(60, 211, 255, 0.1)',
                color: '#3CD3FF',
                transform: 'scale(1.1)',
                boxShadow: '0 0 15px rgba(60, 211, 255, 0.5)'
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
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(60, 211, 255, 0.1)',
                color: '#3CD3FF',
                transform: 'scale(1.02)',
                boxShadow: '0 0 10px rgba(60, 211, 255, 0.3)'
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
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#3CD3FF',
                  boxShadow: '0 0 10px rgba(60, 211, 255, 0.5)'
                }
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
              border: '1px solid #3CD3FF',
              borderRadius: 0,
              marginTop: 1,
              minWidth: 280,
              boxShadow: '0 0 20px rgba(60, 211, 255, 0.3)'
            }
          }}
        >
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              borderBottom: '1px solid rgba(60, 211, 255, 0.3)',
              padding: '12px 16px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(60, 211, 255, 0.1)',
                color: '#3CD3FF'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#3CD3FF',
                  borderRadius: '50%',
                  boxShadow: '0 0 5px #3CD3FF'
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
              borderBottom: '1px solid rgba(60, 211, 255, 0.3)',
              padding: '12px 16px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(60, 211, 255, 0.1)',
                color: '#3CD3FF'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#3CD3FF',
                  borderRadius: '50%',
                  boxShadow: '0 0 5px #3CD3FF'
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
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(60, 211, 255, 0.1)',
                color: '#3CD3FF'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#3CD3FF',
                  borderRadius: '50%',
                  boxShadow: '0 0 5px #3CD3FF'
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

        {/* 사용자 프로필 메뉴 - ProLab 정체성에 맞게 개선 */}
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
              border: '1px solid #3CD3FF',
              borderRadius: 0,
              marginTop: 1,
              minWidth: 250,
              boxShadow: '0 0 20px rgba(60, 211, 255, 0.3)'
            }
          }}
        >
          {/* 사용자 정보 헤더 */}
          <Box
            sx={{
              padding: '20px',
              borderBottom: '1px solid rgba(60, 211, 255, 0.3)',
              backgroundColor: 'rgba(60, 211, 255, 0.05)',
              textAlign: 'center'
            }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                backgroundColor: '#3CD3FF',
                color: '#000000',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                margin: '0 auto 12px auto',
                border: '2px solid #3CD3FF',
                boxShadow: '0 0 15px rgba(60, 211, 255, 0.5)'
              }}
            >
              {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Typography
              variant="subtitle1"
              sx={{
                color: '#3CD3FF',
                fontWeight: 600,
                fontSize: '1.1rem',
                marginBottom: 0.5
              }}
            >
              {userProfile?.displayName || 'ProLab 사용자'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#ffffff',
                opacity: 0.8,
                fontSize: '0.8rem'
              }}
            >
              {userProfile?.email || 'user@prolab.com'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#3CD3FF',
                opacity: 0.7,
                fontSize: '0.7rem',
                display: 'block',
                marginTop: 1
              }}
            >
              🧬 연구 통합 플랫폼
            </Typography>
          </Box>

          {/* 메뉴 아이템들 */}
          <MenuItem
            onClick={handleDashboardClick}
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(60, 211, 255, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(60, 211, 255, 0.1)',
                color: '#3CD3FF',
                paddingLeft: '24px'
              }
            }}
          >
            <DashboardIcon sx={{ marginRight: 2, fontSize: '1.2rem', color: '#3CD3FF' }} />
            대시보드
          </MenuItem>
          
          <MenuItem
            onClick={handleProfileClick}
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(60, 211, 255, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(60, 211, 255, 0.1)',
                color: '#3CD3FF',
                paddingLeft: '24px'
              }
            }}
          >
            <PersonIcon sx={{ marginRight: 2, fontSize: '1.2rem', color: '#3CD3FF' }} />
            내 프로필
          </MenuItem>
          
          <MenuItem
            onClick={handleSettingsClick}
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(60, 211, 255, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(60, 211, 255, 0.1)',
                color: '#3CD3FF',
                paddingLeft: '24px'
              }
            }}
          >
            <SettingsIcon sx={{ marginRight: 2, fontSize: '1.2rem', color: '#3CD3FF' }} />
            설정
          </MenuItem>
          
          <MenuItem
            onClick={handleSignOut}
            sx={{
              color: '#ffffff',
              backgroundColor: '#000000',
              padding: '14px 20px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(60, 211, 255, 0.1)',
                color: '#3CD3FF',
                paddingLeft: '24px'
              }
            }}
          >
            <LogoutIcon sx={{ marginRight: 2, fontSize: '1.2rem', color: '#3CD3FF' }} />
            로그아웃
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

