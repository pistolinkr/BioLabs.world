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
  Medication as MedicationIcon,
  Science as ScienceIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const DrugScreening: React.FC = () => {
  const { userProfile } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [drugName, setDrugName] = useState('');
  const [target, setTarget] = useState('');
  const [screening, setScreening] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleScreening = async () => {
    if (!drugName.trim() || !target.trim()) return;
    
    setLoading(true);
    // 약물 스크리닝 로직 시뮬레이션
    setTimeout(() => {
      setScreening(t('drugScreening.results') || '입력된 약물과 타겟에 대한 스크리닝 결과가 여기에 표시됩니다.');
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
          {t('drugScreening.title')}
        </Typography>

        <Grid container spacing={3}>
          {/* 입력 폼 */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
                  {t('drugScreening.screening.title')}
                </Typography>
                
                <TextField
                  fullWidth
                  label={t('common.drugName')}
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
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
                  label={t('common.targetProtein')}
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
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
                  onClick={handleScreening}
                  disabled={loading || !drugName.trim() || !target.trim()}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {loading ? t('drugScreening.results.loading') : t('common.startScreening')}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* 결과 표시 */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
                  {t('drugScreening.results.title')}
                </Typography>
                
                {showResult && screening && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {screening}
                  </Alert>
                )}
                
                {!showResult && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <MedicationIcon sx={{ fontSize: 64, color: 'var(--text-secondary)', mb: 2 }} />
                    <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>
                      {t('drugScreening.results.instructions')}
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

export default DrugScreening;
