import React, { useState, useMemo, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { NavigationBar } from './NavigationBar';
import { DynamicFontSize } from './common/DynamicFontSize';
import { 
  Sparkles, Plus, Search, Filter, Grid3X3, List, Calendar, Download, 
  Eye, User, Settings, LogOut, TrendingUp, Image as ImageIcon,
  Crown, Star, ShoppingCart, Users, Coins, Shield
} from 'lucide-react';
import { GeneratedProject, UserProfile } from '../App';
import { getMyProjectCount, getMyAverageRating, getMyAdResults, convertAdResultToProject } from '../services/adResultApi';



// Mock data for generated projects - fallback if no projects passed
const defaultMockProjects: GeneratedProject[] = [
  {
    id: 'project-1',
    title: '패션 모델 - 화이트 티셔츠',
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b1ff?w=400&h=400&fit=crop',
    category: 'fashion',
    model: {
      id: 'model-1',
      name: '지민 - 젊은 여성',
      prompt: 'young asian woman, professional headshot',
      seedValue: '12345',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b1ff?w=100&h=100&fit=crop&crop=face',
      category: 'fashion',
      isCustom: false,
      metadata: { age: '20대 초반', gender: '여성', style: '프로페셔널', ethnicity: '아시아' }
    },
    originalPrompt: '흰색 티셔츠를 착용한 젊은 여성 모델',
    finalPrompt: 'young asian woman wearing white t-shirt, professional fashion photography, studio lighting, clean background',
    generatedImages: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b1ff?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop'
    ],
    productImages: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'],
    createdAt: new Date('2024-03-15T10:30:00'),
    status: 'completed',
    settings: {
      background: '화이트 스튜디오',
      style: '프로페셔널',
      lighting: '스튜디오 조명',
      pose: '자연스러운'
    },
    downloadCount: 12,
    isPublic: true,
    rating: {
      overallRating: 4.5,
      categoryRatings: {
        quality: 5,
        accuracy: 4,
        creativity: 4,
        usefulness: 5
      },
      feedback: '이미지 품질이 매우 뛰어나고 제품이 잘 부각되었습니다. ���명과 배경이 완벽하게 조화롭고, 모델의 포즈도 자연스럽습니다.',
      pros: ['높은 이미지 품질', '자연스러운 모델 포즈', '깔끔한 배경'],
      cons: ['조금 더 다양한 각도가 있었으면 좋겠음'],
      ratedAt: new Date('2024-03-15T11:00:00'),
      wouldRecommend: true
    }
  },
  {
    id: 'project-2',
    title: '뷰티 제품 - 립스틱 광고',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    category: 'beauty',
    model: {
      id: 'model-3',
      name: '소피아 - 성인 여성',
      prompt: 'mature woman, elegant portrait',
      seedValue: '34567',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
      category: 'beauty',
      isCustom: false,
      metadata: { age: '30대 중반', gender: '여성', style: '럭셔리', ethnicity: '서양' }
    },
    originalPrompt: '고급스러운 립스틱을 바른 여성',
    finalPrompt: 'elegant woman applying luxury lipstick, beauty photography, soft lighting, luxurious background',
    generatedImages: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop'
    ],
    productImages: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop'],
    createdAt: new Date('2024-03-14T15:20:00'),
    status: 'completed',
    settings: {
      background: '럭셔리',
      style: '엘레간트',
      lighting: '소프트 조명'
    },
    downloadCount: 8,
    isPublic: false,
    rating: {
      overallRating: 3.5,
      categoryRatings: {
        quality: 4,
        accuracy: 3,
        creativity: 4,
        usefulness: 3
      },
      feedback: '전체적으로 만족스럽지만 제품의 색상이 실제와 약간 다른 것 같습니다.',
      pros: ['우아한 분위기', '고급스러운 배경'],
      cons: ['제품 색상 정확도', '조명이 약간 어두움'],
      ratedAt: new Date('2024-03-14T16:00:00'),
      wouldRecommend: false
    }
  },
  {
    id: 'project-3',
    title: '전자제품 - 스마트워치',
    thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    category: 'electronics',
    model: {
      id: 'custom-1',
      name: '커스텀 모델 - 남성 30대',
      prompt: 'professional businessman wearing smartwatch',
      seedValue: '98765',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      category: 'electronics',
      isCustom: true,
      metadata: { age: '30대', gender: '남성', style: '비즈니스', ethnicity: '서양' }
    },
    originalPrompt: '스마트워치를 착용한 비즈니스���',
    finalPrompt: 'professional businessman wearing smartwatch, technology photography, modern office background',
    generatedImages: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop'
    ],
    productImages: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'],
    createdAt: new Date('2024-03-13T09:45:00'),
    status: 'processing',
    settings: {
      background: '오피스',
      style: '비즈니스',
      lighting: '자연광'
    },
    downloadCount: 0,
    isPublic: true
  }
];

