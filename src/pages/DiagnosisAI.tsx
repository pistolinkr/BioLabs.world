import React, { useState, useRef } from 'react';
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
  Paper,
  Tabs,
  Tab,
  IconButton,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Psychology as PsychologyIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  Timeline as TimelineIcon,
  Upload as UploadIcon,
  Image as ImageIcon,
  Description as DescriptionIcon,
  Send as SendIcon,
  Clear as ClearIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface DiagnosisResult {
  diagnosis: string;
  confidence: number;
  recommendations: string[];
  timestamp: string;
}

interface AnthropicContent {
  type: 'text' | 'image';
  text?: string;
  source?: {
    type: 'base64';
    media_type: string;
    data: string;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`diagnosis-tabpanel-${index}`}
      aria-labelledby={`diagnosis-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const DiagnosisAI: React.FC = () => {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const { isDark } = useTheme();
  
  // 탭 상태
  const [tabValue, setTabValue] = useState(0);
  
  // 공통 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  // 이미지 업로드 상태
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  // 증상 입력 상태
  const [symptoms, setSymptoms] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  
  // 파일 업로드 참조
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 드래그 앤 드롭 상태
  const [isDragOver, setIsDragOver] = useState(false);
  
  // 개발자 모드 상태
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [developerLogs, setDeveloperLogs] = useState<string[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
    setDiagnosisResult(null);
  };

  // 개발자 모드 진입 체크
  const checkDeveloperMode = () => {
    if (symptoms.toLowerCase().includes('developer mode') && 
        medicalHistory.toLowerCase().includes('developer mode')) {
      if (!isDeveloperMode) {
        setIsDeveloperMode(true);
        setDeveloperLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 개발자 모드 진입`]);
        setError('');
        setDiagnosisResult(null);
      }
    }
  };

  // 개발자 모드 해제 함수
  const exitDeveloperMode = () => {
    setIsDeveloperMode(false);
    setDeveloperLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 개발자 모드 해제`]);
    setError('');
    setDiagnosisResult(null);
    setSymptoms('');
    setMedicalHistory('');
  };

  // 증상이나 과거 병력이 변경될 때마다 개발자 모드 체크
  React.useEffect(() => {
    checkDeveloperMode(); // 모든 탭에서 개발자 모드 체크
  }, [symptoms, medicalHistory]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    processImageFiles(files);
  };

  const processImageFiles = (files: File[]) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB 제한
    );

    if (validFiles.length === 0) {
      setError('유효한 이미지 파일을 선택해주세요. (JPG, PNG, 최대 10MB)');
      return;
    }

    setUploadedImages(prev => [...prev, ...validFiles]);
    
    // 이미지 미리보기 URL 생성
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setError('');
  };

  // 드래그 앤 드롭 이벤트 핸들러들
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    processImageFiles(files);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    setUploadedImages([]);
    setImagePreviewUrls([]);
  };

  const getDiagnosisPrompt = (diagnosisType: string): string => {
    const basePrompt = `당신은 의학 전문가입니다. ${diagnosisType}를 수행해주세요.

환자 정보:
- 나이: ${patientAge || '미입력'}
- 성별: ${patientGender || '미입력'}
- 과거 병력: ${medicalHistory || '없음'}
- 증상: ${symptoms || '이미지 기반 진단'}

${diagnosisType === '일반 진단' ? '증상 기반 진단' : '이미지 기반 진단'}을 수행하여 다음 형식으로 응답해주세요:

## 진단 결과
[구체적인 진단명]

## 진단 확신도
[0-100%]

## 주요 발견사항
[이미지에서 발견된 주요 병변이나 증상 분석]

## 추가 검사 권장사항
[추가로 필요한 검사나 상세 분석]

## 치료 방향
[일반적인 치료 방향 제시]

## 주의사항
[환자가 주의해야 할 사항들]

의학적 조언이므로 정확하고 신중하게 응답해주세요.`;

    return basePrompt;
  };

  const callAIAPI = async (prompt: string, images?: File[]): Promise<string> => {
    try {
      // 개발자 모드일 때는 모의 응답 반환
      if (isDeveloperMode) {
        console.log('개발자 모드: 모의 응답 생성');
        return generateMockResponse(prompt, images);
      }

      // 이미지가 있는 경우 base64로 인코딩
      let content: AnthropicContent[] = [{ type: 'text', text: prompt }];
      
      if (images && images.length > 0) {
        for (const image of images) {
          const base64 = await fileToBase64(image);
          content.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: image.type,
              data: base64.split(',')[1] // base64 데이터 부분만 추출
            }
          });
        }
      }

      const response = await fetch('http://localhost:3001/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('AI API 호출 오류:', error);
      
      // API 오류 시에도 개발자 모드에서는 모의 응답 반환
      if (isDeveloperMode) {
        console.log('API 오류로 인한 모의 응답 생성');
        return generateMockResponse(prompt, images);
      }
      
      throw error;
    }
  };

  // 모의 응답 생성 함수
  const generateMockResponse = (prompt: string, images?: File[]): string => {
    const timestamp = new Date().toLocaleString('ko-KR');
    const imageInfo = images && images.length > 0 ? `이미지 ${images.length}개 분석 완료` : '이미지 없음';
    
    return `## 진단 결과
모의 진단 결과입니다 (${imageInfo})

## 진단 확신도
85%

## 추가 검사 권장사항
- 혈액 검사
- 추가 영상 검사
- 전문의 상담

## 참고사항
이것은 개발자 모드의 모의 응답입니다. 실제 진단을 위해서는 Anthropic API 크레딧을 충전하거나 다른 AI 서비스를 사용하세요.

생성 시간: ${timestamp}
프롬프트: ${prompt.substring(0, 100)}...`;
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const parseDiagnosisResult = (apiResponse: string): DiagnosisResult => {
    // API 응답을 파싱하여 구조화된 결과로 변환
    const lines = apiResponse.split('\n');
    let diagnosis = '';
    let confidence = 0;
    let recommendations: string[] = [];

    for (const line of lines) {
      if (line.includes('## 진단 결과') || line.includes('진단 결과')) {
        const nextLine = lines[lines.indexOf(line) + 1];
        if (nextLine && !nextLine.startsWith('##')) {
          diagnosis = nextLine.trim();
        }
      } else if (line.includes('## 진단 확신도') || line.includes('진단 확신도')) {
        const nextLine = lines[lines.indexOf(line) + 1];
        if (nextLine) {
          const match = nextLine.match(/(\d+)%/);
          if (match) confidence = parseInt(match[1]);
        }
      } else if (line.includes('## 추가 검사 권장사항') || line.includes('추가 검사 권장사항')) {
        let i = lines.indexOf(line) + 1;
        while (i < lines.length && !lines[i].startsWith('##')) {
          if (lines[i].trim() && !lines[i].startsWith('-')) {
            recommendations.push(lines[i].trim());
          }
          i++;
        }
      }
    }

    return {
      diagnosis: diagnosis || '진단 결과를 파싱할 수 없습니다.',
      confidence: confidence || 0,
      recommendations: recommendations.length > 0 ? recommendations : ['추가 검사가 필요할 수 있습니다.'],
      timestamp: new Date().toLocaleString('ko-KR')
    };
  };

  const handleDiagnosis = async () => {
    if (tabValue === 3 && !symptoms.trim()) {
      setError('증상을 입력해주세요.');
      return;
    }
    
    if (tabValue !== 3 && uploadedImages.length === 0) {
      setError('이미지를 업로드해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setDiagnosisResult(null);

    try {
      const diagnosisTypes = ['MRI 진단', 'CT 진단', '초음파 진단', '일반 진단'];
      const diagnosisType = diagnosisTypes[tabValue];
      
      const prompt = getDiagnosisPrompt(diagnosisType);
      const images = tabValue !== 3 ? uploadedImages : undefined;
      
      const apiResponse = await callAIAPI(prompt, images);
      const result = parseDiagnosisResult(apiResponse);
      
      setDiagnosisResult(result);
    } catch (error: any) {
      setError(`진단 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!diagnosisResult) return;
    
    const content = `
AI 진단 결과
==================
진단: ${diagnosisResult.diagnosis}
확신도: ${diagnosisResult.confidence}%
시간: ${diagnosisResult.timestamp}

추가 검사 권장사항:
${diagnosisResult.recommendations.map(rec => `- ${rec}`).join('\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI진단결과_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 개발자 모드 전용 함수들
  const testAIAPI = async () => {
    try {
              setDeveloperLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] AI API 테스트 시작`]);
      
      const testPrompt = "안녕하세요. 이것은 API 테스트입니다. 간단한 응답을 해주세요.";
              const response = await callAIAPI(testPrompt);
      
      setDeveloperLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] API 응답 성공: ${response.substring(0, 100)}...`]);
      setError('');
    } catch (error: any) {
      const errorMsg = `API 테스트 실패: ${error.message}`;
      setDeveloperLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${errorMsg}`]);
      setError(errorMsg);
    }
  };

  const testImageSystem = () => {
    setDeveloperLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 이미지 시스템 테스트`]);
    
    // 가상 이미지 파일 생성 테스트
    const testFile = new File(['test'], 'test.png', { type: 'image/png' });
    processImageFiles([testFile]);
    
    setDeveloperLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 가상 이미지 처리 완료`]);
    setError('');
  };

  const clearDeveloperLogs = () => {
    setDeveloperLogs([]);
  };

  const exportDeveloperLogs = () => {
    const content = developerLogs.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `developer_logs_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearForm = () => {
    setSymptoms('');
    setPatientAge('');
    setPatientGender('');
    setMedicalHistory('');
    setUploadedImages([]);
    setImagePreviewUrls([]);
    setError('');
    setDiagnosisResult(null);
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
{t('diagnosisAI.title')}
        </Typography>

        <Paper sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: '1px solid var(--border-primary)',
              '& .MuiTab-root': {
                color: 'var(--text-secondary)',
                '&.Mui-selected': {
                  color: 'var(--text-primary)'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--text-primary)'
              }
            }}
          >
            <Tab label={t('diagnosisAI.tabs.mri')} icon={<ImageIcon />} iconPosition="start" />
            <Tab label={t('diagnosisAI.tabs.ct')} icon={<ImageIcon />} iconPosition="start" />
            <Tab label={t('diagnosisAI.tabs.ultrasound')} icon={<ImageIcon />} iconPosition="start" />
            <Tab label={t('diagnosisAI.tabs.general')} icon={<DescriptionIcon />} iconPosition="start" />
          </Tabs>

          {/* MRI 진단 */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
{t('diagnosisAI.mri.title')}
      </Typography>

      <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
            <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--text-primary)' }}>
{t('diagnosisAI.mri.uploadTitle')}
              </Typography>

                <input
                      ref={fileInputRef}
                  type="file"
                      multiple
                      accept="image/*"
                  onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    
                    {/* 드래그 앤 드롭 영역 */}
                    <Box
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      sx={{
                        border: `2px dashed ${isDragOver ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                        borderRadius: '8px',
                        padding: '40px 20px',
                        textAlign: 'center',
                        backgroundColor: isDragOver ? 'var(--bg-tertiary)' : 'transparent',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        mb: 2,
                        '&:hover': {
                          borderColor: 'var(--accent-primary)',
                          backgroundColor: 'var(--bg-tertiary)'
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadIcon 
                        sx={{ 
                          fontSize: '48px', 
                          color: isDragOver ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          mb: 2 
                        }} 
                      />
                      <Typography variant="body1" sx={{ color: 'var(--text-primary)', mb: 1 }}>
                        {isDragOver ? '여기에 이미지를 놓으세요!' : '이미지를 드래그하여 놓거나 클릭하여 선택하세요'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                        JPG, PNG 파일 (최대 10MB)
                      </Typography>
                    </Box>
                    
                  <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                      onClick={() => fileInputRef.current?.click()}
                    fullWidth
                      sx={{ mb: 2, borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                  >
{t('diagnosisAI.upload.selectFile')}
                  </Button>
                    
                    {uploadedImages.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>
                            업로드된 이미지 ({uploadedImages.length}개)
                          </Typography>
                          <Button
                            size="small"
                            onClick={clearAllImages}
                            startIcon={<ClearIcon />}
                            sx={{ color: 'var(--text-secondary)' }}
                          >
                            모두 삭제
                          </Button>
              </Box>

                        <Grid container spacing={1}>
                          {imagePreviewUrls.map((url, index) => (
                            <Grid item xs={6} sm={4} key={index}>
                              <Box sx={{ position: 'relative' }}>
                                <img
                                  src={url}
                                  alt={`MRI ${index + 1}`}
                                  style={{
                                    width: '100%',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-primary)'
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => removeImage(index)}
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                                  }}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--text-primary)' }}>
{t('diagnosisAI.patientInfo.title')}
                    </Typography>
                    
                    <TextField
                      fullWidth
                      label={t('diagnosisAI.patientInfo.age')}
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      margin="dense"
                      sx={{ mb: 2 }}
                      InputProps={{
                        style: { color: 'var(--text-primary)' }
                      }}
                      InputLabelProps={{
                        style: { color: 'var(--text-secondary)' }
                      }}
                    />
                    
                    <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                      <InputLabel sx={{ color: 'var(--text-secondary)' }}>{t('diagnosisAI.patientInfo.gender')}</InputLabel>
                <Select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value)}
                        sx={{ color: 'var(--text-primary)' }}
                      >
                        <MenuItem value="남성">남성</MenuItem>
                        <MenuItem value="여성">여성</MenuItem>
                </Select>
              </FormControl>

                    <TextField
                fullWidth
                      multiline
                      rows={3}
                      label={t('diagnosisAI.patientInfo.medicalHistory')}
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                      margin="dense"
                sx={{ mb: 2 }}
                      InputProps={{
                        style: { color: 'var(--text-primary)' }
                      }}
                      InputLabelProps={{
                        style: { color: 'var(--text-secondary)' }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* CT 진단 */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
              CT 이미지 업로드 및 진단
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--text-primary)' }}>
                      CT 이미지 업로드
                    </Typography>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    
                    {/* 드래그 앤 드롭 영역 */}
                    <Box
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      sx={{
                        border: `2px dashed ${isDragOver ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                        borderRadius: '8px',
                        padding: '40px 20px',
                        textAlign: 'center',
                        backgroundColor: isDragOver ? 'var(--bg-tertiary)' : 'transparent',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        mb: 2,
                        '&:hover': {
                          borderColor: 'var(--accent-primary)',
                          backgroundColor: 'var(--bg-tertiary)'
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadIcon 
                        sx={{ 
                          fontSize: '48px', 
                          color: isDragOver ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          mb: 2 
                        }} 
                      />
                      <Typography variant="body1" sx={{ color: 'var(--text-primary)', mb: 1 }}>
                        {isDragOver ? '여기에 이미지를 놓으세요!' : '이미지를 드래그하여 놓거나 클릭하여 선택하세요'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                        JPG, PNG 파일 (최대 10MB)
                      </Typography>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      onClick={() => fileInputRef.current?.click()}
                      fullWidth
                      sx={{ mb: 2, borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                    >
{t('diagnosisAI.upload.selectFile')}
              </Button>

                    {uploadedImages.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>
                            업로드된 이미지 ({uploadedImages.length}개)
                  </Typography>
                          <Button
                            size="small"
                            onClick={clearAllImages}
                            startIcon={<ClearIcon />}
                            sx={{ color: 'var(--text-secondary)' }}
                          >
                            모두 삭제
                          </Button>
                        </Box>
                        
                        <Grid container spacing={1}>
                          {imagePreviewUrls.map((url, index) => (
                            <Grid item xs={6} sm={4} key={index}>
                              <Box sx={{ position: 'relative' }}>
                                <img
                                  src={url}
                                  alt={`CT ${index + 1}`}
                                  style={{
                                    width: '100%',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-primary)'
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => removeImage(index)}
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                                  }}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
              <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--text-primary)' }}>
{t('diagnosisAI.patientInfo.title')}
                </Typography>

                    <TextField
                      fullWidth
                      label={t('diagnosisAI.patientInfo.age')}
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      margin="dense"
                      sx={{ mb: 2 }}
                      InputProps={{
                        style: { color: 'var(--text-primary)' }
                      }}
                      InputLabelProps={{
                        style: { color: 'var(--text-secondary)' }
                      }}
                    />
                    
                    <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                      <InputLabel sx={{ color: 'var(--text-secondary)' }}>{t('diagnosisAI.patientInfo.gender')}</InputLabel>
                      <Select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value)}
                        sx={{ color: 'var(--text-primary)' }}
                      >
                        <MenuItem value="남성">남성</MenuItem>
                        <MenuItem value="여성">여성</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label={t('diagnosisAI.patientInfo.medicalHistory')}
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                      margin="dense"
                      sx={{ mb: 2 }}
                      InputProps={{
                        style: { color: 'var(--text-primary)' }
                      }}
                      InputLabelProps={{
                        style: { color: 'var(--text-secondary)' }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* 초음파 진단 */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
              초음파 이미지 업로드 및 진단
                      </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--text-primary)' }}>
                      초음파 이미지 업로드
                    </Typography>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    
                    {/* 드래그 앤 드롭 영역 */}
                    <Box
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      sx={{
                        border: `2px dashed ${isDragOver ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                        borderRadius: '8px',
                        padding: '40px 20px',
                        textAlign: 'center',
                        backgroundColor: isDragOver ? 'var(--bg-tertiary)' : 'transparent',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        mb: 2,
                        '&:hover': {
                          borderColor: 'var(--accent-primary)',
                          backgroundColor: 'var(--bg-tertiary)'
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadIcon 
                        sx={{ 
                          fontSize: '48px', 
                          color: isDragOver ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          mb: 2 
                        }} 
                      />
                      <Typography variant="body1" sx={{ color: 'var(--text-primary)', mb: 1 }}>
                        {isDragOver ? '여기에 이미지를 놓으세요!' : '이미지를 드래그하여 놓거나 클릭하여 선택하세요'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                        JPG, PNG 파일 (최대 10MB)
                      </Typography>
                  </Box>

                    <Button
                      variant="outlined"
                      startIcon={<UploadIcon />}
                      onClick={() => fileInputRef.current?.click()}
                      fullWidth
                      sx={{ mb: 2, borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                    >
{t('diagnosisAI.upload.selectFile')}
                    </Button>
                    
                    {uploadedImages.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>
                            업로드된 이미지 ({uploadedImages.length}개)
                  </Typography>
                          <Button
                        size="small"
                            onClick={clearAllImages}
                            startIcon={<ClearIcon />}
                            sx={{ color: 'var(--text-secondary)' }}
                          >
                            모두 삭제
                          </Button>
                        </Box>
                        
                        <Grid container spacing={1}>
                          {imagePreviewUrls.map((url, index) => (
                            <Grid item xs={6} sm={4} key={index}>
                              <Box sx={{ position: 'relative' }}>
                                <img
                                  src={url}
                                  alt={`초음파 ${index + 1}`}
                                  style={{
                                    width: '100%',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-primary)'
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => removeImage(index)}
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                                  }}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                  </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--text-primary)' }}>
{t('diagnosisAI.patientInfo.title')}
                  </Typography>
                    
                    <TextField
                      fullWidth
                      label={t('diagnosisAI.patientInfo.age')}
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      margin="dense"
                      sx={{ mb: 2 }}
                      InputProps={{
                        style: { color: 'var(--text-primary)' }
                      }}
                      InputLabelProps={{
                        style: { color: 'var(--text-secondary)' }
                      }}
                    />
                    
                    <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                      <InputLabel sx={{ color: 'var(--text-secondary)' }}>{t('diagnosisAI.patientInfo.gender')}</InputLabel>
                      <Select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value)}
                        sx={{ color: 'var(--text-primary)' }}
                      >
                        <MenuItem value="남성">남성</MenuItem>
                        <MenuItem value="여성">여성</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label={t('diagnosisAI.patientInfo.medicalHistory')}
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                      margin="dense"
                      sx={{ mb: 2 }}
                      InputProps={{
                        style: { color: 'var(--text-primary)' }
                      }}
                      InputLabelProps={{
                        style: { color: 'var(--text-secondary)' }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* 일반 진단 */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
              증상 기반 일반 진단
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--text-primary)' }}>
                      증상 및 환자 정보 입력
                    </Typography>
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="증상을 자세히 설명해주세요"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      sx={{ mb: 2 }}
                      InputProps={{
                        style: { color: 'var(--text-primary)' }
                      }}
                      InputLabelProps={{
                        style: { color: 'var(--text-secondary)' }
                      }}
                    />
                    
                    <TextField
                      fullWidth
                      label={t('diagnosisAI.patientInfo.age')}
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      margin="dense"
                      sx={{ mb: 2 }}
                      InputProps={{
                        style: { color: 'var(--text-primary)' }
                      }}
                      InputLabelProps={{
                        style: { color: 'var(--text-secondary)' }
                      }}
                    />
                    
                    <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                      <InputLabel sx={{ color: 'var(--text-secondary)' }}>{t('diagnosisAI.patientInfo.gender')}</InputLabel>
                      <Select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value)}
                        sx={{ color: 'var(--text-primary)' }}
                      >
                        <MenuItem value="남성">남성</MenuItem>
                        <MenuItem value="여성">여성</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label={t('diagnosisAI.patientInfo.medicalHistory')}
                      value={medicalHistory}
                      onChange={(e) => setMedicalHistory(e.target.value)}
                      margin="dense"
                      sx={{ mb: 2 }}
                      InputProps={{
                        style: { color: 'var(--text-primary)' }
                      }}
                      InputLabelProps={{
                        style: { color: 'var(--text-secondary)' }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* 개발자 모드 패널 */}
              {isDeveloperMode && (
                <Grid item xs={12}>
                  <Card sx={{ 
                    backgroundColor: 'var(--bg-secondary)', 
                    border: '2px solid var(--accent-primary)',
                    position: 'relative'
                  }}>
                    <CardContent>
                                            <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Typography variant="h6" sx={{ 
                          color: 'var(--accent-primary)', 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: 1
                        }}>
                          🛠️ 개발자 모드
                      <Chip
                            label="ACTIVE" 
                            color="success" 
                        size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </Typography>
                        
                        <Button
                          variant="contained"
                          onClick={exitDeveloperMode}
                          size="small"
                          sx={{
                            backgroundColor: 'var(--error-color)',
                            color: 'var(--bg-primary)',
                            '&:hover': {
                              backgroundColor: 'var(--error-color)',
                              opacity: 0.8
                            }
                          }}
                        >
                          개발자 모드 해제
                        </Button>
                  </Box>
                      
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            variant="outlined"
                            onClick={testAIAPI}
                            fullWidth
                            sx={{ 
                              borderColor: 'var(--accent-primary)', 
                              color: 'var(--accent-primary)',
                              mb: 1
                            }}
                          >
                            API 테스트
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            variant="outlined"
                            onClick={testImageSystem}
                            fullWidth
                            sx={{ 
                              borderColor: 'var(--accent-primary)', 
                              color: 'var(--accent-primary)',
                              mb: 1
                            }}
                          >
                            이미지 시스템 테스트
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            variant="outlined"
                            onClick={clearDeveloperLogs}
                            fullWidth
                            sx={{ 
                              borderColor: 'var(--accent-primary)', 
                              color: 'var(--accent-primary)',
                              mb: 1
                            }}
                          >
                            로그 초기화
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            variant="outlined"
                            onClick={exportDeveloperLogs}
                            fullWidth
                            sx={{ 
                              borderColor: 'var(--accent-primary)', 
                              color: 'var(--accent-primary)',
                              mb: 1
                            }}
                          >
                            로그 내보내기
                          </Button>
                        </Grid>
                      </Grid>

                      {/* 개발자 로그 */}
                      <Typography variant="subtitle2" gutterBottom sx={{ color: 'var(--text-primary)', mb: 1 }}>
                        시스템 로그:
                      </Typography>
                      <Box sx={{ 
                        backgroundColor: 'var(--bg-primary)', 
                        border: '1px solid var(--border-primary)',
                        borderRadius: '4px',
                        padding: '12px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem'
                      }}>
                        {developerLogs.length > 0 ? (
                          developerLogs.map((log, index) => (
                            <div key={index} style={{ 
                              color: 'var(--text-secondary)', 
                              marginBottom: '4px',
                              wordBreak: 'break-word'
                            }}>
                              {log}
                            </div>
                          ))
                        ) : (
                          <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            로그가 없습니다. 테스트를 실행해보세요.
                          </div>
                        )}
                </Box>


              </CardContent>
            </Card>
                </Grid>
          )}
        </Grid>
          </TabPanel>

          {/* 진단 실행 버튼 */}
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={handleDiagnosis}
              disabled={loading || (tabValue === 3 ? !symptoms.trim() : uploadedImages.length === 0)}
              startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              size="large"
              sx={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--bg-primary)',
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'var(--accent-primary)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  backgroundColor: 'var(--border-primary)',
                  color: 'var(--text-muted)'
                }
              }}
            >
{loading ? t('diagnosisAI.analysis.loading') : t('diagnosisAI.analysis.start')}
            </Button>
            
            <Button
              variant="outlined"
              onClick={clearForm}
              startIcon={<ClearIcon />}
              size="large"
              sx={{
                ml: 2,
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
                px: 4,
                py: 1.5
              }}
            >
{t('common.reset')}
            </Button>
          </Box>

          {/* 오류 메시지 */}
          {error && (
            <Fade in={true}>
              <Alert severity="error" sx={{ mx: 3, mb: 3 }}>
                {error}
              </Alert>
            </Fade>
          )}

          {/* 진단 결과 */}
          {diagnosisResult && (
            <Fade in={true}>
              <Box sx={{ p: 3 }}>
                <Card sx={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
            <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: 'var(--text-primary)' }}>
{t('diagnosisAI.results.title')}
              </Typography>
                      <Box>
                          <Chip
                          label={`확신도: ${diagnosisResult.confidence}%`}
                          color={diagnosisResult.confidence > 70 ? 'success' : diagnosisResult.confidence > 40 ? 'warning' : 'error'}
                          sx={{ mr: 1 }}
                        />
                        <Button
                            size="small"
                          startIcon={<DownloadIcon />}
                          onClick={downloadResult}
                          sx={{ color: 'var(--text-secondary)' }}
                        >
                          결과 다운로드
                        </Button>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2, borderColor: 'var(--border-primary)' }} />
                    
                    <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 2 }}>
                      진단: {diagnosisResult.diagnosis}
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'var(--text-primary)', mb: 1 }}>
                      추가 검사 권장사항:
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {diagnosisResult.recommendations.map((rec, index) => (
                        <Chip
                          key={index}
                          label={rec}
                          variant="outlined"
                          sx={{ mr: 1, mb: 1, borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                        />
                      ))}
                    </Box>
                    
                    <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                      진단 시간: {diagnosisResult.timestamp}
                    </Typography>
            </CardContent>
          </Card>
              </Box>
            </Fade>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default DiagnosisAI;
