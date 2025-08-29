import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Fade
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { isDark } = useTheme();



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
                padding: '16px 16px 16px 16px',
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            </Box>
          )}



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
                opacity: 0.4,
                fontSize: '0.65rem',
                display: 'block',
                marginTop: 0.5
              }}
            >
              © 2025 Pistolinkr
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default Sidebar;
