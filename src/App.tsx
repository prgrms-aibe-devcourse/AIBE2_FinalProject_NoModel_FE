import * as React from 'react';
const { useState, useEffect } = React;
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { authService } from './services/auth';
import { OnboardingFlow } from './components/OnboardingFlow';
import { ModelSelectionPage } from './components/ModelSelectionPage';
import { ImageGenerationWorkflow } from './components/ImageGenerationWorkflow';
import { MyPage } from './components/MyPage';
import { ProjectDetail } from './components/ProjectDetail';
import { ProfileSettings } from './components/ProfileSettings';
import { ModelCreation } from './components/ModelCreation';
import { ModelMarketplace } from './components/ModelMarketplace';
import { MyModels } from './components/MyModels';
import { ModelReport } from './components/ModelReport';
import { AdminPage } from './components/AdminPage';
import { ComponentDemo } from './components/ComponentDemo';
import LoginTest from './components/LoginTest';
import PointsSubscriptionPage from './components/PointsSubscriptionPage';
import { MyReviews } from './components/MyReviews';
import { ProductImageUpload } from './components/ProductImageUpload';
import { AdGenerationResult } from './components/AdGenerationResult';

const OAUTH_CALLBACK_PATH =
    (import.meta as any).env?.VITE_OAUTH_CALLBACK || "/oauth2/callback";


export type AppStage = 'landing' | 'login' | 'signup' | 'onboarding' | 'modelSelection' | 'generation' | 'mypage' | 'projectDetail' | 'profile' | 'modelCreation' | 'modelMarketplace' | 'myModels' | 'modelReport' | 'admin' | 'componentDemo' | 'loginTest' | 'pointsSubscription' | 'myReviews' | 'productUpload' | 'adGenerationResult';

export interface UserModel {
  id: string;
  name: string;
  description: string;
  prompt: string;
  seedValue: string;
  fileId?: number; // 모델 파일 ID 추가
  imageUrl: string;
  previewImages: string[];
  category: string;
  metadata: {
    age: string;
    gender: string;
    style: string;
    ethnicity: string;
  };
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  price: number; // 포인트
  usageCount: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  isPublic: boolean;
  isForSale: boolean;
  createdAt: Date;
  updatedAt: Date;
  earnings: number; // 총 수익
}

export interface SelectedModel {
  id: string;
  name: string;
  prompt: string;
  seedValue: string;
  imageUrl: string;
  category: string;
  isCustom: boolean;
  metadata: {
    age: string;
    gender: string;
    style: string;
    ethnicity: string;
  };
  creator?: {
    id: string;
    name: string;
    avatar?: string;
  };
  price?: number;
}

export interface CustomModelSettings {
  prompt: string;
  age: string;
  gender: string;
  ethnicity: string;
  style: string;
  pose: string;
  lighting: string;
  background: string;
}

export interface ProjectRating {
  overallRating: number; // 1-5
  categoryRatings: {
    quality: number; // 이미지 품질
    accuracy: number; // 프롬프트 정확도
    creativity: number; // 창의성
    usefulness: number; // 유용성
  };
  feedback: string;
  pros: string[];
  cons: string[];
  ratedAt: Date;
  wouldRecommend: boolean;
}

export interface GeneratedProject {
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
  settings: {
    background: string;
    style: string;
    lighting: string;
    pose?: string;
  };
  downloadCount: number;
  isPublic: boolean;
  rating?: ProjectRating;
  pointsUsed?: number; // 사용된 포인트
}

export interface PointTransaction {
  id: string;
  userId: number;
  type: 'earned' | 'spent' | 'bonus' | 'refund';
  amount: number;
  description: string;
  relatedModelId?: string;
  relatedProjectId?: string;
  createdAt: Date;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  joinedAt: Date;
  planType: 'free' | 'pro' | 'enterprise';
  points: number;
  role: 'USER' | 'ADMIN';
  modelCount: number;
  projectCount: number;
  isFirstLogin?: boolean; // 응답 바디에서 가져온 최초 로그인 여부
}

