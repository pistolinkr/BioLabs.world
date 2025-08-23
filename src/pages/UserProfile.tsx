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
  Tooltip
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
  Public as PublicIcon
} from '@mui/icons-material';
import { useAuth, LabData } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { currentUser, userProfile, updateLabSettings, signOut } = useAuth();
  
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
    <Box sx={{ padding: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Grow in={true} timeout={600}>
        <Box>
          {/* 헤더 */}
          <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #ffffff 30%, #00bcd4 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 2
              }}
            >
              내 연구실 프로필
            </Typography>
            <Typography variant="h6" sx={{ color: '#b0b0b0' }}>
              당신만의 BioLabs를 관리하세요
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* 사용자 정보 카드 */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333333',
                  borderRadius: 3,
                  height: 'fit-content'
                }}
              >
                <CardContent sx={{ padding: 3, textAlign: 'center' }}>
                  <Avatar
                    src={userProfile.photoURL || undefined}
                    sx={{
                      width: 120,
                      height: 120,
                      margin: '0 auto 2rem',
                      border: '4px solid #00bcd4',
                      fontSize: '3rem'
                    }}
                  >
                    {userProfile.displayName?.charAt(0) || 'U'}
                  </Avatar>

                  <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: 1 }}>
                    {userProfile.displayName}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#b0b0b0', marginBottom: 2 }}>
                    {userProfile.email}
                  </Typography>

                  <Chip
                    label={`${userProfile.provider} 계정`}
                    color="primary"
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                  />

                  <Box sx={{ marginTop: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      가입일: {userProfile.createdAt?.toDate?.()?.toLocaleDateString('ko-KR') || 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      마지막 로그인: {userProfile.lastLoginAt?.toDate?.()?.toLocaleDateString('ko-KR') || 'N/A'}
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
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333333',
                  borderRadius: 3
                }}
              >
                <CardContent sx={{ padding: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                    <SettingsIcon sx={{ color: '#00bcd4', marginRight: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
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
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={labSettings.theme === 'dark'}
                            onChange={(e) => setLabSettings({
                              ...labSettings,
                              theme: e.target.checked ? 'dark' : 'light'
                            })}
                            disabled={!isEditing}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#00bcd4'
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#00bcd4'
                              }
                            }}
                          />
                        }
                        label="다크 테마"
                      />
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
                                color: '#00bcd4'
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#00bcd4'
                              }
                            }}
                          />
                        }
                        label="알림 받기"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="언어"
                        value={labSettings.language}
                        onChange={(e) => setLabSettings({
                          ...labSettings,
                          language: e.target.value as 'ko' | 'en'
                        })}
                        disabled={!isEditing}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#00bcd4' },
                            '&.Mui-focused fieldset': { borderColor: '#00bcd4' }
                          }
                        }}
                      >
                        <option value="ko">한국어</option>
                        <option value="en">English</option>
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Lab 데이터 통계 */}
              <Card
                sx={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333333',
                  borderRadius: 3,
                  marginTop: 3
                }}
              >
                <CardContent sx={{ padding: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                    <TimelineIcon sx={{ color: '#00bcd4', marginRight: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Lab 데이터 통계
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {(['proteinSimulations', 'diagnosisResults', 'interactionNetworks', 'drugScreenings', 'epidemiologyModels'] as const).map((dataType) => (
                      <Grid item xs={12} sm={6} md={4} key={dataType}>
                        <Card
                          sx={{
                            backgroundColor: '#2a2a2a',
                            border: '1px solid #444444',
                            borderRadius: 2,
                            textAlign: 'center',
                            padding: 2,
                            '&:hover': {
                              borderColor: '#00bcd4',
                              transform: 'translateY(-2px)',
                              transition: 'all 0.3s ease'
                            }
                          }}
                        >
                          <Box sx={{ color: '#00bcd4', marginBottom: 1 }}>
                            {getLabDataIcon(dataType)}
                          </Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, marginBottom: 1 }}>
                            {getLabDataCount(dataType)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
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
    </Box>
  );
};

export default UserProfile;
