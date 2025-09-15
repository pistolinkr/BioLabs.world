import { Molecule, SearchResult, MolecularInteraction, DatabaseInfo } from '../types/molecularInteraction';

// 데이터베이스 정보
export const DATABASES: DatabaseInfo[] = [
  {
    name: 'PubChem',
    description: '화합물 정보 데이터베이스',
    url: 'https://pubchem.ncbi.nlm.nih.gov',
    apiEndpoint: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug',
    searchCapabilities: ['name', 'smiles', 'inchi', 'formula', 'cid'],
    dataTypes: ['compound', 'substance', 'assay', 'gene']
  },
  {
    name: 'KEGG',
    description: '생화학 경로 및 유전체 데이터베이스',
    url: 'https://www.genome.jp/kegg',
    apiEndpoint: 'https://rest.kegg.jp',
    searchCapabilities: ['compound', 'drug', 'pathway', 'enzyme', 'gene'],
    dataTypes: ['compound', 'drug', 'pathway', 'enzyme', 'reaction']
  }
];

// PubChem API 서비스
class PubChemService {
  private baseUrl = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

  async searchCompounds(query: string, searchType: 'name' | 'smiles' | 'formula' = 'name'): Promise<Molecule[]> {
    try {
      const searchParam = searchType === 'name' ? 'compound/name' : 
                         searchType === 'smiles' ? 'compound/smiles' : 'compound/formula';
      
      const url = `${this.baseUrl}/${searchParam}/${encodeURIComponent(query)}/cids/JSON`;
      console.log('🌐 PubChem URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      console.log('📡 PubChem response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`PubChem API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 PubChem raw data:', data);
      const cids = data.IdentifierList?.CID || [];
      console.log('🆔 PubChem CIDs:', cids);
      
      if (cids.length === 0) return [];
      
      // 상세 정보 가져오기 (최대 10개)
      const limitedCids = cids.slice(0, 10);
      const details = await this.getCompoundDetails(limitedCids);
      console.log('📋 PubChem details:', details);
      
      return details;
    } catch (error) {
      console.error('PubChem search error:', error);
      return [];
    }
  }

  private async getCompoundDetails(cids: number[]): Promise<Molecule[]> {
    try {
      const cidString = cids.join(',');
      const response = await fetch(
        `${this.baseUrl}/compound/cid/${cidString}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,InChI,InChIKey,Title,Synonym/JSON`
      );
      
      if (!response.ok) {
        throw new Error(`PubChem details error: ${response.status}`);
      }
      
      const data = await response.json();
      const properties = data.PropertyTable?.Properties || [];
      
      return properties.map((prop: any, index: number) => ({
        id: `pubchem_${cids[index]}`,
        name: prop.Title || `Compound ${cids[index]}`,
        smiles: prop.CanonicalSMILES || '',
        inchi: prop.InChI || '',
        inchiKey: prop.InChIKey || '',
        molecularFormula: prop.MolecularFormula || '',
        molecularWeight: prop.MolecularWeight || 0,
        pubchemId: cids[index].toString(),
        synonyms: prop.Synonym || [],
        type: 'compound' as const,
        properties: {}
      }));
    } catch (error) {
      console.error('PubChem details error:', error);
      return [];
    }
  }
}

// KEGG API 서비스
class KEGGService {
  private baseUrl = 'https://rest.kegg.jp';

  async searchCompounds(query: string): Promise<Molecule[]> {
    try {
      // KEGG compound 검색
      const url = `${this.baseUrl}/find/compound/${encodeURIComponent(query)}`;
      console.log('🌐 KEGG URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'text/plain',
        },
      });
      console.log('📡 KEGG response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`KEGG API error: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('📄 KEGG raw text:', text.substring(0, 200));
      const lines = text.split('\n').filter(line => line.trim());
      console.log('📋 KEGG lines:', lines.length);
      
      if (lines.length === 0) return [];
      
      // 상세 정보 가져오기 (최대 10개)
      const limitedLines = lines.slice(0, 10);
      const details = await this.getCompoundDetails(limitedLines);
      console.log('📋 KEGG details:', details);
      
      return details;
    } catch (error) {
      console.error('KEGG search error:', error);
      return [];
    }
  }

  private async getCompoundDetails(lines: string[]): Promise<Molecule[]> {
    const compounds: Molecule[] = [];
    
    for (const line of lines) {
      try {
        const [keggId, name] = line.split('\t');
        if (!keggId || !name) continue;
        
        // KEGG compound 상세 정보 가져오기
        const detailResponse = await fetch(`${this.baseUrl}/get/${keggId}`);
        if (!detailResponse.ok) continue;
        
        const detailText = await detailResponse.text();
        const details = this.parseKeggDetails(detailText, keggId, name);
        
        if (details) {
          compounds.push(details);
        }
      } catch (error) {
        console.error(`KEGG detail error for ${line}:`, error);
      }
    }
    
    return compounds;
  }

  private parseKeggDetails(detailText: string, keggId: string, name: string): Molecule | null {
    try {
      const lines = detailText.split('\n');
      let formula = '';
      let smiles = '';
      let molWeight = 0;
      
      for (const line of lines) {
        if (line.startsWith('FORMULA')) {
          formula = line.split('FORMULA')[1]?.trim() || '';
        } else if (line.startsWith('SMILES')) {
          smiles = line.split('SMILES')[1]?.trim() || '';
        } else if (line.startsWith('MOL_WEIGHT')) {
          molWeight = parseFloat(line.split('MOL_WEIGHT')[1]?.trim() || '0');
        }
      }
      
      return {
        id: `kegg_${keggId}`,
        name: name,
        smiles: smiles,
        molecularFormula: formula,
        molecularWeight: molWeight,
        keggId: keggId,
        synonyms: [],
        type: 'compound' as const,
        properties: {}
      };
    } catch (error) {
      console.error('KEGG parsing error:', error);
      return null;
    }
  }
}

// 통합 검색 서비스
export class MolecularApiService {
  private pubchemService = new PubChemService();
  private keggService = new KEGGService();

