import { NetworkData, Molecule, NetworkAnalysis, SearchResult } from '../types/network';
import { MOLECULE_DATABASE, MoleculeEntry } from '../data/moleculeDatabase';

// PubChem API 기본 URL
const PUBCHEM_BASE_URL = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

// PubChem 검색 함수 (시뮬레이션 데이터 사용)
async function searchPubChem(query: string): Promise<SearchResult[]> {
  console.log('PubChem 검색 시작 (시뮬레이션):', query);
  
  // CORS 문제로 인해 시뮬레이션 데이터만 사용
  return getSimulatedPubChemResults(query);
}

// PubChem 결과 처리
function processPubChemResults(data: any): SearchResult[] {
  console.log('PubChem 결과 처리 시작:', data);
  
  // PC_Compounds 배열이 있는 경우
  if (data.PC_Compounds && Array.isArray(data.PC_Compounds)) {
    return data.PC_Compounds.map((compound: any, index: number) => {
      const props = compound.props || [];
      const title = props.find((p: any) => p.urn?.label === 'IUPAC Name')?.value?.sval || 
                   props.find((p: any) => p.urn?.label === 'Title')?.value?.sval || 
                   `Compound ${compound.id?.id?.cid || index}`;
      
      const smiles = props.find((p: any) => p.urn?.label === 'SMILES')?.value?.sval;
      const formula = props.find((p: any) => p.urn?.label === 'Molecular Formula')?.value?.sval;
      const weight = props.find((p: any) => p.urn?.label === 'Molecular Weight')?.value?.sval;

      return {
        id: `pubchem_${compound.id?.id?.cid || index}`,
        name: title,
        type: 'compound' as const,
        source: 'pubchem' as const,
        pubchemId: compound.id?.id?.cid?.toString(),
        smiles,
        formula,
        molecularWeight: weight ? parseFloat(weight) : undefined,
        description: `PubChem Compound ID: ${compound.id?.id?.cid}`
      };
    });
  }
  
  // PropertyTable 형식인 경우 (부분 이름 검색 결과)
  if (data.PropertyTable && data.PropertyTable.Properties) {
    return data.PropertyTable.Properties.map((prop: any, index: number) => {
      return {
        id: `pubchem_${prop.CID || index}`,
        name: prop.IUPACName || `Compound ${prop.CID || index}`,
        type: 'compound' as const,
        source: 'pubchem' as const,
        pubchemId: prop.CID?.toString(),
        formula: prop.MolecularFormula,
        molecularWeight: prop.MolecularWeight,
        description: `PubChem Compound ID: ${prop.CID}`
      };
    });
  }
  
  console.log('처리할 수 없는 데이터 형식:', data);
  return [];
}

// 시뮬레이션 PubChem 데이터 (API 실패 시 폴백)
function getSimulatedPubChemResults(query: string): SearchResult[] {
  const queryLower = query.toLowerCase();
  const results: SearchResult[] = [];
  
  // 대규모 분자 데이터베이스 사용 (100+ 분자)
  const moleculeData = MOLECULE_DATABASE;
  
  // 똑똑한 검색 로직
  moleculeData.forEach(mol => {
    let matchScore = 0;
    let matched = false;
    
    // 1. 정확한 이름 매칭 (높은 점수)
    if (queryLower === mol.name.toLowerCase()) {
      matchScore = 100;
      matched = true;
    }
    
    // 2. 동의어 매칭 (높은 점수)
    if (mol.synonyms && mol.synonyms.some(syn => queryLower === syn.toLowerCase())) {
      matchScore = 95;
      matched = true;
    }
    
    // 3. 부분 이름 매칭 (중간 점수)
    if (mol.name.toLowerCase().includes(queryLower) || queryLower.includes(mol.name.toLowerCase())) {
      matchScore = Math.max(matchScore, 80);
      matched = true;
    }
    
    // 4. 동의어 부분 매칭 (중간 점수)
    if (mol.synonyms && mol.synonyms.some(syn => 
      syn.toLowerCase().includes(queryLower) || queryLower.includes(syn.toLowerCase()))) {
      matchScore = Math.max(matchScore, 75);
      matched = true;
    }
    
    // 5. 분자식 매칭 (높은 점수)
    if (queryLower === mol.formula.toLowerCase()) {
      matchScore = Math.max(matchScore, 90);
      matched = true;
    }
    
    // 6. PubChem ID 매칭 (높은 점수)
    if (queryLower === mol.pubchemId) {
      matchScore = Math.max(matchScore, 85);
      matched = true;
    }
    
    // 7. SMILES 매칭 (높은 점수)
    if (mol.smiles && queryLower === mol.smiles.toLowerCase()) {
      matchScore = Math.max(matchScore, 85);
      matched = true;
    }
    
    // 8. 유사한 분자식 패턴 매칭 (낮은 점수)
    if (queryLower.match(/c\d+h\d+o\d+/i) && mol.formula.toLowerCase().match(/c\d+h\d+o\d+/i)) {
      matchScore = Math.max(matchScore, 60);
      matched = true;
    }
    
    // 9. 오타 허용 (Levenshtein 거리 기반)
    if (mol.name.length > 3 && calculateSimilarity(queryLower, mol.name.toLowerCase()) > 0.7) {
      matchScore = Math.max(matchScore, 70);
      matched = true;
    }
    
    // 10. 동의어 오타 허용
    if (mol.synonyms && mol.synonyms.some(syn => 
      syn.length > 3 && calculateSimilarity(queryLower, syn.toLowerCase()) > 0.7)) {
      matchScore = Math.max(matchScore, 65);
      matched = true;
    }
    
    if (matched) {
      results.push({
        id: `pubchem_${mol.pubchemId}`,
        name: mol.name,
        type: 'compound' as const,
        source: 'pubchem' as const,
        pubchemId: mol.pubchemId,
        smiles: mol.smiles,
        formula: mol.formula,
        molecularWeight: mol.weight,
        description: mol.description,
        matchScore // 매칭 점수 추가
      });
    }
  });
  
  // 매칭 점수로 정렬 (높은 점수 우선)
  results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  
  return results;
}

