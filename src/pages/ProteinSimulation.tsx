import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { Stage } from 'ngl';

interface ProteinStructure {
  id: string;
  name: string;
  description: string;
  pdbId: string;
  status: 'normal' | 'abnormal' | 'transforming';
}

const ProteinSimulation: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [temperature, setTemperature] = useState(37);
  const [pH, setpH] = useState(7.4);
  const [selectedProtein, setSelectedProtein] = useState('prpc');
  const [showHydrogens, setShowHydrogens] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [transformationProgress, setTransformationProgress] = useState(0);
  const [stage, setStage] = useState<Stage | null>(null);
  const [currentStructure, setCurrentStructure] = useState<any>(null);

  const mountRef = useRef<HTMLDivElement>(null);

  const proteinStructures: ProteinStructure[] = [
    {
      id: 'prpc',
      name: 'PrP^C (Normal)',
      description: '정상 프리온 단백질 - α-나선 구조',
      pdbId: '1QLX', // 실제 PDB ID
      status: 'normal'
    },
    {
      id: 'prpsc',
      name: 'PrP^Sc (Abnormal)',
      description: '비정상 프리온 단백질 - β-sheet 구조',
      pdbId: '2KUN', // 실제 PDB ID
      status: 'abnormal'
    },
    {
      id: 'transforming',
      name: 'Transformation',
      description: 'PrP^C → PrP^Sc 변환 과정',
      pdbId: '1QLX', // 변환 과정을 위한 기본 구조
      status: 'transforming'
    }
  ];

  // NGL Stage 초기화
  useEffect(() => {
    if (mountRef.current) {
      const newStage = new Stage(mountRef.current);
      newStage.setParameters({
        backgroundColor: '#1a1a1a',
        quality: 'medium',
      });
      
      setStage(newStage);
      
      // 기본 구조 로드
      loadProteinStructure(selectedProtein);
      
      return () => {
        if (newStage) {
          newStage.dispose();
        }
      };
    }
  }, []);

  // 단백질 구조 로드
  const loadProteinStructure = async (proteinId: string) => {
    if (!stage) return;
    
    const protein = proteinStructures.find(p => p.id === proteinId);
    if (!protein) return;

    try {
      // 기존 구조 제거
      stage.removeAllComponents();
      
      // PDB 파일 로드
      const component = await stage.loadFile(`https://files.rcsb.org/download/${protein.pdbId}.pdb`);
      
      if (component) {
        setCurrentStructure(component);
        
        // 표현 방식 설정
        component.addRepresentation('cartoon', {
          color: protein.status === 'normal' ? 'blue' : 
                 protein.status === 'abnormal' ? 'red' : 'orange',
          opacity: 0.8,
        });
        
        // 원자 표현 추가
        component.addRepresentation('ball+stick', {
          color: 'element',
          opacity: 0.6,
          visible: showHydrogens,
        });
      }
      
      // 카메라 위치 조정
      stage.autoView();
      
    } catch (error) {
      console.error('Failed to load protein structure:', error);
    }
  };

  // 표현 방식 변경
  const changeRepresentation = (type: string, options: any = {}) => {
    if (!currentStructure) return;
    
    currentStructure.removeAllRepresentations();
    
    switch (type) {
      case 'cartoon':
        currentStructure.addRepresentation('cartoon', {
          color: 'chainid',
          opacity: 0.8,
          ...options,
        });
        break;
      case 'surface':
        currentStructure.addRepresentation('surface', {
          color: 'chainid',
          opacity: 0.6,
          ...options,
        });
        break;
      case 'ball+stick':
        currentStructure.addRepresentation('ball+stick', {
          color: 'element',
          opacity: 0.8,
          ...options,
        });
        break;
      case 'line':
        currentStructure.addRepresentation('line', {
          color: 'chainid',
          opacity: 0.8,
          ...options,
        });
        break;
    }
  };

  // 시뮬레이션 시작/중지
  const toggleSimulation = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      startSimulation();
    } else {
      stopSimulation();
    }
  };

  const startSimulation = () => {
    // 간단한 애니메이션 시뮬레이션
    const animate = () => {
      if (!isPlaying) return;
      
      setSimulationTime(prev => prev + simulationSpeed * 0.1);
      setEnergy(prev => prev + Math.sin(simulationTime) * 0.1);
      setTransformationProgress(prev => Math.min(prev + 0.1, 100));
      
      if (stage && currentStructure) {
        // 구조를 약간 회전 (NGL Viewer는 자동으로 렌더링됨)
        // currentStructure.rotation.set(
        //   currentStructure.rotation.x + 0.01,
        //   currentStructure.rotation.y + 0.01,
        //   currentStructure.rotation.z
        // );
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  };

  const stopSimulation = () => {
    setIsPlaying(false);
    setSimulationTime(0);
    setEnergy(0);
    setTransformationProgress(0);
  };

  const resetSimulation = () => {
    stopSimulation();
    if (stage && currentStructure) {
      currentStructure.rotation.set(0, 0, 0);
      stage.autoView();
    }
  };

  // 단백질 변경 시 구조 로드
  useEffect(() => {
    if (stage) {
      loadProteinStructure(selectedProtein);
    }
  }, [selectedProtein, stage]);

  return (
    <Box sx={{ padding: 3, backgroundColor: '#000000', minHeight: '100vh', color: '#ffffff' }}>
      <Typography variant="h4" sx={{ marginBottom: 3, color: '#ffffff' }}>
        단백질 시뮬레이션
      </Typography>

      <Grid container spacing={3}>
        {/* 3D 뷰어 */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff' }}>
            <CardContent sx={{ padding: 0 }}>
              <Box
                ref={mountRef}
                sx={{
                  width: '100%',
                  height: '600px',
                  backgroundColor: '#1a1a1a',
                  position: 'relative',
                }}
              />
              
              {/* 뷰어 컨트롤 */}
              <Box sx={{ 
                position: 'absolute', 
                top: 10, 
                right: 10, 
                display: 'flex', 
                gap: 1,
                zIndex: 1000 
              }}>
                <Tooltip title="카툰 표현">
                  <IconButton 
                    onClick={() => changeRepresentation('cartoon')}
                    sx={{ color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="표면 표현">
                  <IconButton 
                    onClick={() => changeRepresentation('surface')}
                    sx={{ color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="원자 표현">
                  <IconButton 
                    onClick={() => changeRepresentation('ball+stick')}
                    sx={{ color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.5)' }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 컨트롤 패널 */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            {/* 단백질 선택 */}
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: 2, color: '#ffffff' }}>
                    단백질 구조
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#ffffff' }}>구조 선택</InputLabel>
                    <Select
                      value={selectedProtein}
                      onChange={(e) => setSelectedProtein(e.target.value)}
                      sx={{ color: '#ffffff' }}
                    >
                      {proteinStructures.map((protein) => (
                        <MenuItem key={protein.id} value={protein.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={protein.status === 'normal' ? '정상' : 
                                     protein.status === 'abnormal' ? '비정상' : '변환'}
                              color={protein.status === 'normal' ? 'success' : 
                                     protein.status === 'abnormal' ? 'error' : 'warning'}
                              size="small"
                            />
                            {protein.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography variant="body2" sx={{ marginTop: 1, color: '#b0b0b0' }}>
                    {proteinStructures.find(p => p.id === selectedProtein)?.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* 시뮬레이션 컨트롤 */}
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: 2, color: '#ffffff' }}>
                    시뮬레이션 컨트롤
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                    <Button
                      variant="contained"
                      onClick={toggleSimulation}
                      startIcon={isPlaying ? <PauseIcon /> : <PlayIcon />}
                      sx={{ backgroundColor: isPlaying ? '#f57c00' : '#4caf50' }}
                    >
                      {isPlaying ? '일시정지' : '시작'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={stopSimulation}
                      startIcon={<StopIcon />}
                      sx={{ borderColor: '#ffffff', color: '#ffffff' }}
                    >
                      정지
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={resetSimulation}
                      startIcon={<RefreshIcon />}
                      sx={{ borderColor: '#ffffff', color: '#ffffff' }}
                    >
                      리셋
                    </Button>
                  </Box>

                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body2" sx={{ color: '#ffffff', marginBottom: 1 }}>
                      속도: {simulationSpeed}x
                    </Typography>
                    <Slider
                      value={simulationSpeed}
                      onChange={(_, value) => setSimulationSpeed(value as number)}
                      min={0.1}
                      max={5}
                      step={0.1}
                      sx={{ color: '#4caf50' }}
                    />
                  </Box>

                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body2" sx={{ color: '#ffffff', marginBottom: 1 }}>
                      온도: {temperature}°C
                    </Typography>
                    <Slider
                      value={temperature}
                      onChange={(_, value) => setTemperature(value as number)}
                      min={0}
                      max={100}
                      step={1}
                      sx={{ color: '#ff9800' }}
                    />
                  </Box>

                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body2" sx={{ color: '#ffffff', marginBottom: 1 }}>
                      pH: {pH}
                    </Typography>
                    <Slider
                      value={pH}
                      onChange={(_, value) => setpH(value as number)}
                      min={0}
                      max={14}
                      step={0.1}
                      sx={{ color: '#2196f3' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* 시뮬레이션 정보 */}
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: 2, color: '#ffffff' }}>
                    시뮬레이션 정보
                  </Typography>
                  
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      시뮬레이션 시간: {simulationTime.toFixed(1)}s
                    </Typography>
                  </Box>
                  
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      에너지: {energy.toFixed(3)} kcal/mol
                    </Typography>
                  </Box>
                  
                  <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      변환 진행률: {transformationProgress.toFixed(1)}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProteinSimulation;
