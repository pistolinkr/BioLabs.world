import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Fade,
  Grow
} from '@mui/material';
import {
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
  Share as ShareIcon,
  Medication as MedicationIcon,
  Timeline as TimelineIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const services = [
    {
      id: 'protein-simulation',
      title: '단백질 시뮬레이션',
      description: '3D 단백질 구조 시뮬레이션 및 분석',
      icon: <ScienceIcon sx={{ fontSize: 40, color: '#ffffff' }} />,
      color: '#ffffff',
      path: '/protein-simulation'
    },
    {
      id: 'diagnosis-ai',
      title: 'AI 진단',
      description: '인공지능 기반 질병 진단 및 분석',
      icon: <PsychologyIcon sx={{ fontSize: 40, color: '#ffffff' }} />,
      color: '#ffffff',
      path: '/diagnosis-ai'
    },
    {
      id: 'interaction-network',
      title: '상호작용 네트워크',
      description: '분자 상호작용 네트워크 분석',
      icon: <ShareIcon sx={{ fontSize: 40, color: '#ffffff' }} />,
      color: '#ffffff',
      path: '/interaction-network'
    },
    {
      id: 'drug-screening',
      title: '약물 스크리닝',
      description: '약물 스크리닝 및 효과 분석',
      icon: <MedicationIcon sx={{ fontSize: 40, color: '#ffffff' }} />,
      color: '#ffffff',
      path: '/drug-screening'
    },
    {
      id: 'epidemiology-model',
      title: '역학 모델링',
      description: '역학 모델링 및 예측 분석',
      icon: <TimelineIcon sx={{ fontSize: 40, color: '#ffffff' }} />,
      color: '#ffffff',
      path: '/epidemiology-model'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        paddingTop: '80px',
        paddingBottom: '40px'
      }}
    >
      <Container maxWidth="lg">
        {/* 헤더 섹션 */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', marginBottom: 6 }}>
            <HomeIcon sx={{ fontSize: 60, color: '#ffffff', marginBottom: 2 }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                marginBottom: 2,
                color: '#ffffff'
              }}
            >
              BioLabs 생명학 시뮬레이션 도구
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#b0b0b0',
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: 1.6
              }}
            >
              생명학 연구를 위한 다양한 시뮬레이션 및 테스팅 도구 모음
            </Typography>
            {userProfile && (
              <Typography
                variant="body1"
                sx={{
                  color: '#ffffff',
                  marginTop: 2,
                  fontSize: '1.1rem'
                }}
              >
                안녕하세요, {userProfile.displayName || '사용자'}님! 🧬
              </Typography>
            )}
          </Box>
        </Fade>

        {/* 서비스 소개 섹션 */}
        <Grow in timeout={1000}>
          <Box sx={{ marginBottom: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                textAlign: 'center',
                marginBottom: 4,
                fontWeight: 600,
                color: '#ffffff'
              }}
            >
              사용 가능한 시뮬레이션 도구
            </Typography>
            <Grid container spacing={3}>
              {services.map((service, index) => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                  <Grow in timeout={1200 + index * 200}>
                    <Card
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${service.color}`,
                        borderRadius: 2,
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 8px 25px ${service.color}40`,
                          borderColor: service.color,
                          backgroundColor: 'rgba(255, 255, 255, 0.08)'
                        }
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', padding: 3 }}>
                        <Box sx={{ marginBottom: 2 }}>
                          {service.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: 600,
                            marginBottom: 1,
                            color: '#ffffff'
                          }}
                        >
                          {service.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#b0b0b0',
                            lineHeight: 1.6,
                            marginBottom: 2
                          }}
                        >
                          {service.description}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'center', paddingBottom: 3 }}>
                        <Button
                          variant="outlined"
                          onClick={() => navigate(service.path)}
                          sx={{
                            borderColor: service.color,
                            color: service.color,
                            borderRadius: 0,
                            '&:hover': {
                              backgroundColor: service.color,
                              color: '#000000',
                              borderColor: service.color
                            }
                          }}
                        >
                          도구 시작하기
                        </Button>
                      </CardActions>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grow>

        {/* 추가 정보 섹션 */}
        <Fade in timeout={1400}>
          <Paper
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 2,
              padding: 4,
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontWeight: 600,
                marginBottom: 2,
                color: '#ffffff'
              }}
            >
              BioLabs 도구의 특징
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ color: '#ffffff', marginBottom: 1 }}>
                  🔬 정확한 분석
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  최신 생물학 연구 방법론을 활용한 정확한 데이터 분석
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ color: '#ffffff', marginBottom: 1 }}>
                  🚀 빠른 처리
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  고성능 컴퓨팅을 통한 빠른 데이터 처리 및 결과 도출
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ color: '#ffffff', marginBottom: 1 }}>
                  📊 직관적 시각화
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  복잡한 데이터를 이해하기 쉽게 시각화하여 제공
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Home;
