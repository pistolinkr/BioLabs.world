import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Fade,
  Grow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
  Share as ShareIcon,
  Help as HelpIcon,
  Medication as MedicationIcon,
  Timeline as TimelineIcon,
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  PlayArrow as PlayArrowIcon,
  Bookmark as BookmarkIcon,
  Schedule as ScheduleIcon,
  ViewInAr as ViewInArIcon,
  EmojiEvents as EmojiEventsIcon,
  Engineering as EngineeringIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import HomeNavbar from '../components/HomeNavbar';

const Home: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const { isDark } = useCustomTheme();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [expanded, setExpanded] = useState<string | false>(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // 언어 변경 핸들러 with 애니메이션
  const handleLanguageChange = (newLanguage: 'ko' | 'en') => {
    if (newLanguage === language) return;
    
    setIsTransitioning(true);
    
    // 애니메이션 후 언어 변경
    setTimeout(() => {
      setLanguage(newLanguage);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 200);
  };


  // Hero 섹션 데이터
  const heroData = {
    urgencyBanner: t('home.urgencyBanner'),
    mainHeadline: t('home.mainHeadline'),
    subHeadline: t('home.subHeadline'),
    description: t('home.description'),
    ctaText: t('home.ctaText'),
    rating: { count: t('home.rating.count'), stars: 5 }
  };

  // Features 섹션 데이터
  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 32 }} />,
      title: t('home.features.unlimitedAnalysis.title'),
      description: t('home.features.unlimitedAnalysis.description')
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 32 }} />,
      title: t('home.features.fastProcessing.title'),
      description: t('home.features.fastProcessing.description')
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
      title: t('home.features.noContracts.title'),
      description: t('home.features.noContracts.description')
    },
    {
      icon: <StarIcon sx={{ fontSize: 32 }} />,
      title: t('home.features.noExtraCharges.title'),
      description: t('home.features.noExtraCharges.description')
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 32 }} />,
      title: t('home.features.worldClassQuality.title'),
      description: t('home.features.worldClassQuality.description')
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
      title: t('home.features.satisfactionGuarantee.title'),
      description: t('home.features.satisfactionGuarantee.description')
    }
  ];

  // Introduction 섹션 데이터
  const processSteps = [
    {
      icon: <BookmarkIcon sx={{ fontSize: 40 }} />,
      title: t('home.introduction.steps.start.title'),
      description: t('home.introduction.steps.start.description')
    },
    {
      icon: <ShareIcon sx={{ fontSize: 40 }} />,
      title: t('home.introduction.steps.request.title'),
      description: t('home.introduction.steps.request.description')
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
      title: t('home.introduction.steps.review.title'),
      description: t('home.introduction.steps.review.description')
    }
  ];

  // FAQ 데이터
  const faqs = [
    {
      question: t('home.faq.questions.whatIsPlatform.question'),
      answer: t('home.faq.questions.whatIsPlatform.answer')
    },
    {
      question: t('home.faq.questions.availableTools.question'),
      answer: t('home.faq.questions.availableTools.answer')
    },
    {
      question: t('home.faq.questions.freeUsage.question'),
      answer: t('home.faq.questions.freeUsage.answer')
    },
    {
      question: t('home.faq.questions.dataSecurity.question'),
      answer: t('home.faq.questions.dataSecurity.answer')
    },
    {
      question: t('home.faq.questions.cancellation.question'),
      answer: t('home.faq.questions.cancellation.answer')
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
        color: isDark ? '#ffffff' : '#1a1a1a',
        paddingBottom: '40px'
      }}
    >
      {/* Home Navigation Bar */}
      <HomeNavbar />
      
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '70vh',
            textAlign: 'center', 
            marginBottom: 8,
            paddingTop: '80px' // 네비게이션 바 높이만큼 패딩 추가
          }}>
            {/* Urgency Banner with Language Selector */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: 2, 
              marginBottom: 6,
              flexWrap: 'wrap'
            }}>
              <Chip
                label={heroData.urgencyBanner}
                sx={{
                  backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
                  color: isDark ? '#ffffff' : '#1a1a1a',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  height: '40px',
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning ? 'translateY(-10px)' : 'translateY(0)',
                  transition: 'all 0.3s ease-in-out'
                }}
              />
              
              {/* Language Selector */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
                borderRadius: '20px',
                padding: '4px',
                border: `1px solid ${isDark ? '#444444' : '#e0e0e0'}`,
                height: '40px'
              }}>
                <Button
                  onClick={() => handleLanguageChange('ko')}
                  disabled={isTransitioning}
                  sx={{
                    backgroundColor: language === 'ko' ? '#ff6b35' : 'transparent',
                    color: language === 'ko' ? '#ffffff' : (isDark ? '#cccccc' : '#666666'),
                    borderRadius: '16px',
                    padding: '6px 12px',
                    fontSize: '0.85rem',
                    fontWeight: language === 'ko' ? 600 : 400,
                    textTransform: 'none',
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: language === 'ko' ? '#e55a2b' : (isDark ? '#3a3a3a' : '#e8e8e8')
                    }
                  }}
                >
                  🇰🇷 한국어
                </Button>
                <Box sx={{ 
                  width: '1px', 
                  height: '20px', 
                  backgroundColor: isDark ? '#555555' : '#cccccc' 
                }} />
                <Button
                  onClick={() => handleLanguageChange('en')}
                  disabled={isTransitioning}
                  sx={{
                    backgroundColor: language === 'en' ? '#ff6b35' : 'transparent',
                    color: language === 'en' ? '#ffffff' : (isDark ? '#cccccc' : '#666666'),
                    borderRadius: '16px',
                    padding: '6px 12px',
                    fontSize: '0.85rem',
                    fontWeight: language === 'en' ? 600 : 400,
                    textTransform: 'none',
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: language === 'en' ? '#e55a2b' : (isDark ? '#3a3a3a' : '#e8e8e8')
                    }
                  }}
                >
                  🇺🇸 English
                </Button>
              </Box>
            </Box>

            {/* Main Headline */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                marginBottom: 3,
                fontSize: isMobile ? '2.5rem' : '3.5rem',
                lineHeight: 1.2,
                background: isDark 
                  ? 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)'
                  : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
                transition: 'all 0.3s ease-in-out'
              }}
            >
              {heroData.mainHeadline}
            </Typography>

            {/* Sub Headline */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 400,
                marginBottom: 3,
                color: isDark ? '#a0a0a0' : '#666666',
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
                transition: 'all 0.3s ease-in-out',
                transitionDelay: '0.1s'
              }}
            >
              {heroData.subHeadline}
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: isDark ? '#cccccc' : '#666666',
                maxWidth: '800px',
                margin: '0 auto 4rem auto',
                fontSize: '1.1rem',
                lineHeight: 1.6,
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
                transition: 'all 0.3s ease-in-out',
                transitionDelay: '0.2s'
              }}
            >
              {heroData.description}
            </Typography>

            {/* Rating */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
              transition: 'all 0.3s ease-in-out',
              transitionDelay: '0.3s'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: isDark ? '#cccccc' : '#666666', fontWeight: 500 }}>
                  {heroData.rating.count} {t('home.rating.text')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: '#ffd700', fontSize: '1.2rem' }} />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Features Section */}
        <Box sx={{ marginBottom: 8 }}>
          <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
            <Chip
              icon={<FolderIcon />}
              label="Features"
              sx={{
                backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
                color: isDark ? '#ffffff' : '#1a1a1a',
                marginBottom: 2
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                marginBottom: 2,
                fontSize: isMobile ? '2rem' : '2.5rem'
              }}
            >
              {t('home.features.title')}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow in timeout={1000 + index * 200}>
                  <Card
                    sx={{
                      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                      border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
                      borderRadius: '16px',
                      padding: 3,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: isDark 
                          ? '0 8px 30px rgba(255, 255, 255, 0.1)'
                          : '0 8px 30px rgba(0, 0, 0, 0.1)',
                        borderColor: '#ff6b35'
                      }
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ 
                        color: '#ff6b35', 
                        marginBottom: 2,
                        display: 'flex',
                        justifyContent: 'center'
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                fontWeight: 600,
                          marginBottom: 1,
                          color: isDark ? '#ffffff' : '#1a1a1a'
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDark ? '#cccccc' : '#666666',
                          lineHeight: 1.6
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Platform Features Section */}
        <Box sx={{ marginBottom: 8 }}>
          <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
            <Chip
              icon={<ScienceIcon />}
              label="Platform Features"
              sx={{
                backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
                color: isDark ? '#ffffff' : '#1a1a1a',
                marginBottom: 2
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                marginBottom: 2,
                fontSize: isMobile ? '2rem' : '2.5rem',
                color: isDark ? '#ffffff' : '#1a1a1a'
              }}
            >
              {t('home.platformFeatures.title')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: isDark ? '#cccccc' : '#666666',
                fontWeight: 400,
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              {t('home.platformFeatures.subtitle')}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                path: '/protein-simulation',
                data: {
                  icon: '🧬',
                  title: t('home.platformFeatures.proteinSimulation.title'),
                  description: t('home.platformFeatures.proteinSimulation.description'),
                  features: [
                    t('home.platformFeatures.proteinSimulation.features.0'),
                    t('home.platformFeatures.proteinSimulation.features.1'),
                    t('home.platformFeatures.proteinSimulation.features.2'),
                    t('home.platformFeatures.proteinSimulation.features.3')
                  ]
                }
              },
              {
                path: '/molecular-interaction',
                data: {
                  icon: '🔬',
                  title: t('home.platformFeatures.molecularInteraction.title'),
                  description: t('home.platformFeatures.molecularInteraction.description'),
                  features: [
                    t('home.platformFeatures.molecularInteraction.features.0'),
                    t('home.platformFeatures.molecularInteraction.features.1'),
                    t('home.platformFeatures.molecularInteraction.features.2'),
                    t('home.platformFeatures.molecularInteraction.features.3')
                  ]
                }
              },
              {
                path: '/diagnosis-ai',
                data: {
                  icon: '🤖',
                  title: t('home.platformFeatures.diagnosisAI.title'),
                  description: t('home.platformFeatures.diagnosisAI.description'),
                  features: [
                    t('home.platformFeatures.diagnosisAI.features.0'),
                    t('home.platformFeatures.diagnosisAI.features.1'),
                    t('home.platformFeatures.diagnosisAI.features.2'),
                    t('home.platformFeatures.diagnosisAI.features.3')
                  ]
                }
              },
              {
                path: '/drug-screening',
                data: {
                  icon: '💊',
                  title: t('home.platformFeatures.drugScreening.title'),
                  description: t('home.platformFeatures.drugScreening.description'),
                  features: [
                    t('home.platformFeatures.drugScreening.features.0'),
                    t('home.platformFeatures.drugScreening.features.1'),
                    t('home.platformFeatures.drugScreening.features.2'),
                    t('home.platformFeatures.drugScreening.features.3')
                  ]
                }
              },
              {
                path: '/epidemiology-model',
                data: {
                  icon: '📊',
                  title: t('home.platformFeatures.epidemiologyModel.title'),
                  description: t('home.platformFeatures.epidemiologyModel.description'),
                  features: [
                    t('home.platformFeatures.epidemiologyModel.features.0'),
                    t('home.platformFeatures.epidemiologyModel.features.1'),
                    t('home.platformFeatures.epidemiologyModel.features.2'),
                    t('home.platformFeatures.epidemiologyModel.features.3')
                  ]
                }
              }
            ].map((platform, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow in timeout={1200 + index * 200}>
                  <Card
                    onClick={() => {
                      if (currentUser) {
                        navigate(platform.path);
                      } else {
                        navigate('/login');
                      }
                    }}
                    sx={{
                      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                      border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
                      borderRadius: '20px',
                      padding: 3,
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: isDark 
                          ? '0 12px 40px rgba(255, 107, 53, 0.2)'
                          : '0 12px 40px rgba(255, 107, 53, 0.15)',
                        borderColor: '#ff6b35',
                        backgroundColor: isDark ? '#2a2a2a' : '#fafafa'
                      }
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      {/* Platform Icon */}
                      <Box sx={{ 
                        fontSize: '3rem',
                        marginBottom: 2,
                        display: 'flex',
                        justifyContent: 'center'
                      }}>
                        {platform.data.icon}
                      </Box>
                      
                      {/* Platform Title */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          marginBottom: 1,
                          color: isDark ? '#ffffff' : '#1a1a1a'
                        }}
                      >
                        {platform.data.title}
                      </Typography>
                      
                      {/* Platform Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDark ? '#cccccc' : '#666666',
                          lineHeight: 1.6,
                          marginBottom: 2
                        }}
                      >
                        {platform.data.description}
                      </Typography>
                      
                      {/* Features List */}
                      <Box sx={{ marginBottom: 2 }}>
                        {platform.data.features.map((feature: string, featureIndex: number) => (
                          <Chip
                            key={featureIndex}
                            label={feature}
                            size="small"
                            sx={{
                              backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
                              color: isDark ? '#ffffff' : '#1a1a1a',
                              margin: '2px',
                              fontSize: '0.75rem',
                              height: '24px'
                            }}
                          />
                        ))}
                      </Box>
                      
                      {/* Learn More Button */}
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: '#ff6b35',
                          color: '#ff6b35',
                          borderRadius: '20px',
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: '#ff6b35',
                            color: '#ffffff',
                            borderColor: '#ff6b35'
                          }
                        }}
                      >
                        {t('common.learnMore')}
                      </Button>
                    </Box>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Introduction Section */}
        <Box sx={{ marginBottom: 8 }}>
          <Paper
            sx={{
              backgroundColor: isDark ? '#1a1a1a' : '#fafafa',
              border: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
              borderRadius: '24px',
              padding: isMobile ? 3 : 6,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
              <Chip
                icon={<CheckCircleIcon />}
                label="Introduction"
                sx={{
                  backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
                  color: isDark ? '#ffffff' : '#1a1a1a',
                  marginBottom: 2
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  marginBottom: 2,
                  fontSize: isMobile ? '2rem' : '2.5rem'
                }}
              >
                {t('home.introduction.title')}
              </Typography>
            <Typography
                variant="h6"
              sx={{
                  color: isDark ? '#cccccc' : '#666666',
                  fontWeight: 400,
                  maxWidth: '600px',
                  margin: '0 auto'
                }}
              >
                {t('home.introduction.subtitle')}
            </Typography>
            </Box>

            <Grid container spacing={3}>
              {processSteps.map((step, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Grow in timeout={1200 + index * 200}>
                    <Card
                      sx={{
                        backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
                        border: `1px solid ${isDark ? '#444444' : '#e0e0e0'}`,
                        borderRadius: '16px',
                        padding: 3,
                        height: '100%',
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: isDark 
                            ? '0 8px 30px rgba(255, 255, 255, 0.1)'
                            : '0 8px 30px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                    >
                      <Box sx={{ 
                        color: '#ff6b35', 
                        marginBottom: 2,
                        display: 'flex',
                        justifyContent: 'center'
                      }}>
                        {step.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                          marginBottom: 2,
                          color: isDark ? '#ffffff' : '#1a1a1a'
                          }}
                        >
                        {step.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                          color: isDark ? '#cccccc' : '#666666',
                          lineHeight: 1.6
                          }}
                        >
                        {step.description}
                        </Typography>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ marginBottom: 6 }}>
          <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                marginBottom: 2,
                fontSize: isMobile ? '2rem' : '2.5rem',
                color: isDark ? '#ffffff' : '#1a1a1a'
              }}
            >
              {t('home.faq.title')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? '#cccccc' : '#666666',
                maxWidth: '600px',
                margin: '0 auto'
              }}
            >
              {t('home.faq.subtitle')}
            </Typography>
          </Box>

          <Paper
            sx={{
              backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
              border: `1px solid ${isDark ? '#444444' : '#e0e0e0'}`,
              borderRadius: '16px',
              padding: isMobile ? 2 : 4,
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleAccordionChange(`panel${index}`)}
                sx={{
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  border: 'none',
                  '&:before': { display: 'none' },
                  marginBottom: index < faqs.length - 1 ? 2 : 0
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: isDark ? '#ffffff' : '#1a1a1a' }} />}
                  sx={{
                    backgroundColor: isDark ? '#1a1a1a' : '#f8f8f8',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    '&.Mui-expanded': {
                      marginBottom: 1
                    }
            }}
          >
            <Typography
                    variant="h6"
              sx={{
                fontWeight: 600,
                      color: isDark ? '#ffffff' : '#1a1a1a',
                      fontSize: '1rem'
              }}
            >
                    {faq.question}
            </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: '16px 16px 24px 16px' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark ? '#cccccc' : '#666666',
                      lineHeight: 1.6
                    }}
                  >
                    {faq.answer}
                </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            textAlign: 'center',
            padding: 4,
            borderTop: `1px solid ${isDark ? '#333333' : '#e0e0e0'}`,
            marginTop: 6
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: isDark ? '#888888' : '#666666',
              fontSize: '0.8rem'
            }}
          >
            © 2025 BioLabs. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;