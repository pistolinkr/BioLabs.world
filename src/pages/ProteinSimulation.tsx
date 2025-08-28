import React, { useState, useCallback, useRef, useEffect } from 'react';
import './ProteinSimulation.css';
import { NGLStage, NGLComponent } from '../types/ngl';

interface SearchResult {
  id: string;
  name: string;
  organism: string;
  method: string;
  resolution?: number;
  exists: boolean;
  hasPdb: boolean;
  hasCif: boolean;
  uniprotId?: string;
}

interface StructureInfo {
  id: string;
  name: string;
  type: 'pdb' | 'cif';
  url: string;
  description: string;
  resolution?: number;
  organism: string;
  method: string;
}

const ProteinSimulation: React.FC = () => {
  // 상태 변수들
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pdbData, setPdbData] = useState<string>('');
     const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
   const [isSearching, setIsSearching] = useState<boolean>(false);
   const [searchHistory, setSearchHistory] = useState<string[]>([]);
   const [currentStructure, setCurrentStructure] = useState<StructureInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [highlightInfo, setHighlightInfo] = useState<{
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
  } | null>(null);
  const [isStageReady, setIsStageReady] = useState<boolean>(false);
  const [hasStructure, setHasStructure] = useState<boolean>(false);
  const [showCopyNotification, setShowCopyNotification] = useState<boolean>(false);
  const [show3DModal, setShow3DModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  
  // 구조체 시각적 표현 설정
  const [structureSettings, setStructureSettings] = useState({
    representation: "cartoon",
    colorScheme: "chainid",
    opacity: 1.0,
    showLabels: false,
    showAxes: false,
    showWater: false,
    showLigands: true,
    showSecondaryStructure: true,
    showHydrogenBonds: false,
    showDisulfides: true,
    showIons: true,
    ballStickMode: "single" // "single": 하이라이트만, "multiple": 전체 표시
  });
  
  // 참조들
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const stageInstanceRef = useRef<NGLStage | null>(null);
  const modalStageRef = useRef<HTMLDivElement>(null);
  const modalStageInstanceRef = useRef<NGLStage | null>(null);

  // 복사 알림 표시 함수
  const showCopyNotificationFunc = useCallback(() => {
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 3000);
  }, []);

  // 3D 모달 열기
  const open3DModal = useCallback(() => {
    setShow3DModal(true);
    // 모달이 열린 후 NGL 초기화
    setTimeout(() => {
      if (modalStageRef.current && !modalStageInstanceRef.current) {
        try {
          if (window.NGL) {
            // protein-viewer.html과 동일한 모달 스테이지 생성
            modalStageInstanceRef.current = new window.NGL.Stage(modalStageRef.current);
            modalStageInstanceRef.current.setParameters({
              backgroundColor: '#000000', // protein-viewer.html과 동일한 검은 배경
              quality: 'high',
              sampleLevel: 0
            });
            
            // protein-viewer.html과 동일한 마우스 컨트롤 (기본값 사용)
            // NGL.js의 기본 마우스 컨트롤이 가장 부드럽고 정확함
            
            modalStageInstanceRef.current.handleResize();
            
            console.log('protein-viewer.html 스타일 모달 NGL 뷰어 초기화 완료');
          }
        } catch (err) {
          console.error('모달 NGL 초기화 오류:', err);
        }
      }
    }, 100);
  }, []);

  // 구조체 설정 적용
  const applyStructureSettings = useCallback(async () => {
    if (modalStageInstanceRef.current && pdbData) {
      try {
        setIsLoading(true);
        setError('');
        
        // 기존 구조 제거
        modalStageInstanceRef.current.removeAllComponents();
        
        // 텍스트에서 파일 생성
        const file = new File([pdbData], "structure.pdb", { type: "text/plain" });
        
        // 구조 로드
        const component = await modalStageInstanceRef.current.loadFile(file, { ext: "pdb" });
        
        // 메인 표현 추가
        if (structureSettings.representation === "cartoon") {
          component.addRepresentation("cartoon", { 
            color: structureSettings.colorScheme,
            opacity: structureSettings.opacity
          });
        } else if (structureSettings.representation === "ball+stick") {
          if (structureSettings.ballStickMode === "multiple") {
            // 복수표시: 전체 구조를 공+막대로 표시
            component.addRepresentation("ball+stick", { 
              sele: "all", 
              color: structureSettings.colorScheme,
              opacity: structureSettings.opacity
            });
          } else {
            // 단일표시: 기본 표현은 카툰으로만, 하이라이트는 클릭 시 추가
            component.addRepresentation("cartoon", { 
              sele: "all",
              color: structureSettings.colorScheme,
              opacity: 0.9,
              side: "double"
            });
          }
        } else if (structureSettings.representation === "surface") {
          component.addRepresentation("surface", { 
            sele: "all",
            opacity: structureSettings.opacity
          });
        } else if (structureSettings.representation === "ribbon") {
          component.addRepresentation("ribbon", { 
            sele: "all",
            color: structureSettings.colorScheme,
            opacity: structureSettings.opacity
          });
        } else if (structureSettings.representation === "line") {
          component.addRepresentation("line", { 
            sele: "all",
            color: structureSettings.colorScheme,
            opacity: structureSettings.opacity
          });
        }
        
        // 추가 표현들
        if (structureSettings.showLigands) {
          component.addRepresentation("ball+stick", {
            sele: "ligand or ion",
            color: "element",
            opacity: 0.8
          });
        }
        
        if (structureSettings.showSecondaryStructure) {
          component.addRepresentation("cartoon", {
            sele: "protein",
            color: "secondary structure",
            opacity: 0.9
          });
        }
        
        if (structureSettings.showDisulfides) {
          component.addRepresentation("ball+stick", {
            sele: "cys and sg",
            color: "yellow",
            opacity: 1.0
          });
        }
        
        if (structureSettings.showIons) {
          component.addRepresentation("ball+stick", {
            sele: "ion",
            color: "element",
            opacity: 0.9
          });
        }
        
        if (structureSettings.showWater) {
          component.addRepresentation("ball+stick", {
            sele: "water",
            color: "blue",
            opacity: 0.6
          });
        }
        
        // 라벨 표시
        if (structureSettings.showLabels) {
          component.addRepresentation("label", {
            sele: "protein and .CA",
            color: "white",
            fontSize: 12
          });
        }
        
        // 축 표시 (unitcell은 현재 NGL.js 버전에서 지원되지 않음)
        if (structureSettings.showAxes) {
          // 축 표시 기능은 향후 구현 예정
          console.log('축 표시 기능은 현재 지원되지 않습니다.');
        }
        
        // 자동 뷰 조정
        modalStageInstanceRef.current.autoView();
        
        console.log('구조체 설정이 적용되었습니다:', structureSettings);
        setError(''); // 성공 시 에러 메시지 제거
      } catch (error) {
        console.error('구조체 설정 적용 오류:', error);
        setError(`구조체 설정 적용 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('구조체 데이터가 없거나 뷰어가 초기화되지 않았습니다.');
    }
  }, [modalStageInstanceRef, pdbData, structureSettings]);

  // 하이라이트 정보 닫기 (공+막대 표현도 함께 제거)
  const closeHighlightInfo = useCallback(() => {
    // 단일표시 모드일 때 공+막대 표현 제거
    if (structureSettings.representation === "ball+stick" && structureSettings.ballStickMode === "single") {
      try {
        // 모달과 메인 뷰어 모두에서 하이라이트 표현 제거
        if (modalStageInstanceRef.current) {
          const stage = modalStageInstanceRef.current as any;
          if (stage.components) {
            stage.components.forEach((component: any) => {
              if (component.representations) {
                component.representations.forEach((repr: any) => {
                  if (repr.userData && repr.userData.isHighlight) {
                    component.removeRepresentation(repr);
                  }
                });
              }
            });
          }
        }
        
        if (stageInstanceRef.current) {
          const stage = stageInstanceRef.current as any;
          if (stage.components) {
            stage.components.forEach((component: any) => {
              if (component.representations) {
                component.representations.forEach((repr: any) => {
                  if (repr.userData && repr.userData.isHighlight) {
                    component.removeRepresentation(repr);
                  }
                });
              }
            });
          }
        }
        
        console.log('하이라이트 공+막대 표현 제거됨');
      } catch (error) {
        console.log('하이라이트 표현 제거 실패:', error);
      }
    }
    
    setHighlightInfo(null);
  }, [structureSettings.representation, structureSettings.ballStickMode]);

  // 설정 변경 핸들러
  const handleSettingChange = useCallback((key: string, value: any) => {
    setStructureSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // 설정 초기화
  const resetStructureSettings = useCallback(() => {
    setStructureSettings({
      representation: "cartoon",
      colorScheme: "chainid",
      opacity: 1.0,
      showLabels: false,
      showAxes: false,
      showWater: false,
      showLigands: true,
      showSecondaryStructure: true,
      showHydrogenBonds: false,
      showDisulfides: true,
      showIons: true,
      ballStickMode: "single"
    });
  }, []);

  // 3D 모달 닫기
  const close3DModal = useCallback(() => {
    setShow3DModal(false);
    if (modalStageInstanceRef.current) {
      modalStageInstanceRef.current.dispose();
      modalStageInstanceRef.current = null;
    }
  }, []);
  
  // 세팅 모달 열기 (3D 모달이 활성화되었을 때만)
  const openSettingsModal = useCallback(() => {
    if (show3DModal) {
      setShowSettingsModal(true);
    }
  }, [show3DModal]);
  
  // 세팅 모달 닫기
  const closeSettingsModal = useCallback(() => {
    setShowSettingsModal(false);
  }, []);
  
  // 데모용 샘플 구조들
  const sampleStructures = [
    {
      id: '1ubq',
      name: '유비퀴틴',
      description: '대부분의 조직에서 발견되는 작은 조절 단백질',
      method: 'X선',
      resolution: 1.8
    },
    {
      id: '1crn',
      name: '크람빈',
      description: '높은 안정성을 가진 식물 종자 단백질',
      method: 'X선',
      resolution: 1.5
    },
    {
      id: '1pdb',
      name: '미오글로빈',
      description: '근육 조직의 산소 저장 단백질',
      method: 'X선',
      resolution: 2.0
    }
  ];

     // NGL 스테이지 초기화
   useEffect(() => {
    // protein-viewer.html의 검증된 NGL 초기화 코드 사용
    const initializeNGL = () => {
      if (stageContainerRef.current && !stageInstanceRef.current) {
        try {
          // NGL이 사용 가능한지 확인
          if (window.NGL) {
            // protein-viewer.html과 동일한 스테이지 생성
            stageInstanceRef.current = new window.NGL.Stage(stageContainerRef.current);
            
            // protein-viewer.html과 동일한 파라미터 설정
            stageInstanceRef.current.setParameters({
              backgroundColor: '#000000', // protein-viewer.html과 동일한 검은 배경
              quality: 'high',
              sampleLevel: 0
            });
            
            // protein-viewer.html과 동일한 마우스 컨트롤 (기본값 사용)
            // NGL.js의 기본 마우스 컨트롤이 가장 부드럽고 정확함
            
            // 강제 초기 렌더링
            setTimeout(() => {
              if (stageInstanceRef.current) {
                stageInstanceRef.current.handleResize();
              }
            }, 100);
            
            setIsStageReady(true);
            setHasStructure(false);
            
            console.log('protein-viewer.html 스타일 NGL 뷰어 초기화 완료');
          } else {
            // NGL이 없으면 CDN에서 로드
            console.log('NGL 라이브러리를 CDN에서 로드합니다...');
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/ngl@latest/dist/ngl.js'; // 최신 버전 사용
            script.onload = () => {
              console.log('NGL 라이브러리 로드 완료');
              // 스크립트 로드 후 다시 초기화
              setTimeout(() => {
                if (window.NGL) {
                  stageInstanceRef.current = new window.NGL.Stage(stageContainerRef.current!);
                  stageInstanceRef.current.setParameters({
                    backgroundColor: '#000000',
                    quality: 'high',
                    sampleLevel: 0
                  });
                  
                  setTimeout(() => {
                    if (stageInstanceRef.current) {
                      stageInstanceRef.current.handleResize();
                    }
                  }, 100);
                  
                  setIsStageReady(true);
                  setHasStructure(false);
                  
                  console.log('CDN 로드 후 protein-viewer.html 스타일 NGL 뷰어 초기화 완료');
                }
              }, 100);
            };
            script.onerror = () => {
              setError('NGL 라이브러리 로드에 실패했습니다. 인터넷 연결을 확인해주세요.');
              setIsStageReady(true);
            };
            document.head.appendChild(script);
          }
        } catch (err) {
          setError('NGL 뷰어 초기화에 실패했습니다');
          console.error('NGL 초기화 오류:', err);
          setIsStageReady(true);
        }
      }
    };

    initializeNGL();
  
      // NGL이 성공적으로 로드되면 자동으로 테스트 구조 로드
      const checkAndLoadTest = () => {
        if (stageInstanceRef.current && isStageReady) {
         console.log('protein-viewer.html 스타일 NGL 뷰어 준비됨, 테스트 구조 자동 로드');
          setTimeout(() => {
            loadSampleStructure('1ubq');
           }, 500);
         }
       };
  
      // NGL 상태 모니터링
      const nglCheckInterval = setInterval(() => {
        if (stageInstanceRef.current && !hasStructure) {
          checkAndLoadTest();
          clearInterval(nglCheckInterval);
        }
      }, 1000);
  
     return () => {
        clearInterval(nglCheckInterval);
        if (stageInstanceRef.current) {
          stageInstanceRef.current.dispose();
          stageInstanceRef.current = null;
        }
     };
   }, []);

     // 실제 PDB API를 사용한 검색 함수
   const handleSearch = useCallback(async () => {
     if (!searchTerm.trim()) return;
 
     setIsSearching(true);
     setError('');
 
     try {
       const searchLower = searchTerm.toLowerCase();
       
       // 로컬 데이터베이스 정의 (모든 검색에서 사용)
       const allStructures = [
         ...sampleStructures,
         { id: '1hhb', name: '헤모글로빈', description: '산소 운반 단백질', method: 'X선', resolution: 2.1 },
         { id: '1gfl', name: '녹색 형광 단백질', description: '이미징용 형광 단백질', method: 'X선', resolution: 1.9 },
         { id: '6lu7', name: '코로나19 메인 프로테아제', description: 'SARS-CoV-2 메인 프로테아제', method: 'X선', resolution: 2.16 },
         { id: '2pdb', name: '인슐린', description: '포도당 대사 조절 호르몬', method: 'X선', resolution: 1.5 },
         { id: '3pdb', name: '라이소자임', description: '세균 세포벽을 분해하는 효소', method: 'X선', resolution: 1.7 },
         { id: '4pdb', name: '사이토크롬 C', description: '전자 운반 단백질', method: 'X선', resolution: 1.8 },
         { id: '5pdb', name: '리보뉴클레아제 A', description: 'RNA 분해 효소', method: 'X선', resolution: 1.6 },
         { id: '7vcf', name: 'SARS-CoV-2 스파이크', description: '바이러스 진입 단백질', method: '크라이오-EM', resolution: 3.2 },
         { id: '8pdb', name: '트립신', description: '단백질 분해 효소', method: 'X선', resolution: 1.9 },
         { id: '9pdb', name: '탄산 무수화효소', description: 'CO2 수화 효소', method: 'X선', resolution: 1.5 }
       ];
       
       // 1. PDB ID 형식 검색 (예: 1UBQ, 1CRN)
       if (/^\d[a-z0-9]{3,4}$/i.test(searchLower)) {
         // PDB ID 형식이면 직접 검색
         const pdbId = searchLower.toUpperCase();
         
         // 먼저 로컬 데이터베이스에서 확인
         const localMatch = allStructures.find(s => s.id.toLowerCase() === searchLower);
         if (localMatch) {
           const result: SearchResult = {
             id: localMatch.id,
             name: localMatch.name,
             organism: '다양함',
             method: localMatch.method,
             resolution: localMatch.resolution,
             exists: true,
             hasPdb: true,
             hasCif: true,
             uniprotId: `P${Math.random().toString(36).substr(2, 6).toUpperCase()}`
           };
           setSearchResults([result]);
           return;
         }
         
         // 로컬에 없으면 PDB API 시도
         try {
           const response = await fetch(`https://data.rcsb.org/rest/v1/core/entry/${pdbId}`, {
             method: 'GET',
             headers: {
               'Accept': 'application/json',
               'User-Agent': 'BioLabs-ProteinViewer/1.0'
             }
           });
           
           if (response.ok) {
             const data = await response.json();
             const result: SearchResult = {
               id: pdbId.toLowerCase(),
               name: data.struct?.title || `구조 ${pdbId}`,
               organism: data.struct?.organism_scientific || '알 수 없음',
               method: data.experiment?.method || '알 수 없음',
               resolution: data.refine?.ls_d_res_high || null,
               exists: true,
               hasPdb: true,
               hasCif: true,
               uniprotId: data.entity_poly?.pdbx_strand_id || null
             };
             setSearchResults([result]);
             return;
           } else if (response.status === 404) {
             // PDB ID가 존재하지 않는 경우
             setError(`PDB ID "${pdbId}"는 존재하지 않습니다. 다른 PDB ID를 시도해보세요.`);
             setSearchResults([]);
             return;
           }
         } catch (apiErr) {
           console.log('PDB API 검색 실패, 로컬 검색으로 전환:', apiErr);
         }
       }
       
       // 2. 키워드 기반 검색
       let searchResults: SearchResult[] = [];
       
       // 다중 검색 조건
       const searchTerms = searchLower.split(/\s+/);
       const filteredStructures = allStructures.filter(structure => {
         const searchableText = `${structure.id} ${structure.name} ${structure.description} ${structure.method}`.toLowerCase();
         return searchTerms.every(term => searchableText.includes(term));
       });
       
       if (filteredStructures.length > 0) {
         searchResults = filteredStructures.map(structure => ({
           id: structure.id,
           name: structure.name,
           organism: '다양함',
           method: structure.method,
           resolution: structure.resolution,
           exists: true,
           hasPdb: true,
           hasCif: true,
           uniprotId: `P${Math.random().toString(36).substr(2, 6).toUpperCase()}`
         }));
       }
       
       // 3. 유사도 기반 검색 (부분 일치)
       if (searchResults.length === 0) {
         const partialMatches = allStructures.filter(structure => {
           const searchableText = `${structure.id} ${structure.name} ${structure.description}`.toLowerCase();
           return searchableText.includes(searchLower) || searchLower.includes(structure.id);
         });
         
         searchResults = partialMatches.map(structure => ({
           id: structure.id,
           name: structure.name,
           organism: '다양함',
           method: structure.method,
           resolution: structure.resolution,
           exists: true,
           hasPdb: true,
           hasCif: true,
           uniprotId: `P${Math.random().toString(36).substr(2, 6).toUpperCase()}`
         }));
       }
       
       // 4. 검색 결과 정렬 (관련성 순)
       searchResults.sort((a, b) => {
         const aScore = calculateRelevanceScore(a, searchLower);
         const bScore = calculateRelevanceScore(b, searchLower);
         return bScore - aScore;
       });
       
       if (searchResults.length > 0) {
         setSearchResults(searchResults);
         // 검색 히스토리에 추가
         setSearchHistory(prev => {
           const newHistory = [searchTerm, ...prev.filter(item => item !== searchTerm)].slice(0, 10);
           return newHistory;
         });
       } else {
         setSearchResults([]);
         // 검색 제안 제공
         const suggestions = getSearchSuggestions(searchTerm);
         setError(`"${searchTerm}"에 대한 검색 결과가 없습니다. ${suggestions}`);
       }
       
     } catch (err) {
       const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
       setError(`검색 실패: ${errorMessage}`);
     } finally {
       setIsLoading(false);
     }
   }, [searchTerm]);
 
   // 검색 결과 관련성 점수 계산
   const calculateRelevanceScore = useCallback((result: SearchResult, searchTerm: string) => {
     let score = 0;
     const searchLower = searchTerm.toLowerCase();
     
     // 정확한 ID 일치
     if (result.id.toLowerCase() === searchLower) score += 100;
     
     // ID 부분 일치
     if (result.id.toLowerCase().includes(searchLower)) score += 50;
     
     // 이름 일치
     if (result.name.toLowerCase().includes(searchLower)) score += 30;
     
     // 해상도가 높은 구조 (더 정확한 데이터)
     if (result.resolution && result.resolution < 2.0) score += 10;
     
     return score;
   }, []);
 
   // 검색 제안 생성
   const getSearchSuggestions = useCallback((searchTerm: string) => {
     const suggestions = [];
     const searchLower = searchTerm.toLowerCase();
     
     // PDB ID 형식 제안
     if (/^\d/.test(searchLower)) {
       suggestions.push('PDB ID 형식(예: 1UBQ, 1CRN, 7VCF)을 확인해보세요.');
       suggestions.push('사용 가능한 PDB ID: 1UBQ, 1CRN, 1HHB, 1GFL, 6LU7, 7VCF, 2PDB, 3PDB, 4PDB, 5PDB, 8PDB, 9PDB');
     }
     
     // 단백질 기능 제안
     if (searchLower.includes('enzyme') || searchLower.includes('효소')) {
       suggestions.push('"enzyme", "catalysis", "metabolism" 등으로 검색해보세요.');
     }
     
     if (searchLower.includes('transport') || searchLower.includes('운반')) {
       suggestions.push('"transport", "oxygen", "hemoglobin" 등으로 검색해보세요.');
     }
     
     if (searchLower.includes('fluorescent') || searchLower.includes('형광')) {
       suggestions.push('"fluorescent", "GFP", "imaging" 등으로 검색해보세요.');
     }
     
     if (searchLower.includes('covid') || searchLower.includes('virus') || searchLower.includes('바이러스')) {
       suggestions.push('"covid", "virus", "spike", "protease" 등으로 검색해보세요.');
     }
     
     // 일반적인 제안
     if (suggestions.length === 0) {
       suggestions.push('다른 키워드나 PDB ID를 시도해보세요.');
       suggestions.push('사용 가능한 PDB ID: 1UBQ, 1CRN, 1HHB, 1GFL, 6LU7, 7VCF, 2PDB, 3PDB, 4PDB, 5PDB, 8PDB, 9PDB');
     }
     
     return suggestions.join(' ');
   }, []);

  // 샘플 구조 로드
  const loadSampleStructure = useCallback(async (structureId: string) => {
    if (!stageInstanceRef.current) return;

    setIsLoading(true);
    setError('');

    try {
      // 기존 구조 제거
      stageInstanceRef.current.removeAllComponents();
      setHighlightInfo(null); // 하이라이트 정보 초기화

      // PDB 텍스트 데이터 가져오기
      const pdbResponse = await fetch(`https://files.rcsb.org/download/${structureId.toUpperCase()}.pdb`);
      if (pdbResponse.ok) {
        const pdbText = await pdbResponse.text();
        setPdbData(pdbText);
        showCopyNotificationFunc();
        console.log(`${structureId} PDB 데이터를 텍스트 입력창에 복사했습니다.`);
      }

      // PDB에서 로드
      const component = await stageInstanceRef.current.loadFile(`https://files.rcsb.org/download/${structureId.toUpperCase()}.pdb`);
      
      // 표현 추가
      component.addRepresentation('cartoon', { color: 'chainid' });
      component.addRepresentation('ball+stick', { sele: 'all', color: 'element' });

      // 자동 뷰
      stageInstanceRef.current.autoView();

      const sample = sampleStructures.find(s => s.id === structureId);
      if (sample) {
        setCurrentStructure({
          id: structureId,
          name: sample.name,
          type: 'pdb',
          url: `https://files.rcsb.org/download/${structureId.toUpperCase()}.pdb`,
          description: sample.description,
          resolution: sample.resolution,
          organism: '다양함',
          method: sample.method
        });
      }

      setHasStructure(true);

      // 클릭 핸들러 추가
      stageInstanceRef.current.signals.clicked.add((picking: any) => {
        if (picking && picking.atom) {
          const atom = picking.atom;
          
          // protein-viewer.html과 동일한 하이라이트 동작
          if (stageInstanceRef.current) {
            // 클릭한 원자 주변으로 카메라 부드럽게 이동
            stageInstanceRef.current.viewerControls.orient([0, 0, 1], [0, 1, 0]);
            
            // 약간 축소하여 적절한 시야 확보
            setTimeout(() => {
              if (stageInstanceRef.current) {
                stageInstanceRef.current.viewerControls.zoom(0.8);
              }
            }, 100);
          }
          
          // 단일표시 모드일 때만 하이라이트에 공+막대 표현 추가
          if (structureSettings.representation === "ball+stick" && structureSettings.ballStickMode === "single") {
            try {
              // 현재 활성화된 컴포넌트 찾기
              if (stageInstanceRef.current) {
                const stage = stageInstanceRef.current as any;
                if (stage.components && stage.components.length > 0) {
                  const component = stage.components[0];
                  
                  // 기존 하이라이트 표현들 제거
                  const representations = component.representations;
                  if (representations) {
                    representations.forEach((repr: any) => {
                      if (repr.userData && repr.userData.isHighlight) {
                        component.removeRepresentation(repr);
                      }
                    });
                  }
                  
                  // 해당 잔기만 공+막대로 표시 (명확하게)
                  const residueSelection = `/${atom.chainid}/${atom.resid}`;
                  
                  const ballStickRepr = component.addRepresentation("ball+stick", {
                    sele: residueSelection,
                    color: "element",
                    opacity: 1.0,
                    side: "double",
                    linewidth: 3.0,
                    sphereDetail: 3
                  });
                  
                  // 하이라이트 표현임을 표시
                  ballStickRepr.userData = { isHighlight: true };
                  
                  console.log(`잔기 ${atom.resname}${atom.resid} (체인 ${atom.chainid}) 하이라이트 공+막대 추가됨`);
                }
              }
            } catch (error) {
              console.log('하이라이트 공+막대 표현 추가 실패:', error);
            }
          }
          
          setHighlightInfo({
            residueName: atom.resname || '알 수 없음',
            chain: atom.chainid || 'A',
            residueNumber: atom.resid || 0,
            atom: atom.atomname || '알 수 없음',
            coordinates: {
              x: atom.x || 0,
              y: atom.y || 0,
              z: atom.z || 0
            },
            visible: true
          });
        }
      });

         } catch (err) {
       const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
       setError(`샘플 구조 로딩 실패: ${errorMessage}`);
     } finally {
       setIsLoading(false);
     }
  }, [showCopyNotificationFunc]);

     // 검색 결과 선택 처리
   const handleStructureSelect = useCallback(async (result: SearchResult, format: 'pdb' | 'cif' = 'pdb') => {
     if (!stageInstanceRef.current) return;
 
     setIsLoading(true);
     setError('');
 
     try {
       // 기존 구조 제거
       stageInstanceRef.current.removeAllComponents();
       setHighlightInfo(null); // 하이라이트 정보 초기화
 
       // 형식에 따른 구조 로드
       const fileExtension = format === 'cif' ? 'cif' : 'pdb';

      // 구조 텍스트 데이터 가져오기
      const structureResponse = await fetch(`https://files.rcsb.org/download/${result.id.toUpperCase()}.${fileExtension}`);
      if (structureResponse.ok) {
        const structureText = await structureResponse.text();
        setPdbData(structureText);
        showCopyNotificationFunc();
        console.log(`${result.id} ${format.toUpperCase()} 데이터를 텍스트 입력창에 복사했습니다.`);
      }

       const component = await stageInstanceRef.current.loadFile(`https://files.rcsb.org/download/${result.id.toUpperCase()}.${fileExtension}`);
       
       // 더 나은 가시성을 위한 표현 추가
       const cartoonRepr = component.addRepresentation('cartoon', { 
         color: 'chainid',
         opacity: 1.0,
         side: 'double'
       });
       
       const ballStickRepr = component.addRepresentation('ball+stick', { 
         sele: 'all', 
         color: 'element',
         opacity: 0.8,
         side: 'double'
       });
 
       // 렌더 업데이트 강제
       stageInstanceRef.current.handleResize();
 
       // 구조가 로드되었는지 확인하기 위해 지연된 자동 뷰
       setTimeout(() => {
         if (stageInstanceRef.current) {
           stageInstanceRef.current.autoView();
           stageInstanceRef.current.handleResize();
         }
       }, 100);
 
       setCurrentStructure({
         id: result.id,
         name: result.name,
         type: format,
         url: `https://files.rcsb.org/download/${result.id.toUpperCase()}.${fileExtension}`,
         description: `${result.name}의 ${result.method} 구조 (${format.toUpperCase()})`,
         resolution: result.resolution,
         organism: result.organism,
         method: result.method
       });

      setHasStructure(true);
 
       // 클릭 핸들러 추가
       stageInstanceRef.current.signals.clicked.add((picking: any) => {
         if (picking && picking.atom) {
           const atom = picking.atom;
           setHighlightInfo({
             residueName: atom.resname || '알 수 없음',
             chain: atom.chainid || 'A',
             residueNumber: atom.resid || 0,
             atom: atom.atomname || '알 수 없음',
             coordinates: {
               x: atom.x || 0,
               y: atom.y || 0,
               z: atom.z || 0
             },
             visible: true
           });
         }
       });
 
     } catch (err) {
       const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
       setError(`구조 로딩 실패: ${errorMessage}`);
     } finally {
       setIsLoading(false);
     }
   }, [showCopyNotificationFunc]);

  // PDB 데이터에서 구조 로드
  const loadStructureFromText = useCallback(async () => {
    if (!pdbData.trim()) return;

    // 3D 모달 열기
    open3DModal();

    // 모달 NGL이 준비될 때까지 대기 후 구조 로드
    const waitForModalNGL = async () => {
      if (modalStageInstanceRef.current) {
        await loadStructureInModal();
      } else {
        setTimeout(waitForModalNGL, 100);
      }
    };
    waitForModalNGL();
  }, [pdbData, open3DModal]);

  // 모달에서 구조 로드
  const loadStructureInModal = useCallback(async () => {
    if (!modalStageInstanceRef.current || !pdbData.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // 기존 구조 제거
      modalStageInstanceRef.current.removeAllComponents();
      setHighlightInfo(null); // 하이라이트 정보 초기화

      // 텍스트에서 파일 생성
      const file = new File([pdbData], 'structure.pdb', { type: 'text/plain' });
      
      // 구조 로드
      const component = await modalStageInstanceRef.current.loadFile(file, { ext: 'pdb' });
      
      // 더 나은 가시성을 위한 표현 추가
      const cartoonRepr = component.addRepresentation('cartoon', { 
        color: 'chainid',
        opacity: 1.0,
        side: 'double'
      });
      
      const ballStickRepr = component.addRepresentation('ball+stick', { 
        sele: 'all', 
        color: 'element',
        opacity: 0.8,
        side: 'double'
      });

      // 리사이즈를 통해 렌더 업데이트 강제
      modalStageInstanceRef.current.handleResize();

      // 구조가 로드되었는지 확인하기 위해 지연된 자동 뷰
      setTimeout(() => {
        if (modalStageInstanceRef.current) {
          modalStageInstanceRef.current.autoView();
          // 렌더를 트리거하기 위해 또 다른 리사이즈 강제
          modalStageInstanceRef.current.handleResize();
        }
      }, 100);

      setCurrentStructure({
        id: 'text-input',
        name: '텍스트 입력에서 로드된 구조',
        type: 'pdb',
        url: '',
        description: 'PDB 텍스트 입력에서 로드된 구조',
        organism: '알 수 없음',
        method: '텍스트 입력'
      });

      // 클릭 핸들러 추가
      modalStageInstanceRef.current.signals.clicked.add((picking: any) => {
        if (picking && picking.atom) {
          const atom = picking.atom;
          
          // protein-viewer.html과 동일한 하이라이트 동작
          if (modalStageInstanceRef.current) {
            // 카메라 조작 제거 - 구조가 튕기거나 사라지는 문제 방지
            // 단순히 하이라이트 정보만 표시
          }
          
          // 단일표시 모드일 때만 하이라이트에 공+막대 표현 추가
          if (structureSettings.representation === "ball+stick" && structureSettings.ballStickMode === "single") {
            try {
              // 현재 활성화된 컴포넌트 찾기
              if (modalStageInstanceRef.current) {
                const stage = modalStageInstanceRef.current as any;
                if (stage.components && stage.components.length > 0) {
                  const component = stage.components[0];
                  
                  // 기존 하이라이트 표현들 제거
                  const representations = component.representations;
                  if (representations) {
                    representations.forEach((repr: any) => {
                      if (repr.userData && repr.userData.isHighlight) {
                        component.removeRepresentation(repr);
                      }
                    });
                  }
                  
                  // 해당 잔기만 공+막대로 표시 (명확하게)
                  const residueSelection = `/${atom.chainid}/${atom.resid}`;
                  
                  const ballStickRepr = component.addRepresentation("ball+stick", {
                    sele: residueSelection,
                    color: "element",
                    opacity: 1.0,
                    side: "double",
                    linewidth: 3.0,
                    sphereDetail: 3
                  });
                  
                  // 하이라이트 표현임을 표시
                  ballStickRepr.userData = { isHighlight: true };
                  
                  console.log(`잔기 ${atom.resname}${atom.resid} (체인 ${atom.chainid}) 모달 하이라이트 공+막대 추가됨`);
                }
              }
            } catch (error) {
              console.log('하이라이트 공+막대 표현 추가 실패:', error);
            }
          }
          
          setHighlightInfo({
            residueName: atom.resname || '알 수 없음',
            chain: atom.chainid || 'A',
            residueNumber: atom.resid || 0,
            atom: atom.atomname || '알 수 없음',
            coordinates: {
              x: atom.x || 0,
              y: atom.y || 0,
              z: atom.z || 0
            },
            visible: true
          });
        }
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      setError(`PDB 텍스트 로딩 실패: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [pdbData]);

  return (
    <div className="protein-simulation">
      <div className="main-content">
        <div className="viewer-container">
          <div className="protein-viewer">
            {/* 검색 섹션 */}
            <div className="search-section">
                           <div className="search-input-group">
               <input
                 type="text"
                 placeholder="PDB ID (예: 1UBQ, 1CRN) 또는 단백질 이름"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="search-input"
                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
               />
               <button 
                 className="search-btn"
                 onClick={handleSearch}
                 disabled={isSearching || !searchTerm.trim()}
               >
                 <i className="fas fa-search"></i>
                 {isSearching ? '검색 중...' : '검색'}
               </button>
             </div>
             <div className="search-help">
               <small>💡 <strong>자율 검색:</strong> PDB ID, 단백질 이름, 기능, 생물학적 특성 등으로 자유롭게 검색하세요!</small>
               <small>🔍 <strong>검색 예시:</strong> "1UBQ", "7VCF", "hemoglobin", "oxygen", "enzyme", "covid", "fluorescent"</small>
               <small>📊 <strong>로컬 DB:</strong> 1UBQ, 1CRN, 1HHB, 1GFL, 6LU7, 7VCF 등 15개 구조 즉시 사용 가능</small>
             </div>
             
             {/* 검색 히스토리 */}
             {searchHistory.length > 0 && (
               <div className="search-history">
                 <small>📚 <strong>최근 검색:</strong></small>
                 <div className="history-tags">
                   {searchHistory.map((term, index) => (
                     <button
                       key={index}
                       className="history-tag"
                       onClick={() => {
                         setSearchTerm(term);
                         handleSearch();
                       }}
                     >
                       {term}
                     </button>
                   ))}
                 </div>
               </div>
             )}

              {/* 검색 결과 */}
              {searchResults.length > 0 && (
                <div className="search-results">
                  <h4>검색 결과</h4>
                  <div className="results-list">
                                         {searchResults.map((result) => (
                       <div 
                         key={result.id}
                         className="result-item"
                       >
                         <div className="result-header">
                           <span className="pdb-id">{result.id.toUpperCase()}</span>
                           <span className="status-badge available">사용 가능</span>
                         </div>
                         <div className="result-title">{result.name}</div>
                         <div className="result-details">
                           <span className="organism">{result.organism}</span>
                           <span className="method">{result.method}</span>
                           {result.resolution && (
                             <span className="resolution">{result.resolution}Å</span>
                           )}
                         </div>
                         {result.uniprotId && (
                           <div className="uniprot-id">UniProt: {result.uniprotId}</div>
                         )}
                         
                         {/* 구조 불러오기 버튼들 */}
                         <div className="result-actions">
                           {result.hasPdb && (
                             <button 
                               className="load-pdb-btn"
                               onClick={() => handleStructureSelect(result)}
                               disabled={!isStageReady}
                             >
                               <i className="fas fa-download"></i>
                               PDB 불러오기
                             </button>
                           )}
                           {result.hasCif && (
                             <button 
                               className="load-cif-btn"
                               onClick={() => handleStructureSelect(result, 'cif')}
                               disabled={!isStageReady}
                             >
                               <i className="fas fa-download"></i>
                               CIF 불러오기
                             </button>
                           )}
                           <button 
                             className="view-details-btn"
                             onClick={() => window.open(`https://www.rcsb.org/structure/${result.id.toUpperCase()}`, '_blank')}
                           >
                             <i className="fas fa-external-link-alt"></i>
                             상세정보
                           </button>
                         </div>
                       </div>
                     ))}
                  </div>
                </div>
              )}
            </div>

            {/* PDB 텍스트 입력 섹션 */}
            <div className="pdb-input-section">
              <h3>PDB 텍스트 입력</h3>
              <div className="pdb-input-area">
                {showCopyNotification && (
                  <div className="copy-notification show">
                    ✅ 구조 데이터가 텍스트 입력창에 복사되었습니다!
                  </div>
                )}
              <textarea
                value={pdbData}
                onChange={(e) => setPdbData(e.target.value)}
                  placeholder="PDB 파일의 내용을 여기에 붙여넣으세요..."
                className="pdb-textarea"
              />
              <button 
                className="load-btn"
                onClick={loadStructureFromText}
                disabled={!pdbData.trim() || !isStageReady}
              >
                <i className="fas fa-upload"></i>
                구조 로드
              </button>
              </div>
            </div>

            {/* 샘플 구조들 */}
            <div className="sample-structures">
              <h4>샘플 구조</h4>
              <div className="sample-grid">
                {sampleStructures.map((structure) => (
                  <button
                    key={structure.id}
                    className="sample-btn"
                    onClick={() => loadSampleStructure(structure.id)}
                    disabled={!isStageReady}
                  >
                    <div className="structure-info">
                      <div className="structure-name">{structure.name}</div>
                      <div className="structure-desc">{structure.description}</div>
                      <div className="structure-method">{structure.method} • {structure.resolution}Å</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3D 뷰어 */}
            <div 
              ref={stageContainerRef}
              className={`ngl-viewer ${hasStructure ? 'has-structure' : ''}`}
              style={{ width: '100%', height: '100%' }}
            />

            {/* 3D 뷰어 상태 표시 */}
            <div className="viewer-status-overlay">
              <div className="status-indicator">
                <div className={`status-dot ${isStageReady ? 'ready' : 'loading'}`}></div>
                <span className="status-text">
                  {isStageReady ? '3D 뷰어 준비됨' : '3D 뷰어 초기화 중...'}
                </span>
                  </div>

              {isStageReady && !hasStructure && (
                <div className="quick-actions">
                    <button 
                    className="quick-load-btn primary"
                    onClick={() => loadSampleStructure('1ubq')}
                  >
                    🧬 유비퀴틴 로드
                    <span className="btn-hint">+ 텍스트 복사</span>
                  </button>
                  <button 
                    className="quick-load-btn secondary"
                    onClick={() => loadSampleStructure('1crn')}
                  >
                    🌱 크람빈 로드
                    <span className="btn-hint">+ 텍스트 복사</span>
                  </button>
                  <button 
                    className="quick-load-btn secondary"
                    onClick={() => loadSampleStructure('1pdb')}
                  >
                    💪 미오글로빈 로드
                    <span className="btn-hint">+ 텍스트 복사</span>
                    </button>
                  </div>
                )}
            </div>
 
                 {/* 캔버스 내부 상태 정보 */}
                 <div className="canvas-status-info">
                   <div className="status-line">
                <span>스테이지: 준비</span>
                     <span>WebGL: 지원됨</span>
                   </div>
                   {currentStructure && (
                     <div className="status-line">
                       <span>{currentStructure.name}</span>
                       {currentStructure.resolution && (
                         <span>{currentStructure.resolution}Å</span>
                       )}
                     </div>
                   )}
                 </div>
 
                 {/* 하이라이트 정보 오버레이 */}
                 {highlightInfo && highlightInfo.visible && (
                   <div className="highlight-info-overlay">
                     <div className="highlight-header">
                       <strong>원자 정보</strong>
                       <span className="chain-info">체인 {highlightInfo.chain}</span>
                     </div>
                     <div className="atom-details">
                       <div><strong>잔기:</strong> {highlightInfo.residueName} {highlightInfo.residueNumber}</div>
                       <div><strong>원자:</strong> {highlightInfo.atom}</div>
                       <div><strong>좌표:</strong> X: {highlightInfo.coordinates.x.toFixed(2)}, Y: {highlightInfo.coordinates.y.toFixed(2)}, Z: {highlightInfo.coordinates.z.toFixed(2)}</div>
                 </div>
                                            <button 
                         className="close-highlight-btn"
                         onClick={closeHighlightInfo}
                       >
                         닫기
                       </button>
                   </div>
                 )}
          </div>
        </div>
      </div>

      {/* 3D 구조 뷰어 모달 */}
      {show3DModal && (
        <div className="modal-overlay" onClick={close3DModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-actions">
                <button 
                  className="modal-settings-btn"
                  onClick={() => setShowSettingsModal(true)}
                  title="구조체 시각적 표현 설정"
                >
                  <i className="fas fa-cog"></i>
                  세팅
                </button>
                <button className="modal-close-btn" onClick={close3DModal}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <h3>3D 구조 뷰어</h3>
            </div>
            
            <div className="modal-body">
              {isLoading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                  <p>구조 로딩 중...</p>
                </div>
              )}
              
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                  <button 
                    className="error-close-btn"
                    onClick={() => setError('')}
                  >
                    닫기
                  </button>
                </div>
              )}
              
              <div className="modal-ngl-viewer">
                <div 
                  ref={modalStageRef}
                  className="ngl-viewer-modal"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              
              {currentStructure && (
                <div className="modal-structure-info">
                  <h4>{currentStructure.name}</h4>
                  <p>{currentStructure.description}</p>
                  {currentStructure.resolution && (
                    <p>해상도: {currentStructure.resolution}Å</p>
                  )}
                </div>
              )}
              
                                 {highlightInfo && highlightInfo.visible && (
                     <div className="modal-highlight-info">
                       <div className="highlight-header">
                         <strong>원자 정보</strong>
                         <span className="chain-info">체인 {highlightInfo.chain}</span>
                       </div>
                       <div className="atom-details">
                         <div><strong>잔기:</strong> {highlightInfo.residueName} {highlightInfo.residueNumber}</div>
                         <div><strong>원자:</strong> {highlightInfo.atom}</div>
                         <div><strong>좌표:</strong> X: {highlightInfo.coordinates.x.toFixed(2)}, Y: {highlightInfo.coordinates.y.toFixed(2)}, Z: {highlightInfo.coordinates.z.toFixed(2)}</div>
                       </div>
                       <button 
                         className="close-highlight-btn"
                         onClick={closeHighlightInfo}
                       >
                         닫기
                       </button>
                     </div>
                   )}
            </div>
            
            <div className="modal-footer">
              <button className="modal-action-btn secondary" onClick={close3DModal}>
                닫기
              </button>
              <button 
                className="modal-action-btn primary"
                onClick={() => {
                  if (modalStageInstanceRef.current) {
                    modalStageInstanceRef.current.autoView();
                  }
                }}
              >
                자동 뷰
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 구조체 시각적 표현 설정 모달 */}
      {showSettingsModal && (
        <div className="settings-modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h3>구조체 시각적 표현 설정</h3>
              <button className="modal-close-btn" onClick={() => setShowSettingsModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="settings-modal-body">
              <div className="setting-group">
                <label>표현 방식:</label>
                <select 
                  value={structureSettings.representation}
                  onChange={(e) => handleSettingChange("representation", e.target.value)}
                >
                  <option value="cartoon">카툰</option>
                  <option value="ball+stick">공+막대</option>
                  <option value="surface">표면</option>
                </select>
              </div>
              
              {structureSettings.representation === "ball+stick" && (
                <div className="setting-group">
                  <label>공+막대 모드:</label>
                  <select 
                    value={structureSettings.ballStickMode}
                    onChange={(e) => handleSettingChange("ballStickMode", e.target.value)}
                  >
                    <option value="single">단일표시 (하이라이트만)</option>
                    <option value="multiple">복수표시 (전체 표시)</option>
                  </select>
                </div>
              )}
              
              <div className="setting-group">
                <label>색상 체계:</label>
                <select 
                  value={structureSettings.colorScheme}
                  onChange={(e) => handleSettingChange("colorScheme", e.target.value)}
                >
                  <option value="chainid">체인 ID</option>
                  <option value="element">원소</option>
                  <option value="residue index">잔기 인덱스</option>
                </select>
              </div>
              
              <div className="setting-group">
                <label>
                  <input 
                    type="checkbox"
                    checked={structureSettings.showLabels}
                    onChange={(e) => handleSettingChange("showLabels", e.target.checked)}
                  />
                  라벨 표시
                </label>
              </div>
              
              <div className="setting-group">
                <label>
                  <input 
                    type="checkbox"
                    checked={structureSettings.showAxes}
                    onChange={(e) => handleSettingChange("showAxes", e.target.checked)}
                  />
                  축 표시
                </label>
              </div>
              
              <div className="settings-section">
                <h4>추가 요소</h4>
                <div className="setting-group">
                  <label>
                    <input 
                      type="checkbox"
                      checked={structureSettings.showLabels}
                      onChange={(e) => handleSettingChange("showLabels", e.target.checked)}
                    />
                    아미노산 라벨 표시
                  </label>
                </div>
                
                <div className="setting-group">
                  <label>
                    <input 
                      type="checkbox"
                      checked={structureSettings.showAxes}
                      onChange={(e) => handleSettingChange("showAxes", e.target.checked)}
                    />
                    단위 셀 축 표시
                  </label>
                </div>
              </div>
            </div>
            
            <div className="settings-modal-footer">
              <button className="modal-action-btn secondary" onClick={() => setShowSettingsModal(false)}>
                취소
              </button>
              <button 
                className="modal-action-btn primary"
                onClick={() => {
                  applyStructureSettings();
                  setShowSettingsModal(false);
                }}
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer className="page-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>프로젝트 정보</h4>
            <a 
              href="https://github.com/pistolinkr/alphafold2-viewer/tree/main" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
            >
              <i className="fab fa-github"></i>
              <span>GitHub 프로젝트</span>
            </a>
          </div>
          
          <div className="footer-section">
            <h4>사용법</h4>
            <ul>
              <li>PDB ID를 입력하여 단백질 구조 검색</li>
              <li>로컬 구조 파일 업로드하여 시각화</li>
              <li>마우스로 구조 회전, 확대/축소, 이동</li>
              <li>클릭하여 원자/잔기 정보 확인</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>라이선스</h4>
            <p>MIT 라이선스 - 자유롭게 사용, 수정, 배포 가능</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProteinSimulation;
