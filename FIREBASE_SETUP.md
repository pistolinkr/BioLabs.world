# 🔐 ProLab Firebase 설정 가이드

## 📋 개요
ProLab은 Firebase를 백엔드로 사용하여 사용자 인증, 데이터 저장, 파일 관리 기능을 제공합니다. 각 사용자는 자신만의 Lab을 가지며, 모든 데이터는 개인적으로 관리됩니다.

## 🚀 Firebase 프로젝트 설정

### 1. Firebase 콘솔에서 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름: `prolab-{your-name}`
4. Google Analytics 활성화 (선택사항)

### 2. 웹 앱 추가
1. 프로젝트 대시보드에서 웹 아이콘 클릭
2. 앱 닉네임: `prolab-web`
3. Firebase Hosting 설정 체크
4. 앱 등록

## 🔑 인증 서비스 설정

### 1. Authentication 활성화
1. Firebase 콘솔 → Authentication → 시작하기
2. 로그인 방법에서 다음 제공업체 활성화:
   - **이메일/비밀번호** ✅
   - **Google** ✅
   - **GitHub** ✅
   - **Apple** ✅

### 2. OAuth 제공업체별 설정

#### Google 로그인
1. Google 제공업체 선택
2. 프로젝트 지원 이메일 설정
3. 웹 SDK 구성에서 승인된 도메인 추가:
   - `localhost` (개발용)
   - `your-domain.com` (프로덕션용)

#### GitHub 로그인
1. GitHub 제공업체 선택
2. GitHub에서 OAuth App 생성:
   - Application name: `ProLab`
   - Homepage URL: `https://your-domain.com`
   - Authorization callback URL: `https://your-project.firebaseapp.com/__/auth/handler`
3. Client ID와 Client Secret을 Firebase에 입력

#### Apple 로그인
1. Apple 제공업체 선택
2. Apple Developer 계정에서 Sign in with Apple 설정
3. Service ID 생성 및 설정
4. Team ID, Key ID, Private Key 입력

### 3. 사용자 데이터 수집 동의
- 이메일 주소 수집 ✅
- 사용자 이름 수집 ✅
- 프로필 사진 수집 ✅

## 🗄️ Firestore 데이터베이스 설정

### 1. Firestore 생성
1. Firebase 콘솔 → Firestore Database → 데이터베이스 만들기
2. 보안 규칙 모드: **테스트 모드에서 시작**
3. 위치: `asia-northeast3 (서울)`

### 2. 데이터 구조
```
users/
  {userId}/
    uid: string
    email: string
    displayName: string
    photoURL: string
    provider: string
    createdAt: timestamp
    lastLoginAt: timestamp
    labSettings: {
      theme: 'dark' | 'light'
      language: 'ko' | 'en'
      notifications: boolean
    }
    labData: {
      proteinSimulations: []
      diagnosisResults: []
      interactionNetworks: []
      drugScreenings: []
      epidemiologyModels: []
    }
```

### 3. 보안 규칙 배포
```bash
firebase deploy --only firestore:rules
```

## 📁 Storage 설정

### 1. Storage 활성화
1. Firebase 콘솔 → Storage → 시작하기
2. 보안 규칙 모드: **테스트 모드에서 시작**
3. 위치: `asia-northeast3 (서울)`

### 2. 폴더 구조
```
users/
  {userId}/
    profile/          # 프로필 이미지
    simulations/      # 시뮬레이션 파일
    diagnoses/        # 진단 이미지
    networks/         # 네트워크 데이터
    screenings/       # 스크리닝 결과
    models/           # 모델링 데이터
public/               # 공개 파일
  templates/          # 템플릿 파일
  documentation/      # 문서
```

### 3. 보안 규칙 배포
```bash
firebase deploy --only storage
```

## 🌐 Hosting 설정

### 1. 빌드 및 배포
```bash
# React 앱 빌드
npm run build

# Firebase에 배포
firebase deploy --only hosting
```

### 2. 도메인 설정 (선택사항)
1. Firebase 콘솔 → Hosting → 사용자 정의 도메인
2. 도메인 추가 및 DNS 설정

## 🔧 환경 변수 설정

### 1. .env 파일 생성
프로젝트 루트에 `.env` 파일 생성:

```env
# Firebase 설정
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 2. .gitignore에 추가
```gitignore
# Firebase
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## 📱 사용자 Lab 시스템

### 1. 개인화된 데이터
- **단백질 시뮬레이션**: 사용자별 시뮬레이션 결과 저장
- **AI 진단**: 개인 진단 결과 및 히스토리 관리
- **상호작용 네트워크**: 사용자별 네트워크 분석 데이터
- **약물 스크리닝**: 개인 스크리닝 결과 및 후보물질
- **역학 모델링**: 사용자별 모델링 결과 및 예측

### 2. Lab 설정
- **테마**: 다크/라이트 모드 선택
- **언어**: 한국어/영어 지원
- **알림**: 실시간 알림 설정

### 3. 데이터 보안
- 모든 데이터는 사용자별로 격리
- Firebase 보안 규칙으로 접근 제어
- 개인정보 암호화 저장

## 🚨 보안 고려사항

### 1. 인증 보안
- OAuth 토큰 만료 시간 설정
- 비밀번호 정책 강화
- 다중 인증 (MFA) 권장

### 2. 데이터 보안
- 사용자별 데이터 접근 제한
- API 키 노출 방지
- 정기적인 보안 감사

### 3. 개인정보 보호
- GDPR/개인정보보호법 준수
- 데이터 삭제 요청 처리
- 개인정보 암호화

## 🔍 문제 해결

### 1. OAuth 로그인 실패
- 도메인 설정 확인
- OAuth 앱 설정 검증
- Firebase 콘솔 로그 확인

### 2. 데이터 접근 오류
- 보안 규칙 확인
- 사용자 인증 상태 검증
- Firestore 인덱스 설정

### 3. 파일 업로드 실패
- Storage 보안 규칙 확인
- 파일 크기 제한 확인
- 파일 형식 검증

## 📚 추가 리소스

- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Firebase 보안 규칙 가이드](https://firebase.google.com/docs/firestore/security/get-started)
- [OAuth 2.0 설정 가이드](https://developers.google.com/identity/protocols/oauth2)
- [ProLab 개발자 가이드](https://github.com/your-org/prolab)

## 🎯 다음 단계

1. **테스트 환경 구축**: Firebase Emulator 사용
2. **모니터링 설정**: Firebase Analytics 및 Crashlytics
3. **백업 전략**: 정기적인 데이터 백업
4. **성능 최적화**: Firestore 인덱스 및 쿼리 최적화

---

**⚠️ 주의사항**: 이 가이드는 개발 환경을 위한 것입니다. 프로덕션 환경에서는 추가적인 보안 조치가 필요합니다.
