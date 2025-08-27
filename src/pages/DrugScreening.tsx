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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Slider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';

interface DrugCandidate {
  id: string;
  name: string;
  smiles: string;
  bindingAffinity: number;
  toxicity: 'low' | 'medium' | 'high';
  bioavailability: number;
  molecularWeight: number;
  logP: number;
  status: 'screening' | 'testing' | 'approved';
}

const DrugScreening: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterToxicity, setFilterToxicity] = useState('all');
  const [minAffinity, setMinAffinity] = useState(-10);
  const [isScreening, setIsScreening] = useState(false);
  const [screeningProgress, setScreeningProgress] = useState(0);

  const mockDrugCandidates: DrugCandidate[] = [
    {
      id: '1',
      name: '퀴나크린',
      smiles: 'CC1=CC=C(C=C1)NC(=O)C2=CC=C(C=C2)Cl',
      bindingAffinity: -8.5,
      toxicity: 'medium',
      bioavailability: 0.75,
      molecularWeight: 399.8,
      logP: 3.2,
      status: 'testing'
    },
    {
      id: '2',
      name: '펜토산 폴리설페이트',
      smiles: 'C(C1C(C(C(C(O1)OS(=O)(=O)O)OS(=O)(=O)O)OS(=O)(=O)O)OS(=O)(=O)O)O',
      bindingAffinity: -7.8,
      toxicity: 'low',
      bioavailability: 0.45,
      molecularWeight: 1500.0,
      logP: -2.1,
      status: 'screening'
    },
    {
      id: '3',
      name: '덱스트란 설페이트',
      smiles: 'C(C1C(C(C(C(O1)OS(=O)(=O)O)OS(=O)(=O)O)OS(=O)(=O)O)OS(=O)(=O)O)O',
      bindingAffinity: -6.9,
      toxicity: 'low',
      bioavailability: 0.38,
      molecularWeight: 8000.0,
      logP: -3.5,
      status: 'screening'
    }
  ];

  const handleScreening = () => {
    setIsScreening(true);
    setScreeningProgress(0);

    const interval = setInterval(() => {
      setScreeningProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScreening(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const getToxicityColor = (toxicity: string) => {
    switch (toxicity) {
      case 'low':
        return '#ffffff';
      case 'medium':
        return '#ffffff';
      case 'high':
        return '#ffffff';
      default:
        return '#ffffff';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'screening':
        return '#ffffff';
      case 'testing':
        return '#ffffff';
      case 'approved':
        return '#ffffff';
      default:
        return '#ffffff';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 4, color: '#ffffff' }}>
        가상 약물 스크리닝
      </Typography>

      <Grid container spacing={3}>
        {/* 검색 및 필터 */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: '#000000', border: '1px solid #ffffff', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
                약물 발견 및 스크리닝
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="화합물 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                      '& .MuiInputLabel-root': { color: '#b0b0b0' },
                      '& .MuiInputBase-input': { color: '#ffffff' },
                      '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#ffffff' },
        '&:hover fieldset': { borderColor: '#ffffff' },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#b0b0b0' }}>독성 필터</InputLabel>
                    <Select
                      value={filterToxicity}
                      onChange={(e) => setFilterToxicity(e.target.value)}
                      sx={{ color: '#ffffff' }}
                    >
                      <MenuItem value="all">모든 독성 수준</MenuItem>
                      <MenuItem value="low">낮은 독성</MenuItem>
                      <MenuItem value="medium">중간 독성</MenuItem>
                      <MenuItem value="high">높은 독성</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleScreening}
                    disabled={isScreening}
                    fullWidth
                    sx={{ height: '56px' }}
                  >
                    {isScreening ? '스크리닝 중...' : '스크리닝 시작'}
                  </Button>
                </Grid>
              </Grid>

              {isScreening && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" sx={{ color: '#ffffff', mb: 1 }}>
                    가상 스크리닝 진행 중... {screeningProgress.toFixed(1)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={screeningProgress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#ffffff',
                      },
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* 약물 후보 목록 */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: '#000000', border: '1px solid #ffffff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
                약물 후보
              </Typography>

              <TableContainer component={Paper} sx={{ backgroundColor: '#000000' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                                              <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>이름</TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>결합 친화도 (kcal/mol)</TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>독성</TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>생체이용률</TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>분자량 (Da)</TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>LogP</TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>상태</TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>작업</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockDrugCandidates.map((drug) => (
                      <TableRow key={drug.id}>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                              {drug.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#ffffff' }}>
                              {drug.smiles}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>
                          {drug.bindingAffinity}
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>
                          <Chip
                            label={drug.toxicity === 'low' ? '낮음' : 
                                  drug.toxicity === 'medium' ? '중간' : '높음'}
                            size="small"
                            sx={{
                              backgroundColor: getToxicityColor(drug.toxicity),
                              color: '#ffffff'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>
                          {(drug.bioavailability * 100).toFixed(1)}%
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>
                          {drug.molecularWeight.toFixed(1)}
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>
                          {drug.logP.toFixed(1)}
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>
                          <Chip
                            label={drug.status === 'screening' ? '스크리닝' : 
                                  drug.status === 'testing' ? '테스트' : '승인됨'}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(drug.status),
                              color: '#ffffff'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#ffffff', borderColor: '#ffffff' }}>
                          <Button size="small" variant="outlined" sx={{ mr: 1 }}>
                            보기
                          </Button>
                          <Button size="small" variant="outlined">
                            선택
                          </Button>
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

export default DrugScreening;
