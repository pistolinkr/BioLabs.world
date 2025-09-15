export interface NetworkData {
  nodes: Node[];
  edges: Edge[];
}

export interface Node {
  data: {
    id: string;
    label: string;
    type: 'protein' | 'compound' | 'pathway' | 'disease';
    properties: Record<string, any>;
    size?: number;
    color?: string;
  };
}

export interface Edge {
  data: {
    id: string;
    source: string;
    target: string;
    interaction: string;
    strength: number;
    type?: string;
  };
}

export interface Molecule {
  id: string;
  name: string;
  smiles?: string;
  pubchemId?: string;
  type: string;
  molecularWeight?: number;
  formula?: string;
  description?: string;
}

export interface NetworkAnalysis {
  nodeCount: number;
  edgeCount: number;
  density: number;
  averageDegree: number;
  connectedComponents: number;
  centralNodes: string[];
}

export interface SearchResult {
  id: string;
  name: string;
  type: 'compound' | 'protein' | 'pathway';
  source: 'pubchem' | 'kegg';
  description?: string;
  molecularWeight?: number;
  formula?: string;
  smiles?: string;
  pubchemId?: string;
  keggId?: string;
  matchScore?: number; // 검색 매칭 점수
}
