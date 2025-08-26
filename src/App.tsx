import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Home from './pages/Home';
import ProteinSimulation from './pages/ProteinSimulation';
import DiagnosisAI from './pages/DiagnosisAI';
import InteractionNetwork from './pages/InteractionNetwork';
import DrugScreening from './pages/DrugScreening';
import EpidemiologyModel from './pages/EpidemiologyModel';
import UserProfile from './pages/UserProfile';
import './App.css';

// 보호된 라우트 컴포넌트
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};

// 메인 레이아웃 컴포넌트
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000000' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, marginLeft: '280px' }}>
        <Navbar />
        <Box
          component="main"
          sx={{
            paddingTop: '64px', // Navbar 높이만큼 상단 패딩 추가
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: '#000000'
          }}
        >
          {children}
        </Box>
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
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Home />
                  </MainLayout>
                </ProtectedRoute>
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
              path="/interaction-network"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <InteractionNetwork />
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
    </ThemeProvider>
  );
}

export default App;
