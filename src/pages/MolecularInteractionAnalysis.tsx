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
  NetworkCheck as NetworkCheckIcon,
  AutoAwesome as AIIcon,
  History as HistoryIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
  Tune as TuneIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
  Lightbulb as LightbulbIcon
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
  
  // 혁신적인 검색 기능 상태
  const [searchMode, setSearchMode] = useState<'name' | 'smiles' | 'inchi' | 'cas' | 'ai'>('name');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [molecularWeightRange, setMolecularWeightRange] = useState<[number, number]>([0, 1000]);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);

  // 컴포넌트 마운트 시 데이터베이스 정보 로드
  useEffect(() => {
    setDatabases(molecularApiService.getDatabases());
    // 검색 히스토리 로드
    const savedHistory = localStorage.getItem('molecularSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
    // 즐겨찾기 로드
    const savedFavorites = localStorage.getItem('molecularFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // AI 기반 검색 제안
  useEffect(() => {
    if (searchQuery.length > 2 && searchMode === 'ai') {
      generateAISuggestions(searchQuery);
    }
  }, [searchQuery, searchMode]);

  // 실시간 검색 제안
  useEffect(() => {
    if (searchQuery.length > 1) {
      generateSearchSuggestions(searchQuery);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);

  // AI 검색 제안 생성
  const generateAISuggestions = async (query: string) => {
    try {
      // 실제 AI API 호출 대신 시뮬레이션
      const mockSuggestions = [
        `${query} derivative compounds`,
        `${query} related structures`,
        `${query} biological targets`,
        `${query} therapeutic applications`
      ];
      setAISuggestions(mockSuggestions);
      setShowAISuggestions(true);
    } catch (error) {
      console.error('AI suggestions error:', error);
    }
  };

  // 검색 제안 생성
  const generateSearchSuggestions = async (query: string) => {
    try {
      // 실제 API 호출 대신 시뮬레이션
      const mockSuggestions = [
        `${query} compound`,
        `${query} molecule`,
        `${query} drug`,
        `${query} protein`,
        `${query} enzyme`
      ];
      setSearchSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Search suggestions error:', error);
    }
  };

  // 검색 히스토리에 추가
  const addToHistory = (query: string) => {
    const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('molecularSearchHistory', JSON.stringify(newHistory));
  };

  // 즐겨찾기에 추가/제거
  const toggleFavorite = (query: string) => {
    const newFavorites = favorites.includes(query)
      ? favorites.filter(item => item !== query)
      : [...favorites, query];
    setFavorites(newFavorites);
    localStorage.setItem('molecularFavorites', JSON.stringify(newFavorites));
  };

  // 탭 변경 핸들러
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // 혁신적인 분자 검색
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 검색 히스토리에 추가
      addToHistory(searchQuery);
      
      // 검색 모드에 따른 다른 검색 로직
      let results;
      switch (searchMode) {
        case 'ai':
          results = await molecularApiService.searchMoleculesWithAI(searchQuery);
          break;
        case 'smiles':
          results = await molecularApiService.searchBySMILES(searchQuery);
          break;
        case 'inchi':
          results = await molecularApiService.searchByInChI(searchQuery);
          break;
        case 'cas':
          results = await molecularApiService.searchByCAS(searchQuery);
          break;
        default:
          results = await molecularApiService.searchMolecules(searchQuery);
      }
      
      setSearchResults(results);
      setShowAISuggestions(false);
      
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

  // 빠른 검색 (제안 클릭 시)
  const handleQuickSearch = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch();
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
            <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--border-radius-large)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
                  <BiotechIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
{t('molecularInteractionAnalysis.searchEngine.title')}
                </Typography>
                
                {/* 혁신적인 검색 모드 선택 */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                    검색 모드:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {[
                      { key: 'name', label: '이름', icon: <SearchIcon /> },
                      { key: 'smiles', label: 'SMILES', icon: <ScienceIcon /> },
                      { key: 'inchi', label: 'InChI', icon: <BiotechIcon /> },
                      { key: 'cas', label: 'CAS 번호', icon: <AssessmentIcon /> },
                      { key: 'ai', label: 'AI 추천', icon: <AIIcon /> }
                    ].map((mode) => (
                      <Chip
                        key={mode.key}
                        icon={mode.icon}
                        label={mode.label}
                        variant={searchMode === mode.key ? 'filled' : 'outlined'}
                        color={searchMode === mode.key ? 'primary' : 'default'}
                        sx={{
                          ...(searchMode === mode.key && {
                            backgroundColor: '#ff6b35',
                            color: '#ffffff',
                            '&:hover': {
                              backgroundColor: '#e55a2b'
                            }
                          }),
                          cursor: 'pointer'
                        }}
                        onClick={() => setSearchMode(mode.key as any)}
                      />
                    ))}
                  </Box>
                </Box>

                {/* 혁신적인 검색 입력 */}
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} md={8}>
                    <Box sx={{ position: 'relative' }}>
                    <TextField
                      fullWidth
                        label={
                          searchMode === 'ai' ? 'AI가 추천하는 분자를 검색하세요' :
                          searchMode === 'smiles' ? 'SMILES 구조를 입력하세요 (예: CCO)' :
                          searchMode === 'inchi' ? 'InChI 코드를 입력하세요' :
                          searchMode === 'cas' ? 'CAS 등록번호를 입력하세요' :
                          t('molecularInteractionAnalysis.searchEngine.placeholder')
                        }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      disabled={loading}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'var(--text-primary)',
                          '& fieldset': {
                              borderColor: searchMode === 'ai' ? '#ff6b35' : 'var(--border-primary)',
                          },
                          '&:hover fieldset': {
                              borderColor: '#ff6b35',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#ff6b35',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--text-secondary)',
                        },
                      }}
                    />
                      
                      {/* AI 아이콘 표시 */}
                      {searchMode === 'ai' && (
                        <Box sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                          <AIIcon sx={{ color: '#ff6b35', fontSize: 20 }} />
                        </Box>
                      )}
                    </Box>

                    {/* 실시간 검색 제안 */}
                    {searchSuggestions.length > 0 && (
                      <Paper sx={{ 
                        position: 'absolute', 
                        top: '100%', 
                        left: 0, 
                        right: 0, 
                        zIndex: 1000, 
                        mt: 1,
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--border-radius-medium)'
                      }}>
                        {searchSuggestions.map((suggestion, index) => (
                          <Box
                            key={index}
                            sx={{ 
                              p: 2, 
                              cursor: 'pointer', 
                              '&:hover': { backgroundColor: 'var(--bg-secondary)' },
                              borderBottom: index < searchSuggestions.length - 1 ? '1px solid var(--border-primary)' : 'none'
                            }}
                            onClick={() => handleQuickSearch(suggestion)}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <SearchIcon sx={{ fontSize: 16, color: 'var(--text-secondary)' }} />
                              <Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>
                                {suggestion}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Paper>
                    )}

                    {/* AI 검색 제안 */}
                    {showAISuggestions && aiSuggestions.length > 0 && (
                      <Paper sx={{ 
                        position: 'absolute', 
                        top: '100%', 
                        left: 0, 
                        right: 0, 
                        zIndex: 1000, 
                        mt: 1,
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid #ff6b35',
                        borderRadius: 'var(--border-radius-medium)'
                      }}>
                        <Box sx={{ p: 1, backgroundColor: 'rgba(255, 107, 53, 0.1)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AIIcon sx={{ fontSize: 16, color: '#ff6b35' }} />
                            <Typography variant="caption" sx={{ color: '#ff6b35', fontWeight: 600 }}>
                              AI 추천 검색어
                            </Typography>
                          </Box>
                        </Box>
                        {aiSuggestions.map((suggestion, index) => (
                          <Box
                            key={index}
                            sx={{ 
                              p: 2, 
                              cursor: 'pointer', 
                              '&:hover': { backgroundColor: 'var(--bg-secondary)' },
                              borderBottom: index < aiSuggestions.length - 1 ? '1px solid var(--border-primary)' : 'none'
                            }}
                            onClick={() => handleQuickSearch(suggestion)}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LightbulbIcon sx={{ fontSize: 16, color: '#ff6b35' }} />
                              <Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>
                                {suggestion}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Paper>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="contained"
                      onClick={handleSearch}
                      disabled={loading || !searchQuery.trim()}
                      fullWidth
                      startIcon={loading ? <CircularProgress size={20} /> : 
                        searchMode === 'ai' ? <AIIcon /> : <SearchIcon />}
                      sx={{ 
                        height: 56,
                        backgroundColor: '#ff6b35',
                        '&:hover': {
                          backgroundColor: '#e55a2b'
                        }
                      }}
                    >
                      {loading ? '검색 중...' : 
                        searchMode === 'ai' ? 'AI 검색' : '검색'}
                    </Button>
                  </Grid>
                </Grid>

                {/* 검색 히스토리 및 즐겨찾기 */}
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {searchHistory.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HistoryIcon sx={{ fontSize: 16, color: 'var(--text-secondary)' }} />
                      <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                        최근 검색:
                      </Typography>
                      {searchHistory.slice(0, 3).map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          size="small"
                          variant="outlined"
                          onClick={() => handleQuickSearch(item)}
                          sx={{ cursor: 'pointer', fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  )}
                  
                  {favorites.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon sx={{ fontSize: 16, color: '#ff6b35' }} />
                      <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                        즐겨찾기:
                      </Typography>
                      {favorites.slice(0, 2).map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          size="small"
                          variant="outlined"
                          onClick={() => handleQuickSearch(item)}
                          sx={{ cursor: 'pointer', fontSize: '0.7rem', borderColor: '#ff6b35' }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>

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
            <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--border-radius-large)' }}>
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
                  sx={{ 
                    mt: 2,
                    backgroundColor: '#ff6b35',
                    '&:hover': {
                      backgroundColor: '#e55a2b'
                    }
                  }}
                >
{analyzing ? t('molecularInteractionAnalysis.analysis.loading') : t('molecularInteractionAnalysis.input.button')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 검색 결과 */}
        {searchResults && searchResults.molecules.length > 0 && (
          <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', mb: 3, borderRadius: 'var(--border-radius-large)' }}>
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
                        position: 'relative',
                        '&:hover': {
                          borderColor: '#ff6b35',
                          transform: 'none',
                          transition: 'all 0.2s ease-in-out'
                        }
                      }}
                      onClick={() => handleMoleculeSelect(molecule)}
                    >
                      {/* 즐겨찾기 버튼 */}
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(molecule.name);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 1,
                          color: favorites.includes(molecule.name) ? '#ff6b35' : 'var(--text-secondary)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 107, 53, 0.1)'
                          }
                        }}
                      >
                        <StarIcon sx={{ fontSize: 16 }} />
                      </IconButton>

                      <CardContent>
                        <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 1, pr: 3 }}>
                          {molecule.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                          {molecule.molecularFormula}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                          MW: {molecule.molecularWeight} g/mol
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {molecule.pubchemId && (
                          <Chip 
                            label={`PubChem: ${molecule.pubchemId}`} 
                            size="small" 
                              sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                        {molecule.keggId && (
                          <Chip 
                            label={`KEGG: ${molecule.keggId}`} 
                            size="small" 
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                        
                        {/* AI 추천 태그 */}
                        {searchMode === 'ai' && (
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              icon={<AIIcon sx={{ fontSize: 12 }} />}
                              label="AI 추천"
                              size="small"
                              sx={{ 
                                fontSize: '0.7rem',
                                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                                color: '#ff6b35',
                                border: '1px solid #ff6b35'
                              }}
                            />
                          </Box>
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
            <Paper sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', mb: 3, borderRadius: 'var(--border-radius-large)' }}>
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
                <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--border-radius-large)' }}>
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
