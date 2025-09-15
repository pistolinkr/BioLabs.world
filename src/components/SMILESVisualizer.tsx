import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import { Science as ScienceIcon } from '@mui/icons-material';

interface SMILESVisualizerProps {
  smiles: string;
  moleculeName?: string;
  height?: number;
  width?: number;
}

const SMILESVisualizer: React.FC<SMILESVisualizerProps> = ({ 
  smiles, 
  moleculeName, 
  height = 300, 
  width = 300 
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (smiles && smiles.trim()) {
      generateSMILESVisualization(smiles);
    } else {
      setSvgContent('');
      setError(null);
    }
  }, [smiles]);

  const generateSMILESVisualization = async (smilesString: string) => {
    setLoading(true);
    setError(null);

    try {
      // RDKit.js를 사용한 SMILES 시각화 (실제 구현에서는 RDKit.js 라이브러리 사용)
      // 여기서는 시뮬레이션된 SVG를 생성합니다.
      const svg = await simulateSMILESToSVG(smilesString);
      setSvgContent(svg);
    } catch (err) {
      setError('SMILES 구조를 시각화할 수 없습니다.');
      console.error('SMILES visualization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const simulateSMILESToSVG = async (smiles: string): Promise<string> => {
    // 실제 SMILES 파싱을 통한 분자 구조 생성
    await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
    
    // SMILES 파싱 및 분자 구조 생성
    const moleculeStructure = parseSMILES(smiles);
    
    let svg = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <style>
            .atom { fill: #4CAF50; stroke: #2E7D32; stroke-width: 2; }
            .atom-n { fill: #2196F3; stroke: #1976D2; stroke-width: 2; }
            .atom-o { fill: #FF9800; stroke: #F57C00; stroke-width: 2; }
            .atom-s { fill: #9C27B0; stroke: #7B1FA2; stroke-width: 2; }
            .atom-h { fill: #E0E0E0; stroke: #BDBDBD; stroke-width: 2; }
            .atom-cl { fill: #4CAF50; stroke: #2E7D32; stroke-width: 2; }
            .atom-f { fill: #4CAF50; stroke: #2E7D32; stroke-width: 2; }
            .atom-br { fill: #4CAF50; stroke: #2E7D32; stroke-width: 2; }
            .atom-i { fill: #4CAF50; stroke: #2E7D32; stroke-width: 2; }
            .bond { stroke: #333; stroke-width: 2; }
            .bond-double { stroke: #333; stroke-width: 3; }
            .bond-triple { stroke: #333; stroke-width: 4; }
            .text { font-family: Arial, sans-serif; font-size: 12px; fill: #333; font-weight: bold; }
            .ring { fill: none; stroke: #666; stroke-width: 1; stroke-dasharray: 3,3; }
          </style>
        </defs>
        
        <!-- 배경 -->
        <rect width="100%" height="100%" fill="#f5f5f5" stroke="#ddd" stroke-width="1"/>
        
        <!-- 분자 구조 -->
        <g transform="translate(${width/2}, ${height/2})">`;
    
    // 실제 파싱된 분자 구조 렌더링
    svg += moleculeStructure.svg;
    
    svg += `
        </g>
        
        <!-- SMILES 표시 -->
        <text x="10" y="${height - 10}" class="text" font-size="10">
          SMILES: ${smiles.substring(0, 50)}${smiles.length > 50 ? '...' : ''}
        </text>
        
        <!-- 분자 정보 -->
        <text x="10" y="${height - 25}" class="text" font-size="9">
          ${moleculeStructure.description}
        </text>
      </svg>`;
    
    return svg;
  };

  // SMILES 파싱 함수
  const parseSMILES = (smiles: string) => {
    const atoms: Array<{type: string, x: number, y: number, id: number}> = [];
    const bonds: Array<{from: number, to: number, type: string}> = [];
    let atomId = 0;
    
    // 간단한 SMILES 파싱 (실제로는 더 복잡한 파서가 필요)
    const tokens = smiles.match(/[A-Z][a-z]?|[0-9]+|[=#]|\(|\)|\[|\]|\./g) || [];
    
    let currentX = 0;
    let currentY = 0;
    let branchStack: number[] = [];
    let ringNumbers: {[key: string]: number} = {};
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (token.match(/^[A-Z][a-z]?$/)) {
        // 원자
        const atomType = token;
        const atom = {
          type: atomType,
          x: currentX,
          y: currentY,
          id: atomId++
        };
        atoms.push(atom);
        
        // 이전 원자와 결합
        if (atoms.length > 1) {
          const prevAtom = atoms[atoms.length - 2];
          bonds.push({
            from: prevAtom.id,
            to: atom.id,
            type: 'single'
          });
        }
        
        // 다음 위치 계산
        currentX += 40; // 원자 간격 증가
      } else if (token === '=') {
        // 이중 결합
        if (bonds.length > 0) {
          bonds[bonds.length - 1].type = 'double';
        }
      } else if (token === '#') {
        // 삼중 결합
        if (bonds.length > 0) {
          bonds[bonds.length - 1].type = 'triple';
        }
      } else if (token === '(') {
        // 가지 시작
        branchStack.push(atoms.length - 1);
        currentX -= 30;
        currentY += 30;
      } else if (token === ')') {
        // 가지 끝
        if (branchStack.length > 0) {
          const branchStart = branchStack.pop()!;
          currentX = atoms[branchStart].x + 40;
          currentY = atoms[branchStart].y;
        }
      } else if (token.match(/^[0-9]+$/)) {
        // 고리 번호
        const ringNum = parseInt(token);
        if (ringNumbers[ringNum]) {
          // 고리 닫기
          const ringStart = ringNumbers[ringNum];
          const ringEnd = atoms.length - 1;
          bonds.push({
            from: ringStart,
            to: ringEnd,
            type: 'single'
          });
          delete ringNumbers[ringNum];
        } else {
          // 고리 시작
          ringNumbers[ringNum] = atoms.length - 1;
        }
      }
    }
    
    // 분자 구조를 화면 중앙에 맞추기 위한 스케일링
    if (atoms.length === 0) {
      return { svg: '', description: 'No atoms found' };
    }
    
    const maxX = Math.max(...atoms.map(a => a.x));
    const minX = Math.min(...atoms.map(a => a.x));
    const maxY = Math.max(...atoms.map(a => a.y));
    const minY = Math.min(...atoms.map(a => a.y));
    
    const moleculeWidth = maxX - minX + 80; // 여백 더 추가
    const moleculeHeight = maxY - minY + 80; // 여백 더 추가
    
    const scale = Math.min(width / moleculeWidth, height / moleculeHeight) * 0.6; // 더 작게 스케일링
    const offsetX = width / 2 - ((maxX + minX) / 2) * scale;
    const offsetY = height / 2 - ((maxY + minY) / 2) * scale;
    
    // SVG 생성
    let svgContent = '';
    
    // 결합선 그리기
    bonds.forEach(bond => {
      const fromAtom = atoms[bond.from];
      const toAtom = atoms[bond.to];
      const strokeWidth = bond.type === 'single' ? 2 : bond.type === 'double' ? 3 : 4;
      const strokeDasharray = bond.type === 'double' ? '5,5' : 'none';
      
      const x1 = fromAtom.x * scale + offsetX;
      const y1 = fromAtom.y * scale + offsetY;
      const x2 = toAtom.x * scale + offsetX;
      const y2 = toAtom.y * scale + offsetY;
      
      svgContent += `
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
              stroke="#333" stroke-width="${strokeWidth}" stroke-dasharray="${strokeDasharray}"/>`;
    });
    
    // 원자 그리기
    atoms.forEach(atom => {
      const radius = (atom.type === 'H' ? 8 : 12) * scale;
      const colorClass = getAtomColorClass(atom.type);
      const x = atom.x * scale + offsetX;
      const y = atom.y * scale + offsetY;
      
      svgContent += `
        <circle cx="${x}" cy="${y}" r="${radius}" class="${colorClass}"/>
        <text x="${x}" y="${y + 4 * scale}" text-anchor="middle" class="text" font-size="${12 * scale}">${atom.type}</text>`;
    });
    
    // 분자 설명 생성
    const hasRings = Object.keys(ringNumbers).length > 0 || bonds.some(b => 
      Math.abs(atoms[b.from].x - atoms[b.to].x) < 50 && Math.abs(atoms[b.from].y - atoms[b.to].y) < 50
    );
    const hasBranches = branchStack.length > 0;
    const hasMultipleBonds = bonds.some(b => b.type !== 'single');
    
    let description = '';
    if (hasRings) description += 'Ring structure';
    else if (hasBranches) description += 'Branched molecule';
    else if (hasMultipleBonds) description += 'Multiple bonds';
    else description += 'Linear molecule';
    
    return { svg: svgContent, description };
  };

  // 원자 색상 클래스 결정
  const getAtomColorClass = (atomType: string): string => {
    switch (atomType.toUpperCase()) {
      case 'N': return 'atom-n';
      case 'O': return 'atom-o';
      case 'S': return 'atom-s';
      case 'H': return 'atom-h';
      case 'CL': return 'atom-cl';
      case 'F': return 'atom-f';
      case 'BR': return 'atom-br';
      case 'I': return 'atom-i';
      default: return 'atom';
    }
  };

  if (!smiles || !smiles.trim()) {
    return (
      <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: height,
            color: 'var(--text-secondary)'
          }}>
            <ScienceIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="body2">
              SMILES 구조를 입력하세요
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
      <CardContent>
        {moleculeName && (
          <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 2 }}>
            {moleculeName}
          </Typography>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: height,
          width: '100%',
          border: '1px solid var(--border-primary)',
          borderRadius: 1,
          backgroundColor: 'var(--bg-primary)',
          overflow: 'hidden'
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress size={40} />
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mt: 2 }}>
                분자 구조 생성 중...
              </Typography>
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ maxWidth: '80%' }}>
              {error}
            </Alert>
          ) : svgContent ? (
            <Box 
              dangerouslySetInnerHTML={{ __html: svgContent }}
              sx={{ 
                width: '100%',
                height: '100%',
                '& svg': { 
                  width: '100%', 
                  height: '100%',
                  display: 'block'
                } 
              }}
            />
          ) : (
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
              구조를 생성할 수 없습니다
            </Typography>
          )}
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
            SMILES: {smiles}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SMILESVisualizer;
