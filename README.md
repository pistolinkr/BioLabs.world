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

---

### 🇺🇸 EN
# 🧬 https://www.BioLabs.world - Research Data Integrated Analysis Platform

## 📋 Project Overview

BioLabs is an integrated analysis platform for research. It provides various research tools such as protein simulation, AI diagnosis, interaction networks, drug screening, and epidemiological modeling.

## ✨ Key Features

### 🔬 **Research Modules**
- **Protein Simulation**: Import PDB/CIF files from PDB-101 to visualize 3D protein structures
- **AI Diagnosis**: AI-based prion disease diagnosis
- **Interaction Network**: Protein interaction network analysis
- **Drug Screening**: Drug screening and development
- **Epidemiology Model**: Epidemiological modeling and prediction

### 🔐 **User System**
- **OAuth Login**: Supports Google, GitHub, and Apple
- **Personal Lab**: Customized research environment for each user
- **Data Storage**: Secure data management based on Firestore
- **Settings Management**: Theme, language, and notification settings

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - User interface
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **NGL Viewer** - 3D protein structure visualization
- **Chart.js** - Data charts

### **Backend**
- **Firebase Authentication** - User authentication
- **Firestore** - Database
- **Firebase Storage** - File storage
- **Firebase Hosting** - Web hosting

## 🚀 Installation and execution

### **Requirements**
- Node.js 18.0.0 or higher
- npm or yarn
- Firebase project

### **Installation Steps**

1. **Clone the repository**
```bash
git clone https://github.com/pistolinkr/BioLabs.git
cd BioLabs
```

2. **Install dependencies**
```bash
npm install
```

3. **Firebase setup**
```bash
npm install -g firebase-tools
firebase login
firebase init
```

4. **Set environment variables**
Create a `.env` file and add Firebase settings:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. **Run the development server**
```bash
npm start
```

6. **Build and deploy**
```bash
npm run build
firebase deploy
```

## 🌐 Deployed site

**https://biolabs.world**

## 📁 Project structure

```
src/
├── components/          # Reusable components
├── pages/              # Page components
│   └── ProteinSimulation.tsx  # Protein structure visualization engine
├── contexts/           # React Context
├── firebase/           # Firebase settings and services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
│   └── ngl.d.ts        # NGL Viewer type definitions
└── data/               # Static data
```

## 🧬 Protein visualization engine

### **Key features**
- **File upload**: Directly upload local PDB, CIF, and ENT files
- **PDB ID search**: Directly search and load structures using RCSB PDB structure IDs
- **Sample structures**: Pre-prepared protein structures (Ubiquitin, Hemoglobin, etc.)
- **Various Display Modes**: Cartoon, Surface, Ball+Stick, Ribbon, Spacefill, etc.
- **Color Scheme**: Distinguished by Chain ID, Element, Residue, Atom Index, etc.
- **3D Manipulation**: Rotate, zoom in/out, and move with the mouse
- **Screenshot**: Save the current view as a PNG image

### **Supported file formats**
- **PDB (.pdb)**: Protein Data Bank standard format
- **CIF (.cif)**: Crystallographic Information File
- **ENT (.ent)**: PDB entry file

### **Technical features**
- **NGL Viewer**: Web-based high-performance 3D molecular visualization library
- **WebGL acceleration**: Smooth rendering through hardware acceleration
- **Responsive design**: Optimal visualization experience on all devices
- **Real-time rendering**: Change various display modes and color schemes in real time

## 🔧 Development Environment Setup

### **Firebase Setup**
1. Create a new project in the Firebase console
2. Enable OAuth provider in Authentication
3. Create a Firestore database
4. Set security rules

### **OAuth Provider Setup**
- **Google**: Create an OAuth 2.0 client ID in Google Cloud Console
- **GitHub**: Create an OAuth App in GitHub Developer Settings
- **Apple**: Set up Sign in with Apple in the Apple Developer Console

## 📊 Data Model

### **User Profile**
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

### **Lab Data**
```typescript
interface LabData {
  proteinSimulations: any[];
  diagnosisResults: any[];
  interactionNetworks: any[];
  drugScreenings: any[];
  epidemiologyModels: any[];
}
```

## 🎨 UI/UX Features

- **Black/White Theme**: Minimalist design optimized for research environments
- **Responsive Design**: Optimal experience on all devices
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance optimization**: Code splitting and lazy loading

