import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Autocomplete,
  Alert
} from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import SearchIcon from '@mui/icons-material/Search';
import Molecule3DViewer from '../components/Molecule3DViewer';
import { Molecule } from '../types/network';

const sampleMolecules: Molecule[] = [
  {
    id: 'aspirin',
    name: 'Aspirin',
    smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
    formula: 'C9H8O4',
    molecularWeight: 180.16,
    type: 'compound',
    description: 'Acetylsalicylic acid, pain reliever and anti-inflammatory drug'
  },
  {
    id: 'caffeine',
    name: 'Caffeine',
    smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
    formula: 'C8H10N4O2',
    molecularWeight: 194.19,
    type: 'compound',
    description: 'Stimulant found in coffee and tea'
  },
  {
    id: 'glucose',
    name: 'Glucose',
    smiles: 'C([C@@H]1[C@H]([C@@H](C(O1)O)O)O)O',
    formula: 'C6H12O6',
    molecularWeight: 180.16,
    type: 'compound',
    description: 'Simple sugar, primary energy source'
  },
  {
    id: 'ethanol',
    name: 'Ethanol',
    smiles: 'CCO',
    formula: 'C2H6O',
    molecularWeight: 46.07,
    type: 'compound',
    description: 'Alcohol found in alcoholic beverages'
  }
];

const MoleculeViewer: React.FC = () => {
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | undefined>(undefined);
  const [customSmiles, setCustomSmiles] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleMoleculeSelect = (molecule: Molecule | null) => {
    setSelectedMolecule(molecule || undefined);
    setCustomSmiles('');
    setError('');
  };

  const handleCustomSmiles = () => {
    if (!customSmiles.trim()) {
      setError('SMILES 문자열을 입력하세요');
      return;
    }
    
    // 간단한 SMILES 유효성 검사
    if (!/^[A-Za-z0-9()[\]{}@+\-*/=#$%\\]+$/.test(customSmiles)) {
      setError('유효하지 않은 SMILES 형식입니다');
      return;
    }

    setSelectedMolecule({
      id: 'custom',
      name: 'Custom Molecule',
      smiles: customSmiles,
      formula: 'Custom',
      molecularWeight: 0,
      type: 'compound',
      description: '사용자 정의 분자'
    });
    setError('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ScienceIcon sx={{ mr: 2, fontSize: 40, color: 'var(--primary-main)' }} />
          <Typography variant="h4" color="var(--text-primary)">
            3D 분자 뷰어
          </Typography>
        </Box>
        <Typography variant="body1" color="var(--text-secondary)">
          분자 구조를 3D로 시각화하고 인터랙티브하게 탐색하세요
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 왼쪽 패널 - 분자 선택 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: 'var(--bg-secondary)' }}>
            <Typography variant="h6" color="var(--text-primary)" gutterBottom>
              분자 선택
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="var(--text-secondary)" gutterBottom>
                샘플 분자
              </Typography>
              <Autocomplete
                options={sampleMolecules}
                getOptionLabel={(option) => option.name}
                value={selectedMolecule}
                onChange={(_, value) => handleMoleculeSelect(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="분자 선택"
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'var(--text-primary)',
                        '& fieldset': {
                          borderColor: 'var(--border-color)',
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
                )}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" color="var(--text-secondary)" gutterBottom>
                커스텀 SMILES
              </Typography>
              <TextField
                fullWidth
                label="SMILES 문자열 입력"
                variant="outlined"
                size="small"
                value={customSmiles}
                onChange={(e) => setCustomSmiles(e.target.value)}
                placeholder="예: CCO (에탄올)"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: 'var(--text-primary)',
                    '& fieldset': {
                      borderColor: 'var(--border-color)',
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
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleCustomSmiles}
                fullWidth
                sx={{
                  backgroundColor: 'var(--primary-main)',
                  '&:hover': {
                    backgroundColor: 'var(--primary-dark)',
                  },
                }}
              >
                분자 보기
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* 오른쪽 패널 - 3D 뷰어 */}
        <Grid item xs={12} md={8}>
          {selectedMolecule ? (
            <Molecule3DViewer
              smiles={selectedMolecule.smiles || ''}
              width={600}
              height={500}
              title={selectedMolecule.name}
            />
          ) : (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                backgroundColor: 'var(--bg-secondary)',
                border: '2px dashed var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 500
              }}
            >
              <ScienceIcon sx={{ fontSize: 80, color: 'var(--text-secondary)', mb: 2 }} />
              <Typography variant="h6" color="var(--text-secondary)" gutterBottom>
                분자를 선택하거나 SMILES를 입력하세요
              </Typography>
              <Typography variant="body2" color="var(--text-secondary)" align="center">
                왼쪽에서 샘플 분자를 선택하거나<br />
                직접 SMILES 문자열을 입력하여 3D 구조를 확인하세요
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MoleculeViewer;
