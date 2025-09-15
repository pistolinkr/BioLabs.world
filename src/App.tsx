import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Home from './pages/Home';
import ProteinSimulation from './pages/ProteinSimulation';
import MolecularInteractionAnalysis from './pages/MolecularInteractionAnalysis';
import MolecularSolutionHelper from './pages/MolecularSolutionHelper';
import MoleculeViewer from './pages/MoleculeViewer';
import DiagnosisAI from './pages/DiagnosisAI';
import DrugScreening from './pages/DrugScreening';
import EpidemiologyModel from './pages/EpidemiologyModel';
import UserProfile from './pages/UserProfile';
import './App.css';

// 보호된 라우트 컴포넌트
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading, isInitialized } = useAuth();
  
  // 인증 상태가 초기화되지 않았거나 로딩 중인 경우
  if (!isInitialized || loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          backgroundColor: '#000000',
          color: '#ffffff'
        }}
      >
        <div>로딩 중...</div>
      </Box>
    );
  }
  
  // 인증된 사용자가 있는 경우
  if (currentUser) {
    return <>{children}</>;
  }
  
  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  return <Navigate to="/login" replace />;
};

// 로그인 페이지에서 이미 로그인된 사용자 처리
const LoginRoute: React.FC = () => {
  const { currentUser, loading, isInitialized } = useAuth();
  
  // 인증 상태가 초기화되지 않았거나 로딩 중인 경우
  if (!isInitialized || loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          backgroundColor: '#000000',
          color: '#ffffff'
        }}
      >
        <div>로딩 중...</div>
      </Box>
    );
  }
  
  // 이미 로그인된 사용자는 플랫폼으로 리다이렉트
  if (currentUser) {
    return <Navigate to="/protein-simulation" replace />;
  }
  
  // 로그인되지 않은 사용자는 로그인 페이지 표시
  return <Login />;
};

// 메인 레이아웃 컴포넌트 (네비게이션 바 포함)
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          paddingTop: '64px', // Navbar 높이만큼 상단 패딩 추가
          paddingBottom: '80px', // 하단 네비게이션 바 높이만큼 하단 패딩 추가
          flexGrow: 1,
          backgroundColor: 'var(--bg-primary)'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

// 홈 페이지 레이아웃 컴포넌트 (네비게이션 바 없음)
const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'var(--bg-primary)'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

// 흑백 테마 생성 (검은색/하얀색만 사용)
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ffffff', light: '#ffffff', dark: '#ffffff', contrastText: '#000000' },
    secondary: { main: '#ffffff', light: '#ffffff', dark: '#ffffff', contrastText: '#000000' },
    background: { default: '#000000', paper: '#000000' },
    text: { primary: '#ffffff', secondary: '#ffffff' },
    error: { main: '#ffffff' },
    warning: { main: '#ffffff' },
    info: { main: '#ffffff' },
    success: { main: '#ffffff' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 400 },
    h2: { fontSize: '1.75rem', fontWeight: 400 },
    h3: { fontSize: '1.5rem', fontWeight: 400 },
    h4: { fontSize: '1.25rem', fontWeight: 400 },
    h5: { fontSize: '1.125rem', fontWeight: 400 },
    h6: { fontSize: '1rem', fontWeight: 400 },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.8rem' },
    caption: { fontSize: '0.75rem' },
    button: { fontSize: '0.875rem', fontWeight: 400, textTransform: 'none' }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          border: '1px solid #ffffff',
          borderRadius: 0,
          transition: 'none',
          '&:hover': {
            transform: 'none',
            boxShadow: 'none',
            borderColor: '#ffffff'
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          border: '1px solid #ffffff',
          borderRadius: 0
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          fontWeight: 400,
          transition: 'none',
          '&:hover': {
            transform: 'none'
          }
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '&:hover fieldset': {
              borderColor: '#ffffff'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ffffff',
              borderWidth: 1
            }
          }
        }
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '& .MuiSlider-thumb': {
            backgroundColor: '#ffffff',
            border: '1px solid #000000',
            boxShadow: 'none'
          },
          '& .MuiSlider-track': {
            backgroundColor: '#ffffff'
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#ffffff'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: 'none',
          border: 'none',
          outline: 'none'
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px',
          padding: '0 16px',
          border: 'none',
          borderBottom: 'none',
          outline: 'none'
        }
      }
    }
  },
});

function App() {
  // 부드러운 스크롤 효과 설정
  useEffect(() => {
    // 부드러운 스크롤 함수
    const smoothScroll = (target: Element, duration: number = 800) => {
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80; // 네비게이션 바 높이만큼 조정
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime: number | null = null;

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      };

      // 이징 함수 (부드러운 가속/감속)
      const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
      };

      requestAnimationFrame(animation);
    };

    // 전역 스크롤 이벤트 리스너 추가
    const handleWheel = (e: WheelEvent) => {
      // 부드러운 스크롤을 위한 추가 설정
      if (Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        const scrollAmount = e.deltaY * 0.5; // 스크롤 속도 조절
        window.scrollBy({
          top: scrollAmount,
          behavior: 'smooth'
        });
      }
    };

    // 휠 이벤트 리스너 등록 (선택적)
    // document.addEventListener('wheel', handleWheel, { passive: false });

    // 부드러운 스크롤 유틸리티를 전역에 추가
    (window as any).smoothScroll = smoothScroll;

    return () => {
      // document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <MuiThemeProvider theme={darkTheme}>
          <CssBaseline />
          <AuthProvider>
            <Router>
            <Routes>
              <Route path="/login" element={<LoginRoute />} />
              <Route
                path="/home"
                element={
                  <HomeLayout>
                    <Home />
                  </HomeLayout>
                }
              />
              <Route
                path="/protein-simulation"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ProteinSimulation />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/molecular-interaction"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <MolecularInteractionAnalysis />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/molecular-solution-helper"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <MolecularSolutionHelper />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/molecule-viewer"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <MoleculeViewer />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/diagnosis-ai"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DiagnosisAI />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/drug-screening"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DrugScreening />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/epidemiology-model"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <EpidemiologyModel />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-profile"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserProfile />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/home" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </MuiThemeProvider>
    </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
