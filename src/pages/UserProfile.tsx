import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Chip,
  Alert,
  Fade,
  Grow,
  IconButton,
  Tooltip,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Settings as SettingsIcon,
  Science as ScienceIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  NetworkCheck as NetworkCheckIcon,
  Medication as MedicationIcon,
  Public as PublicIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Computer as ComputerIcon
} from '@mui/icons-material';
import { useAuth, LabData } from '../contexts/AuthContext';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';

const UserProfile: React.FC = () => {
  const { currentUser, userProfile, updateLabSettings, signOut } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [labSettings, setLabSettings] = useState({
    theme: 'dark' as 'dark' | 'light',
    language: 'ko' as 'ko' | 'en',
    notifications: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setLabSettings(userProfile.labSettings);
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const result = await updateLabSettings(labSettings);
      if (result.success) {
        setMessage({ type: 'success', text: '설정이 저장되었습니다! 🎉' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: result.error || '설정 저장에 실패했습니다.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || '오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setLabSettings(userProfile.labSettings);
    }
    setIsEditing(false);
    setMessage(null);
  };

  const handleThemeChange = (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
    setLabSettings(prev => ({
      ...prev,
      theme: newTheme === 'system' ? 'dark' : newTheme
    }));
  };

  const getLabDataCount = (dataType: keyof LabData) => {
    if (!userProfile) return 0;
    return userProfile.labData[dataType]?.length || 0;
  };

  const getLabDataIcon = (dataType: keyof LabData) => {
    const icons = {
      proteinSimulations: <ScienceIcon />,
      diagnosisResults: <AssessmentIcon />,
      interactionNetworks: <NetworkCheckIcon />,
      drugScreenings: <MedicationIcon />,
      epidemiologyModels: <PublicIcon />
    };
    return icons[dataType];
  };

  const getLabDataLabel = (dataType: keyof LabData) => {
    const labels = {
      proteinSimulations: '단백질 시뮬레이션',
      diagnosisResults: '진단 결과',
      interactionNetworks: '상호작용 네트워크',
      drugScreenings: '약물 스크리닝',
      epidemiologyModels: '역학 모델'
    };
    return labels[dataType];
  };

  if (!currentUser || !userProfile) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          사용자 정보를 불러올 수 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      padding: 3, 
      maxWidth: 1200, 
      margin: '0 auto',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      minHeight: '100vh',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <Grow in={true} timeout={600}>
        <Box>
          {/* 헤더 */}
          <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, var(--text-primary) 30%, var(--accent-primary) 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 2
              }}
            >
              내 연구실 프로필
            </Typography>
            <Typography variant="h6" sx={{ color: 'var(--text-secondary)' }}>
              당신만의 BioLabs를 관리하세요
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* 사용자 정보 카드 */}
            <Grid item xs={12} md={4}>
                              <Card
                  sx={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 3,
                    height: 'fit-content',
                    transition: 'all 0.3s ease'
                  }}
                >
                <CardContent sx={{ padding: 3, textAlign: 'center' }}>
                  <Avatar
                    src={userProfile.photoURL || undefined}
                    sx={{
                      width: 120,
                      height: 120,
                      margin: '0 auto 2rem',
                      border: '4px solid var(--border-primary)',
                      fontSize: '3rem'
                    }}
                  >
                    {userProfile.displayName?.charAt(0) || 'U'}
                  </Avatar>

                  <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: 1, color: 'var(--text-primary)' }}>
                    {userProfile.displayName}
                  </Typography>

                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)', marginBottom: 2 }}>
                    {userProfile.email}
                  </Typography>

                  <Chip
                    label={`${userProfile.provider} 계정`}
                    color="primary"
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                  />

                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                      가입일: {userProfile.createdAt?.toDate?.()?.toLocaleDateString('ko-KR') || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                      마지막 로그인: {userProfile.lastLoginAt?.toDate?.()?.toDate?.()?.toLocaleDateString('ko-KR') || 'N/A'}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={signOut}
                    sx={{ marginTop: 2 }}
                  >
                    로그아웃
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Lab 설정 카드 */}
            <Grid item xs={12} md={8}>
                              <Card
                  sx={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease'
                  }}
                >
                <CardContent sx={{ padding: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                    <SettingsIcon sx={{ color: 'var(--text-primary)', marginRight: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      Lab 설정
                    </Typography>
                    <Box sx={{ marginLeft: 'auto' }}>
                      {!isEditing ? (
                        <Button
                          startIcon={<EditIcon />}
                          onClick={() => setIsEditing(true)}
                          variant="outlined"
                          color="primary"
                        >
                          편집
                        </Button>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                          >
                            저장
                          </Button>
                          <Button
                            startIcon={<CancelIcon />}
                            onClick={handleCancel}
                            variant="outlined"
                            color="secondary"
                          >
                            취소
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {message && (
                    <Fade in={true}>
                      <Alert
                        severity={message.type}
                        sx={{ marginBottom: 3 }}
                        onClose={() => setMessage(null)}
                      >
                        {message.text}
                      </Alert>
                    </Fade>
                  )}

                  <Grid container spacing={3}>
                    {/* 테마 설정 */}
                    <Grid item xs={12}>
                      <FormControl component="fieldset" sx={{ width: '100%' }}>
                        <FormLabel component="legend" sx={{ color: 'var(--text-primary)', marginBottom: 2 }}>
                          테마 설정
                        </FormLabel>
                        <RadioGroup
                          value={themeMode}
                          onChange={(e) => handleThemeChange(e.target.value as ThemeMode)}
                          sx={{ flexDirection: 'row', gap: 2 }}
                        >
                          <FormControlLabel
                            value="light"
                            control={<Radio sx={{ 
                              color: 'var(--text-secondary)',
                              '&.Mui-checked': { color: 'var(--accent-primary)' }
                            }} />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LightModeIcon sx={{ fontSize: '1.2rem', color: 'var(--text-primary)' }} />
                                <Typography sx={{ color: 'var(--text-primary)' }}>라이트 모드</Typography>
                              </Box>
                            }
                            sx={{ color: 'var(--text-primary)' }}
                          />
                          <FormControlLabel
                            value="dark"
                            control={<Radio sx={{ 
                              color: 'var(--text-secondary)',
                              '&.Mui-checked': { color: 'var(--accent-primary)' }
                            }} />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DarkModeIcon sx={{ fontSize: '1.2rem', color: 'var(--text-primary)' }} />
                                <Typography sx={{ color: 'var(--text-primary)' }}>다크 모드</Typography>
                              </Box>
                            }
                            sx={{ color: 'var(--text-primary)' }}
                          />
                          <FormControlLabel
                            value="system"
                            control={<Radio sx={{ 
                              color: 'var(--text-secondary)',
                              '&.Mui-checked': { color: 'var(--accent-primary)' }
                            }} />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ComputerIcon sx={{ fontSize: '1.2rem', color: 'var(--text-primary)' }} />
                                <Typography sx={{ color: 'var(--text-primary)' }}>시스템 설정</Typography>
                              </Box>
                            }
                            sx={{ color: 'var(--text-primary)' }}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={labSettings.notifications}
                            onChange={(e) => setLabSettings({
                              ...labSettings,
                              notifications: e.target.checked
                            })}
                            disabled={!isEditing}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: 'var(--accent-primary)'
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: 'var(--accent-primary)'
                              }
                            }}
                          />
                        }
                        label="알림 받기"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ 
                        padding: 2, 
                        backgroundColor: 'var(--bg-secondary)', 
                        border: '1px solid var(--border-primary)',
                        borderRadius: 1
                      }}>
                        <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', marginBottom: 1 }}>
                          언어
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                          한국어 (고정)
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          영어 버전 출시 예정
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Lab 데이터 통계 */}
              <Card
                sx={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 3,
                  marginTop: 3,
                  transition: 'all 0.3s ease'
                }}
              >
                <CardContent sx={{ padding: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                    <TimelineIcon sx={{ color: 'var(--text-primary)', marginRight: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      Lab 데이터 통계
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {(['proteinSimulations', 'diagnosisResults', 'interactionNetworks', 'drugScreenings', 'epidemiologyModels'] as const).map((dataType) => (
                      <Grid item xs={12} sm={6} md={4} key={dataType}>
                        <Card
                          sx={{
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-primary)',
                            borderRadius: 2,
                            textAlign: 'center',
                            padding: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: 'var(--accent-primary)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px var(--shadow-medium)'
                            }
                          }}
                        >
                          <Box sx={{ color: 'var(--text-primary)', marginBottom: 1 }}>
                            {getLabDataIcon(dataType)}
                          </Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, marginBottom: 1, color: 'var(--text-primary)' }}>
                            {getLabDataCount(dataType)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                            {getLabDataLabel(dataType)}
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Grow>

      {/* 공통 푸터 */}
      <Box
        component="footer"
        sx={{
          backgroundColor: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-primary)',
          padding: 3,
          marginTop: 4,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'var(--text-secondary)',
            opacity: 0.6,
            fontSize: '0.7rem',
            display: 'block',
            marginBottom: 1
          }}
        >
          BioLabs v1.0.0
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'var(--text-secondary)',
            opacity: 0.4,
            fontSize: '0.65rem'
          }}
        >
          © 2025 Pistolinkr
        </Typography>
      </Box>
    </Box>
  );
};

export default UserProfile;
