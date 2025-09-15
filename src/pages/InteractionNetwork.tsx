import React, { useState } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  FormControlLabel,
  Checkbox,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Science as ScienceIcon,
  Biotech as BiotechIcon,
  Assessment as AssessmentIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';
import { searchMolecules, getMoleculeDetails, generateNetworkData, analyzeNetwork } from '../services/networkService';
import { SearchResult, Molecule, NetworkAnalysis } from '../types/network';

const InteractionNetwork: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedMolecules, setSelectedMolecules] = useState<Molecule[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedDatabases, setSelectedDatabases] = useState(['pubchem', 'kegg']);
  const [analysis, setAnalysis] = useState<NetworkAnalysis | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearchError(null);
    
    try {
      const results = await searchMolecules(searchQuery, selectedDatabases);
      setSearchResults(results);
      
      if (results.length === 0) {
        setSearchError('검색 결과가 없습니다. 다른 검색어를 시도해보세요.');
      }
    } catch (error) {
      setSearchError('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoleculeToggle = async (result: SearchResult) => {
    const isSelected = selectedMolecules.some(mol => mol.id === result.id);
    
    if (isSelected) {
      setSelectedMolecules(prev => prev.filter(mol => mol.id !== result.id));
    } else {
      try {
        const moleculeDetails = await getMoleculeDetails(result.id);
        if (moleculeDetails) {
          setSelectedMolecules(prev => [...prev, moleculeDetails]);
        } else {
          const basicMolecule: Molecule = {
            id: result.id,
            name: result.name,
            type: result.type,
            pubchemId: result.pubchemId,
            smiles: result.smiles,
            molecularWeight: result.molecularWeight,
            formula: result.formula,
            description: result.description
          };
          setSelectedMolecules(prev => [...prev, basicMolecule]);
        }
      } catch (error) {
        const basicMolecule: Molecule = {
          id: result.id,
          name: result.name,
          type: result.type,
          pubchemId: result.pubchemId,
          smiles: result.smiles,
          molecularWeight: result.molecularWeight,
          formula: result.formula,
          description: result.description
        };
        setSelectedMolecules(prev => [...prev, basicMolecule]);
      }
    }
  };

  const handleAnalysis = async () => {
    if (selectedMolecules.length === 0) return;
    
    setLoading(true);
    
    try {
      const network = generateNetworkData(selectedMolecules);
      const analysisResult = await analyzeNetwork(network);
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('분석 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', paddingTop: '80px', paddingBottom: '40px' }}>
      <Container maxWidth="xl">
        <Typography variant="h3" gutterBottom sx={{ mb: 4, color: 'var(--text-primary)' }}>
          <ScienceIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          분자 간 상호작용 분석
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
                  <BiotechIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  통합 분자 검색 엔진
                </Typography>
                
                <TextField
                  fullWidth
                  label="분자명, SMILES, 분자식, 또는 PubChem ID 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  sx={{ mb: 2 }}
                  InputProps={{ style: { color: 'var(--text-primary)' } }}
                  InputLabelProps={{ style: { color: 'var(--text-secondary)' } }}
                />
                
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={loading || !searchQuery.trim()}
                  startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                  fullWidth
                  sx={{ mb: 3 }}
                >
                  {loading ? '검색 중...' : '검색'}
                </Button>

                <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', mb: 2 }}>
                  검색 대상 데이터베이스:
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={<Checkbox checked={selectedDatabases.includes('pubchem')} onChange={() => setSelectedDatabases(prev => prev.includes('pubchem') ? prev.filter(db => db !== 'pubchem') : [...prev, 'pubchem'])} sx={{ color: 'var(--primary-main)' }} />}
                    label="PubChem"
                    sx={{ color: 'var(--text-primary)' }}
                  />
                  <FormControlLabel
                    control={<Checkbox checked={selectedDatabases.includes('kegg')} onChange={() => setSelectedDatabases(prev => prev.includes('kegg') ? prev.filter(db => db !== 'kegg') : [...prev, 'kegg'])} sx={{ color: 'var(--primary-main)' }} />}
                    label="KEGG"
                    sx={{ color: 'var(--text-primary)' }}
                  />
                </Box>

                {searchError && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    {searchError}
                  </Alert>
                )}

                {searchResults.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', mb: 2 }}>
                      검색 결과 ({searchResults.length})
                    </Typography>
                    <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                      {searchResults.map((result) => (
                        <ListItem key={result.id} sx={{ border: '1px solid var(--border-primary)', borderRadius: 1, mb: 1, backgroundColor: 'var(--bg-primary)' }}>
                          <ListItemText
                            primary={result.name}
                            secondary={
                              <Box>
                                <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                                  {result.description}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                  <Chip label={result.source.toUpperCase()} size="small" sx={{ mr: 1, fontSize: '0.7rem' }} />
                                  <Chip label={result.type} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                </Box>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleMoleculeToggle(result)} sx={{ color: 'var(--primary-main)' }}>
                              {selectedMolecules.some(mol => mol.id === result.id) ? <RemoveIcon /> : <AddIcon />}
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
                  <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  선택된 분자 ({selectedMolecules.length})
                </Typography>

                {selectedMolecules.length === 0 ? (
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)', textAlign: 'center', py: 4 }}>
                    검색 결과에서 분자를 선택하세요
                  </Typography>
                ) : (
                  <Box>
                    <List>
                      {selectedMolecules.map((molecule) => (
                        <ListItem key={molecule.id} sx={{ border: '1px solid var(--border-primary)', borderRadius: 1, mb: 1, backgroundColor: 'var(--bg-primary)' }}>
                          <ListItemText
                            primary={molecule.name}
                            secondary={
                              <Box>
                                <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                                  {molecule.description}
                                </Typography>
                                {molecule.formula && (
                                  <Typography variant="caption" sx={{ color: 'var(--text-secondary)', display: 'block' }}>
                                    Formula: {molecule.formula}
                                  </Typography>
                                )}
                                {molecule.molecularWeight && (
                                  <Typography variant="caption" sx={{ color: 'var(--text-secondary)', display: 'block' }}>
                                    MW: {molecule.molecularWeight}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleMoleculeToggle({ id: molecule.id, name: molecule.name, type: molecule.type as any, source: 'pubchem' as any })} sx={{ color: 'var(--error-main)' }}>
                              <RemoveIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>

                    <Button
                      variant="contained"
                      onClick={handleAnalysis}
                      disabled={loading || selectedMolecules.length === 0}
                      startIcon={loading ? <CircularProgress size={20} /> : <AssessmentIcon />}
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      {loading ? '분석 중...' : '상호작용 분석'}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {analysis && (
          <Box sx={{ mt: 4 }}>
            <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)', mb: 3 }}>
                  <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  네트워크 분석 결과
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'var(--text-secondary)' }}>노드 수</Typography>
                    <Typography variant="h4" sx={{ color: 'var(--text-primary)' }}>{analysis.nodeCount}</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'var(--text-secondary)' }}>엣지 수</Typography>
                    <Typography variant="h4" sx={{ color: 'var(--text-primary)' }}>{analysis.edgeCount}</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'var(--text-secondary)' }}>네트워크 밀도</Typography>
                    <Typography variant="h4" sx={{ color: 'var(--text-primary)' }}>{analysis.density}</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'var(--text-secondary)' }}>평균 연결도</Typography>
                    <Typography variant="h4" sx={{ color: 'var(--text-primary)' }}>{analysis.averageDegree}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default InteractionNetwork;