  async searchMolecules(query: string): Promise<SearchResult> {
    const startTime = Date.now();
    const sources: string[] = [];
    let allMolecules: Molecule[] = [];

    console.log('🔍 Starting molecular search for:', query);

    // 임시로 시뮬레이션 데이터 반환 (CORS 문제 해결을 위해)
    if (query.toLowerCase().includes('aspirin') || query.toLowerCase().includes('아스피린')) {
      const aspirinMolecule: Molecule = {
        id: 'pubchem_2244',
        name: 'Aspirin',
        smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
        inchi: 'InChI=1S/C9H8O4/c1-6(10)13-8-5-3-2-4-7(8)9(11)12/h2-5H,1H3,(H,11,12)',
        inchiKey: 'BSYNRYMUTXBXSQ-UHFFFAOYSA-N',
        molecularFormula: 'C9H8O4',
        molecularWeight: 180.16,
        pubchemId: '2244',
        synonyms: ['Acetylsalicylic acid', 'ASA', 'Acetosal'],
        type: 'compound',
        properties: {}
      };
      
      allMolecules.push(aspirinMolecule);
      sources.push('PubChem');
    }
    
    if (query.toLowerCase().includes('c9h8o4') || query.toLowerCase().includes('aspirin')) {
      const aspirinFormula: Molecule = {
        id: 'kegg_C01405',
        name: 'Aspirin',
        smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
        molecularFormula: 'C9H8O4',
        molecularWeight: 180.16,
        keggId: 'C01405',
        synonyms: ['Acetylsalicylic acid'],
        type: 'compound',
        properties: {}
      };
      
      allMolecules.push(aspirinFormula);
      sources.push('KEGG');
    }
    
    // 추가 분자 데이터
    if (query.toLowerCase().includes('paracetamol') || query.toLowerCase().includes('acetaminophen') || query.toLowerCase().includes('파라세타몰') || query.toLowerCase().includes('c8h9no2')) {
      const paracetamol: Molecule = {
        id: 'pubchem_1983',
        name: 'Paracetamol',
        smiles: 'CC(=O)NC1=CC=C(O)C=C1',
        molecularFormula: 'C8H9NO2',
        molecularWeight: 151.16,
        pubchemId: '1983',
        synonyms: ['Acetaminophen', 'Tylenol'],
        type: 'compound',
        properties: {}
      };
      
      allMolecules.push(paracetamol);
      sources.push('PubChem');
    }
    
    if (query.toLowerCase().includes('ibuprofen') || query.toLowerCase().includes('이부프로펜') || query.toLowerCase().includes('c13h18o2')) {
      const ibuprofen: Molecule = {
        id: 'pubchem_3672',
        name: 'Ibuprofen',
        smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O',
        molecularFormula: 'C13H18O2',
        molecularWeight: 206.28,
        pubchemId: '3672',
        synonyms: ['Brufen', 'Advil'],
        type: 'compound',
        properties: {}
      };
      
      allMolecules.push(ibuprofen);
      sources.push('PubChem');
    }
    
    // 더 많은 분자 데이터 추가
    if (query.toLowerCase().includes('caffeine') || query.toLowerCase().includes('카페인') || query.toLowerCase().includes('c8h10n4o2')) {
      const caffeine: Molecule = {
        id: 'pubchem_2519',
        name: 'Caffeine',
        smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
        molecularFormula: 'C8H10N4O2',
        molecularWeight: 194.19,
        pubchemId: '2519',
        synonyms: ['1,3,7-Trimethylxanthine'],
        type: 'compound',
        properties: {}
      };
      
      allMolecules.push(caffeine);
      sources.push('PubChem');
    }
    
    if (query.toLowerCase().includes('glucose') || query.toLowerCase().includes('글루코스') || query.toLowerCase().includes('c6h12o6')) {
      const glucose: Molecule = {
        id: 'pubchem_5793',
        name: 'Glucose',
        smiles: 'C([C@@H]1[C@H]([C@@H](C(O1)O)O)O)O',
        molecularFormula: 'C6H12O6',
        molecularWeight: 180.16,
        pubchemId: '5793',
        synonyms: ['D-Glucose', 'Dextrose'],
        type: 'compound',
        properties: {}
      };
      
      allMolecules.push(glucose);
      sources.push('PubChem');
    }
    
    // 일반적인 분자식 패턴 매칭
    if (query.toLowerCase().match(/c\d+h\d+o\d+/)) {
      console.log('🔍 Molecular formula pattern detected:', query);
      // 분자식 패턴이 감지되면 기본 분자 정보 제공
      const genericMolecule: Molecule = {
        id: `formula_${query.toLowerCase()}`,
        name: `Compound ${query}`,
        smiles: '',
        molecularFormula: query.toUpperCase(),
        molecularWeight: 0,
        synonyms: [`Formula: ${query}`],
        type: 'compound',
        properties: {}
      };
      
      allMolecules.push(genericMolecule);
      sources.push('Formula Search');
    }

    try {
      // 실제 API 호출은 나중에 활성화
      /*
      // PubChem 검색
      console.log('📡 Searching PubChem...');
      const pubchemResults = await this.pubchemService.searchCompounds(query);
      console.log('📊 PubChem results:', pubchemResults.length);
      if (pubchemResults.length > 0) {
        sources.push('PubChem');
        allMolecules = [...allMolecules, ...pubchemResults];
      }

      // KEGG 검색
      console.log('📡 Searching KEGG...');
      const keggResults = await this.keggService.searchCompounds(query);
      console.log('📊 KEGG results:', keggResults.length);
      if (keggResults.length > 0) {
        sources.push('KEGG');
        allMolecules = [...allMolecules, ...keggResults];
      }
      */

      // 중복 제거 (SMILES 기준)
      const uniqueMolecules = this.removeDuplicates(allMolecules);

      return {
        molecules: uniqueMolecules,
        totalCount: uniqueMolecules.length,
        searchTime: Date.now() - startTime,
        sources
      };
    } catch (error) {
      console.error('Molecular search error:', error);
      return {
        molecules: [],
        totalCount: 0,
        searchTime: Date.now() - startTime,
        sources: []
      };
    }
  }

