import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DefaultAvatar } from './common/DefaultAvatar';
import { StarRating } from './StarRating';
import { ProjectRatingForm } from './ProjectRatingForm';
import { 
  ArrowLeft, Download, Share2, Edit, Copy, Calendar, User, 
  Palette, Camera, Lightbulb, Image as ImageIcon, Eye, 
  CheckCircle, Clock, Settings, Sparkles, Star, ThumbsUp,
  ThumbsDown, MessageCircle, Award, Target, TrendingUp
} from 'lucide-react';
import { GeneratedProject, ProjectRating } from '../App';

interface ProjectDetailProps {
  project: GeneratedProject;
  onBack: () => void;
  onEditProject: () => void;
  onRatingSubmit: (rating: ProjectRating) => void;
  onProjectUpdate: (project: GeneratedProject) => void;
}

export function ProjectDetail({ project, onBack, onEditProject, onRatingSubmit, onProjectUpdate }: ProjectDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showOriginalPrompt, setShowOriginalPrompt] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const categoryNames: Record<string, string> = {
    fashion: '패션',
    electronics: '전자제품',
    beauty: '뷰티',
    home: '홈&리빙',
    food: '식품',
    lifestyle: '라이프스타일'
  };

  const statusNames: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    completed: { 
      label: '완료', 
      color: 'var(--color-semantic-green)',
      icon: <CheckCircle className="w-4 h-4" />
    },
    processing: { 
      label: '처리중', 
      color: 'var(--color-semantic-orange)',
      icon: <Clock className="w-4 h-4" />
    },
    failed: { 
      label: '실패', 
      color: 'var(--color-semantic-red)',
      icon: <CheckCircle className="w-4 h-4" />
    }
  };

  const categoryInfo = {
    quality: { label: '이미지 품질', icon: Award },
    accuracy: { label: '프롬프트 정확도', icon: Target },
    creativity: { label: '창의성', icon: Lightbulb },
    usefulness: { label: '유용성', icon: TrendingUp }
  };

  const handleDownload = (imageUrl: string, index: number) => {
    // In real app, this would trigger actual download
    console.log(`Downloading image ${index + 1}: ${imageUrl}`);
  };

  const handleShare = () => {
    // In real app, this would open share dialog
    console.log('Sharing project:', project.id);
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    // Show toast notification in real app
  };

  const handleRatingSubmit = (rating: ProjectRating) => {
    onRatingSubmit(rating);
    setShowRatingForm(false);
    setActiveTab('rating');
  };

  const getAverageRating = () => {
    if (!project.rating) return 0;
    const { quality, accuracy, creativity, usefulness } = project.rating.categoryRatings;
    return (quality + accuracy + creativity + usefulness) / 4;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background-primary)' }}>
      {/* Header */}
      <header className="linear-header sticky top-0 z-50">
        <div className="linear-container h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center gap-2"
              style={{
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-8)'
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              뒤로 가기
            </Button>
            
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  borderRadius: 'var(--radius-8)'
                }}
              >
                <Sparkles className="w-5 h-5" style={{ color: 'var(--color-utility-white)' }} />
              </div>
              <h1 
                style={{ 
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                NoModel
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {project.rating && (
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                <Star className="w-4 h-4" style={{ color: 'var(--color-semantic-orange)' }} />
                <span style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)' }}>
                  {project.rating.overallRating.toFixed(1)}
                </span>
              </div>
            )}
            <Button 
              variant="outline"
              onClick={handleShare}
              style={{
                borderRadius: 'var(--radius-8)',
                borderColor: 'var(--color-border-primary)'
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              공유
            </Button>
            <Button 
              variant="outline"
              onClick={onEditProject}
              style={{
                borderRadius: 'var(--radius-8)',
                borderColor: 'var(--color-border-primary)'
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              편집
            </Button>
            <Button 
              onClick={() => handleDownload(project.generatedImages[selectedImageIndex], selectedImageIndex)}
              style={{
                backgroundColor: 'var(--color-brand-primary)',
                color: 'var(--color-utility-white)',
                borderRadius: 'var(--radius-8)',
                border: 'none'
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              다운로드
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 
                    className="mb-2"
                    style={{
                      fontSize: 'var(--font-size-title1)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)',
                      lineHeight: '1.1'
                    }}
                  >
                    {project.title}
                  </h1>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="secondary"
                      style={{
                        backgroundColor: 'var(--color-background-tertiary)',
                        color: 'var(--color-text-secondary)',
                        borderRadius: 'var(--radius-6)',
                        fontSize: 'var(--font-size-small)',
                        padding: '4px 12px'
                      }}
                    >
                      {categoryNames[project.category]}
                    </Badge>
                    <div 
                      className="flex items-center gap-1 text-sm"
                      style={{ color: statusNames[project.status].color }}
                    >
                      {statusNames[project.status].icon}
                      {statusNames[project.status].label}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(project.createdAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  {project.downloadCount} 다운로드
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {project.generatedImages.length} 이미지
                </div>
                {project.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" style={{ color: 'var(--color-semantic-orange)' }} />
                    {project.rating.overallRating.toFixed(1)} 평점
                  </div>
                )}
              </div>
            </div>

            {/* Main Image Display */}
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <div 
                className="aspect-square w-full rounded-lg overflow-hidden mb-4"
                style={{ backgroundColor: 'var(--color-background-secondary)' }}
              >
                <img 
                  src={project.generatedImages[selectedImageIndex]} 
                  alt={`Generated image ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Thumbnails */}
              {project.generatedImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {project.generatedImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index 
                          ? 'border-primary' 
                          : 'border-transparent'
                      }`}
                      style={{
                        borderColor: selectedImageIndex === index 
                          ? 'var(--color-brand-primary)' 
                          : 'transparent'
                      }}
                    >
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Original Product Images */}
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <h3 
                className="mb-4"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                원본 제품 이미지
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.productImages.map((image, index) => (
                  <div 
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden"
                    style={{ backgroundColor: 'var(--color-background-secondary)' }}
                  >
                    <img 
                      src={image} 
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList 
                className="grid w-full grid-cols-2"
                style={{
                  backgroundColor: 'var(--color-background-secondary)',
                  borderRadius: 'var(--radius-12)',
                  padding: '4px'
                }}
              >
                <TabsTrigger 
                  value="details"
                  className="flex items-center gap-2"
                  style={{
                    borderRadius: 'var(--radius-8)',
                    fontSize: 'var(--font-size-small)',
                    padding: '8px 12px'
                  }}
                >
                  <Settings className="w-4 h-4" />
                  상세 정보
                </TabsTrigger>
                <TabsTrigger 
                  value="rating"
                  className="flex items-center gap-2"
                  style={{
                    borderRadius: 'var(--radius-8)',
                    fontSize: 'var(--font-size-small)',
                    padding: '8px 12px'
                  }}
                >
                  <Star className="w-4 h-4" />
                  평가
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                {/* Model Information */}
                <Card 
                  className="p-6"
                  style={{
                    backgroundColor: 'var(--color-background-primary)',
                    borderColor: 'var(--color-border-primary)',
                    borderRadius: 'var(--radius-16)'
                  }}
                >
                  <h3 
                    className="mb-4"
                    style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    사용된 AI 모델
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <DefaultAvatar 
                      name={project.model.name}
                      imageUrl={project.model.imageUrl}
                      className="h-12 w-12"
                    />
                    <div className="flex-1">
                      <h4 
                        className="mb-1"
                        style={{
                          fontSize: 'var(--font-size-regular)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-primary)'
                        }}
                      >
                        {project.model.name}
                      </h4>
                      <div className="flex gap-2">
                        {project.model.isCustom && (
                          <Badge 
                            variant="secondary"
                            style={{
                              backgroundColor: 'var(--color-brand-accent-tint)',
                              color: 'var(--color-brand-primary)',
                              borderRadius: 'var(--radius-4)',
                              fontSize: 'var(--font-size-micro)',
                              padding: '2px 8px'
                            }}
                          >
                            커스텀
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p style={{ color: 'var(--color-text-tertiary)' }}>연령대</p>
                      <p style={{ color: 'var(--color-text-primary)' }}>{project.model.metadata.age}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--color-text-tertiary)' }}>성별</p>
                      <p style={{ color: 'var(--color-text-primary)' }}>{project.model.metadata.gender}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--color-text-tertiary)' }}>스타일</p>
                      <p style={{ color: 'var(--color-text-primary)' }}>{project.model.metadata.style}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--color-text-tertiary)' }}>인종</p>
                      <p style={{ color: 'var(--color-text-primary)' }}>{project.model.metadata.ethnicity}</p>
                    </div>
                  </div>
                </Card>

                {/* Generation Settings */}
                <Card 
                  className="p-6"
                  style={{
                    backgroundColor: 'var(--color-background-primary)',
                    borderColor: 'var(--color-border-primary)',
                    borderRadius: 'var(--radius-16)'
                  }}
                >
                  <h3 
                    className="mb-4"
                    style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    생성 설정
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-brand-accent-tint)' }}
                      >
                        <Palette className="w-4 h-4" style={{ color: 'var(--color-brand-primary)' }} />
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>배경</p>
                        <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{project.settings.background}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-brand-accent-tint)' }}
                      >
                        <Camera className="w-4 h-4" style={{ color: 'var(--color-brand-primary)' }} />
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>조명</p>
                        <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{project.settings.lighting}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-brand-accent-tint)' }}
                      >
                        <User className="w-4 h-4" style={{ color: 'var(--color-brand-primary)' }} />
                      </div>
                      <div>
                        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>스타일</p>
                        <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{project.settings.style}</p>
                      </div>
                    </div>

                    {project.settings.pose && (
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'var(--color-brand-accent-tint)' }}
                        >
                          <Settings className="w-4 h-4" style={{ color: 'var(--color-brand-primary)' }} />
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>포즈</p>
                          <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{project.settings.pose}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Prompts */}
                <Card 
                  className="p-6"
                  style={{
                    backgroundColor: 'var(--color-background-primary)',
                    borderColor: 'var(--color-border-primary)',
                    borderRadius: 'var(--radius-16)'
                  }}
                >
                  <h3 
                    className="mb-4"
                    style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    사용된 프롬프트
                  </h3>

                  <Tabs value={showOriginalPrompt ? 'original' : 'final'} onValueChange={(value) => setShowOriginalPrompt(value === 'original')}>
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="final">최종 프롬프트</TabsTrigger>
                      <TabsTrigger value="original">원본 프롬프트</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="final" className="space-y-3">
                      <div 
                        className="p-4 rounded-lg text-sm"
                        style={{
                          backgroundColor: 'var(--color-background-secondary)',
                          border: `1px solid var(--color-border-primary)`,
                          color: 'var(--color-text-secondary)',
                          fontFamily: 'var(--font-family-monospace)',
                          lineHeight: '1.5'
                        }}
                      >
                        {project.finalPrompt}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyPrompt(project.finalPrompt)}
                        className="w-full"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        프롬프트 복사
                      </Button>
                    </TabsContent>

                    <TabsContent value="original" className="space-y-3">
                      <div 
                        className="p-4 rounded-lg text-sm"
                        style={{
                          backgroundColor: 'var(--color-background-secondary)',
                          border: `1px solid var(--color-border-primary)`,
                          color: 'var(--color-text-secondary)',
                          lineHeight: '1.5'
                        }}
                      >
                        {project.originalPrompt}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyPrompt(project.originalPrompt)}
                        className="w-full"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        프롬프트 복사
                      </Button>
                    </TabsContent>
                  </Tabs>
                </Card>

                {/* Technical Info */}
                <Card 
                  className="p-6"
                  style={{
                    backgroundColor: 'var(--color-background-primary)',
                    borderColor: 'var(--color-border-primary)',
                    borderRadius: 'var(--radius-16)'
                  }}
                >
                  <h3 
                    className="mb-4"
                    style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    기술 정보
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-text-tertiary)' }}>시드 값</span>
                      <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-monospace)' }}>
                        {project.model.seedValue}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-text-tertiary)' }}>모델 ID</span>
                      <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-monospace)' }}>
                        {project.model.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-text-tertiary)' }}>프로젝트 ID</span>
                      <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-family-monospace)' }}>
                        {project.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-text-tertiary)' }}>공개 여부</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>
                        {project.isPublic ? '공개' : '비공개'}
                      </span>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="rating" className="space-y-6">
                {!project.rating && !showRatingForm && (
                  <Card 
                    className="p-8 text-center"
                    style={{
                      backgroundColor: 'var(--color-background-primary)',
                      borderColor: 'var(--color-border-primary)',
                      borderRadius: 'var(--radius-16)'
                    }}
                  >
                    <Star 
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
                      이 결과물을 평가해보세요
                    </h3>
                    <p 
                      className="mb-6"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      생성된 이미지의 품질과 만족도를 평가하여 
                      더 나은 결과물을 만드는데 도움을 주세요
                    </p>
                    <Button 
                      onClick={() => setShowRatingForm(true)}
                      style={{
                        backgroundColor: 'var(--color-brand-primary)',
                        color: 'var(--color-utility-white)',
                        borderRadius: 'var(--radius-8)',
                        border: 'none'
                      }}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      평가하기
                    </Button>
                  </Card>
                )}

                {showRatingForm && (
                  <ProjectRatingForm
                    existingRating={project.rating}
                    onSubmit={handleRatingSubmit}
                    onCancel={() => setShowRatingForm(false)}
                  />
                )}

                {project.rating && !showRatingForm && (
                  <div className="space-y-6">
                    {/* Rating Summary */}
                    <Card 
                      className="p-6"
                      style={{
                        backgroundColor: 'var(--color-background-primary)',
                        borderColor: 'var(--color-border-primary)',
                        borderRadius: 'var(--radius-16)'
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 
                          style={{
                            fontSize: 'var(--font-size-title3)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-text-primary)'
                          }}
                        >
                          내 평가
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowRatingForm(true)}
                        >
                          수정
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span style={{ color: 'var(--color-text-secondary)' }}>전체 만족도</span>
                          <StarRating rating={project.rating.overallRating} readonly size="md" />
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <h4 
                            className="text-sm"
                            style={{
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-text-primary)'
                            }}
                          >
                            세부 평가
                          </h4>
                          {Object.entries(categoryInfo).map(([key, info]) => {
                            const IconComponent = info.icon;
                            const rating = project.rating!.categoryRatings[key as keyof typeof project.rating.categoryRatings];
                            return (
                              <div key={key} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <IconComponent 
                                    className="w-4 h-4"
                                    style={{ color: 'var(--color-text-tertiary)' }}
                                  />
                                  <span 
                                    className="text-sm"
                                    style={{ color: 'var(--color-text-secondary)' }}
                                  >
                                    {info.label}
                                  </span>
                                </div>
                                <StarRating rating={rating} readonly size="sm" />
                              </div>
                            );
                          })}
                        </div>

                        {project.rating.feedback && (
                          <>
                            <Separator />
                            <div>
                              <h4 
                                className="text-sm mb-2"
                                style={{
                                  fontWeight: 'var(--font-weight-semibold)',
                                  color: 'var(--color-text-primary)'
                                }}
                              >
                                상세 피드백
                              </h4>
                              <p 
                                className="text-sm"
                                style={{ 
                                  color: 'var(--color-text-secondary)',
                                  lineHeight: '1.5'
                                }}
                              >
                                {project.rating.feedback}
                              </p>
                            </div>
                          </>
                        )}

                        {(project.rating.pros.length > 0 || project.rating.cons.length > 0) && (
                          <>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {project.rating.pros.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <ThumbsUp 
                                      className="w-4 h-4"
                                      style={{ color: 'var(--color-semantic-green)' }}
                                    />
                                    <h4 
                                      className="text-sm"
                                      style={{
                                        fontWeight: 'var(--font-weight-semibold)',
                                        color: 'var(--color-text-primary)'
                                      }}
                                    >
                                      좋았던 점
                                    </h4>
                                  </div>
                                  <ul className="space-y-1">
                                    {project.rating.pros.map((pro, index) => (
                                      <li 
                                        key={index}
                                        className="text-sm"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                      >
                                        • {pro}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {project.rating.cons.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <ThumbsDown 
                                      className="w-4 h-4"
                                      style={{ color: 'var(--color-semantic-red)' }}
                                    />
                                    <h4 
                                      className="text-sm"
                                      style={{
                                        fontWeight: 'var(--font-weight-semibold)',
                                        color: 'var(--color-text-primary)'
                                      }}
                                    >
                                      아쉬웠던 점
                                    </h4>
                                  </div>
                                  <ul className="space-y-1">
                                    {project.rating.cons.map((con, index) => (
                                      <li 
                                        key={index}
                                        className="text-sm"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                      >
                                        • {con}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        <Separator />

                        <div className="flex items-center justify-between">
                          <span 
                            className="text-sm"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            다른 사용자에게 추천
                          </span>
                          <Badge
                            style={{
                              backgroundColor: project.rating.wouldRecommend 
                                ? 'var(--color-semantic-green)' + '20'
                                : 'var(--color-semantic-red)' + '20',
                              color: project.rating.wouldRecommend 
                                ? 'var(--color-semantic-green)'
                                : 'var(--color-semantic-red)',
                              borderRadius: 'var(--radius-rounded)',
                              fontSize: 'var(--font-size-small)'
                            }}
                          >
                            {project.rating.wouldRecommend ? '추천함' : '추천 안함'}
                          </Badge>
                        </div>

                        <div className="text-xs text-center" style={{ color: 'var(--color-text-quaternary)' }}>
                          {formatDate(project.rating.ratedAt)} 평가
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}