// 유사도 계산 함수 (Levenshtein 거리 기반)
function calculateSimilarity(str1: string, str2: string): number {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // 치환
          matrix[i][j - 1] + 1,     // 삽입
          matrix[i - 1][j] + 1      // 삭제
        );
      }
    }
  }
  
  const distance = matrix[str2.length][str1.length];
  const maxLength = Math.max(str1.length, str2.length);
  return 1 - (distance / maxLength);
}

// KEGG 검색 함수 (시뮬레이션)
async function searchKEGG(query: string): Promise<SearchResult[]> {
  try {
    const mockKEGGResults: SearchResult[] = [];
    
    // 더 많은 분자 지원
    const moleculeData = [
      {
        name: 'Glucose',
        type: 'compound' as const,
        keggId: 'C00031',
        description: 'D-Glucose metabolic pathway',
        formula: 'C6H12O6',
        weight: 180.16
      },
      {
        name: 'Lactate',
        type: 'compound' as const,
        keggId: 'C00186',
        description: 'Lactic acid fermentation pathway',
        formula: 'C3H6O3',
        weight: 90.08
      },
      {
        name: 'Pyruvate',
        type: 'compound' as const,
        keggId: 'C00022',
        description: 'Pyruvate metabolism pathway',
        formula: 'C3H4O3',
        weight: 88.06
      },
      {
        name: 'Citrate',
        type: 'compound' as const,
        keggId: 'C00158',
        description: 'Citric acid cycle pathway',
        formula: 'C6H8O7',
        weight: 192.12
      },
      {
        name: 'ATP',
        type: 'compound' as const,
        keggId: 'C00002',
        description: 'Adenosine triphosphate pathway',
        formula: 'C10H16N5O13P3',
        weight: 507.18
      },
      {
        name: 'NAD+',
        type: 'compound' as const,
        keggId: 'C00003',
        description: 'Nicotinamide adenine dinucleotide pathway',
        formula: 'C21H28N7O14P2',
        weight: 663.43
      },
      {
        name: 'FAD',
        type: 'compound' as const,
        keggId: 'C00016',
        description: 'Flavin adenine dinucleotide pathway',
        formula: 'C27H33N9O15P2',
        weight: 785.55
      },
      {
        name: 'Coenzyme A',
        type: 'compound' as const,
        keggId: 'C00010',
        description: 'Coenzyme A biosynthesis pathway',
        formula: 'C21H36N7O16P3S',
        weight: 767.53
      }
    ];

    // 똑똑한 KEGG 검색 로직
    const queryLower = query.toLowerCase();
    moleculeData.forEach(mol => {
      let matchScore = 0;
      let matched = false;
      
      // 1. 정확한 이름 매칭
      if (queryLower === mol.name.toLowerCase()) {
        matchScore = 100;
        matched = true;
      }
      
      // 2. 부분 이름 매칭
      if (mol.name.toLowerCase().includes(queryLower) || queryLower.includes(mol.name.toLowerCase())) {
        matchScore = Math.max(matchScore, 80);
        matched = true;
      }
      
      // 3. 분자식 매칭
      if (queryLower === mol.formula.toLowerCase()) {
        matchScore = Math.max(matchScore, 90);
        matched = true;
      }
      
      // 4. KEGG ID 매칭
      if (queryLower === mol.keggId.toLowerCase()) {
        matchScore = Math.max(matchScore, 85);
        matched = true;
      }
      
      // 5. 오타 허용
      if (mol.name.length > 3 && calculateSimilarity(queryLower, mol.name.toLowerCase()) > 0.7) {
        matchScore = Math.max(matchScore, 70);
        matched = true;
      }
      
      if (matched) {
        mockKEGGResults.push({
          id: `kegg_${mol.keggId}`,
          name: mol.name,
          type: mol.type,
          source: 'kegg' as const,
          keggId: mol.keggId,
          formula: mol.formula,
          molecularWeight: mol.weight,
          description: mol.description,
          matchScore
        });
      }
    });
    
    // 매칭 점수로 정렬
    mockKEGGResults.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    // 일반적인 생물학적 용어 검색
    if (queryLower.includes('protein') || queryLower.includes('enzyme') || queryLower.includes('pathway')) {
      mockKEGGResults.push({
        id: 'kegg_pathway_1',
        name: `${query} Metabolic Pathway`,
        type: 'pathway' as const,
        source: 'kegg' as const,
        keggId: `hsa${Math.floor(Math.random() * 1000)}`,
        description: 'KEGG Metabolic Pathway Database Entry'
      });
    }

    return mockKEGGResults;
  } catch (error) {
    console.error('KEGG 검색 오류:', error);
    return [];
  }
}

