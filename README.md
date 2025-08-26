# 🧬 https://www.BioLabs.world - Research Data Integrated Analysis Platform

## 📋 프로젝트 개요

BioLabs은 연구를 위한 통합 분석 플랫폼입니다. 단백질 시뮬레이션, AI 진단, 상호작용 네트워크, 약물 스크리닝, 역학 모델링 등 다양한 연구 도구를 제공합니다.

## ✨ 주요 기능

### 🔬 **연구 모듈**
- **Protein Simulation**: PDB-101의 PDB/CIF 파일을 불러와 3D 단백질 구조 시각화
- **AI Diagnosis**: AI 기반 프리온 질병 진단
- **Interaction Network**: 단백질 상호작용 네트워크 분석
- **Drug Screening**: 약물 스크리닝 및 개발
- **Epidemiology Model**: 역학 모델링 및 예측

### 🔐 **사용자 시스템**
- **OAuth 로그인**: Google, GitHub, Apple 지원
- **개인 Lab**: 사용자별 맞춤형 연구 환경
- **데이터 저장**: Firestore 기반 안전한 데이터 관리
- **설정 관리**: 테마, 언어, 알림 설정

## 🛠️ 기술 스택

### **Frontend**
- **React 18** - 사용자 인터페이스
- **TypeScript** - 타입 안전성
- **Material-UI (MUI)** - 컴포넌트 라이브러리
- **NGL Viewer** - 3D 단백질 구조 시각화
- **Chart.js** - 데이터 차트

### **Backend**
- **Firebase Authentication** - 사용자 인증
- **Firestore** - 데이터베이스
- **Firebase Storage** - 파일 저장
- **Firebase Hosting** - 웹 호스팅

## 🚀 설치 및 실행

### **필수 요구사항**
- Node.js 18.0.0 이상
- npm 또는 yarn
- Firebase 프로젝트

### **설치 단계**

1. **저장소 클론**
```bash
git clone https://github.com/pistolinkr/BioLabs.git
cd BioLabs
```

2. **의존성 설치**
```bash
npm install
```

3. **Firebase 설정**
```bash
npm install -g firebase-tools
firebase login
firebase init
```

4. **환경 변수 설정**
`.env` 파일을 생성하고 Firebase 설정을 추가:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. **개발 서버 실행**
```bash
npm start
```

6. **빌드 및 배포**
```bash
npm run build
firebase deploy
```

## 🌐 배포된 사이트

**https://biolabs.world**

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
├── pages/              # 페이지 컴포넌트
│   └── ProteinSimulation.tsx  # 단백질 구조 시각화 엔진
├── contexts/           # React Context
├── firebase/           # Firebase 설정 및 서비스
├── utils/              # 유틸리티 함수
├── types/              # TypeScript 타입 정의
│   └── ngl.d.ts        # NGL Viewer 타입 정의
└── data/               # 정적 데이터
```

## 🧬 단백질 시각화 엔진

### **주요 기능**
- **파일 업로드**: 로컬 PDB, CIF, ENT 파일 직접 업로드
- **PDB ID 검색**: RCSB PDB의 구조 ID로 직접 검색 및 로드
- **샘플 구조**: 미리 준비된 단백질 구조들 (Ubiquitin, Hemoglobin 등)
- **다양한 표현 방식**: Cartoon, Surface, Ball+Stick, Ribbon, Spacefill 등
- **색상 체계**: Chain ID, Element, Residue, Atom Index 등으로 구분
- **3D 조작**: 마우스로 회전, 확대/축소, 이동
- **스크린샷**: 현재 뷰를 PNG 이미지로 저장

### **지원 파일 형식**
- **PDB (.pdb)**: Protein Data Bank 표준 형식
- **CIF (.cif)**: Crystallographic Information File
- **ENT (.ent)**: PDB 엔트리 파일

### **기술적 특징**
- **NGL Viewer**: 웹 기반 고성능 3D 분자 시각화 라이브러리
- **WebGL 가속**: 하드웨어 가속을 통한 부드러운 렌더링
- **반응형 디자인**: 모든 디바이스에서 최적의 시각화 경험
- **실시간 렌더링**: 다양한 표현 방식과 색상 체계를 실시간으로 변경

## 🔧 개발 환경 설정

### **Firebase 설정**
1. Firebase 콘솔에서 새 프로젝트 생성
2. Authentication에서 OAuth 제공업체 활성화
3. Firestore 데이터베이스 생성
4. 보안 규칙 설정

### **OAuth 제공업체 설정**
- **Google**: Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
- **GitHub**: GitHub Developer Settings에서 OAuth App 생성
- **Apple**: Apple Developer Console에서 Sign in with Apple 설정

## 📊 데이터 모델

### **사용자 프로필**
```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: string;
  createdAt: string;
  lastLoginAt: string;
  labSettings: LabSettings;
  labData: LabData;
}
```

### **Lab 데이터**
```typescript
interface LabData {
  proteinSimulations: any[];
  diagnosisResults: any[];
  interactionNetworks: any[];
  drugScreenings: any[];
  epidemiologyModels: any[];
}
```

## 🎨 UI/UX 특징

- **검은색/하얀색 테마**: 연구 환경에 최적화된 미니멀한 디자인
- **반응형 디자인**: 모든 디바이스에서 최적의 경험
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원
- **성능 최적화**: 코드 스플리팅 및 지연 로딩

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

- **GitHub**: [@pistolinkr](https://github.com/pistolinkr)
- **Mail**: [pistolinkr@icloud.com](pistolinkr@icloud.com)
- **프로젝트 링크**: [https://github.com/pistolinkr/BioLabs](https://github.com/pistolinkr/BioLabs)

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
