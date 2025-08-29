import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Fade
} from '@mui/material';
import {
  Home as HomeIcon,
  Science as ScienceIcon,
  Assessment as AssessmentIcon,
  AccountTree as NetworkIcon,
  Biotech as DrugIcon,
  Timeline as TimelineIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useAuth();
  const { themeMode, isDark } = useTheme();

  const menuItems = [
    { path: '/home', icon: <HomeIcon />, text: '홈' },
    { path: '/protein-simulation', icon: <ScienceIcon />, text: '단백질 시뮬레이션' },
    { path: '/diagnosis-ai', icon: <AssessmentIcon />, text: 'AI 진단' },
    { path: '/interaction-network', icon: <NetworkIcon />, text: '상호작용 네트워크' },
    { path: '/drug-screening', icon: <DrugIcon />, text: '약물 스크리닝' },
    { path: '/epidemiology-model', icon: <TimelineIcon />, text: '역학 모델링' }
  ];

  // 테마 모드 텍스트
  const getThemeText = () => {
    switch (themeMode) {
      case 'light': return '라이트';
      case 'dark': return '다크';
      case 'system': return '시스템';
      default: return '시스템';
    }
  };

  return (
    <Box
      sx={{
        width: 280,
        backgroundColor: 'var(--bg-primary)',
        borderRight: '1px solid var(--border-primary)',
        height: '100vh',
        overflowY: 'auto',
        position: 'fixed',
        left: 0,
        top: '64px', // 네비게이션 바 높이만큼 상단 여백 추가
        zIndex: 1000
      }}
    >
      <Fade in={true} timeout={800}>
        <Box>
          {/* 사용자 프로필 섹션 */}
          {userProfile && (
            <Box
              onClick={() => navigate('/user-profile')}
              sx={{
                padding: 2,
                borderBottom: '1px solid var(--border-primary)',
                backgroundColor: 'var(--bg-primary)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'var(--bg-tertiary)',
                  transform: 'translateX(4px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-secondary)',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      borderColor: 'var(--text-muted)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  {userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <Box sx={{ 
                  flex: 1, 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    '& .MuiTypography-root': {
                      color: 'var(--text-muted)'
                    }
                  }
                }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'var(--text-primary)',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {userProfile.displayName || '사용자'}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-secondary)',
                      opacity: 0.7,
                      fontSize: '0.75rem',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {userProfile.email}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box
                  sx={{
                    flex: 1,
                    padding: 1,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 0,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'var(--bg-tertiary)',
                      borderColor: 'var(--text-muted)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.7rem',
                      display: 'block',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    테마
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {getThemeText()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    padding: 1,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 0,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'var(--bg-tertiary)',
                      borderColor: 'var(--text-muted)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.7rem',
                      display: 'block',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    언어
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      transition: 'color 0.3s ease'
                    }}
                  >
                    한국어
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* 메뉴 아이템들 */}
          <List sx={{ padding: 1 }}>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ marginBottom: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    backgroundColor: location.pathname === item.path ? 'var(--accent-primary)' : 'transparent',
                    color: location.pathname === item.path ? 'var(--text-primary)' : 'var(--text-primary)',
                    borderRadius: 0,
                    padding: '12px 16px',
                    transition: 'none',
                    '&:hover': {
                      backgroundColor: location.pathname === item.path ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      transform: 'none'
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--text-primary)',
                      '&:hover': {
                        backgroundColor: 'var(--accent-primary)'
                      }
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: location.pathname === item.path ? 'var(--text-primary)' : 'var(--text-primary)',
                      minWidth: 36,
                      fontSize: '1.2rem'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.9rem',
                        fontWeight: location.pathname === item.path ? 500 : 400
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ borderColor: 'var(--border-primary)', margin: 2 }} />

          {/* 푸터 */}
          <Box
            sx={{
              padding: 2,
              borderTop: 'none',
              marginTop: 'auto',
              textAlign: 'center'
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'var(--text-secondary)',
                opacity: 0.6,
                fontSize: '0.7rem'
              }}
            >
              BioLabs v1.0.0
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'var(--text-secondary)',
                opacity: 0.6,
                fontSize: '0.7rem',
                display: 'block',
                marginTop: 0.5
              }}
            >
              연구를 위한 최고의 플랫폼
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default Sidebar;
