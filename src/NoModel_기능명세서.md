# NoModel 기능 명세서 (Functional Specification)

## 📋 프로젝트 개요

### 1.1 프로젝트 정보
- **프로젝트명**: NoModel - AI 기반 제품 광고 이미지 생성 플랫폼
- **버전**: v1.0
- **작성일**: 2025년 1월
- **목적**: 모델 고용 비용을 90% 절감하고 제작 시간을 몇 분으로 단축하는 AI 기반 제품 이미지 생성 서비스

### 1.2 핵심 가치 제안
- **비용 절감**: 기존 모델 고용 비용 대비 90% 절감
- **시간 단축**: 며칠 걸리던 작업을 10-15분으로 단축
- **완전한 워크플로우**: 제품 이미지 업로드부터 AI 모델/배경 생성까지 원스톱 서비스
- **마켓플레이스**: 사용자 생성 모델 공유 및 수익화 시스템

## 🎯 핵심 기능

### 2.1 사용자 인증 및 관리
#### 2.1.1 회원가입/로그인
- **기능**: 이메일 기반 회원가입 및 로그인
- **구현 상태**: ✅ 완료 (프론트엔드)
- **컴포넌트**: `LoginPage.tsx`, `SignupPage.tsx`
- **주요 기능**:
  - 이메일/패스워드 인증
  - 사용자 프로필 생성
  - 자동 로그인 유지

#### 2.1.2 사용자 프로필 관리
- **기능**: 개인정보 수정 및 계정 관리
- **구현 상태**: ✅ 완료 (프론트엔드)
- **컴포넌트**: `ProfileSettings.tsx`
- **주요 기능**:
  - 프로필 정보 수정 (이름, 이메일, 프로필 이미지, 소개, 회사, 위치, 웹사이트)
  - 계정 설정
  - 포인트 거래 내역 조회

### 2.2 온보딩 시스템
#### 2.2.1 5분 온보딩 플로우
- **기능**: 신규 사용자 대상 서비스 소개 및 설정
- **구현 상태**: ✅ 완료 (프론트엔드)
- **컴포넌트**: `OnboardingFlow.tsx`
- **주요 기능**:
  - 서비스 소개
  - 사용 목적 설정
  - 관심 카테고리 선택
  - 초기 설정 완료

### 2.3 AI 모델 시스템
#### 2.3.1 모델 선택
- **기능**: 사전 생성된 AI 모델 또는 커스텀 모델 선택
- **구현 상태**: ✅ 완료 (프론트엔드)
- **컴포넌트**: `ModelSelectionPage.tsx`
- **주요 기능**:
  - 카테고리별 모델 필터링
  - 모델 미리보기
  - 모델 상세 정보 조회 (연령, 성별, 스타일, 인종 등)
  - 유료 모델 구매 (포인트 결제)
  - 커스텀 모델 생성 연결

#### 2.3.2 커스텀 모델 생성
- **기능**: 사용자 정의 AI 모델 생성
- **구현 상태**: ✅ 완료 (프론트엔드)
- **컴포넌트**: `ModelCreation.tsx`, `CustomModelCreator.tsx`
- **주요 기능**:
  - 프롬프트 기반 모델 생성
  - 모델 메타데이터 설정 (연령, 성별, 스타일, 인종, 포즈, 조명, 배경)
  - 모델 미리보기 생성
  - 모델 공개/비공개 설정
  - 판매 가격 설정

#### 2.3.3 내 모델 관리
- **기능**: 사용자가 생성한 모델 관리
- **구현 상태**: ✅ 완료 (프론트엔드)
- **컴포넌트**: `MyModels.tsx`
- **주요 기능**:
  - 생성한 모델 목록 조회
  - 모델 수정/삭제
  - 모델 판매 통계 조회
  - 수익 관리

### 2.4 이미지 생성 워크플로우
#### 2.4.1 5단계 이미지 생성 프로세스
- **기능**: 제품 이미지부터 최종 결과물까지 5단계 워크플로우
- **구현 상태**: ✅ 완료 (프론트엔드)
- **컴포넌트**: `ImageGenerationWorkflow.tsx`
- **세부 단계**:

##### Step 1: 제품 업로드 (`ProductUpload.tsx`)
- 제품 이미지 업로드
- 제품 카테고리 선택
- 제품 설명 입력

##### Step 2: 스타일 선택 (`StyleSelection.tsx`)
- 배경 스타일 선택
- 조명 설정
- 촬영 각도/포즈 선택

##### Step 3: AI 생성 (`AIGeneration.tsx`)
- AI 모델 기반 이미지 생성
- 프롬프트 최적화
- 생성 프로세스 모니터링

##### Step 4: 편집 도구 (`EditingTools.tsx`)
- 생성된 이미지 편집
- 필터 및 보정 도구
- 추가 효과 적용

##### Step 5: 결과 다운로드 (`ResultDownload.tsx`)
- 최종 결과물 미리보기
- 다양한 형식으로 다운로드
- 소셜 미디어 공유

