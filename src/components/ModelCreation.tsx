import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, Wand2, Save,
  Image as ImageIcon, Info, CheckCircle, Plus
} from 'lucide-react';
import { UserProfile, UserModel } from '../App';
import { NavigationBar } from './NavigationBar';

interface ModelCreationProps {
  userProfile: UserProfile | null;
  onBack: () => void;
  onModelCreated: (model: UserModel) => void;
  onLogin: () => void;
  onLogout: () => void;
  onAdGeneration: () => void;
  onModelCreation: () => void;
  onMarketplace: () => void;
  onMyPage: () => void;
  onHome: () => void;
  onAdmin?: () => void;
}

const ageOptions = ['10대', '20대 초반', '20대 후반', '30대 초반', '30대 후반', '40대', '50대+'];
const genderOptions = ['남성', '여성', '중성'];
const ethnicityOptions = ['아시아', '서양', '아프리카', '라틴', '혼합'];
const styleOptions = ['프로페셔널', '캐주얼', '럭셔리', '스포츠', '아티스틱', '빈티지'];
const categoryOptions = [
  { value: 'fashion', label: '패션' },
  { value: 'beauty', label: '뷰티' },
  { value: 'electronics', label: '전자제품' },
  { value: 'home', label: '홈&리빙' },
  { value: 'food', label: '식품' },
  { value: 'lifestyle', label: '라이프스타일' }
];

// 고정된 네거티브 프롬프트
const FIXED_NEGATIVE_PROMPT = "(worst quality:2),(low quality:2),(normal quality:2),lowres,watermark,lower body,text";

// AI 프롬프트 자동 생성 버튼들
const promptAutoGenButtons = {
  gender: [
    { label: "남성", value: "male" },
    { label: "여성", value: "female" },
  ],
  age: [
    { label: "젊은", value: "young" },
    { label: "성인", value: "adult" },
    { label: "나이든", value: "elderly" },
  ],
  appearance: [
    { label: "아름다운", value: "beautiful" },
    { label: "잘생긴", value: "handsome" },
    { label: "귀여운", value: "cute" },
    { label: "세련된", value: "elegant" },
    { label: "자연스러운", value: "natural" },
  ],
  emotion: [
    { label: "행복한", value: "happy" },
    { label: "슬픈", value: "sad" },
    { label: "진지한", value: "serious" },
    { label: "놀란", value: "surprised" },
    { label: "평온한", value: "peaceful" },
    { label: "자신감 있는", value: "confident" },
  ],
  style: [
    { label: "프로페셔널", value: "professional" },
    { label: "캐주얼", value: "casual" },
    { label: "럭셔리", value: "luxury" },
    { label: "빈티지", value: "vintage" },
    { label: "모던", value: "modern" },
    { label: "스포티", value: "sporty" },
  ],
  lighting: [
    { label: "자연광", value: "natural lighting" },
    { label: "스튜디오 조명", value: "studio lighting" },
    { label: "드라마틱", value: "dramatic lighting" },
    { label: "따뜻한 조명", value: "warm lighting" },
    { label: "차가운 조명", value: "cool lighting" },
  ],
  background: [
    { label: "화이트 배경", value: "white background" },
    { label: "도시 배경", value: "urban background" },
    { label: "자연 배경", value: "natural background" },
    { label: "스튜디오", value: "studio background" },
    { label: "인테리어", value: "interior background" },
  ],
};