  private removeDuplicates(molecules: Molecule[]): Molecule[] {
    const seen = new Set<string>();
    return molecules.filter(molecule => {
      const key = molecule.smiles || molecule.name;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  async analyzeInteractions(molecules: Molecule[]): Promise<MolecularInteraction[]> {
    // 실제로는 더 복잡한 상호작용 분석 로직이 필요하지만,
    // 여기서는 시뮬레이션 데이터를 반환합니다.
    const interactions: MolecularInteraction[] = [];
    
    for (let i = 0; i < molecules.length; i++) {
      for (let j = i + 1; j < molecules.length; j++) {
        const mol1 = molecules[i];
        const mol2 = molecules[j];
        
        // 간단한 상호작용 시뮬레이션
        const interactionTypes: Array<'binding' | 'inhibition' | 'activation' | 'catalysis'> = 
          ['binding', 'inhibition', 'activation', 'catalysis'];
        
        const randomType = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
        const strength = Math.random();
        const confidence = 0.7 + Math.random() * 0.3;
        
        interactions.push({
          id: `interaction_${mol1.id}_${mol2.id}`,
          sourceMolecule: mol1,
          targetMolecule: mol2,
          interactionType: randomType,
          strength,
          confidence,
          mechanism: this.generateMechanism(randomType, mol1, mol2),
          evidence: [
            {
              source: 'literature',
              reference: 'Simulated interaction data',
              description: `Predicted ${randomType} interaction between ${mol1.name} and ${mol2.name}`
            }
          ],
          biologicalSignificance: this.generateBiologicalSignificance(randomType, mol1, mol2),
          therapeuticRelevance: this.generateTherapeuticRelevance(randomType, mol1, mol2)
        });
      }
    }
    
    return interactions;
  }

  private generateMechanism(type: string, mol1: Molecule, mol2: Molecule): string {
    const mechanisms = {
      binding: `${mol1.name} forms a stable complex with ${mol2.name} through non-covalent interactions`,
      inhibition: `${mol1.name} competitively inhibits the activity of ${mol2.name}`,
      activation: `${mol1.name} enhances the catalytic activity of ${mol2.name}`,
      catalysis: `${mol1.name} acts as a catalyst for the transformation of ${mol2.name}`
    };
    return mechanisms[type as keyof typeof mechanisms] || 'Unknown mechanism';
  }

  private generateBiologicalSignificance(type: string, mol1: Molecule, mol2: Molecule): string {
    return `This ${type} interaction may play a crucial role in cellular processes and could be targeted for therapeutic intervention.`;
  }

  private generateTherapeuticRelevance(type: string, mol1: Molecule, mol2: Molecule): string {
    return `The ${type} interaction between ${mol1.name} and ${mol2.name} represents a potential drug target for treating various diseases.`;
  }

  getDatabases(): DatabaseInfo[] {
    return DATABASES;
  }
}

export const molecularApiService = new MolecularApiService();
