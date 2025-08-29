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
  Psychology as PsychologyIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const DiagnosisAI: React.FC = () => {
  const { userProfile } = useAuth();
  const { isDark } = useTheme();
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleDiagnosis = async () => {
    if (!symptoms.trim()) return;
    
    setLoading(true);
    // AI 진단 로직 시뮬레이션
    setTimeout(() => {
      setDiagnosis('입력된 증상에 기반한 AI 진단 결과가 여기에 표시됩니다.');
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
          AI 진단
        </Typography>

        <Grid container spacing={3}>
          {/* 입력 폼 */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
                  증상 입력
                </Typography>
                
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="증상을 자세히 설명해주세요"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
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
                  onClick={handleDiagnosis}
                  disabled={loading || !symptoms.trim()}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {loading ? '진단 중...' : 'AI 진단 시작'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* 결과 표시 */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
                  진단 결과
                </Typography>
                
                {showResult && diagnosis && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {diagnosis}
                  </Alert>
                )}
                
                {!showResult && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <PsychologyIcon sx={{ fontSize: 64, color: 'var(--text-secondary)', mb: 2 }} />
                    <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>
                      증상을 입력하고 AI 진단을 시작하세요
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

export default DiagnosisAI;