export function ModelCreation({ userProfile, onBack, onModelCreated, onLogin, onLogout, onAdGeneration, onModelCreation, onMarketplace, onMyPage, onHome, onAdmin }: ModelCreationProps) {
  const [step, setStep] = useState<'basic' | 'details' | 'preview'>('basic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
    category: '',
    age: '',
    gender: '',
    ethnicity: '',
    style: '',
    price: 50,
    tags: [] as string[],
    isPublic: true,
    isForSale: true
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [seedValue, setSeedValue] = useState('');

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim()) && formData.tags.length < 10) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleGeneratePreview = async () => {
    if (!formData.prompt) {
      alert('프롬프트를 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    
    try {
      // API 요청 데이터 구성
      const requestData = {
        prompt: formData.prompt,
        mode: "SUBJECT_SCENE",
        width: 512,
        height: 512,
        steps: 40,
        cfgScale: 7.0,
        negativePrompt: FIXED_NEGATIVE_PROMPT, // 고정된 네거티브 프롬프트 사용
        relationId: 0,
        relationType: "MODEL",
        userId: userProfile?.id || 1,
        modelName: formData.name,
        price: formData.price,
        isPublic: formData.isPublic
      };

      console.log('이미지 생성 요청:', requestData);

      // 백엔드 서버 사용 가능 여부 확인
      const USE_BACKEND = true; // 실제 API 사용
      
      if (USE_BACKEND) {
        console.log(`API 요청: http://localhost:8080/api/generate/stable-diffusion/generate-file`);
        
        const response = await fetch('http://localhost:8080/api/generate/stable-diffusion/generate-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('API 응답:', result);

        if (result.status === 'SUCCEEDED' && result.resultFileUrl) {
          // 성공적으로 생성된 이미지 URL 설정
          setPreviewImages([result.resultFileUrl]);
          setSeedValue(result.jobId || Math.random().toString().slice(2, 7));
          setIsGenerating(false);
          setStep('preview');
        } else {
          throw new Error(result.errorMessage || '이미지 생성에 실패했습니다.');
        }
      } else {
        // Mock 데이터 사용 (백엔드 서버 없을 때)
        console.log('백엔드 서버가 없으므로 Mock 데이터 사용');
        
        // 2-3초 대기 (실제 생성 시간 모방)
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // 고품질 AI 생성 이미지 Mock URL
        const mockGeneratedImage = 'https://images.unsplash.com/photo-1494790108755-2616b612b1ff?w=512&h=512&fit=crop&crop=face';
        
        setPreviewImages([mockGeneratedImage]);
        setSeedValue(`mock-${Date.now()}`);
        setIsGenerating(false);
        setStep('preview');
      }
    } catch (error) {
      console.error('이미지 생성 오류:', error);
      setIsGenerating(false);
      alert(`이미지 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  const handleSubmit = async () => {
    if (!userProfile) return;
    
    if (!formData.name || !formData.description || !formData.prompt || !formData.category) {
      alert('필수 필드를 모두 입력해주세요.');
      return;
    }

    if (previewImages.length === 0) {
      alert('미리보기 이미지를 생성해주세요.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newModel: UserModel = {
        id: `model-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        prompt: formData.prompt,
        seedValue: seedValue,
        imageUrl: previewImages[0],
        previewImages: previewImages,
        category: 'general', // 기본 카테고리
        metadata: {
          age: '20대',
          gender: '일반',
          style: '일반',
          ethnicity: '아시아'
        },
        creatorId: userProfile.id.toString(),
        creatorName: userProfile.name,
        creatorAvatar: undefined, // 기본 아바타는 DefaultAvatar 컴포넌트에서 처리
        price: formData.price,
        usageCount: 0,
        rating: 0,
        ratingCount: 0,
        tags: [], // 태그 기능 제거로 빈 배열
        isPublic: formData.isPublic,
        isForSale: true, // 기본적으로 판매 허용
        createdAt: new Date(),
        updatedAt: new Date(),
        earnings: 0
      };

      onModelCreated(newModel);
      setIsSubmitting(false);
    }, 2000);
  };

  const isBasicValid = formData.name && formData.description && formData.prompt;

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background-primary)' }}>
      <NavigationBar
        onLogin={onLogin}
        onLogout={onLogout}
        onAdGeneration={onAdGeneration}
        onModelCreation={onModelCreation}
        onMarketplace={onMarketplace}
        onMyPage={onMyPage}
        onHome={onHome}
        onBack={onBack}
        onAdmin={onAdmin}
        isAdmin={userProfile?.role === 'ADMIN'}
        isLoggedIn={!!userProfile}
        showBackButton={true}
        userPoints={userProfile?.points}
        currentPage="other"
      />

      {/* Main Content */}
      <main className="page-container">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            {['basic', 'details', 'preview'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === stepName ? 'bg-primary text-white' : 
                    ['basic', 'details', 'preview'].indexOf(step) > index ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                  style={{
                    backgroundColor: step === stepName ? 'var(--color-brand-primary)' : 
                      ['basic', 'details', 'preview'].indexOf(step) > index ? 'var(--color-semantic-green)' : 'var(--color-background-tertiary)',
                    color: step === stepName || ['basic', 'details', 'preview'].indexOf(step) > index ? 'var(--color-utility-white)' : 'var(--color-text-tertiary)'
                  }}
                >
                  {index + 1}
                </div>
                {index < 2 && (
                  <div 
                    className="w-16 h-1 mx-2"
                    style={{
                      backgroundColor: ['basic', 'details', 'preview'].indexOf(step) > index ? 'var(--color-semantic-green)' : 'var(--color-background-tertiary)'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <div className="text-center">
              <h1 
                className="mb-2"
                style={{
                  fontSize: 'var(--font-size-title1)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                {step === 'basic' && 'AI 모델 기본 정보'}
                {step === 'details' && '판매 및 공개 설정'}
                {step === 'preview' && '미리보기 및 출시'}
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {step === 'basic' && '모델의 기본 정보와 프롬프트를 설정하세요'}
                {step === 'details' && '모델의 판매 가격과 공개 설정을 완료하세요'}
                {step === 'preview' && '생성된 모델을 확인하고 마켓플레이스에 출시하세요'}
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 'basic' && (
          <div className="space-y-6">
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <h3 
                className="mb-6"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                기본 정보
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">
                    모델 이름 <span style={{ color: 'var(--color-semantic-red)' }}>*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="예: 젊은 아시아 여성 모델"
                    className="mt-2"
                    style={{
                      borderRadius: 'var(--radius-8)',
                      borderColor: 'var(--color-border-primary)',
                      backgroundColor: 'var(--color-input-background)',
                      height: '48px'
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="description">
                    모델 설명 <span style={{ color: 'var(--color-semantic-red)' }}>*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="이 모델의 특징과 어떤 용도로 사용하면 좋은지 설명해주세요"
                    className="mt-2 min-h-24"
                    style={{
                      borderRadius: 'var(--radius-8)',
                      borderColor: 'var(--color-border-primary)',
                      backgroundColor: 'var(--color-input-background)'
                    }}
                  />
                </div>

                {/* AI 프롬프트 자동 생성 버튼들 */}
                <div className="space-y-4">
                  <Label>
                    AI 프롬프트 자동 생성
                  </Label>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    아래 버튼들을 클릭하여 영어 프롬프트를 자동으로 추가하세요
                  </p>
                  
                  {Object.entries(promptAutoGenButtons).map(([category, buttons]) => (
                    <div key={category} className="space-y-2">
                      <h4 
                        className="text-sm font-medium"
                        style={{ color: "var(--color-text-primary)" }}
                      >
                        {category === 'gender' ? '성별' :
                         category === 'age' ? '연령' :
                         category === 'appearance' ? '외모' :
                         category === 'emotion' ? '감정/표정' :
                         category === 'style' ? '스타일' :
                         category === 'lighting' ? '조명' :
                         category === 'background' ? '배경' : category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {buttons.map((button, index) => {
                          const buttonId = `${category}-${index}`;
                          const isClicked = clickedButton === buttonId;
                          
                          return (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentPrompt = formData.prompt || "";
                                const newPrompt = currentPrompt 
                                  ? `${currentPrompt}, ${button.value}`
                                  : button.value;
                                handleInputChange('prompt', newPrompt);
                                
                                // 클릭 효과
                                setClickedButton(buttonId);
                                setTimeout(() => setClickedButton(null), 200);
                              }}
                              style={{
                                borderRadius: "var(--radius-6)",
                                borderColor: isClicked ? "var(--color-brand-primary)" : "var(--color-border-primary)",
                                fontSize: "var(--font-size-small)",
                                padding: "6px 12px",
                                height: "auto",
                                backgroundColor: isClicked ? "var(--color-brand-primary)" : "transparent",
                                color: isClicked ? "var(--color-utility-white)" : "var(--color-text-primary)",
                                transform: isClicked ? "scale(0.95)" : "scale(1)",
                                transition: "all 0.15s ease-in-out",
                                boxShadow: isClicked ? "0 2px 8px rgba(0,0,0,0.2)" : "none"
                              }}
                              className="hover:scale-105 active:scale-95"
                            >
                              <Plus className={`w-3 h-3 mr-1 transition-transform duration-150 ${
                                isClicked ? 'rotate-45' : ''
                              }`} />
                              {button.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="prompt">
                      AI 프롬프트 <span style={{ color: 'var(--color-semantic-red)' }}>*</span>
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange('prompt', "")}
                      style={{
                        borderRadius: "var(--radius-6)",
                        fontSize: "var(--font-size-small)",
                        height: "32px",
                        padding: "0 12px"
                      }}
                    >
                      초기화
                    </Button>
                  </div>
                  <Textarea
                    id="prompt"
                    value={formData.prompt}
                    onChange={(e) => handleInputChange('prompt', e.target.value)}
                    placeholder="예: beautiful young woman, professional model, natural lighting, studio background, high quality portrait..."
                    className="min-h-32"
                    style={{
                      borderRadius: 'var(--radius-8)',
                      borderColor: 'var(--color-border-primary)',
                      backgroundColor: 'var(--color-input-background)',
                      fontFamily: 'var(--font-family-monospace)',
                      fontSize: 'var(--font-size-small)'
                    }}
                  />
                  <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                    위의 자동 생성 버튼을 사용하거나 직접 영어 프롬프트를 입력하세요. 영어로 작성하면 더 정확한 결과를 얻을 수 있습니다.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <Button 
                onClick={() => setStep('details')}
                disabled={!isBasicValid}
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-utility-white)',
                  borderRadius: 'var(--radius-8)',
                  border: 'none',
                  opacity: !isBasicValid ? 0.6 : 1
                }}
              >
                다음 단계
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 'details' && (
          <div className="space-y-6">
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <h3 
                className="mb-6"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                판매 및 공개 설정
              </h3>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="price">판매 가격 (포인트)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                      min="10"
                      max="1000"
                      className="w-32"
                      style={{
                        borderRadius: 'var(--radius-8)',
                        borderColor: 'var(--color-border-primary)',
                        backgroundColor: 'var(--color-input-background)',
                        height: '40px'
                      }}
                    />
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      P (추천: 50-200P)
                    </span>
                  </div>
                  <p 
                    className="text-xs mt-2 p-3 rounded-lg"
                    style={{ 
                      color: 'var(--color-text-tertiary)',
                      backgroundColor: 'var(--color-background-secondary)'
                    }}
                  >
                    <Info className="w-4 h-4 inline mr-2" />
                    모델이 사용될 때마다 가격의 70%를 수익으로 받게 됩니다 (플랫폼 수수료 30%)
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                        공개 설정
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                        다른 사용자가 이 모델을 찾을 수 있도록 허용
                      </p>
                    </div>
                    <Switch
                      checked={formData.isPublic}
                      onCheckedChange={(checked: boolean) => handleInputChange('isPublic', checked)}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-between gap-3">
              <Button 
                variant="outline"
                onClick={() => setStep('basic')}
                style={{
                  borderRadius: 'var(--radius-8)',
                  borderColor: 'var(--color-border-primary)'
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전 단계
              </Button>
              <Button 
                onClick={handleGeneratePreview}
                disabled={isGenerating}
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-utility-white)',
                  borderRadius: 'var(--radius-8)',
                  border: 'none',
                  opacity: isGenerating ? 0.6 : 1,
                  minWidth: '180px'
                }}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    AI 이미지 생성 중...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    미리보기 생성
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 'preview' && (
          <div className="space-y-6">
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <h3 
                className="mb-6"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                생성된 모델 미리보기
              </h3>

              {previewImages.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div 
                      className="w-96 h-96 rounded-lg overflow-hidden"
                      style={{ backgroundColor: 'var(--color-background-secondary)' }}
                    >
                      <img 
                        src={previewImages[0]} 
                        alt="Generated Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('이미지 로드 실패:', previewImages[0]);
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b1ff?w=400&h=400&fit=crop';
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 
                      className="mb-2"
                      style={{
                        fontSize: 'var(--font-size-regular)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)'
                      }}
                    >
                      생성된 AI 모델 미리보기
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      AI가 생성한 모델 이미지입니다. 마켓플레이스에 출시할 준비가 되었습니다.
                    </p>
                  </div>
                </div>
              ) : (
                <div 
                  className="aspect-video rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-background-secondary)' }}
                >
                  <div className="text-center">
                    <ImageIcon 
                      className="w-12 h-12 mx-auto mb-4"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    />
                    <p style={{ color: 'var(--color-text-tertiary)' }}>
                      미리보기 이미지가 생성되지 않았습니다
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 
                    className="mb-3"
                    style={{
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    모델 정보
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-text-tertiary)' }}>이름</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-text-tertiary)' }}>판매 가격</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>{formData.price}P</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-text-tertiary)' }}>예상 수익</span>
                      <span style={{ color: 'var(--color-semantic-green)' }}>{Math.floor(formData.price * 0.7)}P</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div 
              className="p-4 rounded-lg border-2 border-dashed"
              style={{
                borderColor: 'var(--color-semantic-green)',
                backgroundColor: 'var(--color-semantic-green)' + '10'
              }}
            >
              <div className="flex items-center gap-3">
                <CheckCircle 
                  className="w-6 h-6"
                  style={{ color: 'var(--color-semantic-green)' }}
                />
                <div>
                  <h4 
                    style={{
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    모델 생성 완료!
                  </h4>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    모델을 마켓플레이스에 출시하면 100P의 보너스 포인트를 받게 됩니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <Button 
                variant="outline"
                onClick={() => setStep('details')}
                style={{
                  borderRadius: 'var(--radius-8)',
                  borderColor: 'var(--color-border-primary)'
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                수정하기
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-utility-white)',
                  borderRadius: 'var(--radius-8)',
                  border: 'none',
                  opacity: isSubmitting ? 0.6 : 1
                }}
              >
                {isSubmitting ? (
                  <>
                    <Save className="w-4 h-4 mr-2 animate-spin" />
                    출시 중...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    마켓플레이스에 출시
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}