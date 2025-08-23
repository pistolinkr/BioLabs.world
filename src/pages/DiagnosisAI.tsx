import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Upload as UploadIcon,
  PlayArrow as PlayIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface DiagnosisResult {
  id: string;
  patientId: string;
  date: string;
  imageType: string;
  result: 'normal' | 'suspicious' | 'positive';
  confidence: number;
  symptoms: string[];
  recommendations: string[];
}

const DiagnosisAI: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageType, setImageType] = useState('mri');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  const mockDiagnosisHistory: DiagnosisResult[] = [
    {
      id: '1',
      patientId: 'P-001',
      date: '2024-08-22',
      imageType: 'MRI',
      result: 'suspicious',
      confidence: 78.5,
      symptoms: ['치매 증상', '운동실조'],
      recommendations: ['추가 검사 필요', '신경과 상담 권장']
    },
    {
      id: '2',
      patientId: 'P-002',
      date: '2024-08-21',
      imageType: 'CT',
      result: 'normal',
      confidence: 95.2,
      symptoms: ['두통'],
      recommendations: ['정기 검진 권장']
    },
    {
      id: '3',
      patientId: 'P-003',
      date: '2024-08-20',
      imageType: 'MRI',
      result: 'positive',
      confidence: 89.7,
      symptoms: ['치매 증상', '시각 장애', '근육 경련'],
      recommendations: ['즉시 입원 치료', '가족 상담 필요']
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleAnalysis = () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // 시뮬레이션된 분석 진행
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          
          // 가상의 진단 결과 생성
          const mockResult: DiagnosisResult = {
            id: Date.now().toString(),
            patientId: `P-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0],
            imageType: imageType.toUpperCase(),
            result: Math.random() > 0.7 ? 'positive' : Math.random() > 0.4 ? 'suspicious' : 'normal',
            confidence: Math.floor(Math.random() * 30 + 70),
            symptoms: getRandomSymptoms(),
            recommendations: getRandomRecommendations()
          };
          
          setDiagnosisResult(mockResult);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);
  };

  const getRandomSymptoms = () => {
    const allSymptoms = [
      '치매 증상', '운동실조', '시각 장애', '근육 경련', '언어 장애',
      '기억력 저하', '집중력 저하', '행동 변화', '수면 장애'
    ];
    const count = Math.floor(Math.random() * 3) + 1;
    return allSymptoms.sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const getRandomRecommendations = () => {
    const allRecommendations = [
      '추가 검사 필요', '신경과 상담 권장', '정기 검진 권장',
      '즉시 입원 치료', '가족 상담 필요', '약물 치료 고려'
    ];
    const count = Math.floor(Math.random() * 2) + 1;
    return allRecommendations.sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'normal':
        return '#4caf50';
      case 'suspicious':
        return '#ff9800';
      case 'positive':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'normal':
        return <CheckCircleIcon />;
      case 'suspicious':
        return <WarningIcon />;
      case 'positive':
        return <ErrorIcon />;
      default:
        return <CheckCircleIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 4, color: '#ffffff' }}>
        AI Diagnosis System
      </Typography>

      <Grid container spacing={3}>
        {/* 이미지 업로드 및 분석 */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #333333', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
                Image Upload & Analysis
              </Typography>

              <Box sx={{ mb: 3 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    sx={{ mb: 2 }}
                    fullWidth
                  >
                    {selectedImage ? selectedImage.name : 'Upload Medical Image'}
                  </Button>
                </label>

                {selectedImage && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    이미지가 성공적으로 업로드되었습니다: {selectedImage.name}
                  </Alert>
                )}
              </Box>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: '#b0b0b0' }}>Image Type</InputLabel>
                <Select
                  value={imageType}
                  onChange={(e) => setImageType(e.target.value)}
                  sx={{ color: '#ffffff' }}
                >
                  <MenuItem value="mri">MRI (뇌자기공명영상)</MenuItem>
                  <MenuItem value="ct">CT (컴퓨터단층촬영)</MenuItem>
                  <MenuItem value="eeg">EEG (뇌파검사)</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={handleAnalysis}
                disabled={!selectedImage || isAnalyzing}
                fullWidth
                sx={{ mb: 2 }}
              >
                {isAnalyzing ? 'Analyzing...' : 'Start AI Analysis'}
              </Button>

              {isAnalyzing && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#ffffff', mb: 1 }}>
                    AI 분석 진행 중... {analysisProgress.toFixed(1)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={analysisProgress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#333333',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#00bcd4',
                      },
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* 진단 결과 */}
          {diagnosisResult && (
            <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
                  Diagnosis Result
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      backgroundColor: getResultColor(diagnosisResult.result), 
                      mr: 2 
                    }}>
                      {getResultIcon(diagnosisResult.result)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#ffffff' }}>
                        {diagnosisResult.result.toUpperCase()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                        Confidence: {diagnosisResult.confidence}%
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ backgroundColor: '#333333', my: 2 }} />

                  <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                    Detected Symptoms:
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {diagnosisResult.symptoms.map((symptom, index) => (
                      <Chip
                        key={index}
                        label={symptom}
                        size="small"
                        sx={{ mr: 1, mb: 1, backgroundColor: '#333333', color: '#ffffff' }}
                      />
                    ))}
                  </Box>

                  <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                    Recommendations:
                  </Typography>
                  <Box>
                    {diagnosisResult.recommendations.map((rec, index) => (
                      <Chip
                        key={index}
                        label={rec}
                        size="small"
                        sx={{ mr: 1, mb: 1, backgroundColor: '#00bcd4', color: '#ffffff' }}
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* 진단 히스토리 */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
                Diagnosis History
              </Typography>

              <TableContainer component={Paper} sx={{ backgroundColor: '#1a1a1a' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#ffffff', borderColor: '#333333' }}>Patient ID</TableCell>
                      <TableCell sx={{ color: '#ffffff', borderColor: '#333333' }}>Date</TableCell>
                      <TableCell sx={{ color: '#ffffff', borderColor: '#333333' }}>Type</TableCell>
                      <TableCell sx={{ color: '#ffffff', borderColor: '#333333' }}>Result</TableCell>
                      <TableCell sx={{ color: '#ffffff', borderColor: '#333333' }}>Confidence</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockDiagnosisHistory.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#333333' }}>
                          {row.patientId}
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#333333' }}>
                          {row.date}
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#333333' }}>
                          {row.imageType}
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#333333' }}>
                          <Chip
                            label={row.result}
                            size="small"
                            sx={{
                              backgroundColor: getResultColor(row.result),
                              color: '#ffffff'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#333333' }}>
                          {row.confidence}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DiagnosisAI;
