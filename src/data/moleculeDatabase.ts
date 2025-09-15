export interface MoleculeEntry {
  name: string;
  pubchemId: string;
  smiles: string;
  formula: string;
  weight: number;
  description: string;
  synonyms: string[];
  category?: string;
}

export const MOLECULE_DATABASE: MoleculeEntry[] = [
  // === 의약품 (Pharmaceuticals) ===
  {
    name: 'Aspirin',
    pubchemId: '2244',
    smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
    formula: 'C9H8O4',
    weight: 180.16,
    description: 'Acetylsalicylic acid - pain reliever and anti-inflammatory',
    synonyms: ['acetylsalicylic acid', 'asa', 'acetosal', 'asp', '아스피린', '아세틸살리실산', 'aspl', 'aspirn', 'aspir'],
    category: 'pharmaceutical'
  },
  {
    name: 'Paracetamol',
    pubchemId: '1983',
    smiles: 'CC(=O)NC1=CC=C(O)C=C1',
    formula: 'C8H9NO2',
    weight: 151.16,
    description: 'Acetaminophen - pain reliever and fever reducer',
    synonyms: ['acetaminophen', 'tylenol', 'panadol', 'paracetamol', '파라세타몰', '아세트아미노펜', 'para', 'paracetamal'],
    category: 'pharmaceutical'
  },
  {
    name: 'Ibuprofen',
    pubchemId: '3672',
    smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O',
    formula: 'C13H18O2',
    weight: 206.28,
    description: 'Non-steroidal anti-inflammatory drug',
    synonyms: ['brufen', 'advil', 'motrin', 'nurofen', '이부프로펜', '브루펜', 'ibu', 'ibuprofin'],
    category: 'pharmaceutical'
  },
  {
    name: 'Morphine',
    pubchemId: '5288826',
    smiles: 'CN1CCC23C4C1CC5=C2C(=C(C=C5)O)OC3C(C=C4)O',
    formula: 'C17H19NO3',
    weight: 285.34,
    description: 'Opioid pain medication',
    synonyms: ['morphine sulfate', 'ms contin', '모르핀'],
    category: 'pharmaceutical'
  },
  {
    name: 'Codeine',
    pubchemId: '5284371',
    smiles: 'COC1=C(C=C2C3=C1OC4C(C3CCC2=O)(CCN4C)C)O',
    formula: 'C18H21NO3',
    weight: 299.36,
    description: 'Opioid used for pain relief',
    synonyms: ['codeine phosphate', '코데인'],
    category: 'pharmaceutical'
  },
  {
    name: 'Penicillin',
    pubchemId: '5904',
    smiles: 'CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)CC3=CC=CC=C3)C(=O)O)C',
    formula: 'C16H18N2O4S',
    weight: 334.39,
    description: 'Beta-lactam antibiotic',
    synonyms: ['penicillin g', 'benzylpenicillin', '페니실린'],
    category: 'pharmaceutical'
  },
  
  // === 비타민 (Vitamins) ===
  {
    name: 'Vitamin A',
    pubchemId: '445354',
    smiles: 'CC1=C(C(CCC1)(C)C)C=CC(=CC=CC(=CC=CC=C(C)C=CC=C(C)C(=O)O)C)C',
    formula: 'C20H30O',
    weight: 286.45,
    description: 'Retinol - essential for vision and immune function',
    synonyms: ['retinol', 'vitamin a1', '비타민 a', 'vita'],
    category: 'vitamin'
  },
  {
    name: 'Vitamin B1',
    pubchemId: '1130',
    smiles: 'CC1=C(SC=N1)CCO',
    formula: 'C12H17N4OS',
    weight: 265.35,
    description: 'Thiamine - essential for energy metabolism',
    synonyms: ['thiamine', 'thiamin', '티아민', '비타민 b1'],
    category: 'vitamin'
  },
  {
    name: 'Vitamin B6',
    pubchemId: '1054',
    smiles: 'CC1=NC=C(C(=C1O)CO)CO',
    formula: 'C8H11NO3',
    weight: 169.18,
    description: 'Pyridoxine - important for brain development',
    synonyms: ['pyridoxine', '피리독신', '비타민 b6'],
    category: 'vitamin'
  },
  {
    name: 'Vitamin B12',
    pubchemId: '44176380',
    smiles: 'CC1=CC2=C(C=C1C)N(C=N2)[C@@H]3[C@@H]([C@@H]([C@H](O3)CO)O)O',
    formula: 'C63H88CoN14O14P',
    weight: 1355.37,
    description: 'Cobalamin - essential for nerve function',
    synonyms: ['cobalamin', 'cyanocobalamin', '코발라민', '비타민 b12'],
    category: 'vitamin'
  },
  {
    name: 'Vitamin C',
    pubchemId: '54670067',
    smiles: 'C([C@@H]([C@H](C(=O)O)O)O)O',
    formula: 'C6H8O6',
    weight: 176.12,
    description: 'Ascorbic acid - essential vitamin',
    synonyms: ['ascorbic acid', 'l-ascorbic acid', 'vit c', '비타민 c', '아스코르빈산', 'vitc', 'vitamin c'],
    category: 'vitamin'
  },
  {
    name: 'Vitamin D2',
    pubchemId: '5280793',
    smiles: 'CC(C)C(C)C=CC(C)C1CCC2C1(CCC3C2CC=C4C3(CCC(C4)O)C)C',
    formula: 'C28H44O',
    weight: 396.65,
    description: 'Ergocalciferol - vitamin D',
    synonyms: ['ergocalciferol', '에르고칼시페롤', '비타민 d2'],
    category: 'vitamin'
  },
  {
    name: 'Vitamin D3',
    pubchemId: '5280795',
    smiles: 'CC(C)CCCC(C)C1CCC2C1(CCC3C2CC=C4C3(CCC(C4)O)C)C',
    formula: 'C27H44O',
    weight: 384.64,
    description: 'Cholecalciferol - vitamin D',
    synonyms: ['cholecalciferol', 'vitamin d', 'vit d', 'vit d3', '비타민 d', '비타민 d3', '콜레칼시페롤', 'vitd', 'vitamin d'],
    category: 'vitamin'
  },
  {
    name: 'Vitamin E',
    pubchemId: '14985',
    smiles: 'CC1=C(C(=C(C2=C1OC(CC2)(C)C)C)O)C',
    formula: 'C29H50O2',
    weight: 430.71,
    description: 'Alpha-tocopherol - antioxidant vitamin',
    synonyms: ['alpha-tocopherol', 'tocopherol', '토코페롤', '비타민 e'],
    category: 'vitamin'
  },
  {
    name: 'Vitamin K1',
    pubchemId: '5284607',
    smiles: 'CC(CCC[C@H](C)CCC[C@H](C)CCCC(C)C)C',
    formula: 'C31H46O2',
    weight: 450.70,
    description: 'Phylloquinone - essential for blood clotting',
    synonyms: ['phylloquinone', '필로퀴논', '비타민 k1'],
    category: 'vitamin'
  },
  
  // === 아미노산 (Amino Acids) ===
  {
    name: 'Alanine',
    pubchemId: '5950',
    smiles: 'C[C@@H](C(=O)O)N',
    formula: 'C3H7NO2',
    weight: 89.09,
    description: 'Non-essential amino acid',
    synonyms: ['ala', 'l-alanine', '알라닌'],
    category: 'amino_acid'
  },
  {
    name: 'Glycine',
    pubchemId: '750',
    smiles: 'C(C(=O)O)N',
    formula: 'C2H5NO2',
    weight: 75.07,
    description: 'Simplest amino acid',
    synonyms: ['gly', '글리신'],
    category: 'amino_acid'
  },
  {
    name: 'Valine',
    pubchemId: '6287',
    smiles: 'CC(C)[C@@H](C(=O)O)N',
    formula: 'C5H11NO2',
    weight: 117.15,
    description: 'Essential branched-chain amino acid',
    synonyms: ['val', 'l-valine', '발린'],
    category: 'amino_acid'
  },
  {
    name: 'Leucine',
    pubchemId: '6106',
    smiles: 'CC(C)C[C@@H](C(=O)O)N',
    formula: 'C6H13NO2',
    weight: 131.17,
    description: 'Essential branched-chain amino acid',
    synonyms: ['leu', 'l-leucine', '류신'],
    category: 'amino_acid'
  },
  {
    name: 'Isoleucine',
    pubchemId: '6306',
    smiles: 'CC[C@H](C)[C@@H](C(=O)O)N',
    formula: 'C6H13NO2',
    weight: 131.17,
    description: 'Essential branched-chain amino acid',
    synonyms: ['ile', 'l-isoleucine', '이소류신'],
    category: 'amino_acid'
  },
  {
    name: 'Phenylalanine',
    pubchemId: '6140',
    smiles: 'C1=CC=C(C=C1)C[C@@H](C(=O)O)N',
    formula: 'C9H11NO2',
    weight: 165.19,
    description: 'Essential aromatic amino acid',
    synonyms: ['phe', 'l-phenylalanine', '페닐알라닌'],
    category: 'amino_acid'
  },
  {
    name: 'Tryptophan',
    pubchemId: '6305',
    smiles: 'C1=CC=C2C(=C1)C(=CN2)C[C@@H](C(=O)O)N',
    formula: 'C11H12N2O2',
    weight: 204.23,
    description: 'Essential aromatic amino acid',
    synonyms: ['trp', 'l-tryptophan', '트립토판'],
    category: 'amino_acid'
  },
  {
    name: 'Tyrosine',
    pubchemId: '6057',
    smiles: 'C1=CC(=CC=C1C[C@@H](C(=O)O)N)O',
    formula: 'C9H11NO3',
    weight: 181.19,
    description: 'Non-essential aromatic amino acid',
    synonyms: ['tyr', 'l-tyrosine', '티로신'],
    category: 'amino_acid'
  },
  {
    name: 'Serine',
    pubchemId: '5951',
    smiles: 'C([C@@H](C(=O)O)N)O',
    formula: 'C3H7NO3',
    weight: 105.09,
    description: 'Non-essential amino acid with hydroxyl group',
    synonyms: ['ser', 'l-serine', '세린'],
    category: 'amino_acid'
  },
  {
    name: 'Threonine',
    pubchemId: '6288',
    smiles: 'C[C@H]([C@@H](C(=O)O)N)O',
    formula: 'C4H9NO3',
    weight: 119.12,
    description: 'Essential amino acid with hydroxyl group',
    synonyms: ['thr', 'l-threonine', '트레오닌'],
    category: 'amino_acid'
  },
  {
    name: 'Cysteine',
    pubchemId: '5862',
    smiles: 'C([C@@H](C(=O)O)N)S',
    formula: 'C3H7NO2S',
    weight: 121.16,
    description: 'Semi-essential sulfur-containing amino acid',
    synonyms: ['cys', 'l-cysteine', '시스테인'],
    category: 'amino_acid'
  },
  {
    name: 'Methionine',
    pubchemId: '6137',
    smiles: 'CSCC[C@@H](C(=O)O)N',
    formula: 'C5H11NO2S',
    weight: 149.21,
    description: 'Essential sulfur-containing amino acid',
    synonyms: ['met', 'l-methionine', '메티오닌'],
    category: 'amino_acid'
  },
  {
    name: 'Aspartic Acid',
    pubchemId: '5960',
    smiles: 'C([C@@H](C(=O)O)N)C(=O)O',
    formula: 'C4H7NO4',
    weight: 133.10,
    description: 'Non-essential acidic amino acid',
    synonyms: ['asp', 'aspartate', 'l-aspartic acid', '아스파르트산'],
    category: 'amino_acid'
  },
  {
    name: 'Glutamic Acid',
    pubchemId: '33032',
    smiles: 'C(CC(=O)O)[C@@H](C(=O)O)N',
    formula: 'C5H9NO4',
    weight: 147.13,
    description: 'Non-essential acidic amino acid',
    synonyms: ['glu', 'glutamate', 'l-glutamic acid', '글루탐산'],
    category: 'amino_acid'
  },
  {
    name: 'Lysine',
    pubchemId: '5962',
    smiles: 'C(CCN)C[C@@H](C(=O)O)N',
    formula: 'C6H14N2O2',
    weight: 146.19,
    description: 'Essential basic amino acid',
    synonyms: ['lys', 'l-lysine', '라이신'],
    category: 'amino_acid'
  },
  {
    name: 'Arginine',
    pubchemId: '6322',
    smiles: 'C(C[C@@H](C(=O)O)N)CN=C(N)N',
    formula: 'C6H14N4O2',
    weight: 174.20,
    description: 'Semi-essential basic amino acid',
    synonyms: ['arg', 'l-arginine', '아르기닌'],
    category: 'amino_acid'
  },
  {
    name: 'Histidine',
    pubchemId: '6274',
    smiles: 'C1=C(NC=N1)C[C@@H](C(=O)O)N',
    formula: 'C6H9N3O2',
    weight: 155.15,
    description: 'Essential basic amino acid',
    synonyms: ['his', 'l-histidine', '히스티딘'],
    category: 'amino_acid'
  },
  {
    name: 'Proline',
    pubchemId: '145742',
    smiles: 'C1C[C@H](NC1)C(=O)O',
    formula: 'C5H9NO2',
    weight: 115.13,
    description: 'Non-essential cyclic amino acid',
    synonyms: ['pro', 'l-proline', '프롤린'],
    category: 'amino_acid'
  },
  {
    name: 'Asparagine',
    pubchemId: '6267',
    smiles: 'C([C@@H](C(=O)O)N)C(=O)N',
    formula: 'C4H8N2O3',
    weight: 132.12,
    description: 'Non-essential amino acid amide',
    synonyms: ['asn', 'l-asparagine', '아스파라긴'],
    category: 'amino_acid'
  },
  {
    name: 'Glutamine',
    pubchemId: '5961',
    smiles: 'C(CC(=O)N)[C@@H](C(=O)O)N',
    formula: 'C5H10N2O3',
    weight: 146.14,
    description: 'Non-essential amino acid amide',
    synonyms: ['gln', 'l-glutamine', '글루타민'],
    category: 'amino_acid'
  },
  
  // === 당류 (Sugars) ===
  {
    name: 'Glucose',
    pubchemId: '5793',
    smiles: 'C([C@@H]1[C@H]([C@@H](C(O1)O)O)O)O',
    formula: 'C6H12O6',
    weight: 180.16,
    description: 'D-Glucose - primary energy source for cells',
    synonyms: ['d-glucose', 'dextrose', 'blood sugar', '포도당', '글루코스', '덱스트로스', 'gluc', 'glucose'],
    category: 'sugar'
  },
  {
    name: 'Fructose',
    pubchemId: '5984',
    smiles: 'C([C@H]([C@@H]([C@@H](C(CO)O)O)O)O)O',
    formula: 'C6H12O6',
    weight: 180.16,
    description: 'Fruit sugar - ketohexose',
    synonyms: ['d-fructose', 'fruit sugar', '과당', '프럭토스'],
    category: 'sugar'
  },
  {
    name: 'Sucrose',
    pubchemId: '5988',
    smiles: 'C([C@@H]1[C@H]([C@@H]([C@H]([C@H](O1)O[C@]2([C@H]([C@@H]([C@@H](O2)CO)O)O)CO)O)O)O)O',
    formula: 'C12H22O11',
    weight: 342.30,
    description: 'Common table sugar',
    synonyms: ['table sugar', 'cane sugar', '설탕', '수크로스'],
    category: 'sugar'
  },
  {
    name: 'Lactose',
    pubchemId: '6134',
    smiles: 'C([C@@H]1[C@@H]([C@@H]([C@H]([C@@H](O1)O[C@@H]2[C@H](O[C@H]([C@@H]([C@H]2O)O)O)CO)O)O)O)O',
    formula: 'C12H22O11',
    weight: 342.30,
    description: 'Milk sugar',
    synonyms: ['milk sugar', '유당', '락토스'],
    category: 'sugar'
  },
  {
    name: 'Maltose',
    pubchemId: '10991610',
    smiles: 'C([C@@H]1[C@@H]([C@H]([C@@H]([C@H](O1)O[C@@H]2[C@H](O[C@H]([C@@H]([C@H]2O)O)O)CO)O)O)O)O',
    formula: 'C12H22O11',
    weight: 342.30,
    description: 'Malt sugar - disaccharide',
    synonyms: ['malt sugar', '맥아당', '말토스'],
    category: 'sugar'
  },
  {
    name: 'Galactose',
    pubchemId: '6036',
    smiles: 'C([C@@H]1[C@@H]([C@H]([C@@H]([C@H](O1)O)O)O)O)O',
    formula: 'C6H12O6',
    weight: 180.16,
    description: 'D-Galactose - component of lactose',
    synonyms: ['d-galactose', '갈락토스'],
    category: 'sugar'
  },
  {
    name: 'Ribose',
    pubchemId: '5779',
    smiles: 'C([C@@H]1[C@H]([C@H]([C@@H](O1)O)O)O)O',
    formula: 'C5H10O5',
    weight: 150.13,
    description: 'Pentose sugar in RNA',
    synonyms: ['d-ribose', '리보스'],
    category: 'sugar'
  },
  {
    name: 'Deoxyribose',
    pubchemId: '439576',
    smiles: 'C([C@@H]1[C@H](C[C@@H](O1)O)O)O',
    formula: 'C5H10O4',
    weight: 134.13,
    description: 'Pentose sugar in DNA',
    synonyms: ['2-deoxyribose', '디옥시리보스'],
    category: 'sugar'
  },
  
  // === 호르몬 (Hormones) ===
  {
    name: 'Insulin',
    pubchemId: '70678557',
    smiles: '',
    formula: 'C257H383N65O77S6',
    weight: 5807.7,
    description: 'Peptide hormone regulating glucose metabolism',
    synonyms: ['human insulin', 'insulin hormone', '인슐린', '인슐린 호르몬', 'ins', 'insulin'],
    category: 'hormone'
  },
  {
    name: 'Testosterone',
    pubchemId: '6013',
    smiles: 'C[C@]12CC[C@H]3[C@H]([C@@H]1CC[C@@H]2O)CCC4=CC(=O)CC[C@]34C',
    formula: 'C19H28O2',
    weight: 288.42,
    description: 'Male sex hormone',
    synonyms: ['test', '테스토스테론'],
    category: 'hormone'
  },
  {
    name: 'Estrogen',
    pubchemId: '5757',
    smiles: 'C[C@]12CC[C@H]3[C@H]([C@@H]1CCC2=O)CCC4=C3C=CC(=C4)O',
    formula: 'C18H22O2',
    weight: 270.37,
    description: 'Female sex hormone',
    synonyms: ['estradiol', '에스트로겐', '에스트라디올'],
    category: 'hormone'
  },
  {
    name: 'Cortisol',
    pubchemId: '5754',
    smiles: 'C[C@]12CC[C@H]3[C@H]([C@@H]1CC[C@@H]2C(=O)CO)CCC4=CC(=O)CC[C@]34C',
    formula: 'C21H30O5',
    weight: 362.46,
    description: 'Stress hormone',
    synonyms: ['hydrocortisone', '코르티솔', '하이드로코르티손'],
    category: 'hormone'
  },
  {
    name: 'Thyroxine',
    pubchemId: '5819',
    smiles: 'C1=C(C=C(C(=C1I)OC2=CC(=C(C(=C2)I)O)I)I)C[C@@H](C(=O)O)N',
    formula: 'C15H11I4NO4',
    weight: 776.87,
    description: 'Thyroid hormone T4',
    synonyms: ['t4', 'levothyroxine', '티록신'],
    category: 'hormone'
  },
  {
    name: 'Adrenaline',
    pubchemId: '5816',
    smiles: 'CNC[C@@H](C1=CC(=C(C=C1)O)O)O',
    formula: 'C9H13NO3',
    weight: 183.20,
    description: 'Epinephrine - fight or flight hormone',
    synonyms: ['epinephrine', '에피네프린', '아드레날린'],
    category: 'hormone'
  },
  {
    name: 'Noradrenaline',
    pubchemId: '439260',
    smiles: 'NC[C@@H](C1=CC(=C(C=C1)O)O)O',
    formula: 'C8H11NO3',
    weight: 169.18,
    description: 'Norepinephrine - neurotransmitter',
    synonyms: ['norepinephrine', '노르에피네프린', '노르아드레날린'],
    category: 'hormone'
  },
  {
    name: 'Dopamine',
    pubchemId: '681',
    smiles: 'C1=CC(=C(C=C1CCN)O)O',
    formula: 'C8H11NO2',
    weight: 153.18,
    description: 'Neurotransmitter - reward and pleasure',
    synonyms: ['dopa', '도파민'],
    category: 'hormone'
  },
  {
    name: 'Serotonin',
    pubchemId: '5202',
    smiles: 'C1=CC2=C(C=C1O)C(=CN2)CCN',
    formula: 'C10H12N2O',
    weight: 176.21,
    description: 'Neurotransmitter - mood regulation',
    synonyms: ['5-ht', '세로토닌'],
    category: 'hormone'
  },
  
  // === 알칼로이드 (Alkaloids) ===
  {
    name: 'Caffeine',
    pubchemId: '2519',
    smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
    formula: 'C8H10N4O2',
    weight: 194.19,
    description: 'Central nervous system stimulant',
    synonyms: ['1,3,7-trimethylxanthine', 'theine', 'guaranine', '카페인', '테인', 'caff', 'caffiene'],
    category: 'alkaloid'
  },
  {
    name: 'Nicotine',
    pubchemId: '89594',
    smiles: 'CN1CCC[C@H]1C2=CN=CC=C2',
    formula: 'C10H14N2',
    weight: 162.23,
    description: 'Stimulant alkaloid found in tobacco',
    synonyms: ['nic', '니코틴'],
    category: 'alkaloid'
  },
  {
    name: 'Cocaine',
    pubchemId: '446220',
    smiles: 'CN1C2CCC1C(C(C2)OC(=O)C3=CC=CC=C3)C(=O)OC',
    formula: 'C17H21NO4',
    weight: 303.35,
    description: 'Tropane alkaloid and stimulant',
    synonyms: ['coke', '코카인'],
    category: 'alkaloid'
  },
  {
    name: 'Quinine',
    pubchemId: '3034034',
    smiles: 'COC1=CC2=C(C=CN=C2C=C1)[C@H]([C@@H]3C[C@@H]4CCN3C[C@@H]4C=C)O',
    formula: 'C20H24N2O2',
    weight: 324.42,
    description: 'Antimalarial alkaloid',
    synonyms: ['quin', '퀴닌'],
    category: 'alkaloid'
  },
  {
    name: 'Capsaicin',
    pubchemId: '1548943',
    smiles: 'COC1=C(C=CC(=C1)CNC(=O)CCCCCCCC=C)O',
    formula: 'C18H27NO3',
    weight: 305.41,
    description: 'Active component of chili peppers',
    synonyms: ['caps', '캡사이신'],
    category: 'alkaloid'
  },
  
  // === 지질 (Lipids) ===
  {
    name: 'Cholesterol',
    pubchemId: '5997',
    smiles: 'C[C@H](CCCC(C)C)[C@H]1CC[C@@H]2[C@@]1(CC[C@H]3[C@H]2CC=C4[C@@]3(CC[C@@H](C4)O)C)C',
    formula: 'C27H46O',
    weight: 386.65,
    description: 'Sterol lipid - membrane component',
    synonyms: ['chol', '콜레스테롤'],
    category: 'lipid'
  },
  {
    name: 'Ethanol',
    pubchemId: '702',
    smiles: 'CCO',
    formula: 'C2H6O',
    weight: 46.07,
    description: 'Ethyl alcohol - solvent and recreational drug',
    synonyms: ['ethyl alcohol', 'grain alcohol', 'drinking alcohol', '에탄올', '에틸알코올', '술', 'eth', 'ethanol'],
    category: 'alcohol'
  },
  
  // === 뉴클레오티드 (Nucleotides) ===
  {
    name: 'ATP',
    pubchemId: '5957',
    smiles: 'C1=NC(=C2C(=N1)N(C=N2)[C@H]3[C@@H]([C@@H]([C@H](O3)COP(=O)(O)OP(=O)(O)OP(=O)(O)O)O)O)N',
    formula: 'C10H16N5O13P3',
    weight: 507.18,
    description: 'Adenosine triphosphate - cellular energy currency',
    synonyms: ['atp', 'adenosine triphosphate', '아데노신 삼인산'],
    category: 'nucleotide'
  },
  {
    name: 'ADP',
    pubchemId: '6022',
    smiles: 'C1=NC(=C2C(=N1)N(C=N2)[C@H]3[C@@H]([C@@H]([C@H](O3)COP(=O)(O)OP(=O)(O)O)O)O)N',
    formula: 'C10H15N5O10P2',
    weight: 427.20,
    description: 'Adenosine diphosphate',
    synonyms: ['adp', 'adenosine diphosphate', '아데노신 이인산'],
    category: 'nucleotide'
  },
  {
    name: 'AMP',
    pubchemId: '6083',
    smiles: 'C1=NC(=C2C(=N1)N(C=N2)[C@H]3[C@@H]([C@@H]([C@H](O3)COP(=O)(O)O)O)O)N',
    formula: 'C10H14N5O7P',
    weight: 347.22,
    description: 'Adenosine monophosphate',
    synonyms: ['amp', 'adenosine monophosphate', '아데노신 일인산'],
    category: 'nucleotide'
  },
  {
    name: 'NAD+',
    pubchemId: '5892',
    smiles: 'C1=CC(=C[N+](=C1)C2C(C(C(O2)COP(=O)([O-])OP(=O)([O-])OCC3C(C(C(O3)N4C=NC5=C(N=CN=C54)N)O)O)O)O)C(=O)N',
    formula: 'C21H28N7O14P2',
    weight: 663.43,
    description: 'Nicotinamide adenine dinucleotide - electron carrier',
    synonyms: ['nad', 'nad+', '니코틴아마이드 아데닌 디뉴클레오티드'],
    category: 'nucleotide'
  },
  {
    name: 'NADH',
    pubchemId: '5893',
    smiles: 'C1=CC(=CN=C1)C2C(C(C(O2)COP(=O)([O-])OP(=O)([O-])OCC3C(C(C(O3)N4C=NC5=C(N=CN=C54)N)O)O)O)O',
    formula: 'C21H29N7O14P2',
    weight: 664.42,
    description: 'Reduced form of NAD+',
    synonyms: ['nadh', 'reduced nad', '환원된 nad'],
    category: 'nucleotide'
  },
  {
    name: 'FAD',
    pubchemId: '643975',
    smiles: 'CC1=CC2=C(C=C1C)N(C3=NC(=O)NC(=O)C3=N2)C[C@H]([C@H]([C@H](COP(=O)([O-])OP(=O)([O-])OC[C@@H]4[C@H]([C@H]([C@@H](O4)N5C=NC6=C(N=CN=C65)N)O)O)O)O)O',
    formula: 'C27H33N9O15P2',
    weight: 785.55,
    description: 'Flavin adenine dinucleotide - electron carrier',
    synonyms: ['fad', 'flavin adenine dinucleotide', '플라빈 아데닌 디뉴클레오티드'],
    category: 'nucleotide'
  },
  
  // === 단백질 (Proteins) ===
  {
    name: 'Hemoglobin',
    pubchemId: '727',
    smiles: '',
    formula: 'C2952H4664N812O832S8Fe4',
    weight: 64500,
    description: 'Oxygen-carrying protein in red blood cells',
    synonyms: ['hb', 'hgb', 'hemoglobin protein', '헤모글로빈', '혈색소', 'hemo', 'hemoglobin'],
    category: 'protein'
  },
  {
    name: 'Albumin',
    pubchemId: '151165',
    smiles: '',
    formula: 'C2933H4614N784O898S39',
    weight: 66463,
    description: 'Major protein in blood plasma',
    synonyms: ['serum albumin', '알부민'],
    category: 'protein'
  },
  
  // === 기타 생체분자 (Other Biomolecules) ===
  {
    name: 'Creatine',
    pubchemId: '586',
    smiles: 'CN(CC(=O)O)C(=N)N',
    formula: 'C4H9N3O2',
    weight: 131.13,
    description: 'Compound that supplies energy to muscle cells',
    synonyms: ['creat', '크레아틴'],
    category: 'metabolite'
  },
  {
    name: 'Urea',
    pubchemId: '1176',
    smiles: 'C(=O)(N)N',
    formula: 'CH4N2O',
    weight: 60.06,
    description: 'Waste product of protein metabolism',
    synonyms: ['carbamide', '요소', '우레아'],
    category: 'metabolite'
  },
  {
    name: 'Uric Acid',
    pubchemId: '1175',
    smiles: 'C1=C2C(=O)NC(=O)N2C(=O)N1',
    formula: 'C5H4N4O3',
    weight: 168.11,
    description: 'End product of purine metabolism',
    synonyms: ['urate', '요산'],
    category: 'metabolite'
  },
  {
    name: 'Lactic Acid',
    pubchemId: '612',
    smiles: 'CC(C(=O)O)O',
    formula: 'C3H6O3',
    weight: 90.08,
    description: 'Product of anaerobic glycolysis',
    synonyms: ['lactate', '젖산'],
    category: 'metabolite'
  },
  {
    name: 'Pyruvic Acid',
    pubchemId: '1060',
    smiles: 'CC(=O)C(=O)O',
    formula: 'C3H4O3',
    weight: 88.06,
    description: 'Key intermediate in metabolism',
    synonyms: ['pyruvate', '피루브산'],
    category: 'metabolite'
  },
  {
    name: 'Citric Acid',
    pubchemId: '311',
    smiles: 'C(C(=O)O)C(CC(=O)O)(C(=O)O)O',
    formula: 'C6H8O7',
    weight: 192.12,
    description: 'Key intermediate in citric acid cycle',
    synonyms: ['citrate', '구연산'],
    category: 'metabolite'
  },
  {
    name: 'Oxaloacetic Acid',
    pubchemId: '970',
    smiles: 'C(C(=O)C(=O)O)C(=O)O',
    formula: 'C4H4O5',
    weight: 132.07,
    description: 'Intermediate in citric acid cycle',
    synonyms: ['oxaloacetate', '옥살로아세트산'],
    category: 'metabolite'
  },
  {
    name: 'Alpha-Ketoglutaric Acid',
    pubchemId: '51',
    smiles: 'C(CC(=O)C(=O)O)C(=O)O',
    formula: 'C5H6O5',
    weight: 146.10,
    description: 'Intermediate in citric acid cycle',
    synonyms: ['alpha-ketoglutarate', '알파-케토글루타르산'],
    category: 'metabolite'
  },
  {
    name: 'Succinic Acid',
    pubchemId: '1110',
    smiles: 'C(CC(=O)O)C(=O)O',
    formula: 'C4H6O4',
    weight: 118.09,
    description: 'Intermediate in citric acid cycle',
    synonyms: ['succinate', '숙신산'],
    category: 'metabolite'
  },
  {
    name: 'Fumaric Acid',
    pubchemId: '444972',
    smiles: 'C(=CC(=O)O)C(=O)O',
    formula: 'C4H4O4',
    weight: 116.07,
    description: 'Intermediate in citric acid cycle',
    synonyms: ['fumarate', '푸마르산'],
    category: 'metabolite'
  },
  {
    name: 'Malic Acid',
    pubchemId: '525',
    smiles: 'C(C(C(=O)O)O)C(=O)O',
    formula: 'C4H6O5',
    weight: 134.09,
    description: 'Intermediate in citric acid cycle',
    synonyms: ['malate', '말산'],
    category: 'metabolite'
  }
];
