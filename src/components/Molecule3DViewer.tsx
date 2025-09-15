import React, { useEffect, useRef } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';

declare global {
  interface Window {
    $3Dmol: any;
  }
}

interface Molecule3DViewerProps {
  smiles?: string;
  width?: number;
  height?: number;
  title?: string;
}

const Molecule3DViewer: React.FC<Molecule3DViewerProps> = ({
  smiles,
  width = 400,
  height = 400,
  title
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || !smiles) return;

    // 3Dmol.js가 로드되었는지 확인
    if (typeof window.$3Dmol === 'undefined') {
      console.warn('3Dmol.js not loaded');
      return;
    }

    // 기존 뷰어 제거
    if (viewerRef.current) {
      viewerRef.current.clear();
    }

    // 새 뷰어 생성
    viewerRef.current = window.$3Dmol.createViewer(containerRef.current, {
      backgroundColor: 'white'
    });

    // SMILES를 3D 구조로 변환
    const mol = window.$3Dmol.getMolFromSmiles(smiles);
    if (mol) {
      // 분자 추가
      viewerRef.current.addModel(mol, 'sdf');
      
      // 스타일 설정
      viewerRef.current.setStyle({}, {
        stick: { radius: 0.15 },
        sphere: { radius: 0.5 }
      });

      // 카메라 위치 조정
      viewerRef.current.zoomTo();
      viewerRef.current.render();
    } else {
      console.error('Failed to parse SMILES:', smiles);
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.clear();
      }
    };
  }, [smiles, width, height]);

  // 3Dmol.js 스크립트 로드
  useEffect(() => {
    if (typeof window.$3Dmol !== 'undefined') return;

    const script = document.createElement('script');
    script.src = 'https://3dmol.csb.pitt.edu/build/3Dmol-min.js';
    script.async = true;
    script.onload = () => {
      console.log('3Dmol.js loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load 3Dmol.js');
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)'
      }}
    >
      {title && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ScienceIcon sx={{ mr: 1, color: 'var(--primary-main)' }} />
          <Typography variant="h6" color="var(--text-primary)">
            {title}
          </Typography>
        </Box>
      )}
      
      <Box
        ref={containerRef}
        sx={{
          width: width,
          height: height,
          border: '2px solid var(--border-color)',
          borderRadius: 1,
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {!smiles && (
          <Typography variant="body2" color="var(--text-secondary)">
            SMILES 문자열을 입력하세요
          </Typography>
        )}
      </Box>
      
      {smiles && (
        <Typography 
          variant="caption" 
          color="var(--text-secondary)"
          sx={{ mt: 1, display: 'block' }}
        >
          SMILES: {smiles}
        </Typography>
      )}
    </Paper>
  );
};

export default Molecule3DViewer;
