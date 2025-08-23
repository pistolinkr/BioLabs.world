import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Fade,
  Grow,
  Alert,
  Button
} from '@mui/material';
import {
  Science as ScienceIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Biotech as BiotechIcon
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const { userProfile, getLabData } = useAuth();
  const [labData, setLabData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLabData = async () => {
      if (userProfile) {
        try {
          const proteinData = await getLabData('proteinSimulations');
          const diagnosisData = await getLabData('diagnosisResults');
          const networkData = await getLabData('interactionNetworks');
          const drugData = await getLabData('drugScreenings');
          const epidemiologyData = await getLabData('epidemiologyModels');

          setLabData({
            proteinSimulations: proteinData || [],
            diagnosisResults: diagnosisData || [],
            interactionNetworks: networkData || [],
            drugScreenings: drugData || [],
            epidemiologyModels: epidemiologyData || []
          });
        } catch (error) {
          console.error('Lab 데이터 로드 실패:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadLabData();
  }, [userProfile, getLabData]);

  // 연구 프로젝트 수 계산
  const getTotalProjects = () => {
    if (!labData) return 0;
    return Object.values(labData).reduce((total: number, data: any) => total + (data?.length || 0), 0);
  };

  // 완료된 프로젝트 수 계산
  const getCompletedProjects = () => {
    if (!labData) return 0;
    // 실제 구현에서는 각 데이터의 상태를 확인해야 함
    return Math.floor(getTotalProjects() * 0.2); // 임시로 20% 완료로 계산
  };

  // 초기화 상태인지 확인
  const isInitialized = getTotalProjects() > 0;

  if (loading) {
    return (
      <Box sx={{ padding: 3, marginTop: 8 }}>
        <Typography variant="h6" sx={{ color: '#ffffff', textAlign: 'center' }}>
          데이터를 불러오는 중...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, marginTop: 8, minHeight: 'calc(100vh - 64px)' }}>
      <Fade in={true} timeout={800}>
        <Box>
          {/* 환영 메시지 */}
          <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: '#ffffff',
                fontWeight: 400,
                marginBottom: 1,
                fontSize: '2rem'
              }}
            >
              ProLab에 오신 것을 환영합니다
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#ffffff',
                fontWeight: 300,
                opacity: 0.8,
                fontSize: '1.1rem'
              }}
            >
              고급 프리온 연구 및 분석 플랫폼
      </Typography>
          </Box>

          {/* 초기화 상태 안내 */}
          {!isInitialized && (
            <Grow in={true} timeout={1000}>
              <Alert
                severity="info"
                sx={{
                  marginBottom: 3,
                  backgroundColor: '#000000',
                  border: '1px solid #ffffff',
                  color: '#ffffff',
                  '& .MuiAlert-icon': { color: '#ffffff' }
                }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    startIcon={<AddIcon />}
                    sx={{ color: '#ffffff', border: '1px solid #ffffff' }}
                  >
                    첫 프로젝트 시작하기
                  </Button>
                }
              >
                아직 연구 프로젝트가 없습니다. 첫 번째 프로젝트를 시작해보세요!
              </Alert>
            </Grow>
          )}

      {/* 통계 카드들 */}
          <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
              <Grow in={true} timeout={800}>
                <Card
                  sx={{
                    backgroundColor: '#000000',
                    border: '1px solid #ffffff',
                    borderRadius: 0,
                    height: '100%',
                    transition: 'none',
                    '&:hover': {
                      transform: 'none',
                      boxShadow: 'none'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', padding: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: '#0066cc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        border: '1px solid #ffffff'
                      }}
                    >
                      <ScienceIcon sx={{ color: '#ffffff', fontSize: '2rem' }} />
              </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#0066cc',
                        fontWeight: 500,
                        marginBottom: 1,
                        fontSize: '1rem'
                      }}
                    >
                      연구 프로젝트
              </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        color: '#ffffff',
                        fontWeight: 300,
                        fontSize: '2.5rem'
                      }}
                    >
                      {getTotalProjects()}
              </Typography>
            </CardContent>
          </Card>
              </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
              <Grow in={true} timeout={1000}>
                <Card
                  sx={{
                    backgroundColor: '#000000',
                    border: '1px solid #ffffff',
                    borderRadius: 0,
                    height: '100%',
                    transition: 'none',
                    '&:hover': {
                      transform: 'none',
                      boxShadow: 'none'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', padding: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: '#00aa44',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        border: '1px solid #ffffff'
                      }}
                    >
                      <CheckCircleIcon sx={{ color: '#ffffff', fontSize: '2rem' }} />
              </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#00aa44',
                        fontWeight: 500,
                        marginBottom: 1,
                        fontSize: '1rem'
                      }}
                    >
                      완료됨
              </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        color: '#ffffff',
                        fontWeight: 300,
                        fontSize: '2.5rem'
                      }}
                    >
                      {getCompletedProjects()}
              </Typography>
            </CardContent>
          </Card>
              </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
              <Grow in={true} timeout={1200}>
                <Card
                  sx={{
                    backgroundColor: '#000000',
                    border: '1px solid #ffffff',
                    borderRadius: 0,
                    height: '100%',
                    transition: 'none',
                    '&:hover': {
                      transform: 'none',
                      boxShadow: 'none'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', padding: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: '#cc6600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        border: '1px solid #ffffff'
                      }}
                    >
                      <TrendingUpIcon sx={{ color: '#ffffff', fontSize: '2rem' }} />
              </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#cc6600',
                        fontWeight: 500,
                        marginBottom: 1,
                        fontSize: '1rem'
                      }}
                    >
                      진행률
              </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        color: '#ffffff',
                        fontWeight: 300,
                        fontSize: '2.5rem'
                      }}
                    >
                      {getTotalProjects() > 0 ? Math.round((getCompletedProjects() / getTotalProjects()) * 100) : 0}%
              </Typography>
            </CardContent>
          </Card>
              </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
              <Grow in={true} timeout={1400}>
                <Card
                  sx={{
                    backgroundColor: '#000000',
                    border: '1px solid #ffffff',
                    borderRadius: 0,
                    height: '100%',
                    transition: 'none',
                    '&:hover': {
                      transform: 'none',
                      boxShadow: 'none'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', padding: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: '#aa0066',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        border: '1px solid #ffffff'
                      }}
                    >
                      <AssessmentIcon sx={{ color: '#ffffff', fontSize: '2rem' }} />
              </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#aa0066',
                        fontWeight: 500,
                        marginBottom: 1,
                        fontSize: '1rem'
                      }}
                    >
                      분석 결과
              </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        color: '#ffffff',
                        fontWeight: 300,
                        fontSize: '2.5rem'
                      }}
                    >
                      {labData?.diagnosisResults?.length || 0}
              </Typography>
            </CardContent>
          </Card>
              </Grow>
        </Grid>
      </Grid>

          {/* 모듈별 상세 정보 */}
          {isInitialized && (
            <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
                <Grow in={true} timeout={1600}>
                  <Card
                    sx={{
                      backgroundColor: '#000000',
                      border: '1px solid #ffffff',
                      borderRadius: 0,
                      transition: 'none',
                      '&:hover': {
                        transform: 'none',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    <CardContent sx={{ padding: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#ffffff',
                          fontWeight: 500,
                          marginBottom: 2,
                          fontSize: '1.1rem'
                        }}
                      >
                        모듈별 현황
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BiotechIcon sx={{ color: '#ffffff', fontSize: '1.2rem' }} />
                            <Typography sx={{ color: '#ffffff', fontSize: '0.9rem' }}>
                              단백질 시뮬레이션
                            </Typography>
                          </Box>
                          <Typography sx={{ color: '#ffffff', fontSize: '0.9rem' }}>
                            {labData?.proteinSimulations?.length || 0}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AssessmentIcon sx={{ color: '#ffffff', fontSize: '1.2rem' }} />
                            <Typography sx={{ color: '#ffffff', fontSize: '0.9rem' }}>
                              AI 진단
                            </Typography>
                          </Box>
                          <Typography sx={{ color: '#ffffff', fontSize: '0.9rem' }}>
                            {labData?.diagnosisResults?.length || 0}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ScienceIcon sx={{ color: '#ffffff', fontSize: '1.2rem' }} />
                            <Typography sx={{ color: '#ffffff', fontSize: '0.9rem' }}>
                              약물 스크리닝
                            </Typography>
                          </Box>
                          <Typography sx={{ color: '#ffffff', fontSize: '0.9rem' }}>
                            {labData?.drugScreenings?.length || 0}
                  </Typography>
                </Box>
                      </Box>
            </CardContent>
          </Card>
                </Grow>
        </Grid>

        <Grid item xs={12} md={6}>
                <Grow in={true} timeout={1800}>
                  <Card
                    sx={{
                      backgroundColor: '#000000',
                      border: '1px solid #ffffff',
                      borderRadius: 0,
                      transition: 'none',
                      '&:hover': {
                        transform: 'none',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    <CardContent sx={{ padding: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#ffffff',
                          fontWeight: 500,
                          marginBottom: 2,
                          fontSize: '1.1rem'
                        }}
                      >
                        빠른 시작
              </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button
                          variant="outlined"
                          startIcon={<ScienceIcon />}
                          sx={{
                            borderColor: '#ffffff',
                            color: '#ffffff',
                            backgroundColor: '#000000',
                            borderRadius: 0,
                            fontSize: '0.9rem',
                            padding: '8px 16px',
                            '&:hover': {
                              borderColor: '#ffffff',
                              backgroundColor: '#000000'
                            }
                          }}
                        >
                          새 시뮬레이션 시작
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<AssessmentIcon />}
                          sx={{
                            borderColor: '#ffffff',
                            color: '#ffffff',
                            backgroundColor: '#000000',
                            borderRadius: 0,
                            fontSize: '0.9rem',
                            padding: '8px 16px',
                            '&:hover': {
                              borderColor: '#ffffff',
                              backgroundColor: '#000000'
                            }
                          }}
                        >
                          AI 진단 실행
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<BiotechIcon />}
                          sx={{
                            borderColor: '#ffffff',
                            color: '#ffffff',
                            backgroundColor: '#000000',
                            borderRadius: 0,
                            fontSize: '0.9rem',
                            padding: '8px 16px',
                            '&:hover': {
                              borderColor: '#ffffff',
                              backgroundColor: '#000000'
                            }
                          }}
                        >
                          약물 스크리닝
                        </Button>
                      </Box>
            </CardContent>
          </Card>
                </Grow>
        </Grid>
      </Grid>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default Dashboard;