## 🤝 Contribute

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m ‘Add some AmazingFeature’`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is distributed under the MIT License. For details, refer to the `LICENSE` file.

## 📞 Contact

- **GitHub**: [@pistolinkr](https://github.com/pistolinkr)
- **Mail**: [pistolinkr@icloud.com](pistolinkr@icloud.com)
- **Project Link**: [https://github.com/pistolinkr/BioLabs](https://github.com/pistolinkr/BioLabs)

⭐ If this project was helpful, please give it a star!

Translated with DeepL.com (free version)

---

## 🇯🇵 日本語

### 🧬 [https://www.BioLabs.world](https://www.BioLabs.world) - 研究データ統合解析プラットフォーム

### 📋 プロジェクト概要

BioLabsは研究のための統合解析プラットフォームです。タンパク質シミュレーション、AI診断、相互作用ネットワーク、薬物スクリーニング、疫学モデリングなどの様々な研究ツールを提供します。

### ✨ 主要機能

**🔬 研究モジュール**

- **タンパク質シミュレーション**: PDB-101からPDB/CIFファイルをインポートし、3Dタンパク質構造を可視化
- **AI診断**: AIベースのプリオン病診断
- **相互作用ネットワーク**: タンパク質相互作用ネットワーク解析
- **薬物スクリーニング**: 薬物スクリーニングと開発
- **疫学モデル**: 疫学モデリングと予測

**🔐 ユーザーシステム**

- **OAuthログイン**: Google、GitHub、Apple対応
- **パーソナルラボ**: 各ユーザー用のカスタマイズされた研究環境
- **データストレージ**: Firestoreベースの安全なデータ管理
- **設定管理**: テーマ、言語、通知設定

### 🛠️ 技術スタック

**フロントエンド**

- **React 18** - ユーザーインターフェース
- **TypeScript** - 型安全性
- **Material-UI (MUI)** - コンポーネントライブラリ
- **NGL Viewer** - 3Dタンパク質構造可視化
- **Chart.js** - データチャート

**バックエンド**

- **Firebase Authentication** - ユーザー認証
- **Firestore** - データベース
- **Firebase Storage** - ファイルストレージ
- **Firebase Hosting** - ウェブホスティング

### 🚀 インストールと実行

**要件**

- Node.js 18.0.0以上
- npmまたはyarn
- Firebaseプロジェクト

**インストール手順**

1. **リポジトリのクローン**

```bash
git clone [https://github.com/pistolinkr/BioLabs.git](https://github.com/pistolinkr/BioLabs.git)
cd BioLabs
```

1. **依存関係のインストール**

```bash
npm install
```

1. **Firebase設定**

```bash
npm install -g firebase-tools
firebase login
firebase init
```

1. **環境変数の設定**

`.env`ファイルを作成し、Firebase設定を追加：

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

1. **開発サーバーの実行**

```bash
npm start
```

1. **ビルドとデプロイ**

```bash
npm run build
firebase deploy
```

### 🌐 デプロイサイト

[**https://biolabs.world**](https://biolabs.world)

---

## 🇨🇳 中

### 🧬 [https://www.BioLabs.world](https://www.BioLabs.world) - 研究数据集成分析平台

### 📋 项目概述

BioLabs是一个研究集成分析平台。它提供各种研究工具，如蛋白质模拟、AI诊断、相互作用网络、药物筛选和流行病学建模。

### ✨ 主要功能

**🔬 研究模块**

- **蛋白质模拟**：从PDB-101导入PDB/CIF文件以可视化3D蛋白质结构
- **AI诊断**：基于AI的朊病毒疾病诊断
- **相互作用网络**：蛋白质相互作用网络分析
- **药物筛选**：药物筛选和开发
- **流行病学模型**：流行病学建模和预测

**🔐 用户系统**

- **OAuth登录**：支持Google、GitHub和Apple
- **个人实验室**：为每个用户定制的研究环境
- **数据存储**：基于Firestore的安全数据管理
- **设置管理**：主题、语言和通知设置

### 🛠️ 技术栈

**前端**

- **React 18** - 用户界面
- **TypeScript** - 类型安全
- **Material-UI (MUI)** - 组件库
- **NGL Viewer** - 3D蛋白质结构可视化
- **Chart.js** - 数据图表

**后端**

- **Firebase Authentication** - 用户认证
- **Firestore** - 数据库
- **Firebase Storage** - 文件存储
- **Firebase Hosting** - Web托管

### 🚀 安装和运行

**要求**

- Node.js 18.0.0或更高版本
- npm或yarn
- Firebase项目

**安装步骤**

1. **克隆仓库**

```bash
git clone [https://github.com/pistolinkr/BioLabs.git](https://github.com/pistolinkr/BioLabs.git)
cd BioLabs
```

1. **安装依赖**

```bash
npm install
```

1. **Firebase设置**

```bash
npm install -g firebase-tools
firebase login
firebase init
```

1. **设置环境变量**

创建`.env`文件并添加Firebase设置：

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

1. **运行开发服务器**

```bash
npm start
```

1. **构建和部署**

```bash
npm run build
firebase deploy
```

### 🌐 部署站点

[**https://biolabs.world**](https://biolabs.world)

---

## 🇷🇺 Русский

### 🧬 [https://www.BioLabs.world](https://www.BioLabs.world) - Платформа интегрированного анализа исследовательских данных

### 📋 Обзор проекта

BioLabs — это интегрированная аналитическая платформа для исследований. Она предоставляет различные исследовательские инструменты, такие как моделирование белков, ИИ-диагностика, сети взаимодействий, скрининг лекарств и эпидемиологическое моделирование.

### ✨ Ключевые функции

**🔬 Исследовательские модули**

- **Моделирование белков**: Импорт файлов PDB/CIF из PDB-101 для визуализации 3D-структур белков
- **ИИ-диагностика**: ИИ-диагностика прионных заболеваний
- **Сети взаимодействий**: Анализ сетей белковых взаимодействий
- **Скрининг лекарств**: Скрининг и разработка лекарств
- **Эпидемиологические модели**: Эпидемиологическое моделирование и прогнозирование

**🔐 Пользовательская система**

- **OAuth-авторизация**: Поддержка Google, GitHub и Apple
- **Персональная лаборатория**: Индивидуальная исследовательская среда для каждого пользователя
- **Хранение данных**: Безопасное управление данными на основе Firestore
- **Управление настройками**: Тема, язык и настройки уведомлений

### 🛠️ Технологический стек

**Фронтенд**

- **React 18** - Пользовательский интерфейс
- **TypeScript** - Типобезопасность
- **Material-UI (MUI)** - Библиотека компонентов
- **NGL Viewer** - Визуализация 3D-структур белков
- **Chart.js** - Диаграммы данных

**Бэкенд**

- **Firebase Authentication** - Аутентификация пользователей
- **Firestore** - База данных
- **Firebase Storage** - Хранилище файлов
- **Firebase Hosting** - Веб-хостинг

### 🚀 Установка и запуск

**Требования**

- Node.js 18.0.0 или выше
- npm или yarn
- Проект Firebase

**Шаги установки**

1. **Клонирование репозитория**

```bash
git clone [https://github.com/pistolinkr/BioLabs.git](https://github.com/pistolinkr/BioLabs.git)
cd BioLabs
```

1. **Установка зависимостей**

```bash
npm install
```

1. **Настройка Firebase**

```bash
npm install -g firebase-tools
firebase login
firebase init
```

1. **Установка переменных окружения**

Создайте файл `.env` и добавьте настройки Firebase:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

1. **Запуск сервера разработки**

```bash
npm start
```

1. **Сборка и развертывание**

```bash
npm run build
firebase deploy
```

### 🌐 Развернутый сайт

[**https://biolabs.world**](https://biolabs.world)

---

## 🇪🇸 Español

### 🧬 [https://www.BioLabs.world](https://www.BioLabs.world) - Plataforma de Análisis Integrado de Datos de Investigación

### 📋 Resumen del Proyecto

BioLabs es una plataforma de análisis integrado para investigación. Proporciona varias herramientas de investigación como simulación de proteínas, diagnóstico por IA, redes de interacción, cribado de fármacos y modelado epidemiológico.

### ✨ Características Principales

**🔬 Módulos de Investigación**

- **Simulación de Proteínas**: Importar archivos PDB/CIF desde PDB-101 para visualizar estructuras de proteínas en 3D
- **Diagnóstico por IA**: Diagnóstico de enfermedades priónicas basado en IA
- **Redes de Interacción**: Análisis de redes de interacción de proteínas
- **Cribado de Fármacos**: Cribado y desarrollo de fármacos
- **Modelos Epidemiológicos**: Modelado epidemiológico y predicción

**🔐 Sistema de Usuarios**

- **Inicio de Sesión OAuth**: Compatible con Google, GitHub y Apple
- **Laboratorio Personal**: Entorno de investigación personalizado para cada usuario
- **Almacenamiento de Datos**: Gestión segura de datos basada en Firestore
- **Gestión de Configuraciones**: Configuraciones de tema, idioma y notificaciones

### 🛠️ Stack Tecnológico

**Frontend**

- **React 18** - Interfaz de usuario
- **TypeScript** - Seguridad de tipos
- **Material-UI (MUI)** - Biblioteca de componentes
- **NGL Viewer** - Visualización de estructuras de proteínas en 3D
- **Chart.js** - Gráficos de datos

**Backend**

- **Firebase Authentication** - Autenticación de usuarios
- **Firestore** - Base de datos
- **Firebase Storage** - Almacenamiento de archivos
- **Firebase Hosting** - Alojamiento web

### 🚀 Instalación y Ejecución

**Requisitos**

- Node.js 18.0.0 o superior
- npm o yarn
- Proyecto Firebase

**Pasos de Instalación**

1. **Clonar el repositorio**

```bash
git clone [https://github.com/pistolinkr/BioLabs.git](https://github.com/pistolinkr/BioLabs.git)
cd BioLabs
```

1. **Instalar dependencias**

```bash
npm install
```

1. **Configuración de Firebase**

```bash
npm install -g firebase-tools
firebase login
firebase init
```

1. **Configurar variables de entorno**

Crear un archivo `.env` y agregar la configuración de Firebase:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

1. **Ejecutar el servidor de desarrollo**

```bash
npm start
```

1. **Construir y desplegar**

```bash
npm run build
firebase deploy
```

### 🌐 Sitio Desplegado

[**https://biolabs.world**](https://biolabs.world)

---

## 🇫🇷 Français

### 🧬 [https://www.BioLabs.world](https://www.BioLabs.world) - Plateforme d'Analyse Intégrée de Données de Recherche

### 📋 Aperçu du Projet

BioLabs est une plateforme d'analyse intégrée pour la recherche. Elle fournit divers outils de recherche tels que la simulation de protéines, le diagnostic par IA, les réseaux d'interaction, le criblage de médicaments et la modélisation épidémiologique.

### ✨ Fonctionnalités Principales

**🔬 Modules de Recherche**

- **Simulation de Protéines** : Importer des fichiers PDB/CIF depuis PDB-101 pour visualiser les structures de protéines en 3D
- **Diagnostic par IA** : Diagnostic de maladies à prions basé sur l'IA
- **Réseaux d'Interaction** : Analyse des réseaux d'interaction des protéines
- **Criblage de Médicaments** : Criblage et développement de médicaments
- **Modèles Épidémiologiques** : Modélisation épidémiologique et prédiction

**🔐 Système Utilisateur**

- **Connexion OAuth** : Support de Google, GitHub et Apple
- **Laboratoire Personnel** : Environnement de recherche personnalisé pour chaque utilisateur
- **Stockage de Données** : Gestion sécurisée des données basée sur Firestore
- **Gestion des Paramètres** : Paramètres de thème, langue et notifications

### 🛠️ Stack Technologique

**Frontend**

- **React 18** - Interface utilisateur
- **TypeScript** - Sécurité des types
- **Material-UI (MUI)** - Bibliothèque de composants
- **NGL Viewer** - Visualisation de structures de protéines en 3D
- **Chart.js** - Graphiques de données

**Backend**

- **Firebase Authentication** - Authentification des utilisateurs
- **Firestore** - Base de données
- **Firebase Storage** - Stockage de fichiers
- **Firebase Hosting** - Hébergement web

### 🚀 Installation et Exécution

**Exigences**

- Node.js 18.0.0 ou supérieur
- npm ou yarn
- Projet Firebase

**Étapes d'Installation**

1. **Cloner le dépôt**

```bash
git clone [https://github.com/pistolinkr/BioLabs.git](https://github.com/pistolinkr/BioLabs.git)
cd BioLabs
```

1. **Installer les dépendances**

```bash
npm install
```

1. **Configuration Firebase**

```bash
npm install -g firebase-tools
firebase login
firebase init
```

1. **Configurer les variables d'environnement**

Créer un fichier `.env` et ajouter la configuration Firebase :

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

1. **Exécuter le serveur de développement**

```bash
npm start
```

1. **Construire et déployer**

```bash
npm run build
firebase deploy
```

### 🌐 Site Déployé

[**https://biolabs.world**](https://biolabs.world)

---

## 🇩🇪 Deutsch

### 🧬 [https://www.BioLabs.world](https://www.BioLabs.world) - Integrierte Analyseplattform für Forschungsdaten

### 📋 Projektübersicht

BioLabs ist eine integrierte Analyseplattform für die Forschung. Sie bietet verschiedene Forschungstools wie Proteinsimulation, KI-Diagnose, Interaktionsnetzwerke, Medikamenten-Screening und epidemiologische Modellierung.

### ✨ Hauptfunktionen

**🔬 Forschungsmodule**

- **Proteinsimulation**: PDB/CIF-Dateien von PDB-101 importieren zur Visualisierung von 3D-Proteinstrukturen
- **KI-Diagnose**: KI-basierte Prionenkrankheitsdiagnose
- **Interaktionsnetzwerke**: Analyse von Proteininteraktionsnetzwerken
- **Medikamenten-Screening**: Medikamenten-Screening und -entwicklung
- **Epidemiologische Modelle**: Epidemiologische Modellierung und Vorhersage

**🔐 Benutzersystem**

- **OAuth-Anmeldung**: Unterstützung für Google, GitHub und Apple
- **Persönliches Labor**: Angepasste Forschungsumgebung für jeden Benutzer
- **Datenspeicherung**: Sichere Datenverwaltung basierend auf Firestore
- **Einstellungsverwaltung**: Theme-, Sprach- und Benachrichtigungseinstellungen

### 🛠️ Technologie-Stack

**Frontend**

- **React 18** - Benutzeroberfläche
- **TypeScript** - Typsicherheit
- **Material-UI (MUI)** - Komponentenbibliothek
- **NGL Viewer** - 3D-Proteinstruktur-Visualisierung
- **Chart.js** - Datendiagramme

**Backend**

- **Firebase Authentication** - Benutzerauthentifizierung
- **Firestore** - Datenbank
- **Firebase Storage** - Dateispeicherung
- **Firebase Hosting** - Web-Hosting

### 🚀 Installation und Ausführung

**Anforderungen**

- Node.js 18.0.0 oder höher
- npm oder yarn
- Firebase-Projekt

**Installationsschritte**

1. **Repository klonen**

```bash
git clone [https://github.com/pistolinkr/BioLabs.git](https://github.com/pistolinkr/BioLabs.git)
cd BioLabs
```

1. **Abhängigkeiten installieren**

```bash
npm install
```

1. **Firebase-Setup**

```bash
npm install -g firebase-tools
firebase login
firebase init
```

1. **Umgebungsvariablen konfigurieren**

Eine `.env`-Datei erstellen und Firebase-Konfiguration hinzufügen:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

1. **Entwicklungsserver ausführen**

```bash
npm start
```

1. **Bauen und bereitstellen**

```bash
npm run build
firebase deploy
```

### 🌐 Bereitgestellte Website

[**https://biolabs.world**](https://biolabs.world)

---

## 📞 Contact / 連絡先 / 联系方式 / Контакт / Contacto / Contact / Kontakt

- **GitHub**: [@pistolinkr](https://github.com/pistolinkr)
- **Email**: [pistolinkr@icloud.com](mailto:pistolinkr@icloud.com)
- **Project Link**: [https://github.com/pistolinkr/BioLabs](https://github.com/pistolinkr/BioLabs)

⭐ このプロジェクトが役に立った場合は、ぜひスターをお願いします！

⭐ 如果这个项目对您有帮助，请给它一个星星！

⭐ Если этот проект был полезен, пожалуйста, поставьте звезду!

⭐ ¡Si este proyecto fue útil, por favor dale una estrella!

⭐ Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile !

⭐ Wenn dieses Projekt hilfreich war, geben Sie ihm bitte einen Stern!