// 통합 검색 함수
export async function searchMolecules(query: string, databases: string[] = ['pubchem', 'kegg']): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  
  try {
    // PubChem 검색
    if (databases.includes('pubchem')) {
      const pubchemResults = await searchPubChem(query);
      results.push(...pubchemResults);
    }
    
    // KEGG 검색
    if (databases.includes('kegg')) {
      const keggResults = await searchKEGG(query);
      results.push(...keggResults);
    }
    
    return results;
  } catch (error) {
    console.error('분자 검색 오류:', error);
    return [];
  }
}

// 분자 상세 정보 가져오기
export async function getMoleculeDetails(moleculeId: string): Promise<Molecule | null> {
  try {
    if (moleculeId.startsWith('pubchem_')) {
      const pubchemId = moleculeId.replace('pubchem_', '');
      const response = await fetch(`${PUBCHEM_BASE_URL}/compound/cid/${pubchemId}/JSON`);
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      const compound = data.PC_Compounds[0];
      const props = compound.props || [];
      
      const title = props.find((p: any) => p.urn?.label === 'IUPAC Name')?.value?.sval || 
                   props.find((p: any) => p.urn?.label === 'Title')?.value?.sval;
      
      return {
        id: moleculeId,
        name: title,
        type: 'compound',
        pubchemId,
        smiles: props.find((p: any) => p.urn?.label === 'SMILES')?.value?.sval,
        molecularWeight: props.find((p: any) => p.urn?.label === 'Molecular Weight')?.value?.sval,
        formula: props.find((p: any) => p.urn?.label === 'Molecular Formula')?.value?.sval,
        description: `PubChem Compound ID: ${pubchemId}`
      };
    }
    
    return null;
  } catch (error) {
    console.error('분자 상세 정보 가져오기 오류:', error);
    return null;
  }
}

// 네트워크 데이터 생성 (샘플)
export function generateNetworkData(molecules: Molecule[]): NetworkData {
  const nodes: any[] = [];
  const edges: any[] = [];
  
  molecules.forEach((molecule, index) => {
    // 분자 노드 추가
    nodes.push({
      data: {
        id: molecule.id,
        label: molecule.name,
        type: molecule.type,
        properties: {
          pubchemId: molecule.pubchemId,
          smiles: molecule.smiles,
          molecularWeight: molecule.molecularWeight
        }
      }
    });
    
    // 다른 분자들과의 상호작용 엣지 추가 (샘플)
    if (index > 0) {
      edges.push({
        data: {
          id: `edge_${index}`,
          source: molecule.id,
          target: molecules[index - 1].id,
          interaction: 'interacts_with',
          strength: Math.floor(Math.random() * 5) + 1,
          type: 'interaction'
        }
      });
    }
  });
  
  return { nodes, edges };
}

// 네트워크 분석
export async function analyzeNetwork(data: NetworkData): Promise<NetworkAnalysis> {
  const nodeCount = data.nodes.length;
  const edgeCount = data.edges.length;
  const density = edgeCount / (nodeCount * (nodeCount - 1)) || 0;
  
  const nodeDegrees = data.nodes.map(node => {
    const connectedEdges = data.edges.filter(edge => 
      edge.data.source === node.data.id || edge.data.target === node.data.id
    );
    return connectedEdges.length;
  });
  
  const averageDegree = nodeDegrees.reduce((sum, degree) => sum + degree, 0) / nodeCount || 0;
  const connectedComponents = Math.max(1, Math.floor(nodeCount / 3));
  
  const centralNodes = data.nodes
    .map(node => ({
      id: node.data.id,
      degree: data.edges.filter(edge => 
        edge.data.source === node.data.id || edge.data.target === node.data.id
      ).length
    }))
    .sort((a, b) => b.degree - a.degree)
    .slice(0, 3)
    .map(node => node.id);
  
  return {
    nodeCount,
    edgeCount,
    density: Math.round(density * 1000) / 1000,
    averageDegree: Math.round(averageDegree * 100) / 100,
    connectedComponents,
    centralNodes
  };
}