const categoryNames: Record<string, string> = {
  fashion: '패션',
  electronics: '전자제품',
  beauty: '뷰티',
  home: '홈&리빙',
  food: '식품',
  lifestyle: '라이프스타일'
};

const statusNames: Record<string, { label: string; color: string }> = {
  completed: { label: '완료', color: 'var(--color-semantic-green)' },
  processing: { label: '처리중', color: 'var(--color-semantic-orange)' },
  failed: { label: '실패', color: 'var(--color-semantic-red)' }
};

interface MyPageProps {
  userProfile: UserProfile | null;
  projects: GeneratedProject[];
  onProjectSelect: (project: GeneratedProject) => void;
  onNewProject: () => void;
  onProfileSettings: () => void;
  onMyModels: () => void;
  onCreateModel: () => void;
  onMarketplace: () => void;
  onLogout: () => void;
  onAdmin: () => void;
  onLogin: () => void;
}

export function MyPage({ userProfile, projects = defaultMockProjects, onProjectSelect, onNewProject, onProfileSettings, onMyModels, onCreateModel, onMarketplace, onLogout, onAdmin, onLogin }: MyPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'downloads' | 'rating'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [projectCount, setProjectCount] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [apiProjects, setApiProjects] = useState<GeneratedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [useApiData, setUseApiData] = useState(false);

  // Fetch API data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!userProfile) return;
      
      try {
        setLoading(true);
        const [countResponse, ratingResponse, projectsResponse] = await Promise.all([
          getMyProjectCount(),
          getMyAverageRating(),
          getMyAdResults(0, 100) // Get up to 100 projects
        ]);
        
        if (countResponse.success) {
          setProjectCount(countResponse.response.totalProjects);
        }
        
        if (ratingResponse.success) {
          setAverageRating(ratingResponse.response.averageRating);
        }
        
        if (projectsResponse.success && projectsResponse.response.content) {
          const convertedProjects = projectsResponse.response.content.map(convertAdResultToProject);
          setApiProjects(convertedProjects);
          setUseApiData(true);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Fallback to project count from props and mock data
        setProjectCount(projects.length);
        setUseApiData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userProfile, projects.length]);

  // Use API data if available, fallback to props
  const currentProjects = useApiData ? apiProjects : projects;

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = currentProjects.filter(project => {
      if (selectedCategory !== 'all' && project.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && project.status !== selectedStatus) return false;
      if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'downloads':
          return b.downloadCount - a.downloadCount;
        case 'rating':
          const aRating = a.rating?.overallRating || 0;
          const bRating = b.rating?.overallRating || 0;
          return bRating - aRating;
        default:
          return 0;
      }
    });
  }, [currentProjects, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };


  // Calculate user stats including ratings
  const userStats = useMemo(() => {
    const ratedProjects = currentProjects.filter(p => p.rating);
    
    return {
      totalDownloads: currentProjects.reduce((sum, p) => sum + p.downloadCount, 0),
      averageRating: averageRating,
      ratedProjects: ratedProjects.length
    };
  }, [currentProjects, averageRating]);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background-primary)' }}>
      <NavigationBar
        onLogin={onLogin}
        onLogout={onLogout}
        onAdGeneration={onNewProject}
        onModelCreation={onCreateModel}
        onMarketplace={onMarketplace}
        onMyPage={() => {}} // Already on MyPage
        onHome={onNewProject}
        onAdmin={onAdmin}
        isAdmin={userProfile?.role === 'ADMIN'}
        isLoggedIn={!!userProfile}
        isLandingPage={false}
        currentPage="mypage"
      />

      {/* Main Content */}
      <main className="py-8 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* User Stats */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold"
              style={{ fontSize: 'var(--font-size-title3)' }}
            >
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 
                  style={{
                    fontSize: 'var(--font-size-title2)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {userProfile.name}
                </h1>
                <Badge 
                  className="flex items-center gap-1"
                  style={{
                    backgroundColor: userProfile.planType === 'pro' ? 'var(--color-brand-accent-tint)' : 'var(--color-background-tertiary)',
                    color: userProfile.planType === 'pro' ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                    borderRadius: 'var(--radius-rounded)',
                    fontSize: 'var(--font-size-small)',
                    fontWeight: 'var(--font-weight-medium)',
                    padding: '4px 12px'
                  }}
                >
                  {userProfile.planType === 'pro' && <Crown className="w-3 h-3" />}
                  {userProfile.planType.toUpperCase()}
                </Badge>
              </div>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {userProfile.bio}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Card 
              className="p-4"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-12)'
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-brand-accent-tint)' }}
                >
                  <ImageIcon 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-brand-primary)' }}
                  />
                </div>
                <div>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    총 프로젝트
                  </p>
                  <p 
                    style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {loading ? '-' : projectCount}
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-12)'
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-semantic-blue)' + '20' }}
                >
                  <Download 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-semantic-blue)' }}
                  />
                </div>
                <div>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    총 다운로드
                  </p>
                  <p 
                    style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {userStats.totalDownloads}
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-12)'
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-semantic-orange)' + '20' }}
                >
                  <Star 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-semantic-orange)' }}
                  />
                </div>
                <div>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    평균 평점
                  </p>
                  <p 
                    style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {userStats.averageRating > 0 ? userStats.averageRating.toFixed(1) : '-'}
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-12)'
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-semantic-orange)' + '20' }}
                >
                  <Coins 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-semantic-orange)' }}
                  />
                </div>
                <div>
                  <p 
                    className="text-sm font-medium mb-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    보유 포인트
                  </p>
                  <DynamicFontSize
                    text={`${userProfile.points.toLocaleString()} P`}
                    baseSize="var(--font-size-title3)"
                    maxWidth="140px"
                    minSize="12px"
                    style={{
                      color: 'var(--color-text-primary)'
                    }}
                  />
                </div>
              </div>
            </Card>

            <Card 
              className="p-4"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-12)'
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-semantic-indigo)' + '20' }}
                >
                  <Users 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-semantic-indigo)' }}
                  />
                </div>
                <div>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    생성한 모델
                  </p>
                  <p 
                    style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {userProfile.modelCount || 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card 
              className="p-6 cursor-pointer transition-all hover:shadow-lg"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)',
                boxShadow: 'var(--shadow-tiny)'
              }}
              onClick={onCreateModel}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-tiny)';
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-brand-accent-tint)' }}
                >
                  <Plus 
                    className="w-6 h-6"
                    style={{ color: 'var(--color-brand-primary)' }}
                  />
                </div>
                <div>
                  <h3 
                    style={{
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    AI 모델 생성
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    새로운 AI 모델을 만들고 프로젝트를 생성해보세요
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-6 cursor-pointer transition-all hover:shadow-lg"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)',
                boxShadow: 'var(--shadow-tiny)'
              }}
              onClick={onMarketplace}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-tiny)';
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-semantic-blue)' + '20' }}
                >
                  <ShoppingCart 
                    className="w-6 h-6"
                    style={{ color: 'var(--color-semantic-blue)' }}
                  />
                </div>
                <div>
                  <h3 
                    style={{
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    모델 마켓플레이스
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    다른 모델들을 사용해보세요
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-6 cursor-pointer transition-all hover:shadow-lg"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)',
                boxShadow: 'var(--shadow-tiny)'
              }}
              onClick={onMyModels}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-tiny)';
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-semantic-green)' + '20' }}
                >
                  <Users 
                    className="w-6 h-6"
                    style={{ color: 'var(--color-semantic-green)' }}
                  />
                </div>
                <div>
                  <h3 
                    style={{
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    내 AI 모델
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    생성한 모델을 관리하고 수익을 확인하세요
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Projects Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 
              style={{
                fontSize: 'var(--font-size-title2)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)'
              }}
            >
              내 프로젝트 ({filteredProjects.length})
            </h2>
          </div>

          {/* Search and Filters Section */}
          <div className="mb-8">
            {/* Search Bar with Integrated Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  />
                  <Input
                    placeholder="프로젝트 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base"
                    style={{
                      borderRadius: 'var(--radius-8)',
                      borderColor: 'var(--color-border-primary)',
                      backgroundColor: 'var(--color-input-background)',
                      fontSize: 'var(--font-size-regular)'
                    }}
                  />
                </div>
                
                {/* Filter Row - Close to Search */}
                <div className="flex flex-wrap gap-3 mt-3 items-center">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  
                  {/* Category Filter */}
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-36 h-9">
                      <SelectValue placeholder="카테고리" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 카테고리</SelectItem>
                      <SelectItem value="fashion">패션</SelectItem>
                      <SelectItem value="beauty">뷰티</SelectItem>
                      <SelectItem value="electronics">전자제품</SelectItem>
                      <SelectItem value="home">홈&리빙</SelectItem>
                      <SelectItem value="lifestyle">라이프스타일</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Status Filter */}
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-28 h-9">
                      <SelectValue placeholder="상태" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 상태</SelectItem>
                      <SelectItem value="completed">완료</SelectItem>
                      <SelectItem value="processing">처리중</SelectItem>
                      <SelectItem value="failed">실패</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                    <SelectTrigger className="w-28 h-9">
                      <SelectValue placeholder="정렬" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">최신순</SelectItem>
                      <SelectItem value="oldest">오래된순</SelectItem>
                      <SelectItem value="downloads">다운로드순</SelectItem>
                      <SelectItem value="rating">평점순</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <span className="text-sm text-muted-foreground">
                    {filteredProjects.length}개 프로젝트
                  </span>

                  {/* View Mode */}
                  <div className="flex gap-1 bg-muted/30 rounded-lg p-1 ml-auto">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="px-3 h-9"
                      style={{ borderRadius: 'var(--radius-6)' }}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="px-3 h-9"
                      style={{ borderRadius: 'var(--radius-6)' }}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Grid/List */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon 
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: 'var(--color-text-tertiary)' }}
              />
              <h3 
                className="mb-2"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                프로젝트가 없습니다
              </h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                첫 번째 AI 이미지를 생성해보세요
              </p>
              <Button 
                onClick={onNewProject}
                className="mt-4"
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-utility-white)',
                  borderRadius: 'var(--radius-8)'
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                새 프로젝트 시작
              </Button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProjects.map((project) => (
                <Card 
                  key={project.id}
                  className={`group cursor-pointer transition-all hover:shadow-lg ${
                    viewMode === 'list' ? 'flex items-center p-4' : 'p-4'
                  }`}
                  style={{
                    backgroundColor: 'var(--color-background-primary)',
                    borderColor: 'var(--color-border-primary)',
                    borderRadius: 'var(--radius-16)',
                    boxShadow: 'var(--shadow-tiny)',
                    transition: 'all var(--animation-quick-transition) ease'
                  }}
                  onClick={() => onProjectSelect(project)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-tiny)';
                  }}
                >
                  <div className={`${viewMode === 'list' ? 'flex items-center gap-4 w-full' : ''}`}>
                    {/* Project Thumbnail */}
                    <div 
                      className={`relative overflow-hidden ${
                        viewMode === 'list' ? 'w-16 h-16' : 'w-full aspect-square mb-4'
                      }`}
                      style={{ borderRadius: 'var(--radius-12)' }}
                    >
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      

                      {/* Model Type Badge */}
                      {project.model.isCustom && (
                        <Badge 
                          className="absolute top-2 right-2 text-xs"
                          style={{
                            backgroundColor: 'var(--color-brand-accent-tint)',
                            color: 'var(--color-brand-primary)',
                            borderRadius: 'var(--radius-4)',
                            fontSize: 'var(--font-size-micro)',
                            padding: '2px 6px'
                          }}
                        >
                          커스텀
                        </Badge>
                      )}

                      {/* Points Used Badge */}
                      {project.pointsUsed && (
                        <Badge 
                          className="absolute bottom-2 right-2 text-xs flex items-center gap-1"
                          style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'var(--color-utility-white)',
                            borderRadius: 'var(--radius-4)',
                            fontSize: 'var(--font-size-micro)',
                            padding: '2px 6px'
                          }}
                        >
                          <Coins className="w-3 h-3" />
                          {project.pointsUsed}P
                        </Badge>
                      )}

                      {/* Quick View */}
                      <div 
                        className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                          viewMode === 'list' ? 'hidden' : ''
                        }`}
                      >
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className={`${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 
                              className="line-clamp-1 flex-1"
                              style={{
                                fontSize: 'var(--font-size-regular)',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: 'var(--color-text-primary)'
                              }}
                            >
                              {project.title}
                            </h3>
                            <Badge 
                              variant="secondary" 
                              className="text-xs flex-shrink-0"
                              style={{
                                backgroundColor: 'var(--color-background-tertiary)',
                                color: 'var(--color-text-secondary)',
                                borderRadius: 'var(--radius-4)',
                                fontSize: 'var(--font-size-micro)',
                                padding: '2px 6px'
                              }}
                            >
                              {categoryNames[project.category]}
                            </Badge>
                          </div>

                          {viewMode === 'grid' && (
                            <div className="space-y-1">
                              <p 
                                className="text-xs"
                                style={{ 
                                  color: 'var(--color-text-tertiary)',
                                  lineHeight: '1.4'
                                }}
                              >
                                {project.model.name}
                              </p>
                              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                <span>{formatDate(project.createdAt)}</span>
                                <span>•</span>
                                <span>{project.downloadCount} 다운로드</span>
                                {project.rating && (
                                  <>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                      <Star className="w-3 h-3" style={{ color: 'var(--color-semantic-orange)' }} />
                                      <span>{project.rating.overallRating.toFixed(1)}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {viewMode === 'list' && (
                          <div className="text-right text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                            <p>{formatDate(project.createdAt)}</p>
                            <div className="flex items-center gap-2 justify-end mt-1">
                              <span>{project.downloadCount} 다운로드</span>
                              {project.rating && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3" style={{ color: 'var(--color-semantic-orange)' }} />
                                    <span>{project.rating.overallRating.toFixed(1)}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}