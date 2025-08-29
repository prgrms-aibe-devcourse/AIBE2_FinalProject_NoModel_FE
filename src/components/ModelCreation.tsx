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
  ArrowLeft, Sparkles, Upload, Wand2, Save, Eye, 
  Image as ImageIcon, Tags, Coins, Users, Globe,
  AlertTriangle, Info, CheckCircle
} from 'lucide-react';
import { UserProfile, UserModel } from '../App';

interface ModelCreationProps {
  userProfile: UserProfile | null;
  onBack: () => void;
  onModelCreated: (model: UserModel) => void;
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

export function ModelCreation({ userProfile, onBack, onModelCreated }: ModelCreationProps) {
  const [step, setStep] = useState<'basic' | 'details' | 'preview'>('basic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    // Simulate AI generation
    setTimeout(() => {
      // Mock generated images
      const mockImages = [
        'https://images.unsplash.com/photo-1494790108755-2616b612b1ff?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
      ];
      setPreviewImages(mockImages);
      setSeedValue(Math.random().toString().slice(2, 7));
      setIsGenerating(false);
      setStep('preview');
    }, 3000);
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
        category: formData.category,
        metadata: {
          age: formData.age,
          gender: formData.gender,
          style: formData.style,
          ethnicity: formData.ethnicity
        },
        creatorId: userProfile.id,
        creatorName: userProfile.name,
        creatorAvatar: userProfile.avatar,
        price: formData.price,
        usageCount: 0,
        rating: 0,
        ratingCount: 0,
        tags: formData.tags,
        isPublic: formData.isPublic,
        isForSale: formData.isForSale,
        createdAt: new Date(),
        updatedAt: new Date(),
        earnings: 0
      };

      onModelCreated(newModel);
      setIsSubmitting(false);
    }, 2000);
  };

  const isBasicValid = formData.name && formData.description && formData.prompt && formData.category;
  const isDetailsValid = formData.age && formData.gender && formData.ethnicity && formData.style;

  if (!userProfile) {
    return <div>Loading...</div>;
  }

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
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--color-background-secondary)' }}>
              <Coins className="w-4 h-4" style={{ color: 'var(--color-semantic-orange)' }} />
              <span style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)' }}>
                {userProfile.points.toLocaleString()}P
              </span>
            </div>
            <Badge 
              style={{
                backgroundColor: 'var(--color-brand-accent-tint)',
                color: 'var(--color-brand-primary)',
                borderRadius: 'var(--radius-rounded)',
                fontSize: 'var(--font-size-small)',
                fontWeight: 'var(--font-weight-medium)',
                padding: '8px 16px'
              }}
            >
              AI 모델 생성
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 max-w-4xl mx-auto" style={{ paddingInline: 'var(--spacing-page-padding-inline)' }}>
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
                {step === 'details' && '모델 세부 설정'}
                {step === 'preview' && '미리보기 및 출시'}
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {step === 'basic' && '모델의 기본 정보와 프롬프트를 설정하세요'}
                {step === 'details' && '모델의 특성과 판매 설정을 완료하세요'}
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

                <div>
                  <Label htmlFor="category">
                    카테고리 <span style={{ color: 'var(--color-semantic-red)' }}>*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="prompt">
                    AI 프롬프트 <span style={{ color: 'var(--color-semantic-red)' }}>*</span>
                  </Label>
                  <Textarea
                    id="prompt"
                    value={formData.prompt}
                    onChange={(e) => handleInputChange('prompt', e.target.value)}
                    placeholder="professional young asian woman, studio lighting, clean background, high quality portrait"
                    className="mt-2 min-h-32"
                    style={{
                      borderRadius: 'var(--radius-8)',
                      borderColor: 'var(--color-border-primary)',
                      backgroundColor: 'var(--color-input-background)',
                      fontFamily: 'var(--font-family-monospace)',
                      fontSize: 'var(--font-size-small)'
                    }}
                  />
                  <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                    영어로 작성하면 더 정확한 결과를 얻을 수 있습니다
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
                모델 특성
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="age">
                    연령대 <span style={{ color: 'var(--color-semantic-red)' }}>*</span>
                  </Label>
                  <Select value={formData.age} onValueChange={(value) => handleInputChange('age', value)}>
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="연령대 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gender">
                    성별 <span style={{ color: 'var(--color-semantic-red)' }}>*</span>
                  </Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="성별 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ethnicity">
                    인종 <span style={{ color: 'var(--color-semantic-red)' }}>*</span>
                  </Label>
                  <Select value={formData.ethnicity} onValueChange={(value) => handleInputChange('ethnicity', value)}>
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="인종 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {ethnicityOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="style">
                    스타일 <span style={{ color: 'var(--color-semantic-red)' }}>*</span>
                  </Label>
                  <Select value={formData.style} onValueChange={(value) => handleInputChange('style', value)}>
                    <SelectTrigger className="mt-2 h-12">
                      <SelectValue placeholder="스타일 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

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
                태그 및 설정
              </h3>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="tags">검색 태그</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="태그 입력"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      style={{
                        borderRadius: 'var(--radius-8)',
                        borderColor: 'var(--color-border-primary)',
                        backgroundColor: 'var(--color-input-background)',
                        height: '40px'
                      }}
                    />
                    <Button 
                      onClick={addTag}
                      variant="outline"
                      disabled={!currentTag.trim()}
                    >
                      추가
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag) => (
                        <Badge 
                          key={tag}
                          className="cursor-pointer"
                          onClick={() => removeTag(tag)}
                          style={{
                            backgroundColor: 'var(--color-brand-accent-tint)',
                            color: 'var(--color-brand-primary)',
                            borderRadius: 'var(--radius-rounded)'
                          }}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                    {formData.tags.length}/10 개 태그
                  </p>
                </div>

                <Separator />

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
                      onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                        판매 허용
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                        다른 사용자가 포인트로 이 모델을 구매할 수 있도록 허용
                      </p>
                    </div>
                    <Switch
                      checked={formData.isForSale}
                      onCheckedChange={(checked) => handleInputChange('isForSale', checked)}
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
                disabled={!isDetailsValid || isGenerating}
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-utility-white)',
                  borderRadius: 'var(--radius-8)',
                  border: 'none',
                  opacity: (!isDetailsValid || isGenerating) ? 0.6 : 1
                }}
              >
                {isGenerating ? (
                  <>
                    <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                    AI 생성 중...
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {previewImages.map((image, index) => (
                    <div 
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden"
                      style={{ backgroundColor: 'var(--color-background-secondary)' }}
                    >
                      <img 
                        src={image} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
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
                      <span style={{ color: 'var(--color-text-tertiary)' }}>카테고리</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>
                        {categoryOptions.find(c => c.value === formData.category)?.label}
                      </span>
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

                <div>
                  <h4 
                    className="mb-3"
                    style={{
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    모델 특성
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-text-tertiary)' }}>연령대</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>{formData.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-text-tertiary)' }}>성별</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>{formData.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-text-tertiary)' }}>인종</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>{formData.ethnicity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-text-tertiary)' }}>스타일</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>{formData.style}</span>
                    </div>
                  </div>
                </div>
              </div>

              {formData.tags.length > 0 && (
                <div className="mt-4">
                  <h4 
                    className="mb-3"
                    style={{
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    태그
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge 
                        key={tag}
                        style={{
                          backgroundColor: 'var(--color-background-tertiary)',
                          color: 'var(--color-text-secondary)',
                          borderRadius: 'var(--radius-rounded)'
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
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