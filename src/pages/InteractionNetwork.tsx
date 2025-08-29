import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  Fade,
  Grow,
  Paper
} from '@mui/material';
import {
  Share as ShareIcon,
  NetworkCheck as NetworkCheckIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const InteractionNetwork: React.FC = () => {
  const { userProfile } = useAuth();
  const { isDark } = useTheme();
  const [molecule, setMolecule] = useState('');
  const [network, setNetwork] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleNetworkAnalysis = async () => {
    if (!molecule.trim()) return;
    
    setLoading(true);
    // 네트워크 분석 로직 시뮬레이션
    setTimeout(() => {
      setNetwork('입력된 분자에 대한 상호작용 네트워크 분석 결과가 여기에 표시됩니다.');
      setShowResult(true);
      setLoading(false);
    }, 2000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        paddingTop: '80px',
        paddingBottom: '40px'
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom sx={{ mb: 4, color: 'var(--text-primary)' }}>
          상호작용 네트워크
        </Typography>

        <Grid container spacing={3}>
          {/* 입력 폼 */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
                  분자 상호작용 분석
                </Typography>
                
                <TextField
                  fullWidth
                  label="분자명"
                  value={molecule}
                  onChange={(e) => setMolecule(e.target.value)}
                  sx={{ mb: 3 }}
                  InputProps={{
                    style: { color: 'var(--text-primary)' }
                  }}
                  InputLabelProps={{
                    style: { color: 'var(--text-secondary)' }
                  }}
                />
                
                <Button
                  variant="contained"
                  onClick={handleNetworkAnalysis}
                  disabled={loading || !molecule.trim()}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {loading ? '분석 중...' : '네트워크 분석 시작'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* 결과 표시 */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
                  네트워크 분석 결과
                </Typography>
                
                {showResult && network && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {network}
                  </Alert>
                )}
                
                {!showResult && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ShareIcon sx={{ fontSize: 64, color: 'var(--text-secondary)', mb: 2 }} />
                    <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>
                      분자명을 입력하고 네트워크 분석을 시작하세요
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InteractionNetwork;