### 2.5 프로젝트 관리
#### 2.5.1 마이페이지 대시보드
- **기능**: 사용자 대시보드 및 프로젝트 관리
- **구현 상태**: ✅ 완료 (프론트엔드)
- **컴포넌트**: `MyPage.tsx`
- **주요 기능**:
  - 사용자 통계 대시보드
  - 생성한 프로젝트 목록
  - 최근 활동 내역
  - 포인트 현황
  - 퀵 액션 메뉴

#### 2.5.2 프로젝트 상세 관리
- **기능**: 개별 프로젝트 상세 조회 및 관리
- **구현 상태**: ✅ 완료 (프론트엔드)
- **컴포넌트**: `ProjectDetail.tsx`
- **주요 기능**:
  - 프로젝트 상세 정보 조회
  - 생성된 이미지 갤러리
  - 프로젝트 편집/재생성
  - 다운로드 및 공유
  - 프로젝트 평가

### 2.6 평가 및 피드백 시스템
#### 2.6.1 프로젝트 평가
- **기능**: 생성된 프로젝트에 대한 평가 시스템
- **구현 상태**: ✅ 완료 (프론트엔드)
- **컴포넌트**: `ProjectRatingForm.tsx`, `StarRating.tsx`
- **주요 기능**:
  - 5점 척도 전체 평가
  - 카테고리별 세부 평가 (품질, 정확도, 창의성, 유용성)
  - 텍스트 피드백
  - 장단점 평가
  - 추천 여부

### 2.7 마켓플레이스 시스템
#### 2.7.1 모델 마켓플레이스
- **기능**: 사용자 생성 모델 거래 플랫폼
- **구현 상태**: ✅ 완료 (프론트엔드)
- **컴포넌트**: `ModelMarketplace.tsx`
- **주요 기능**:
  - 모델 검색 및 필터링
  - 모델 상세 정보 조회
  - 모델 구매 (포인트 결제)
  - 인기 모델 랭킹
  - 제작자 프로필 조회

#### 2.7.2 포인트 시스템
- **기능**: 플랫폼 내 가상 화폐 시스템
- **구현 상태**: ✅ 완료 (프론트엔드)
- **주요 기능**:
  - 포인트 충전/사용
  - 모델 판매 수익 (70% 수수료율)
  - 모델 생성 보너스 (100 포인트)
  - 거래 내역 관리
  - 수익 통계

## 🏗️ 시스템 아키텍처

### 3.1 프론트엔드 구조
#### 3.1.1 기술 스택
- **프레임워크**: React with TypeScript
- **UI 라이브러리**: shadcn/ui
- **스타일링**: Tailwind CSS v4
- **디자인 시스템**: Linear Design System
- **아이콘**: Lucide React

#### 3.1.2 컴포넌트 구조
```
src/
├── App.tsx                    # 메인 애플리케이션
├── components/
│   ├── LandingPage.tsx       # 랜딩 페이지
│   ├── LoginPage.tsx         # 로그인
│   ├── SignupPage.tsx        # 회원가입
│   ├── OnboardingFlow.tsx    # 온보딩
│   ├── ModelSelectionPage.tsx # 모델 선택
│   ├── ImageGenerationWorkflow.tsx # 이미지 생성
│   ├── MyPage.tsx            # 마이페이지
│   ├── ProjectDetail.tsx     # 프로젝트 상세
│   ├── ProfileSettings.tsx   # 프로필 설정
│   ├── ModelCreation.tsx     # 모델 생성
│   ├── ModelMarketplace.tsx  # 마켓플레이스
│   ├── MyModels.tsx          # 내 모델 관리
│   ├── workflow/             # 워크플로우 컴포넌트
│   └── ui/                   # UI 컴포넌트 라이브러리
└── styles/
    └── globals.css           # 전역 스타일
```

### 3.2 데이터 모델
#### 3.2.1 핵심 인터페이스

##### UserProfile
```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  company?: string;
  location?: string;
  website?: string;
  joinedAt: Date;
  planType: 'free' | 'pro' | 'enterprise';
  generatedCount: number;
  downloadCount: number;
  points: number;
  totalEarned: number;
  totalSpent: number;
  modelsCreated: number;
  modelsEarnings: number;
}
```

##### UserModel
```typescript
interface UserModel {
  id: string;
  name: string;
  description: string;
  prompt: string;
  seedValue: string;
  imageUrl: string;
  previewImages: string[];
  category: string;
  metadata: ModelMetadata;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  price: number;
  usageCount: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  isPublic: boolean;
  isForSale: boolean;
  createdAt: Date;
  updatedAt: Date;
  earnings: number;
}
```

##### GeneratedProject
```typescript
interface GeneratedProject {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  model: SelectedModel;
  originalPrompt: string;
  finalPrompt: string;
  generatedImages: string[];
  productImages: string[];
  createdAt: Date;
  status: 'completed' | 'processing' | 'failed';
  settings: ProjectSettings;
  downloadCount: number;
  isPublic: boolean;
  rating?: ProjectRating;
  pointsUsed?: number;
}
```

