import React, { useState, useEffect } from 'react';
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
  Autocomplete,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Search as SearchIcon,
  Science as ScienceIcon,
  Biotech as BiotechIcon,
  Assessment as AssessmentIcon,
  PlayArrow as PlayIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Storage as DatabaseIcon,
  Link as LinkIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  NetworkCheck as NetworkCheckIcon
} from '@mui/icons-material';

import SMILESVisualizer from '../components/SMILESVisualizer';
import { molecularApiService } from '../services/molecularApiService';
import { Molecule, SearchResult, MolecularInteraction, DatabaseInfo } from '../types/molecularInteraction';

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
      id={`molecular-tabpanel-${index}`}
      aria-labelledby={`molecular-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const MolecularInteractionAnalysis: React.FC = () => {
  const { t } = useLanguage();
  
  // 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [selectedMolecules, setSelectedMolecules] = useState<Molecule[]>([]);
  const [interactions, setInteractions] = useState<MolecularInteraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedInteraction, setSelectedInteraction] = useState<MolecularInteraction | null>(null);
  const [showInteractionDetails, setShowInteractionDetails] = useState(false);
  const [databases, setDatabases] = useState<DatabaseInfo[]>([]);

  // 컴포넌트 마운트 시 데이터베이스 정보 로드
  useEffect(() => {
    setDatabases(molecularApiService.getDatabases());
  }, []);

  // 탭 변경 핸들러
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // 분자 검색
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await molecularApiService.searchMolecules(searchQuery);
      setSearchResults(results);
      
      if (results.molecules.length === 0) {
        setError('검색 결과가 없습니다. 다른 검색어를 시도해보세요.');
      }
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 분자 선택
  const handleMoleculeSelect = (molecule: Molecule) => {
    if (!selectedMolecules.find(m => m.id === molecule.id)) {
      setSelectedMolecules(prev => [...prev, molecule]);
    }
  };

  // 분자 제거
  const handleMoleculeRemove = (moleculeId: string) => {
    setSelectedMolecules(prev => prev.filter(m => m.id !== moleculeId));
  };

  // 상호작용 분석
  const handleAnalyzeInteractions = async () => {
    if (selectedMolecules.length < 2) {
      setError('최소 2개 이상의 분자를 선택해주세요.');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const interactionResults = await molecularApiService.analyzeInteractions(selectedMolecules);
      setInteractions(interactionResults);
      setActiveTab(1); // 분석 결과 탭으로 이동
    } catch (err) {
      setError('상호작용 분석 중 오류가 발생했습니다.');
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  // 상호작용 상세 정보 표시
  const handleInteractionClick = (interaction: MolecularInteraction) => {
    setSelectedInteraction(interaction);
    setShowInteractionDetails(true);
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
      <Container maxWidth="xl">
        <Typography variant="h3" gutterBottom sx={{ mb: 4, color: 'var(--text-primary)' }}>
          <ScienceIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
{t('molecularInteractionAnalysis.title')}
        </Typography>

        {/* 검색 섹션 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
                  <BiotechIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
{t('molecularInteractionAnalysis.searchEngine.title')}
                </Typography>
                
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label={t('molecularInteractionAnalysis.searchEngine.placeholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      disabled={loading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'var(--text-primary)',
                          '& fieldset': {
                            borderColor: 'var(--border-primary)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--primary-main)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--text-secondary)',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="contained"
                      onClick={handleSearch}
                      disabled={loading || !searchQuery.trim()}
                      fullWidth
                      startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                      sx={{ height: 56 }}
                    >
                      {loading ? '검색 중...' : '검색'}
                    </Button>
                  </Grid>
                </Grid>

                {/* 데이터베이스 정보 */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
{t('molecularInteractionAnalysis.searchEngine.databases')}:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {databases.map((db) => (
                      <Chip
                        key={db.name}
                        icon={<DatabaseIcon />}
                        label={db.name}
                        variant="outlined"
                        size="small"
                        sx={{ color: 'var(--text-primary)' }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* 에러 메시지 */}
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* 선택된 분자들 */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 2 }}>
{t('molecularInteractionAnalysis.selectedMolecules.title')} ({selectedMolecules.length})
                </Typography>
                
                {selectedMolecules.length === 0 ? (
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
{t('molecularInteractionAnalysis.selectedMolecules.instructions')}
                  </Typography>
                ) : (
                  <List dense>
                    {selectedMolecules.map((molecule) => (
                      <ListItem
                        key={molecule.id}
                        sx={{ 
                          border: '1px solid var(--border-primary)', 
                          borderRadius: 1, 
                          mb: 1,
                          backgroundColor: 'var(--bg-primary)'
                        }}
                      >
                        <ListItemIcon>
                          <ScienceIcon sx={{ color: 'var(--primary-main)' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={molecule.name}
                          secondary={`${molecule.molecularFormula} (MW: ${molecule.molecularWeight})`}
                          sx={{ color: 'var(--text-primary)' }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleMoleculeRemove(molecule.id)}
                          sx={{ color: 'var(--text-secondary)' }}
                        >
                          ×
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                )}

                <Button
                  variant="contained"
                  onClick={handleAnalyzeInteractions}
                  disabled={analyzing || selectedMolecules.length < 2}
                  fullWidth
                  startIcon={analyzing ? <CircularProgress size={20} /> : <AssessmentIcon />}
                  sx={{ mt: 2 }}
                >
{analyzing ? t('molecularInteractionAnalysis.analysis.loading') : t('molecularInteractionAnalysis.input.button')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 검색 결과 */}
        {searchResults && searchResults.molecules.length > 0 && (
          <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 2 }}>
                검색 결과 ({searchResults.totalCount}개, {searchResults.searchTime}ms)
              </Typography>
              
              <Grid container spacing={2}>
                {searchResults.molecules.map((molecule) => (
                  <Grid item xs={12} md={6} lg={4} key={molecule.id}>
                    <Card 
                      sx={{ 
                        backgroundColor: 'var(--bg-primary)', 
                        border: '1px solid var(--border-primary)',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'var(--primary-main)',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out'
                        }
                      }}
                      onClick={() => handleMoleculeSelect(molecule)}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 1 }}>
                          {molecule.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                          {molecule.molecularFormula}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                          MW: {molecule.molecularWeight} g/mol
                        </Typography>
                        {molecule.pubchemId && (
                          <Chip 
                            label={`PubChem: ${molecule.pubchemId}`} 
                            size="small" 
                            sx={{ ml: 1, fontSize: '0.7rem' }}
                          />
                        )}
                        {molecule.keggId && (
                          <Chip 
                            label={`KEGG: ${molecule.keggId}`} 
                            size="small" 
                            sx={{ ml: 1, fontSize: '0.7rem' }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* 메인 콘텐츠 */}
        {selectedMolecules.length > 0 && (
          <Box>
            {/* 탭 네비게이션 */}
            <Paper sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="molecular analysis tabs"
                sx={{
                  '& .MuiTab-root': {
                    color: 'var(--text-secondary)',
                    '&.Mui-selected': {
                      color: 'var(--primary-main)',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'var(--primary-main)',
                  },
                }}
              >
                <Tab label="분자 구조" icon={<ScienceIcon />} iconPosition="start" />
                <Tab label="상호작용 분석" icon={<NetworkCheckIcon />} iconPosition="start" />
                <Tab label="상호작용 테이블" icon={<BarChartIcon />} iconPosition="start" />
              </Tabs>
            </Paper>

            {/* 탭 콘텐츠 */}
            <TabPanel value={activeTab} index={0}>
              <Grid container spacing={3}>
                {selectedMolecules.map((molecule) => (
                  <Grid item xs={12} md={6} key={molecule.id}>
                    <SMILESVisualizer
                      smiles={molecule.smiles}
                      moleculeName={molecule.name}
                      height={400}
                    />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {interactions.length > 0 ? (
                <Grid container spacing={3}>
                  {interactions.map((interaction) => (
                    <Grid item xs={12} md={6} key={interaction.id}>
                      <Card 
                        sx={{ 
                          backgroundColor: 'var(--bg-secondary)', 
                          border: '1px solid var(--border-primary)',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: 'var(--primary-main)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.2s ease-in-out'
                          }
                        }}
                        onClick={() => handleInteractionClick(interaction)}
                      >
                        <CardContent>
                          <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 2 }}>
                            {interaction.sourceMolecule.name} ↔ {interaction.targetMolecule.name}
                          </Typography>
                          
                          <Box sx={{ mb: 2 }}>
                            <Chip 
                              label={interaction.interactionType} 
                              color="primary" 
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={`강도: ${(interaction.strength * 100).toFixed(1)}%`} 
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={`신뢰도: ${(interaction.confidence * 100).toFixed(1)}%`} 
                              size="small"
                            />
                          </Box>
                          
                          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                            {interaction.mechanism}
                          </Typography>
                          
                          <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                            클릭하여 상세 정보 보기
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <AssessmentIcon sx={{ fontSize: 64, color: 'var(--text-secondary)', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                    상호작용 분석을 실행하세요
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>
                    선택된 분자들 간의 상호작용을 분석하려면 "상호작용 분석" 버튼을 클릭하세요
                  </Typography>
                </Box>
              )}
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              {interactions.length > 0 ? (
                <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 2 }}>
                      상호작용 상세 테이블
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ color: 'var(--text-primary)' }}>분자 A</TableCell>
                            <TableCell sx={{ color: 'var(--text-primary)' }}>분자 B</TableCell>
                            <TableCell sx={{ color: 'var(--text-primary)' }}>상호작용 유형</TableCell>
                            <TableCell sx={{ color: 'var(--text-primary)' }}>강도</TableCell>
                            <TableCell sx={{ color: 'var(--text-primary)' }}>신뢰도</TableCell>
                            <TableCell sx={{ color: 'var(--text-primary)' }}>작업</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {interactions.map((interaction) => (
                            <TableRow key={interaction.id}>
                              <TableCell sx={{ color: 'var(--text-primary)' }}>
                                {interaction.sourceMolecule.name}
                              </TableCell>
                              <TableCell sx={{ color: 'var(--text-primary)' }}>
                                {interaction.targetMolecule.name}
                              </TableCell>
                              <TableCell sx={{ color: 'var(--text-primary)' }}>
                                <Chip 
                                  label={interaction.interactionType} 
                                  size="small" 
                                  color="primary"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell sx={{ color: 'var(--text-primary)' }}>
                                {(interaction.strength * 100).toFixed(1)}%
                              </TableCell>
                              <TableCell sx={{ color: 'var(--text-primary)' }}>
                                {(interaction.confidence * 100).toFixed(1)}%
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => handleInteractionClick(interaction)}
                                  sx={{ color: 'var(--primary-main)' }}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <BarChartIcon sx={{ fontSize: 64, color: 'var(--text-secondary)', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                    분석 결과가 없습니다
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>
                    상호작용 분석을 먼저 실행해주세요
                  </Typography>
                </Box>
              )}
            </TabPanel>
          </Box>
        )}

        {/* 상호작용 상세 정보 모달 */}
        <Dialog
          open={showInteractionDetails}
          onClose={() => setShowInteractionDetails(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ color: 'var(--text-primary)' }}>
            상호작용 상세 정보
          </DialogTitle>
          <DialogContent>
            {selectedInteraction && (
              <Box>
                <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 2 }}>
                  {selectedInteraction.sourceMolecule.name} ↔ {selectedInteraction.targetMolecule.name}
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                      상호작용 유형
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)' }}>
                      {selectedInteraction.interactionType}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                      강도
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)' }}>
                      {(selectedInteraction.strength * 100).toFixed(1)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                      신뢰도
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)' }}>
                      {(selectedInteraction.confidence * 100).toFixed(1)}%
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 1 }}>
                  메커니즘
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                  {selectedInteraction.mechanism}
                </Typography>
                
                <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 1 }}>
                  생물학적 중요성
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                  {selectedInteraction.biologicalSignificance}
                </Typography>
                
                <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 1 }}>
                  치료적 관련성
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                  {selectedInteraction.therapeuticRelevance}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowInteractionDetails(false)}>
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MolecularInteractionAnalysis;
