// 분자 상호작용 관련 타입 정의

export interface Molecule {
  id: string;
  name: string;
  smiles: string;
  inchi?: string;
  inchiKey?: string;
  molecularFormula: string;
  molecularWeight: number;
  pubchemId?: string;
  keggId?: string;
  casNumber?: string;
  synonyms: string[];
  description?: string;
  type: 'compound' | 'protein' | 'metabolite' | 'drug';
  properties: {
    logP?: number;
    hbd?: number; // Hydrogen bond donors
    hba?: number; // Hydrogen bond acceptors
    tpsa?: number; // Topological polar surface area
    rotatableBonds?: number;
    aromaticRings?: number;
    heavyAtoms?: number;
    aiRecommended?: boolean; // AI 추천 분자 여부
  };
}

export interface MolecularInteraction {
  id: string;
  sourceMolecule: Molecule;
  targetMolecule: Molecule;
  interactionType: 'binding' | 'inhibition' | 'activation' | 'catalysis' | 'transport' | 'metabolic';
  strength: number; // 0-1 scale
  confidence: number; // 0-1 scale
  mechanism: string;
  evidence: {
    source: 'pubchem' | 'kegg' | 'literature' | 'experimental';
    reference: string;
    description: string;
  }[];
  pathway?: {
    name: string;
    keggId: string;
    description: string;
  };
  biologicalSignificance: string;
  therapeuticRelevance?: string;
}

export interface SearchResult {
  molecules: Molecule[];
  totalCount: number;
  searchTime: number;
  sources: string[];
}

export interface InteractionAnalysis {
  interactions: MolecularInteraction[];
  networkMetrics: {
    nodeCount: number;
    edgeCount: number;
    averageDegree: number;
    clusteringCoefficient: number;
    centralMolecules: string[];
  };
  pathwayAnalysis: {
    affectedPathways: string[];
    keyPathways: string[];
    pathwayInteractions: Record<string, MolecularInteraction[]>;
  };
  drugDiscovery: {
    potentialTargets: string[];
    drugLikeProperties: Record<string, any>;
    toxicityPredictions: Record<string, any>;
  };
}

export interface SMILESVisualization {
  smiles: string;
  svg?: string;
  molfile?: string;
  properties: {
    isValid: boolean;
    atomCount: number;
    bondCount: number;
    ringCount: number;
  };
}

export interface DatabaseInfo {
  name: string;
  description: string;
  url: string;
  apiEndpoint: string;
  searchCapabilities: string[];
  dataTypes: string[];
}