#### 3.2.2 상태 관리
- **메인 상태**: App.tsx에서 중앙 집중식 상태 관리
- **사용자 세션**: 로그인 상태 및 사용자 프로필
- **프로젝트 관리**: 생성된 프로젝트 목록 및 선택된 프로젝트
- **모델 관리**: 사용자 생성 모델 및 선택된 모델
- **포인트 시스템**: 포인트 잔액 및 거래 내역

### 3.3 디자인 시스템
#### 3.3.1 Linear Design System
- **브랜드 컬러**: #7170ff (Primary), #8989f0 (Secondary)
- **폰트**: Inter (300, 400, 500, 600, 700)
- **레이아웃**: 최대 너비 1024px, 그리드 갭 32px
- **컴포넌트**: 일관된 UI 컴포넌트 라이브러리

#### 3.3.2 반응형 디자인
- **데스크톱 우선**: 1024px 최대 너비
- **모바일 대응**: 반응형 레이아웃
- **터치 친화적**: 모바일 인터페이스 최적화

## 🚀 사용자 여정

### 4.1 신규 사용자 온보딩
1. **랜딩 페이지** → 서비스 소개 및 가입 유도
2. **회원가입** → 계정 생성
3. **온보딩 플로우** → 5분 초기 설정
4. **첫 프로젝트 생성** → 모델 선택 및 이미지 생성

### 4.2 일반 사용자 워크플로우
1. **로그인** → 마이페이지 접근
2. **프로젝트 생성** → 카테고리 선택
3. **모델 선택** → AI 모델 또는 커스텀 모델
4. **이미지 생성** → 5단계 워크플로우
5. **결과 관리** → 다운로드, 공유, 평가

### 4.3 고급 사용자 (모델 제작자)
1. **모델 생성** → 커스텀 AI 모델 제작
2. **마켓플레이스 등록** → 모델 판매 설정
3. **수익 관리** → 포인트 수익 조회
4. **모델 최적화** → 평가 기반 모델 개선

## 📊 성능 및 품질 지표

### 5.1 사용자 경험
- **온보딩 완료율**: 목표 85% 이상
- **첫 프로젝트 생성 시간**: 15분 이내
- **사용자 만족도**: 4.0/5.0 이상
- **재방문율**: 70% 이상

### 5.2 시스템 성능
- **페이지 로딩 시간**: 3초 이내
- **이미지 생성 시간**: 2-5분
- **시스템 가용성**: 99.9% 이상
- **동시 사용자 지원**: 1,000명 이상

### 5.3 비즈니스 지표
- **모델 고용 비용 절감**: 90% 이상
- **작업 시간 단축**: 일 → 분 단위
- **사용자 증가율**: 월 20% 이상
- **수익 증가율**: 분기 30% 이상

## 🔮 향후 개발 계획

### 6.1 백엔드 시스템 구축
- **API 서버**: RESTful API 또는 GraphQL
- **데이터베이스**: PostgreSQL 또는 MongoDB
- **파일 저장소**: AWS S3 또는 Google Cloud Storage
- **인증 시스템**: JWT 기반 인증

### 6.2 AI 기능 연동
- **AI 모델 서버**: TensorFlow Serving 또는 PyTorch Serve
- **이미지 생성 API**: Stable Diffusion 기반
- **모델 훈련 파이프라인**: MLOps 구축
- **품질 관리 시스템**: 자동화된 품질 검증

### 6.3 고급 기능
- **배치 처리**: 대량 이미지 생성
- **API 연동**: 외부 서비스 연결
- **모바일 앱**: React Native 기반
- **협업 기능**: 팀 워크스페이스

## ✅ 현재 구현 상태

### 완료된 기능 (프론트엔드)
- ✅ 사용자 인증 시스템 (UI)
- ✅ 온보딩 플로우
- ✅ 모델 선택 및 생성 시스템
- ✅ 이미지 생성 워크플로우 (UI)
- ✅ 프로젝트 관리 시스템
- ✅ 평가 및 피드백 시스템
- ✅ 마켓플레이스 시스템
- ✅ 포인트 시스템 (프론트엔드 로직)
- ✅ 프로필 관리 시스템
- ✅ 반응형 디자인

### 미구현 기능
- ❌ 백엔드 API 서버
- ❌ 데이터베이스 연동
- ❌ 실제 AI 모델 연동
- ❌ 파일 업로드/저장 시스템
- ❌ 결제 시스템
- ❌ 이메일 인증
- ❌ 소셜 로그인
- ❌ 실시간 알림

---

*이 문서는 NoModel 플랫폼의 현재 구현 상태를 바탕으로 작성되었으며, 향후 백엔드 개발 및 AI 기능 연동 시 업데이트될 예정입니다.*