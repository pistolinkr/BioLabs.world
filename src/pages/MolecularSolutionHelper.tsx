import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  Paper,
  Divider
} from '@mui/material';
import {
  Help as HelpIcon,
  Science as ScienceIcon,
  Biotech as BiotechIcon,
  School as SchoolIcon,
  Lightbulb as LightbulbIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Book as BookIcon,
  Psychology as PsychologyIcon,
  LocalHospital as LocalHospitalIcon,
  Nature as EcoIcon
} from '@mui/icons-material';

const MolecularSolutionHelper: React.FC = () => {
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>('basic-concepts');

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const basicConcepts = [
    {
      term: '분자 (Molecule)',
      definition: '두 개 이상의 원자가 화학 결합으로 연결된 가장 작은 입자 단위입니다.',
      example: '물(H₂O), 산소(O₂), 포도당(C₆H₁₂O₆) 등',
      icon: <ScienceIcon />
    },
    {
      term: 'SMILES',
      definition: '분자의 구조를 텍스트로 표현하는 방법입니다. 원자와 결합을 문자와 기호로 나타냅니다.',
      example: '물은 H2O, 에탄올은 CCO로 표현됩니다.',
      icon: <BiotechIcon />
    },
    {
      term: '상호작용 (Interaction)',
      definition: '분자들이 서로 만나서 일어나는 반응이나 결합을 의미합니다.',
      example: '약물이 질병을 일으키는 단백질과 결합하여 치료 효과를 나타내는 것',
      icon: <PsychologyIcon />
    },
    {
      term: 'PubChem',
      definition: '미국 국립보건원에서 운영하는 화합물 정보 데이터베이스입니다.',
      example: '전 세계의 화학 물질 정보를 무료로 제공합니다.',
      icon: <BookIcon />
    },
    {
      term: 'KEGG',
      definition: '일본 교토 대학에서 운영하는 생화학 경로 및 유전체 데이터베이스입니다.',
      example: '생물체 내에서 일어나는 화학 반응 경로를 보여줍니다.',
      icon: <EcoIcon />
    }
  ];

  const howToUse = [
    {
      step: 1,
      title: '분자 검색',
      description: '관심 있는 분자의 이름, 화학식, 또는 SMILES 구조를 입력하세요.',
      tips: [
        '일반적인 이름으로 검색해보세요 (예: 아스피린, 카페인)',
        '화학식도 사용할 수 있습니다 (예: C9H8O4)',
        'PubChem ID나 KEGG ID로도 검색 가능합니다'
      ]
    },
    {
      step: 2,
      title: '분자 선택',
      description: '검색 결과에서 분석하고 싶은 분자들을 선택하세요.',
      tips: [
        '최소 2개 이상의 분자를 선택해야 상호작용 분석이 가능합니다',
        '관련성이 높은 분자들을 함께 선택하면 더 의미있는 결과를 얻을 수 있습니다',
        '분자 카드를 클릭하면 선택됩니다'
      ]
    },
    {
      step: 3,
      title: '상호작용 분석',
      description: '"상호작용 분석" 버튼을 클릭하여 선택된 분자들 간의 상호작용을 분석하세요.',
      tips: [
        '분석에는 몇 초에서 몇 분이 걸릴 수 있습니다',
        '분석 결과는 강도와 신뢰도로 표시됩니다',
        '각 상호작용의 메커니즘과 생물학적 의미를 확인할 수 있습니다'
      ]
    },
    {
      step: 4,
      title: '결과 해석',
      description: '분석 결과를 통해 분자들 간의 관계와 잠재적 응용 분야를 파악하세요.',
      tips: [
        '강도가 높을수록 강한 상호작용을 의미합니다',
        '신뢰도가 높을수록 더 확실한 결과입니다',
        '치료적 관련성 정보를 통해 의학적 응용 가능성을 확인하세요'
      ]
    }
  ];

  const applications = [
    {
      field: '의학 및 약물 개발',
      description: '새로운 약물의 작용 메커니즘을 이해하고 부작용을 예측합니다.',
      examples: ['항암제 개발', '항생제 연구', '부작용 예측'],
      icon: <LocalHospitalIcon />
    },
    {
      field: '생명과학 연구',
      description: '세포 내에서 일어나는 분자적 상호작용을 연구합니다.',
      examples: ['단백질 상호작용', '대사 경로 분석', '유전자 발현 조절'],
      icon: <BiotechIcon />
    },
    {
      field: '환경 과학',
      description: '환경 오염 물질의 생태계 영향과 분해 과정을 분석합니다.',
      examples: ['오염물질 분해', '생태독성 연구', '환경 정화'],
      icon: <EcoIcon />
    },
    {
      field: '식품 과학',
      description: '식품 성분의 상호작용과 영양소 흡수를 연구합니다.',
      examples: ['영양소 상호작용', '식품 안전성', '기능성 식품 개발'],
      icon: <ScienceIcon />
    }
  ];

  const faqs = [
    {
      question: 'SMILES 구조가 무엇인가요?',
      answer: 'SMILES(Simplified Molecular Input Line Entry System)는 분자의 구조를 텍스트로 표현하는 방법입니다. 예를 들어, 물은 H2O, 에탄올은 CCO로 표현됩니다. 이 시스템을 통해 복잡한 분자 구조를 간단한 텍스트로 나타낼 수 있습니다.'
    },
    {
      question: '분자 상호작용 분석 결과를 어떻게 해석하나요?',
      answer: '분석 결과에서 강도는 상호작용의 세기를, 신뢰도는 결과의 확실성을 나타냅니다. 강도가 높을수록 두 분자 간의 상호작용이 강하고, 신뢰도가 높을수록 더 확실한 결과입니다. 또한 메커니즘과 생물학적 중요성 정보를 통해 실제 응용 가능성을 파악할 수 있습니다.'
    },
    {
      question: 'PubChem과 KEGG의 차이점은 무엇인가요?',
      answer: 'PubChem은 주로 화합물의 물리화학적 특성과 구조 정보를 제공하며, KEGG는 생물학적 경로와 대사 과정에 대한 정보를 제공합니다. 두 데이터베이스를 함께 사용하면 분자의 구조적 특성과 생물학적 기능을 종합적으로 이해할 수 있습니다.'
    },
    {
      question: '분석 결과가 정확한가요?',
      answer: '이 시스템은 PubChem과 KEGG의 실제 데이터를 기반으로 하지만, 상호작용 분석은 예측적 성격을 가집니다. 실제 실험을 통한 검증이 필요하며, 연구나 의학적 결정에 사용하기 전에는 전문가와 상담하는 것이 좋습니다.'
    },
    {
      question: '어떤 종류의 분자를 검색할 수 있나요?',
      answer: '일반적인 화합물, 약물, 단백질, 대사물질 등 다양한 분자를 검색할 수 있습니다. 분자명, 화학식, SMILES 구조, PubChem ID, KEGG ID 등으로 검색 가능합니다.'
    }
  ];

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
          <HelpIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          분자 상호작용 분석 도우미
        </Typography>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body1">
            이 페이지는 분자 상호작용 분석 시스템을 처음 사용하는 분들을 위한 가이드입니다. 
            기본 개념부터 실제 사용법까지 단계별로 안내해드립니다.
          </Typography>
        </Alert>

        {/* 기본 개념 */}
        <Accordion 
          expanded={expandedAccordion === 'basic-concepts'} 
          onChange={handleAccordionChange('basic-concepts')}
          sx={{ mb: 2, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ color: 'var(--text-primary)' }}>
              <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              기본 개념 이해하기
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {basicConcepts.map((concept, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {concept.icon}
                        <Typography variant="h6" sx={{ color: 'var(--text-primary)', ml: 1 }}>
                          {concept.term}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                        {concept.definition}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                        예시: {concept.example}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* 사용 방법 */}
        <Accordion 
          expanded={expandedAccordion === 'how-to-use'} 
          onChange={handleAccordionChange('how-to-use')}
          sx={{ mb: 2, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ color: 'var(--text-primary)' }}>
              <LightbulbIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              단계별 사용 방법
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {howToUse.map((step, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          label={`${step.step}`} 
                          color="primary" 
                          sx={{ mr: 2, fontWeight: 'bold' }}
                        />
                        <Typography variant="h6" sx={{ color: 'var(--text-primary)' }}>
                          {step.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                        {step.description}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', mb: 1 }}>
                        💡 팁:
                      </Typography>
                      <List dense>
                        {step.tips.map((tip, tipIndex) => (
                          <ListItem key={tipIndex} sx={{ py: 0 }}>
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <CheckCircleIcon sx={{ fontSize: 16, color: 'var(--primary-main)' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={tip}
                              sx={{ 
                                '& .MuiListItemText-primary': { 
                                  fontSize: '0.875rem',
                                  color: 'var(--text-secondary)'
                                }
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* 응용 분야 */}
        <Accordion 
          expanded={expandedAccordion === 'applications'} 
          onChange={handleAccordionChange('applications')}
          sx={{ mb: 2, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ color: 'var(--text-primary)' }}>
              <ScienceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              응용 분야
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {applications.map((app, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {app.icon}
                        <Typography variant="h6" sx={{ color: 'var(--text-primary)', ml: 1 }}>
                          {app.field}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                        {app.description}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', mb: 1 }}>
                        주요 예시:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {app.examples.map((example, exampleIndex) => (
                          <Chip 
                            key={exampleIndex}
                            label={example} 
                            size="small" 
                            variant="outlined"
                            sx={{ color: 'var(--text-primary)' }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* 자주 묻는 질문 */}
        <Accordion 
          expanded={expandedAccordion === 'faq'} 
          onChange={handleAccordionChange('faq')}
          sx={{ mb: 2, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ color: 'var(--text-primary)' }}>
              <QuestionAnswerIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              자주 묻는 질문 (FAQ)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {faqs.map((faq, index) => (
                <Grid item xs={12} key={index}>
                  <Card sx={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 2 }}>
                        <InfoIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1.2rem' }} />
                        {faq.question}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                        {faq.answer}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* 추가 도움말 */}
        <Paper sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', p: 3 }}>
          <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 2 }}>
            <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            중요한 안내사항
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <InfoIcon sx={{ color: 'var(--primary-main)' }} />
              </ListItemIcon>
              <ListItemText 
                primary="이 시스템은 교육 및 연구 목적으로 제작되었습니다."
                sx={{ color: 'var(--text-secondary)' }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningIcon sx={{ color: 'var(--warning-main)' }} />
              </ListItemIcon>
              <ListItemText 
                primary="의학적 결정이나 상업적 목적으로 사용하기 전에는 반드시 전문가와 상담하세요."
                sx={{ color: 'var(--text-secondary)' }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: 'var(--success-main)' }} />
              </ListItemIcon>
              <ListItemText 
                primary="분석 결과는 참고용이며, 실제 실험을 통한 검증이 필요합니다."
                sx={{ color: 'var(--text-secondary)' }}
              />
            </ListItem>
          </List>
        </Paper>
      </Container>
    </Box>
  );
};

export default MolecularSolutionHelper;
