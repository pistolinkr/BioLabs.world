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
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  ShowChart as ShowChartIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const EpidemiologyModel: React.FC = () => {
  const { userProfile } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [disease, setDisease] = useState('');
  const [region, setRegion] = useState('');
  const [modeling, setModeling] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleModeling = async () => {
    if (!disease.trim() || !region.trim()) return;
    
    setLoading(true);
    // 역학 모델링 로직 시뮬레이션
    setTimeout(() => {
      setModeling(t('epidemiologyModel.results') || '입력된 질병과 지역에 대한 역학 모델링 결과가 여기에 표시됩니다.');
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
          {t('epidemiologyModel.title')}
        </Typography>

      <Grid container spacing={3}>
          {/* 입력 폼 */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
                  {t('epidemiologyModel.model.title')}
                </Typography>
              
                <TextField
                  fullWidth
                  label={t('common.diseaseModel')}
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  sx={{ mb: 3 }}
                  InputProps={{
                    style: { color: 'var(--text-primary)' }
                  }}
                  InputLabelProps={{
                    style: { color: 'var(--text-secondary)' }
                  }}
                />
                
                <TextField
                  fullWidth
                  label={t('common.region')}
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
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
                  onClick={handleModeling}
                  disabled={loading || !disease.trim() || !region.trim()}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {loading ? t('epidemiologyModel.simulation.loading') : t('common.runSimulation')}
                </Button>
            </CardContent>
          </Card>
        </Grid>

          {/* 결과 표시 */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
                  {t('epidemiologyModel.results.title')}
                </Typography>

                {showResult && modeling && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {modeling}
                  </Alert>
                )}
                
                {!showResult && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <TimelineIcon sx={{ fontSize: 64, color: 'var(--text-secondary)', mb: 2 }} />
                    <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>
                      {t('epidemiologyModel.results.instructions')}
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

export default EpidemiologyModel;