export interface ModelReport {
  id: string;
  modelId: string;
  modelName: string;
  modelImageUrl: string;
  reporterId: string;
  reporterName: string;
  reportType: 'inappropriate_content' | 'copyright' | 'spam' | 'fake' | 'other';
  description: string;
  attachments?: string[]; // 증거 이미지 URL들
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: number;
  reviewNotes?: string;
  resolution?: 'model_removed' | 'warning_issued' | 'no_action' | 'user_banned';
}

export default function App() {
  const [currentStage, setCurrentStage] = useState<AppStage>('landing');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<SelectedModel | null>(null);
  const [selectedProject, setSelectedProject] = useState<GeneratedProject | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<GeneratedProject[]>([]);
  const [userModels, setUserModels] = useState<UserModel[]>([]);
  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>([]);
  const [modelReports, setModelReports] = useState<ModelReport[]>([
    {
      id: 'report-1',
      modelId: 'model-123',
      modelName: '아시아 여성 패션 모델 - 민지',
      modelImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b1ff?w=400&h=400&fit=crop&crop=face',
      reporterId: 'user-456',
      reporterName: '이승호',
      reportType: 'inappropriate_content',
      description: '이 모델이 실제 연예인과 매우 유사하게 생겼습니다. 초상권 침해 우려가 있으며, 특정 연예인의 얼굴을 무단으로 사용한 것 같습니다. 또한 해당 모델로 생성된 이미지들이 부적절한 용도로 사용될 가능성이 높아 보입니다.',
      attachments: [
        'https://images.unsplash.com/photo-1494790108755-2616b612b1ff?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop'
      ],
      status: 'pending',
      createdAt: new Date('2024-01-28T14:30:00'),
    },
    {
      id: 'report-2',
      modelId: 'model-456',
      modelName: '서양 남성 비즈니스 모델 - 제임스',
      modelImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      reporterId: 'user-789',
      reporterName: '박미영',
      reportType: 'copyright',
      description: '이 모델은 유명한 stock photo 모델의 이미지를 그대로 사용한 것 같습니다. 저작권이 있는 이미지를 허가 없이 AI 모델 학습에 사용한 것으로 판단됩니다.',
      attachments: [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop'
      ],
      status: 'reviewed',
      createdAt: new Date('2024-01-27T09:15:00'),
      reviewedAt: new Date('2024-01-27T16:20:00'),
      reviewedBy: 1,
      reviewNotes: '해당 이미지의 저작권 확인이 필요합니다. 원본 이미지 소스를 조사 중입니다.',
    },
    {
      id: 'report-3',
      modelId: 'model-789',
      modelName: '일본 여성 뷰티 모델 - 사쿠라',
      modelImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
      reporterId: 'user-012',
      reporterName: '김태현',
      reportType: 'fake',
      description: '이 모델이 실제로 존재하지 않는 가짜 인물인 것 같습니다. 여러 다른 얼굴을 합성해서 만든 것 같은데, 이런 가짜 모델로 생성된 이미지가 실제 사람으로 오인될 수 있어 문제가 될 수 있습니다.',
      status: 'resolved',
      createdAt: new Date('2024-01-26T11:45:00'),
      reviewedAt: new Date('2024-01-26T15:30:00'),
      reviewedBy: 1,
      reviewNotes: '조사 결과 해당 모델은 적절한 AI 생성 과정을 통해 만들어진 것으로 확인됩니다. 실제 인물을 모방한 것이 아니므로 문제없습니다.',
      resolution: 'no_action'
    },
    {
      id: 'report-4',
      modelId: 'model-101',
      modelName: '중년 남성 요리사 모델 - 로버트',
      modelImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      reporterId: 'user-345',
      reporterName: '조민수',
      reportType: 'spam',
      description: '동일한 모델이 여러 개의 다른 이름으로 중복 등록되어 있습니다. 같은 사람의 얼굴인데 "요리사 로버트", "셰프 밥", "요리 전문가 로버트" 등으로 여러 번 올라와 있어서 스팸성 게시물로 판단됩니다.',
      status: 'resolved',
      createdAt: new Date('2024-01-25T13:20:00'),
      reviewedAt: new Date('2024-01-25T18:45:00'),
      reviewedBy: 2,
      reviewNotes: '중복된 모델들을 확인했습니다. 동일한 이미지로 생성된 3개의 중복 모델을 발견했으며, 원본 하나만 남기고 나머지는 삭제 조치했습니다.',
      resolution: 'model_removed'
    },
    {
      id: 'report-5',
      modelId: 'model-202',
      modelName: '십대 학생 모델 - 지은',
      modelImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      reporterId: 'user-567',
      reporterName: '정현우',
      reportType: 'inappropriate_content',
      description: '미성년자로 보이는 모델을 성인 콘텐츠 생성 목적으로 사용할 수 있도록 등록한 것 같습니다. 모델 설명에 "어린 학생", "십대" 등의 키워드가 포함되어 있어 부적절한 용도로 악용될 가능성이 높습니다.',
      status: 'dismissed',
      createdAt: new Date('2024-01-24T16:10:00'),
      reviewedAt: new Date('2024-01-24T20:30:00'),
      reviewedBy: 1,
      reviewNotes: '해당 모델은 성인 모델이며, "학생"은 대학생을 의미하는 컨셉으로 확인됩니다. 부적절한 콘텐츠 생성을 방지하는 필터가 적용되어 있어 문제없습니다.',
      resolution: 'no_action'
    },
    {
      id: 'report-6',
      modelId: 'model-303',
      modelName: '유럽 여성 모델 - 엠마',
      modelImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
      reporterId: 'user-890',
      reporterName: '황지현',
      reportType: 'other',
      description: '이 모델을 사용해서 생성한 이미지가 계속 이상하게 나옵니다. 얼굴이 왜곡되거나 부자연스럽게 나오는 경우가 많아서 모델 자체에 문제가 있는 것 같습니다. 품질이 너무 떨어져서 환불을 요청하고 싶습니다.',
      status: 'pending',
      createdAt: new Date('2024-01-29T10:25:00'),
    }
  ]);
  const [selectedModelToReport, setSelectedModelToReport] = useState<UserModel | null>(null);
  const [selectedModelForAdGeneration, setSelectedModelForAdGeneration] = useState<UserModel | null>(null);
  const [adGenerationData, setAdGenerationData] = useState<{
    originalImage: string;
    generatedImageUrl: string;
    additionalPrompt?: string;
  } | null>(null);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log('🔍 인증 상태 확인 시작');
      const isAuth = authService.isAuthenticated();
      console.log('🔍 isAuthenticated() 결과:', isAuth);
      
      if (isAuth) {
        try {
          console.log('🔍 서버에서 사용자 프로필 가져오기 시도');
          // 쿠키에 토큰이 있으면 서버에서 사용자 프로필 가져오기 시도
          const profileData = await authService.getUserProfile();
          console.log('🔍 getUserProfile 응답:', profileData);
          
          if (profileData.success) {
            setUserProfile(profileData.response);
            setIsLoggedIn(true);
            
            // JWT Claims의 isFirstLogin을 확인하여 페이지 이동 결정
            if (profileData.response.isFirstLogin === false) {
              // 최초 로그인이 아니면 바로 마이 페이지로 이동
              setCurrentStage('mypage');
              console.log('✅ 기존 사용자 인증 성공: 마이 페이지로 이동', profileData.response);
            } else {
              // 최초 로그인이면 온보딩으로 이동
              setCurrentStage('onboarding');
              console.log('✅ 최초 로그인 사용자 인증 성공: 온보딩으로 이동', profileData.response);
            }
          } else {
            // 서버에서 프로필 가져오기 실패 시 로그아웃
            console.log('❌ 인증 실패: 서버에서 프로필을 가져올 수 없음', profileData);
            await authService.logout();
            setIsLoggedIn(false);
            setUserProfile(null);
            setCurrentStage('landing');
          }
        } catch (error) {
          console.error('❌ Auth check failed:', error);
          await authService.logout();
          setIsLoggedIn(false);
          setUserProfile(null);
          setCurrentStage('landing');
        }
      } else {
        // 토큰이 없으면 랜딩 페이지로
        console.log('토큰이 없음: 랜딩 페이지로 이동');
        setCurrentStage('landing');
      }
    };

    checkAuthStatus();
  }, []);

  const handleStageChange = (stage: AppStage) => {
    console.log('=== handleStageChange 호출됨 ===');
    console.log('이전 스테이지:', currentStage);
    console.log('새 스테이지:', stage);
    setCurrentStage(stage);
    console.log('스테이지 변경 완료');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentStage('modelSelection');
  };

  const handleModelSelect = (model: SelectedModel) => {
    setSelectedModel(model);
    
    // 모델 사용 시 포인트 차감 및 제작자에게 포인트 지급
    if (model.creator && model.price && userProfile) {
      if (userProfile.points >= model.price) {
        // 포인트 차감
        setUserProfile(prev => prev ? { ...prev, points: prev.points - model.price! } : prev);
        
        // 거래 내역 추가
        const transaction: PointTransaction = {
          id: `transaction-${Date.now()}`,
          userId: userProfile.id,
          type: 'spent',
          amount: -model.price,
          description: `${model.name} 모델 사용`,
          relatedModelId: model.id,
          createdAt: new Date()
        };
        setPointTransactions(prev => [transaction, ...prev]);
        
        // 실제 앱에서는 여기서 모델 제작자에게 포인트 지급 API 호출
        console.log(`${model.creator.name}에게 ${model.price * 0.7} 포인트 지급`); // 70% 수수료율
      } else {
        alert('포인트가 부족합니다.');
        return;
      }
    }
    
    setCurrentStage('generation');
  };

  const handleProjectSelect = (project: GeneratedProject) => {
    setSelectedProject(project);
    setCurrentStage('projectDetail');
  };

  const handleLoginSuccess = async () => {
    try {
      // Get user profile after successful login
      const profileData = await authService.getUserProfile();
      if (profileData.success) {
        setUserProfile(profileData.response);
        setIsLoggedIn(true);
        
        // JWT Claims의 isFirstLogin을 확인하여 페이지 이동 결정
        if (profileData.response.isFirstLogin === false) {
          // 최초 로그인이 아니면 바로 마이 페이지로 이동
          setCurrentStage('mypage');
          console.log('🔄 기존 사용자 로그인: 마이 페이지로 이동');
        } else {
          // 최초 로그인이거나 정보가 없으면 온보딩으로 이동
          setCurrentStage('onboarding');
          console.log('🆕 최초 로그인: 온보딩으로 이동');
        }
      } else {
        console.error('Failed to get user profile:', profileData.error);
        // Still proceed with basic login
        const storedUserInfo = authService.getStoredUserInfo();
        if (storedUserInfo) {
          setUserProfile(storedUserInfo);
          setIsLoggedIn(true);
          // 저장된 정보에서 isFirstLogin 확인
          if (storedUserInfo.isFirstLogin === false) {
            setCurrentStage('mypage');
          } else {
            setCurrentStage('onboarding');
          }
        }
      }
    } catch (error) {
      console.error('Login success handler error:', error);
      // API 요청 실패 시 로그인 페이지로 이동
      setCurrentStage('login');
    }
  };

  useEffect(() => {
    // 백엔드 성공 핸들러가 http://localhost:5173/oauth2/callback#access=...&refresh=... 로 보낸다고 가정
    if (window.location.pathname === OAUTH_CALLBACK_PATH) {

      // 주소 정리: 해시/콜백 경로 제거
      window.history.replaceState({}, "", "/");

      // 로그인 후 처리(프로필 로딩/스테이지 이동)
      void (async () => {
        try {
          await handleLoginSuccess();
        } catch {
          // 실패 시 최소한 마이페이지/온보딩 중 하나로 진입
          setCurrentStage("onboarding");
        }
      })();
    }
    // 이 이펙트는 최초 마운트에서 1번만 수행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSignupSuccess = (isAutoLogin: boolean = false) => {
    if (isAutoLogin) {
      // 소셜 로그인의 경우 자동 로그인 처리
      setIsLoggedIn(true);
      setCurrentStage('mypage');
    } else {
      // 일반 회원가입의 경우 로그인 페이지로 이동
      setCurrentStage('login');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    setUserProfile(null);
    setCurrentStage('landing');
  };

  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, ...updatedProfile });
    }
  };

  const handleGenerationComplete = (newProject: GeneratedProject) => {
    // In real app, save project to database
    setProjects(prev => [newProject, ...prev]);
    setCurrentStage('mypage');
  };

  const handleProjectRating = (projectId: string, rating: ProjectRating) => {
    // Update project rating
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, rating }
          : project
      )
    );

    // Update selected project if it's currently viewed
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({ ...selectedProject, rating });
    }
  };

  const handleProjectUpdate = (updatedProject: GeneratedProject) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === updatedProject.id 
          ? updatedProject
          : project
      )
    );

    if (selectedProject && selectedProject.id === updatedProject.id) {
      setSelectedProject(updatedProject);
    }
  };

  const handleModelCreation = (newModel: UserModel) => {
    setUserModels(prev => [newModel, ...prev]);
    
    // 모델 생성 보너스 포인트 지급 (백엔드에서 처리)
    const bonusPoints = 100;
    if (userProfile) {
      setUserProfile(prev => prev ? { 
        ...prev, 
        points: prev.points + bonusPoints
      } : prev);
      
      // 거래 내역 추가
      const transaction: PointTransaction = {
        id: `transaction-${Date.now()}`,
        userId: userProfile.id,
        type: 'bonus',
        amount: bonusPoints,
        description: `모델 생성 보너스: ${newModel.name}`,
        relatedModelId: newModel.id,
        createdAt: new Date()
      };
      setPointTransactions(prev => [transaction, ...prev]);
    }
    
    setCurrentStage('myModels');
  };

  const handleModelUpdate = (updatedModel: UserModel) => {
    setUserModels(prev => 
      prev.map(model => 
        model.id === updatedModel.id 
          ? updatedModel
          : model
      )
    );
  };

  const handleModelPurchase = (model: SelectedModel) => {
    // 모델 구매 로직은 handleModelSelect에서 처리됨
    handleModelSelect(model);
  };

  const handleModelReportRequest = (model: UserModel) => {
    console.log('=== handleModelReportRequest 시작 ===');
    console.log('신고할 모델:', model.name);
    console.log('모델 ID:', model.id);
    console.log('현재 스테이지:', currentStage);
    
    setSelectedModelToReport(model);
    console.log('selectedModelToReport 설정 완료');
    
    setCurrentStage('modelReport');
    console.log('스테이지를 modelReport로 변경 완료');
    console.log('=== handleModelReportRequest 완료 ===');
  };

  const handleModelReportSubmit = (report: Omit<ModelReport, 'id' | 'createdAt'>) => {
    const newReport: ModelReport = {
      ...report,
      id: `report-${Date.now()}`,
      createdAt: new Date()
    };
    
    setModelReports(prev => [newReport, ...prev]);
    setCurrentStage('modelMarketplace');
  };

  const handleGoToProductUpload = (model: UserModel) => {
    setSelectedModelForAdGeneration(model);
    setCurrentStage('productUpload');
  };

  const handleAdGenerationComplete = (originalImage: string, generatedImageUrl: string, additionalPrompt?: string) => {
    setAdGenerationData({
      originalImage,
      generatedImageUrl,
      additionalPrompt
    });
    setCurrentStage('adGenerationResult');
  };

  const handleReportStatusUpdate = (reportId: string, status: ModelReport['status'], reviewNotes?: string, resolution?: ModelReport['resolution']) => {
    setModelReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { 
              ...report, 
              status, 
              reviewedAt: new Date(),
              reviewedBy: userProfile?.id,
              reviewNotes,
              resolution
            }
          : report
      )
    );
  };
  
      const handlePointBalanceUpdate = React.useCallback((newBalance: number) => {
        setUserProfile(prevProfile => {
          if (prevProfile) {
            return { ...prevProfile, points: newBalance };
          }
          return prevProfile;
        });
      }, []);

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: 'var(--color-background-primary)',
        fontFamily: 'var(--font-family-regular)'
      }}
    >
      {currentStage === 'landing' && (
        <LandingPage 
          onGetStarted={() => {
            // 무료로 시작하기: 로그인 상태에 따라 다르게 동작
            if (isLoggedIn) {
              handleStageChange('mypage');  // 로그인되어 있으면 마이페이지로
            } else {
              handleStageChange('login');   // 로그인 안되어 있으면 로그인 페이지로
            }
          }}
          onSignup={() => handleStageChange('signup')}  // 회원가입 버튼
          onLogin={() => handleStageChange('login')}
          onLogout={handleLogout}
          onAdGeneration={() => handleStageChange('onboarding')}
          onModelCreation={() => handleStageChange('modelCreation')}
          onMarketplace={() => handleStageChange('modelMarketplace')}
          onMyPage={() => handleStageChange('mypage')}
          onAdmin={() => handleStageChange('admin')}
          isLoggedIn={isLoggedIn}
          isAdmin={userProfile?.role === 'ADMIN'}
          onPointsSubscription={() => handleStageChange('pointsSubscription')}
        />
      )}

      {currentStage === 'login' && (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess}
          onSignup={() => handleStageChange('signup')}
          onBack={() => handleStageChange('landing')}
        />
      )}

      {currentStage === 'signup' && (
        <SignupPage 
          onSignupSuccess={handleSignupSuccess}
          onLogin={() => handleStageChange('login')}
          onBack={() => handleStageChange('landing')}
        />
      )}
      
      {currentStage === 'onboarding' && (
        <OnboardingFlow 
          onComplete={handleCategorySelect}
          onBack={() => handleStageChange('mypage')}
        />
      )}

      {currentStage === 'modelSelection' && (
        <ModelSelectionPage 
          selectedCategory={selectedCategory}
          onModelSelect={handleModelSelect}
          onBack={() => handleStageChange('onboarding')}
          userProfile={userProfile}
          onCreateModel={() => handleStageChange('modelCreation')}
          onBrowseMarketplace={() => handleStageChange('modelMarketplace')}
          onLogin={() => handleStageChange('login')}
          onLogout={handleLogout}
          onAdGeneration={() => handleStageChange('onboarding')}
          onMarketplace={() => handleStageChange('modelMarketplace')}
          onMyPage={() => handleStageChange('mypage')}
          onAdmin={() => handleStageChange('admin')}
          onPointsSubscription={() => handleStageChange('pointsSubscription')}
        />
      )}
      
      {currentStage === 'generation' && (
        <ImageGenerationWorkflow 
          selectedCategory={selectedCategory}
          selectedModel={selectedModel}
          onBack={() => handleStageChange('modelSelection')}
          onComplete={handleGenerationComplete}
        />
      )}

      {currentStage === 'mypage' && (
        <MyPage 
          userProfile={userProfile}
          projects={projects}
          onProjectSelect={handleProjectSelect}
          onNewProject={() => handleStageChange('onboarding')}
          onMyModels={() => handleStageChange('myModels')}
          onCreateModel={() => handleStageChange('modelCreation')}
          onMarketplace={() => handleStageChange('modelMarketplace')}
          onLogout={handleLogout}
          onAdmin={() => handleStageChange('admin')}
          onLogin={() => handleStageChange('login')}
          onPointsSubscription={() => handleStageChange('pointsSubscription')}
          onMyReviews={() => handleStageChange('myReviews')}
        />
      )}

      {currentStage === 'projectDetail' && selectedProject && (
        <ProjectDetail 
          project={selectedProject}
          onBack={() => handleStageChange('mypage')}
          onEditProject={() => handleStageChange('generation')}
          onRatingSubmit={(rating) => handleProjectRating(selectedProject.id, rating)}
          onProjectUpdate={handleProjectUpdate}
        />
      )}

      {currentStage === 'profile' && (
        <ProfileSettings 
          userProfile={userProfile}
          pointTransactions={pointTransactions}
          onBack={() => handleStageChange('mypage')}
          onProfileUpdate={handleProfileUpdate}
        />
      )}

      {currentStage === 'modelCreation' && (
        <ModelCreation 
          userProfile={userProfile}
          onBack={() => handleStageChange('modelSelection')}
          onModelCreated={handleModelCreation}
          onLogin={() => handleStageChange('login')}
          onLogout={handleLogout}
          onAdGeneration={() => handleStageChange('onboarding')}
          onModelCreation={() => handleStageChange('modelCreation')}
          onMarketplace={() => handleStageChange('modelMarketplace')}
          onMyPage={() => handleStageChange('mypage')}
          onHome={() => handleStageChange('landing')}
          onAdmin={() => handleStageChange('admin')}
          onGoToProductUpload={handleGoToProductUpload}
        />
      )}

      {currentStage === 'modelMarketplace' && (
        <ModelMarketplace 
          userProfile={userProfile}
          onBack={() => handleStageChange('modelSelection')}
          onModelPurchase={handleModelPurchase}
          onCreateModel={() => handleStageChange('modelCreation')}
          onModelReport={handleModelReportRequest}
          onLogin={() => handleStageChange('login')}
          onLogout={handleLogout}
          onAdGeneration={() => handleStageChange('onboarding')}
          onMyPage={() => handleStageChange('mypage')}
          onAdmin={() => handleStageChange('admin')}
          onPointsSubscription={() => handleStageChange('pointsSubscription')}
        />
      )}

      {currentStage === 'myModels' && (
        <MyModels 
          userProfile={userProfile}
          userModels={userModels}
          pointTransactions={pointTransactions}
          onBack={() => handleStageChange('mypage')}
          onCreateModel={() => handleStageChange('modelCreation')}
          onModelUpdate={handleModelUpdate}
          onLogin={() => handleStageChange('login')}
          onLogout={handleLogout}
          onAdGeneration={() => handleStageChange('onboarding')}
          onMarketplace={() => handleStageChange('modelMarketplace')}
          onMyPage={() => handleStageChange('mypage')}
          onAdmin={() => handleStageChange('admin')}
          onPointsSubscription={() => handleStageChange('pointsSubscription')}
        />
      )}

      {currentStage === 'modelReport' && selectedModelToReport && (
        <ModelReport 
          model={selectedModelToReport}
          userProfile={userProfile}
          onBack={() => handleStageChange('modelMarketplace')}
          onReportSubmit={handleModelReportSubmit}
        />
      )}

      {currentStage === 'admin' && (
        <AdminPage 
          userProfile={userProfile}
          modelReports={modelReports}
          onBack={() => handleStageChange('mypage')}
          onReportStatusUpdate={handleReportStatusUpdate}
          onLogin={() => handleStageChange('login')}
          onLogout={handleLogout}
          onAdGeneration={() => handleStageChange('onboarding')}
          onModelCreation={() => handleStageChange('modelCreation')}
          onMarketplace={() => handleStageChange('modelMarketplace')}
          onMyPage={() => handleStageChange('mypage')}
          onAdmin={() => handleStageChange('admin')}
          onPointsSubscription={() => handleStageChange('pointsSubscription')}
        />
      )}

      {currentStage === 'componentDemo' && (
        <ComponentDemo />
      )}
      {currentStage === 'loginTest' && (
        <LoginTest />
      )}

      {currentStage === 'pointsSubscription' && (
        <PointsSubscriptionPage 
          userProfile={userProfile}
          onLogin={() => handleStageChange('login')}
          onLogout={handleLogout}
          onAdGeneration={() => handleStageChange('onboarding')}
          onModelCreation={() => handleStageChange('modelCreation')}
          onMarketplace={() => handleStageChange('modelMarketplace')}
          onMyPage={() => handleStageChange('mypage')}
          onAdmin={() => handleStageChange('admin')}
          onPointsSubscription={() => handleStageChange('pointsSubscription')}
          onPointBalanceUpdate={handlePointBalanceUpdate}
        />
      )}

      {currentStage === 'myReviews' && (
        <MyReviews 
          userProfile={userProfile}
          onBack={() => handleStageChange('mypage')}
          onLogin={() => handleStageChange('login')}
          onLogout={handleLogout}
          onNewProject={() => handleStageChange('onboarding')}
          onCreateModel={() => handleStageChange('modelCreation')}
          onMarketplace={() => handleStageChange('modelMarketplace')}
          onMyPage={() => handleStageChange('mypage')}
          onAdmin={() => handleStageChange('admin')}
          onPointsSubscription={() => handleStageChange('pointsSubscription')}
        />
      )}

      {currentStage === 'productUpload' && selectedModelForAdGeneration && (
        <ProductImageUpload 
          userProfile={userProfile}
          selectedModel={selectedModelForAdGeneration}
          onBack={() => handleStageChange('myModels')}
          onGenerateAd={(productImages, additionalPrompt) => {
            // 제품 이미지와 선택된 모델로 광고 이미지 생성 로직
            console.log('제품 이미지:', productImages);
            console.log('추가 프롬프트:', additionalPrompt);
            console.log('선택된 모델:', selectedModelForAdGeneration);
            
            // 결과 화면으로 이동 (기존 알림 대신)
            if (productImages.length > 0) {
              handleAdGenerationComplete(
                productImages[0], // 원본 이미지 (첫 번째 업로드된 이미지)
                productImages[productImages.length - 1], // 생성된 이미지 (마지막 이미지가 생성된 결과)
                additionalPrompt
              );
            }
          }}
          onLogin={() => handleStageChange('login')}
          onLogout={handleLogout}
          onAdGeneration={() => handleStageChange('onboarding')}
          onModelCreation={() => handleStageChange('modelCreation')}
          onMarketplace={() => handleStageChange('modelMarketplace')}
          onMyPage={() => handleStageChange('mypage')}
          onHome={() => handleStageChange('landing')}
          onAdmin={() => handleStageChange('admin')}
        />
      )}

      {currentStage === 'adGenerationResult' && selectedModelForAdGeneration && adGenerationData && (
        <AdGenerationResult 
          userProfile={userProfile}
          selectedModel={selectedModelForAdGeneration}
          originalImage={adGenerationData.originalImage}
          generatedImageUrl={adGenerationData.generatedImageUrl}
          additionalPrompt={adGenerationData.additionalPrompt}
          onBack={() => handleStageChange('productUpload')}
          onNewGeneration={() => handleStageChange('productUpload')}
          onLogin={() => handleStageChange('login')}
          onLogout={handleLogout}
          onAdGeneration={() => handleStageChange('onboarding')}
          onModelCreation={() => handleStageChange('modelCreation')}
          onMarketplace={() => handleStageChange('modelMarketplace')}
          onMyPage={() => handleStageChange('mypage')}
          onHome={() => handleStageChange('landing')}
          onAdmin={() => handleStageChange('admin')}
        />
      )}
    </div>
  );
}