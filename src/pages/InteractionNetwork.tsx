import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Slider,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import {
  Hub as HubIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

const InteractionNetwork: React.FC = () => {
  const [networkType, setNetworkType] = useState('protein-protein');
  const [interactionThreshold, setInteractionThreshold] = useState(0.5);
  const [showLabels, setShowLabels] = useState(true);
  const [showWeights, setShowWeights] = useState(true);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 4, color: '#ffffff' }}>
        단백질 상호작용 네트워크 분석
      </Typography>

      <Grid container spacing={3}>
        {/* 네트워크 시각화 */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ backgroundColor: '#000000', border: '1px solid #ffffff', height: '600px' }}>
            <CardContent sx={{ height: '100%', p: 0 }}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontSize: '1.2rem',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <HubIcon sx={{ fontSize: 64, color: '#ffffff', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                    단백질 상호작용 네트워크
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    네트워크 시각화가 여기에 표시됩니다
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 제어 패널 */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ backgroundColor: '#000000', border: '1px solid #ffffff', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 2 }}>
                네트워크 제어
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<ZoomInIcon />}
                  sx={{ mr: 1, mb: 1 }}
                >
                  확대
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ZoomOutIcon />}
                  sx={{ mb: 1 }}
                >
                  축소
                </Button>
              </Box>

              <Divider sx={{ backgroundColor: '#ffffff', my: 2 }} />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: '#b0b0b0' }}>네트워크 유형</InputLabel>
                <Select
                  value={networkType}
                  onChange={(e) => setNetworkType(e.target.value)}
                  sx={{ color: '#ffffff' }}
                >
                  <MenuItem value="protein-protein">단백질-단백질</MenuItem>
                  <MenuItem value="protein-dna">단백질-DNA</MenuItem>
                  <MenuItem value="protein-ligand">단백질-리간드</MenuItem>
                  <MenuItem value="metabolic">대사 경로</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                상호작용 임계값: {interactionThreshold}
              </Typography>
              <Slider
                value={interactionThreshold}
                onChange={(_, value) => setInteractionThreshold(value as number)}
                min={0}
                max={1}
                step={0.1}
                sx={{ mb: 3 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                  />
                }
                label="라벨 표시"
                sx={{ color: '#ffffff', mb: 1 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={showWeights}
                    onChange={(e) => setShowWeights(e.target.checked)}
                  />
                }
                label="가중치 표시"
                sx={{ color: '#ffffff' }}
              />
            </CardContent>
          </Card>

          {/* 네트워크 통계 */}
          <Card sx={{ backgroundColor: '#000000', border: '1px solid #ffffff', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 2 }}>
                네트워크 통계
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  노드: 1,247
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  엣지: 3,891
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  밀도: 0.0025
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  클러스터링 계수: 0.187
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* 핵심 노드 */}
          <Card sx={{ backgroundColor: '#000000', border: '1px solid #ffffff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 2 }}>
                핵심 단백질
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Chip
                  label="PrP^C"
                  size="small"
                  sx={{ mr: 1, mb: 1, backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff' }}
                />
                <Chip
                  label="PrP^Sc"
                  size="small"
                  sx={{ mr: 1, mb: 1, backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff' }}
                />
                <Chip
                  label="14-3-3"
                  size="small"
                  sx={{ mr: 1, mb: 1, backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff' }}
                />
                <Chip
                  label="Tau"
                  size="small"
                  sx={{ mr: 1, mb: 1, backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InteractionNetwork;
