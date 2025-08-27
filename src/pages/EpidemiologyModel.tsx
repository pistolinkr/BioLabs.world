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
  Slider,
  FormControlLabel,
  Switch,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const EpidemiologyModel: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [populationSize, setPopulationSize] = useState(1000000);
  const [initialInfected, setInitialInfected] = useState(10);
  const [transmissionRate, setTransmissionRate] = useState(0.3);
  const [recoveryRate, setRecoveryRate] = useState(0.01);
  const [mortalityRate, setMortalityRate] = useState(0.001);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [susceptible, setSusceptible] = useState(populationSize - initialInfected);
  const [infected, setInfected] = useState(initialInfected);
  const [recovered, setRecovered] = useState(0);
  const [deceased, setDeceased] = useState(0);

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setSimulationTime(0);
    
    // 간단한 SIR 모델 시뮬레이션
    const interval = setInterval(() => {
      setSimulationTime(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          return 100;
        }

        // SIR 모델 계산
        const newInfected = Math.floor(transmissionRate * susceptible * infected / populationSize);
        const newRecovered = Math.floor(recoveryRate * infected);
        const newDeceased = Math.floor(mortalityRate * infected);

        setSusceptible(prev => Math.max(0, prev - newInfected));
        setInfected(prev => Math.max(0, prev + newInfected - newRecovered - newDeceased));
        setRecovered(prev => prev + newRecovered);
        setDeceased(prev => prev + newDeceased);

        return prev + 1;
      });
    }, 100);
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setSimulationTime(0);
    setSusceptible(populationSize - initialInfected);
    setInfected(initialInfected);
    setRecovered(0);
    setDeceased(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 4, color: '#ffffff' }}>
        역학 모델링
      </Typography>

      <Grid container spacing={3}>
        {/* 시뮬레이션 제어 */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ backgroundColor: '#1a1a1a', border: '1px solid #333333', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
                시뮬레이션 제어
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={isSimulating ? <PauseIcon /> : <PlayIcon />}
                  onClick={handleStartSimulation}
                  disabled={isSimulating}
                  sx={{ mr: 1, mb: 1 }}
                  fullWidth
                >
                  {isSimulating ? '일시정지' : '시작'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<StopIcon />}
                  onClick={handleStopSimulation}
                  disabled={!isSimulating}
                  sx={{ mr: 1, mb: 1 }}
                  fullWidth
                >
                  정지
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleResetSimulation}
                  fullWidth
                >
                  재설정
                </Button>
              </Box>

              <Divider sx={{ backgroundColor: '#ffffff', my: 2 }} />

              <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                시뮬레이션 시간: {simulationTime}일
              </Typography>
            </CardContent>
          </Card>

          {/* 모델 파라미터 */}
          <Card sx={{ backgroundColor: '#000000', border: '1px solid #ffffff', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
                모델 매개변수
              </Typography>

              <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                인구 크기: {populationSize.toLocaleString()}
              </Typography>
              <Slider
                value={populationSize}
                onChange={(_, value) => setPopulationSize(value as number)}
                min={100000}
                max={10000000}
                step={100000}
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                초기 감염자: {initialInfected}
              </Typography>
              <Slider
                value={initialInfected}
                onChange={(_, value) => setInitialInfected(value as number)}
                min={1}
                max={1000}
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                전파율: {transmissionRate}
              </Typography>
              <Slider
                value={transmissionRate}
                onChange={(_, value) => setTransmissionRate(value as number)}
                min={0}
                max={1}
                step={0.01}
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                회복율: {recoveryRate}
              </Typography>
              <Slider
                value={recoveryRate}
                onChange={(_, value) => setRecoveryRate(value as number)}
                min={0}
                max={0.1}
                step={0.001}
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                사망율: {mortalityRate}
              </Typography>
              <Slider
                value={mortalityRate}
                onChange={(_, value) => setMortalityRate(value as number)}
                min={0}
                max={0.01}
                step={0.0001}
                sx={{ mb: 3 }}
              />
            </CardContent>
          </Card>

          {/* 고급 설정 */}
          <Card sx={{ backgroundColor: '#000000', border: '1px solid #ffffff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 2 }}>
                고급 설정
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={showAdvanced}
                    onChange={(e) => setShowAdvanced(e.target.checked)}
                  />
                }
                label="고급 옵션 표시"
                sx={{ color: '#ffffff' }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 시뮬레이션 결과 */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ backgroundColor: '#000000', border: '1px solid #ffffff', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
                시뮬레이션 결과
              </Typography>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#000000', border: '1px solid #ffffff', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ color: '#ffffff', mb: 1 }}>
                      {susceptible.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>
                      감염 가능자
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#000000', border: '1px solid #ffffff', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ color: '#ffffff', mb: 1 }}>
                      {infected.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>
                      감염자
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#000000', border: '1px solid #ffffff', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ color: '#ffffff', mb: 1 }}>
                      {recovered.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>
                      회복자
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#000000', border: '1px solid #ffffff', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ color: '#ffffff', mb: 1 }}>
                      {deceased.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>
                      사망자
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ height: '300px', backgroundColor: '#000000', borderRadius: 2, p: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%',
                  color: '#ffffff'
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 64, color: '#ffffff', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                      역학 곡선
                    </Typography>
                            <Typography variant="body2" sx={{ color: '#ffffff' }}>
          SIR 모델 시각화가 여기에 표시됩니다
        </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* 모델 정보 */}
          <Card sx={{ backgroundColor: '#000000', border: '1px solid #ffffff' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
                모델 정보
              </Typography>

              <Alert severity="info" sx={{ backgroundColor: '#000000', color: '#ffffff', border: '1px solid #ffffff', mb: 2 }}>
                이 시뮬레이션은 SIR (Susceptible-Infected-Recovered) 모델을 기반으로 합니다.
              </Alert>

              <Typography variant="body2" sx={{ color: '#ffffff', mb: 2 }}>
                <strong>SIR 모델</strong>은 전염병의 전파를 모델링하는 수학적 모델입니다:
              </Typography>

              <Box sx={{ pl: 2 }}>
                <Typography variant="body2" sx={{ color: '#ffffff', mb: 1 }}>
                  • <strong>S (Susceptible)</strong>: 감염 가능한 개체 수
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff', mb: 1 }}>
                  • <strong>I (Infected)</strong>: 현재 감염된 개체 수
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff', mb: 1 }}>
                  • <strong>R (Recovered)</strong>: 회복된 개체 수
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                  • <strong>D (Deceased)</strong>: 사망한 개체 수
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EpidemiologyModel;
