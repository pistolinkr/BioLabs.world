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

