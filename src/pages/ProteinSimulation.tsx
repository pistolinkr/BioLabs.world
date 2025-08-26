import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as NGL from 'ngl';
import { checkWebGLSupport, getWebGLInfo } from '../utils/webgl';
import './ProteinSimulation.css';

interface ProteinStructure {
  id: string;
  name: string;
  type: 'pdb' | 'cif';
  url: string;
  description?: string;
  resolution?: number;
  organism?: string;
  method?: string;
}

interface AnalysisResult {
  type: 'secondary_structure' | 'surface_area' | 'binding_sites' | 'mutations';
  data: any;
  timestamp: Date;
}

interface HighlightInfo {
  residueName: string;
  chain: string;
  residueNumber: number;
  atom: string;
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
  visible: boolean;
}

const ProteinSimulation: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const stageInstanceRef = useRef<NGL.Stage | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdbId, setPdbId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentStructure, setCurrentStructure] = useState<ProteinStructure | null>(null);
  const [representation, setRepresentation] = useState<string>('cartoon');
  const [colorScheme, setColorScheme] = useState<string>('chainid');
  const [isStageReady, setIsStageReady] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [webglInfo, setWebglInfo] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [selectedResidue, setSelectedResidue] = useState<string>('');
  const [measurementMode, setMeasurementMode] = useState<boolean>(false);
  const [highlightInfo, setHighlightInfo] = useState<HighlightInfo | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // 생명공학 연구용 샘플 구조들
  const sampleStructures: ProteinStructure[] = [
    {
      id: '1crn',
      name: 'Crambin (1CRN)',
      type: 'pdb',
      url: 'https://files.rcsb.org/download/1CRN.pdb',
      description: '식물 독소 단백질 - 구조 생물학 연구의 표준 모델',
      resolution: 1.5,
      organism: 'Crambe abyssinica',
      method: 'X-ray crystallography'
    },
    {
      id: '1ubq',
      name: 'Ubiquitin (1UBQ)',
      type: 'pdb',
      url: 'https://files.rcsb.org/download/1UBQ.pdb',
      description: '단백질 분해 신호 분자 - 암 연구의 핵심',
      resolution: 1.8,
      organism: 'Synthetic',
      method: 'X-ray crystallography'
    },
    {
      id: '1hhb',
      name: 'Hemoglobin (1HHB)',
      type: 'pdb',
      url: 'https://files.rcsb.org/download/1HHB.pdb',
      description: '산소 운반 단백질 - 혈액학 연구의 기본',
      resolution: 2.1,
      organism: 'Homo sapiens',
      method: 'X-ray crystallography'
    },
    {
      id: '1gfl',
      name: 'Green Fluorescent Protein (1GFL)',
      type: 'pdb',
      url: 'https://files.rcsb.org/download/1GFL.pdb',
      description: '형광 단백질 - 세포 이미징의 혁명',
      resolution: 1.9,
      organism: 'Aequorea victoria',
      method: 'X-ray crystallography'
    },
    {
      id: '6lu7',
      name: 'COVID-19 Main Protease (6LU7)',
      type: 'pdb',
      url: 'https://files.rcsb/download/6LU7.pdb',
      description: 'SARS-CoV-2 주요 단백질분해효소 - 항바이러스 약물 개발',
      resolution: 2.16,
      organism: 'SARS-CoV-2',
      method: 'X-ray crystallography'
    }
  ];

  // NGL Stage 초기화
  const initializeStage = useCallback(() => {
    if (!stageRef.current || stageInstanceRef.current) return;

    try {
      console.log('Initializing NGL Stage for structural biology analysis...');
      
      // WebGL 지원 확인
      const webglCheck = checkWebGLSupport();
      if (!webglCheck.supported) {
        setWebglSupported(false);
        setError(`WebGL 지원 오류: ${webglCheck.error}`);
        return;
      }
      
      // WebGL 정보 저장
      const info = getWebGLInfo();
      setWebglInfo(info);
      
      // Stage 생성
      stageInstanceRef.current = new NGL.Stage(stageRef.current);
      
      // 생명과학 연구에 최적화된 파라미터 설정
      stageInstanceRef.current.setParameters({
        backgroundColor: '#121212',
        quality: 'high'
      });

      // Stage 크기 설정
      if (stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        stageInstanceRef.current.setSize(rect.width, rect.height);
      }

      // 클릭 이벤트 리스너 추가
      stageInstanceRef.current.mouseControls.add('click', (event: any) => {
        handleAtomClick(event);
      });

      console.log('NGL Stage initialized successfully for structural biology');
      setIsStageReady(true);
      
      // 기본 구조 로드 (Crambin - 구조 생물학 연구의 표준)
      setTimeout(() => {
        loadStructure(sampleStructures[0]);
      }, 200);
      
    } catch (err) {
      console.error('Failed to initialize NGL Stage:', err);
      setError('NGL Stage 초기화에 실패했습니다: ' + (err as Error).message);
    }
  }, []);

  // 원자 클릭 이벤트 처리
  const handleAtomClick = useCallback((event: any) => {
    if (!stageInstanceRef.current) return;

    try {
      // 클릭한 위치에서 원자 정보 가져오기
      const pickingProxy = stageInstanceRef.current.pick(event);
      
      if (pickingProxy) {
        const atom = pickingProxy.atom;
        if (atom) {
          // 하이라이트 정보 설정
          const info: HighlightInfo = {
            residueName: atom.resname || 'UNK',
            chain: atom.chainname || 'A',
            residueNumber: atom.resno || 0,
            atom: atom.atomname || 'CA',
            coordinates: {
              x: Math.round(atom.x * 100) / 100,
              y: Math.round(atom.y * 100) / 100,
              z: Math.round(atom.z * 100) / 100
            },
            visible: true
          };
          
          setHighlightInfo(info);
          console.log('Atom clicked:', info);
        }
      } else {
        // 클릭한 위치에 원자가 없으면 하이라이트 정보 숨기기
        setHighlightInfo(null);
      }
    } catch (err) {
      console.error('Error handling atom click:', err);
    }
  }, []);

  // 구조 로드 함수
  const loadStructure = useCallback(async (structure: ProteinStructure) => {
    if (!stageInstanceRef.current || !isStageReady) {
      console.log('Stage not ready, cannot load structure');
      return;
    }

    try {
      console.log('Loading protein structure for analysis:', structure.name);
      
      // 하이라이트 정보 초기화
      setHighlightInfo(null);
      
      // 새 구조 로드
      const component = await stageInstanceRef.current.loadFile(structure.url, {
        ext: structure.type === 'cif' ? 'cif' : 'pdb'
      });

      console.log('Structure loaded, applying biological representation...');

      // 생명과학 연구에 최적화된 표현 설정
      const repr = component.addRepresentation(representation, {
        color: colorScheme,
        opacity: 0.8,
        side: 'double'
      });

      // 카메라 자동 조정
      stageInstanceRef.current.autoView();
      
      // 렌더링 루프 시작 (브라우저의 requestAnimationFrame 사용)
      const animate = () => {
        if (stageInstanceRef.current) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
      
      setCurrentStructure(structure);
      console.log('Protein structure loaded successfully for analysis');
      
    } catch (err) {
      console.error('Structure loading error:', err);
      setError('단백질 구조 로딩 중 오류가 발생했습니다: ' + (err as Error).message);
      throw err;
    }
  }, [representation, colorScheme, isStageReady]);

  // 파일 업로드 처리
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsLoading(true);
    setError('');

    try {
      if (!stageInstanceRef.current || !isStageReady) {
        setError('Stage가 준비되지 않았습니다.');
        return;
      }

      console.log('Loading experimental structure file:', file.name);

      // 하이라이트 정보 초기화
      setHighlightInfo(null);

      // 기존 구조 제거
      stageInstanceRef.current.removeAllComponents();

      // 파일 로드
      const component = await stageInstanceRef.current.loadFile(file, {
        ext: file.name.endsWith('.cif') ? 'cif' : 'pdb'
      });

      console.log('Experimental structure loaded, applying analysis parameters...');

      // 기본 표현 설정
      component.addRepresentation(representation, {
        color: colorScheme
      });

      // 카메라 자동 조정
      stageInstanceRef.current.autoView();

      setCurrentStructure({
        id: file.name,
        name: file.name,
        type: file.name.endsWith('.cif') ? 'cif' : 'pdb',
        url: URL.createObjectURL(file),
        description: '실험실에서 결정된 구조',
        method: 'Experimental determination'
      });

      console.log('Experimental structure loaded successfully');
      
    } catch (err) {
      console.error('File loading error:', err);
      setError('실험 구조 파일 로딩 중 오류가 발생했습니다: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [representation, colorScheme, isStageReady]);

  // 실시간 PDB 검색 엔진 (PDB-101과 동일한 방식)
  const handlePdbIdSearch = useCallback(async () => {
    if (!pdbId.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    setError('');

    try {
      const searchTerm = pdbId.trim().toUpperCase();
      let searchResults = [];
      
      // 1. RCSB PDB 직접 검색 (가장 신뢰할 수 있는 방법)
      try {
        const response = await fetch(`https://data.rcsb.org/rest/v1/core/entry/${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.rcsb_id) {
            // PDB 파일 존재 여부 확인
            const pdbResponse = await fetch(`https://files.rcsb.org/download/${searchTerm}.pdb`);
            const cifResponse = await fetch(`https://files.rcsb.org/download/${searchTerm}.cif`);
            
            const hasPdb = pdbResponse.ok;
            const hasCif = cifResponse.ok;
            
            searchResults.push({
              pdb_id: data.rcsb_id,
              title: data.struct?.title || `${searchTerm} 단백질 구조`,
              resolution: data.refine?.ls_d_res_high || null,
              organism: data.entity?.src_organism?.[0]?.scientific_name || 'Unknown',
              method: data.experimental?.method || 'X-ray crystallography',
              exists: true,
              hasPdb: hasPdb,
              hasCif: hasCif,
              pdbUrl: hasPdb ? `https://files.rcsb.org/download/${searchTerm}.pdb` : null,
              cifUrl: hasCif ? `https://files.rcsb.org/download/${searchTerm}.cif` : null,
              source: 'RCSB PDB'
            });
          }
        }
      } catch (apiError) {
        console.log('RCSB API search failed, trying direct file check...');
      }

      // 2. 직접 파일 존재 여부 확인 (API가 실패한 경우)
      if (searchResults.length === 0) {
        try {
          const pdbResponse = await fetch(`https://files.rcsb.org/download/${searchTerm}.pdb`);
          const cifResponse = await fetch(`https://files.rcsb.org/download/${searchTerm}.cif`);
          
          if (pdbResponse.ok || cifResponse.ok) {
            searchResults.push({
              pdb_id: searchTerm,
              title: `${searchTerm} 단백질 구조`,
              resolution: null,
              organism: 'Unknown',
              method: 'X-ray crystallography',
              exists: true,
              hasPdb: pdbResponse.ok,
              hasCif: cifResponse.ok,
              pdbUrl: pdbResponse.ok ? `https://files.rcsb.org/download/${searchTerm}.pdb` : null,
              cifUrl: cifResponse.ok ? `https://files.rcsb.org/download/${searchTerm}.cif` : null,
              source: 'PDB Database'
            });
          }
        } catch (directError) {
          console.log('Direct file check failed...');
        }
      }

      // 3. PDB-101 교육 자료 검색
      if (searchResults.length === 0) {
        try {
          // PDB-101에서 관련 교육 자료 검색
          const pdb101Response = await fetch(`https://pdb101.rcsb.org/api/search?q=${searchTerm}&format=json`);
          if (pdb101Response.ok) {
            const pdb101Data = await pdb101Response.json();
            if (pdb101Data.results && pdb101Data.results.length > 0) {
              pdb101Data.results.slice(0, 3).forEach((result: any) => {
                searchResults.push({
                  pdb_id: result.pdb_id || searchTerm,
                  title: result.title || `${searchTerm} 관련 교육 자료`,
                  resolution: result.resolution || null,
                  organism: result.organism || 'Unknown',
                  method: result.method || 'Educational',
                  exists: true,
                  hasPdb: false,
                  hasCif: false,
                  source: 'PDB-101',
                  url: result.url || `https://pdb101.rcsb.org/learn/guide-to-understanding-pdb-data/${result.pdb_id}`
                });
              });
            }
          }
        } catch (pdb101Error) {
          console.log('PDB-101 search failed...');
        }
      }

      if (searchResults.length > 0) {
        setSearchResults(searchResults);
        console.log('Real-time search results:', searchResults);
      } else {
        setError(`'${searchTerm}'에 대한 검색 결과를 찾을 수 없습니다. 정확한 PDB ID를 입력해주세요.`);
      }
      
    } catch (err) {
      console.error('Search error:', err);
      setError('검색 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해보세요.');
    } finally {
      setIsSearching(false);
    }
  }, [pdbId]);

  // PDB 파일 복사 함수
  const handleCopyPdb = useCallback(async (pdbId: string) => {
    try {
      const response = await fetch(`https://files.rcsb.org/download/${pdbId.toUpperCase()}.pdb`);
      if (response.ok) {
        const pdbContent = await response.text();
        await navigator.clipboard.writeText(pdbContent);
        // 성공 메시지 표시 (임시)
        console.log('PDB 파일이 클립보드에 복사되었습니다.');
      } else {
        setError('PDB 파일을 가져올 수 없습니다.');
      }
    } catch (err) {
      console.error('PDB copy error:', err);
      setError('PDB 파일 복사 중 오류가 발생했습니다.');
    }
  }, []);

  // CIF 파일 복사 함수
  const handleCopyCif = useCallback(async (pdbId: string) => {
    try {
      const response = await fetch(`https://files.rcsb.org/download/${pdbId.toUpperCase()}.cif`);
      if (response.ok) {
        const cifContent = await response.text();
        await navigator.clipboard.writeText(cifContent);
        // 성공 메시지 표시 (임시)
        console.log('CIF 파일이 클립보드에 복사되었습니다.');
      } else {
        setError('CIF 파일을 가져올 수 없습니다.');
      }
    } catch (err) {
      console.error('CIF copy error:', err);
      setError('CIF 파일 복사 중 오류가 발생했습니다.');
    }
  }, []);

  // 검색 결과 중 하나를 선택하여 구조 로드 (개선된 버전)
  const handleStructureSelect = useCallback(async (result: any) => {
    setIsSearching(false);
    setSearchResults([]);
    setPdbId(''); // 검색어 초기화

    try {
      if (result.exists) {
        // 실제 PDB 구조가 있는 경우
        const structure: ProteinStructure = {
          id: result.pdb_id.toLowerCase(),
          name: `${result.pdb_id} (PDB ID)`,
          type: 'pdb',
          url: `https://files.rcsb.org/download/${result.pdb_id}.pdb`,
          description: result.title,
          resolution: result.resolution,
          organism: result.organism,
          method: result.method
        };

        await loadStructure(structure);
      } else {
        // 예측 구조인 경우 (UniProt ID 기반)
        setError(`${result.pdb_id}는 예측 구조입니다. 실제 PDB 구조를 찾을 수 없습니다. 다른 PDB ID를 시도해보세요.`);
      }
    } catch (err) {
      console.error('Structure selection error:', err);
      setError('구조 로딩 중 오류가 발생했습니다: ' + (err as Error).message);
    }
  }, [loadStructure]);

  // 표현 방식 변경
  const changeRepresentation = useCallback(async (newRep: string) => {
    if (!stageInstanceRef.current || !currentStructure) return;

    try {
      setRepresentation(newRep);
      setIsLoading(true);
      setError('');
      
      console.log('Changing structural representation to:', newRep);
      
      // 기존 구조 제거
      stageInstanceRef.current.removeAllComponents();
      
      // 새 표현으로 구조 다시 로드
      await loadStructure(currentStructure);
      
    } catch (err) {
      console.error('Representation change error:', err);
      setError('구조 표현 방식 변경 중 오류가 발생했습니다: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [currentStructure, loadStructure]);

  // 색상 체계 변경
  const changeColorScheme = useCallback(async (newColor: string) => {
    if (!stageInstanceRef.current || !currentStructure) return;

    try {
      setColorScheme(newColor);
      setIsLoading(true);
      setError('');
      
      console.log('Changing color scheme to:', newColor);
      
      // 기존 구조 제거
      stageInstanceRef.current.removeAllComponents();
      
      // 새 색상 체계로 구조 다시 로드
      await loadStructure(currentStructure);
      
    } catch (err) {
      console.error('Color scheme change error:', err);
      setError('색상 체계 변경 중 오류가 발생했습니다: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [currentStructure, loadStructure]);

  // 뷰 리셋
  const resetView = useCallback(() => {
    if (stageInstanceRef.current) {
      stageInstanceRef.current.autoView();
    }
  }, []);

  // 스크린샷 촬영
  const takeScreenshot = useCallback(() => {
    if (stageInstanceRef.current) {
      try {
        const canvas = stageInstanceRef.current.getImage();
        const link = document.createElement('a');
        link.download = `protein-structure-${currentStructure?.id || 'unknown'}-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (err) {
        console.error('Screenshot error:', err);
        setError('스크린샷 촬영에 실패했습니다.');
      }
    }
  }, [currentStructure]);

  // 컴포넌트 마운트 시 Stage 초기화
  useEffect(() => {
    console.log('ProteinSimulation component mounted for structural biology research');
    
    // DOM이 준비된 후 Stage 초기화
    const timer = setTimeout(() => {
      initializeStage();
    }, 300);

    return () => {
      clearTimeout(timer);
      if (stageInstanceRef.current) {
        console.log('Disposing NGL Stage...');
        stageInstanceRef.current.dispose();
        stageInstanceRef.current = null;
      }
      setIsStageReady(false);
    };
  }, [initializeStage]);

  // 윈도우 리사이즈 처리
  useEffect(() => {
    const handleResize = () => {
      if (stageInstanceRef.current && stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        stageInstanceRef.current.setSize(rect.width, rect.height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="protein-simulation">
      <div className="main-content">
        <div className="controls-panel">
          <div className="control-section">
            <h3>구조 파일 업로드</h3>
            <input
              type="file"
              accept=".pdb,.cif,.ent"
              onChange={handleFileUpload}
              className="file-input"
            />
            <p className="file-info">지원 형식: PDB, CIF, ENT</p>
            <p className="file-info" style={{ marginTop: '5px', fontSize: '0.8rem', color: '#888888' }}>
              원소를 명확하게 보려면 "Ball+Stick" 표현과 "Element" 색상을 사용하세요
            </p>
          </div>

          <div className="control-section">
            <h3>PDB 데이터베이스 검색</h3>
            <div className="pdb-search">
              <input
                type="text"
                placeholder="예: 7VCF, 1UBQ, 1CRN, 6LU7"
                value={pdbId}
                onChange={(e) => {
                  setPdbId(e.target.value);
                  // 실시간 검색 (입력 후 500ms 대기)
                  if (e.target.value.trim()) {
                    if (searchTimeoutRef.current) {
                      clearTimeout(searchTimeoutRef.current);
                    }
                    searchTimeoutRef.current = setTimeout(() => {
                      if (e.target.value.trim()) {
                        handlePdbIdSearch();
                      }
                    }, 500);
                  } else {
                    setSearchResults([]);
                    setError('');
                  }
                }}
                onKeyPress={(e) => e.key === 'Enter' && handlePdbIdSearch()}
                className="pdb-input"
              />
              <button 
                onClick={handlePdbIdSearch}
                disabled={!pdbId.trim() || isLoading || !isStageReady}
                className="search-btn"
              >
                검색
              </button>
            </div>
            {isSearching && (
              <div className="search-results">
                <h4>검색 결과:</h4>
                {searchResults.length > 0 ? (
                  <ul className="search-results-list">
                    {searchResults.map((result, index) => (
                      <li 
                        key={index} 
                        className="search-result-item"
                        onClick={() => handleStructureSelect(result)}
                      >
                        <div className="result-header">
                          <strong className="pdb-id">{result.pdb_id}</strong>
                          <span className="resolution">
                            {result.resolution ? `${result.resolution}Å` : 'N/A'}
                          </span>
                          {result.exists && <span className="status-badge available">사용 가능</span>}
                          {!result.exists && <span className="status-badge predicted">예측 구조</span>}
                          {result.source && <span className="source-badge">{result.source}</span>}
                        </div>
                        <div className="result-title">{result.title}</div>
                        <div className="result-details">
                          <span className="organism">{result.organism}</span>
                          <span className="method">{result.method}</span>
                          {result.uniprot_id && (
                            <span className="uniprot-id">UniProt: {result.uniprot_id}</span>
                          )}
                        </div>
                        {result.exists && (result.hasPdb || result.hasCif) && (
                          <div className="copy-buttons">
                            {result.hasPdb && (
                              <button 
                                className="copy-btn pdb-copy"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyPdb(result.pdb_id);
                                }}
                              >
                                <i className="fas fa-copy"></i> PDB 복사
                              </button>
                            )}
                            {result.hasCif && (
                              <button 
                                className="copy-btn cif-copy"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyCif(result.pdb_id);
                                }}
                              >
                                <i className="fas fa-copy"></i> CIF 복사
                              </button>
                            )}
                          </div>
                        )}
                        {result.url && result.source === 'PDB-101' && (
                          <div className="pdb101-actions">
                            <a 
                              href={result.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="pdb101-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="fas fa-external-link-alt"></i> PDB-101 보기
                            </a>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-results">검색 결과가 없습니다.</p>
                )}
              </div>
            )}
          </div>

          <div className="control-section">
            <h3>구조 표현 방식</h3>
            <select
              value={representation}
              onChange={(e) => changeRepresentation(e.target.value)}
              className="representation-select"
              disabled={!isStageReady}
            >
              <option value="cartoon">Cartoon (리본) - 2차 구조 분석</option>
              <option value="ball+stick">Ball+Stick (공+막대) - 원자 수준 분석</option>
              <option value="spacefill">Spacefill (공간 채움) - 분자 표면 분석</option>
              <option value="surface">Surface (표면) - 결합 부위 분석</option>
              <option value="line">Line (선) - 골격 구조 분석</option>
              <option value="ribbon">Ribbon (리본) - 단백질 접힘 분석</option>
              <option value="hyperball">Hyperball (하이퍼볼) - 결합 분석</option>
              <option value="licorice">Licorice (감초) - 원자 결합 분석</option>
            </select>
          </div>

          <div className="control-section">
            <h3>생물학적 색상 체계</h3>
            <select
                      value={colorScheme}
                      onChange={(e) => changeColorScheme(e.target.value)}
              className="color-select"
              disabled={!isStageReady}
            >
              <option value="element">Element (원소별) - 화학적 분석</option>
              <option value="chainid">Chain ID (체인별) - 다중체 분석</option>
              <option value="residueindex">Residue Index (잔기 순서) - 서열 분석</option>
              <option value="resname">Residue Name (잔기 이름) - 기능적 분석</option>
              <option value="atomindex">Atom Index (원자 순서) - 원자 수준 분석</option>
              <option value="uniform">Uniform (단일 색상) - 구조 분석</option>
              <option value="bfactor">B-Factor (온도 인자) - 동적 분석</option>
              <option value="sstruc">Secondary Structure (2차 구조) - 접힘 분석</option>
            </select>
          </div>

          <div className="control-section">
            <h3>뷰어 제어</h3>
            <div className="viewer-controls">
              <button 
                onClick={resetView} 
                className="control-btn"
                disabled={!isStageReady}
              >
                뷰 리셋
              </button>
              <button 
                onClick={takeScreenshot} 
                className="control-btn"
                disabled={!isStageReady}
              >
                스크린샷
              </button>
            </div>
          </div>

          <div className="control-section">
            <h3>원소 시각화</h3>
            <div className="element-controls">
              <button 
                onClick={async () => {
                  if (stageInstanceRef.current && currentStructure) {
                    try {
                      setIsLoading(true);
                      setError('');
                      setColorScheme('element');
                      
                      // 기존 구조 제거
                      stageInstanceRef.current.removeAllComponents();
                      
                      // 새 색상 체계로 구조 다시 로드
                      await loadStructure(currentStructure);
                    } catch (err) {
                      console.error('Element color change error:', err);
                      setError('원소별 색상 변경 중 오류가 발생했습니다: ' + (err as Error).message);
                    } finally {
                      setIsLoading(false);
                    }
                  }
                }}
                className="control-btn"
                disabled={!isStageReady || isLoading}
              >
                원소별 색상
              </button>
              <button 
                onClick={async () => {
                  if (stageInstanceRef.current && currentStructure) {
                    try {
                      setIsLoading(true);
                      setError('');
                      setRepresentation('ball+stick');
                      
                      // 기존 구조 제거
                      stageInstanceRef.current.removeAllComponents();
                      
                      // 새 표현으로 구조 다시 로드
                      await loadStructure(currentStructure);
                    } catch (err) {
                      console.error('Ball+Stick mode change error:', err);
                      setError('Ball+Stick 모드 변경 중 오류가 발생했습니다: ' + (err as Error).message);
                    } finally {
                      setIsLoading(false);
                    }
                  }
                }}
                className="control-btn"
                disabled={!isStageReady || isLoading}
              >
                Ball+Stick 모드
              </button>
            </div>
          </div>



          {/* 하이라이트 정보 표시 */}
          {highlightInfo && (
            <div className="control-section">
              <h3>하이라이트 정보</h3>
              <div className="highlight-info">
                <div className="highlight-item">
                  <span className="highlight-label">잔기명:</span>
                  <span className="highlight-value">{highlightInfo.residueName}</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-label">체인:</span>
                  <span className="highlight-value">{highlightInfo.chain}</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-label">번호:</span>
                  <span className="highlight-value">{highlightInfo.residueNumber}</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-label">원자:</span>
                  <span className="highlight-value">{highlightInfo.atom}</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-label">좌표:</span>
                  <span className="highlight-value">
                    x={highlightInfo.coordinates.x}, y={highlightInfo.coordinates.y}, z={highlightInfo.coordinates.z}
                  </span>
                </div>
                <p className="highlight-description">
                  클릭한 부분의 중합체를 표시합니다.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="viewer-panel">
          <div className="viewer-container">
            {!isStageReady && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <p>NGL Stage를 초기화하는 중...</p>
                <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>생명과학 연구를 위한 최적화 중</p>
              </div>
            )}
            
            {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <p>단백질 구조를 분석하는 중...</p>
                <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>구조 생물학 데이터 처리 중</p>
              </div>
            )}
            
            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={() => setError('')} className="error-close-btn">
                  닫기
                </button>
              </div>
            )}
            
            <div ref={stageRef} className="ngl-viewer" />
          </div>
        </div>
      </div>
      
      {/* 페이지 하단 푸터 정보 */}
      <div className="page-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>📚 사용법</h4>
            <ul>
              <li>PDB/CIF 파일을 업로드하거나 텍스트로 붙여넣기</li>
              <li>다양한 시각화 스타일과 색상 옵션 선택</li>
              <li>구조를 클릭하여 잔기 정보 확인</li>
              <li>카메라 컨트롤로 3D 구조 탐색</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>🔗 프로젝트</h4>
            <a 
              href="https://github.com/pistolinkr/alphafold2-viewer/tree/main" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
            >
              <i className="fab fa-github"></i>
              <span>AlphaFold2 Viewer</span>
            </a>
            <p className="project-desc">MIT 라이센스 하에 배포되는 단백질 구조 시각화 도구</p>
          </div>
          
          <div className="footer-section">
            <h4>📄 라이선스</h4>
            <div className="license-info">
              <p><strong>프로젝트:</strong> MIT 라이센스</p>
              <p><strong>NGL Viewer:</strong> MIT 라이센스</p>
              <p><strong>Font Awesome:</strong> MIT 라이센스</p>
              <p className="license-note">자세한 내용은 GitHub 프로젝트에서 확인하세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProteinSimulation;
