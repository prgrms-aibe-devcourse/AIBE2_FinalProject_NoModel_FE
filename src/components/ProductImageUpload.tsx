import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft, Upload, Image as ImageIcon, Wand2, 
  X, Plus, FileImage, CheckCircle
} from 'lucide-react';
import { UserProfile, UserModel } from '../App';
import { NavigationBar } from './NavigationBar';

interface ProductImageUploadProps {
  userProfile: UserProfile | null;
  selectedModel: UserModel;
  onBack: () => void;
  onGenerateAd: (productImages: string[], additionalPrompt?: string) => void;
  onLogin: () => void;
  onLogout: () => void;
  onAdGeneration: () => void;
  onModelCreation: () => void;
  onMarketplace: () => void;
  onMyPage: () => void;
  onHome: () => void;
  onAdmin?: () => void;
}

export function ProductImageUpload({ 
  userProfile, 
  selectedModel, 
  onBack, 
  onGenerateAd,
  onLogin, 
  onLogout, 
  onAdGeneration, 
  onModelCreation, 
  onMarketplace, 
  onMyPage, 
  onHome, 
  onAdmin 
}: ProductImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (uploadedImages.length === 0) {
      alert('최소 1개의 제품 이미지를 업로드해주세요.');
      return;
    }

    setIsGenerating(true);
    
    try {
      // 2-3초 후에 광고 이미지 생성 완료
      await new Promise(resolve => setTimeout(resolve, 3000));
      onGenerateAd(uploadedImages, additionalPrompt);
    } catch (error) {
      console.error('광고 이미지 생성 오류:', error);
      alert('광고 이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

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
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 
            className="mb-4"
            style={{
              fontSize: 'var(--font-size-title1)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            }}
          >
            제품 이미지 업로드
          </h1>
          <p 
            className="text-lg mb-6"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            고품질의 제품 사진을 업로드해주세요. AI가 자동으로 배경을 제거하고 최적화합니다.
          </p>

          {/* Selected Model Info */}
          <div 
            className="inline-flex items-center gap-3 px-4 py-2 rounded-lg"
            style={{
              backgroundColor: 'var(--color-brand-primary)' + '10',
              borderColor: 'var(--color-brand-primary)',
              border: '1px solid'
            }}
          >
            <img 
              src={selectedModel.imageUrl} 
              alt={selectedModel.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span 
              style={{ 
                color: 'var(--color-brand-primary)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              선택된 AI 모델: {selectedModel.name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image Upload */}
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
                className="mb-4"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                제품 이미지 업로드
              </h3>

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragOver ? 'border-primary bg-primary/5' : 'border-gray-300'
                }`}
                style={{
                  borderColor: isDragOver ? 'var(--color-brand-primary)' : 'var(--color-border-secondary)',
                  backgroundColor: isDragOver ? 'var(--color-brand-primary)' + '05' : 'transparent'
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <FileImage 
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: 'var(--color-text-tertiary)' }}
                />
                <p 
                  className="mb-2"
                  style={{ 
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                >
                  이미지를 드래그하여 업로드
                </p>
                <p 
                  className="text-sm mb-4"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  또는 파일을 선택하세요
                </p>
                <Button
                  type="button"
                  style={{
                    backgroundColor: 'var(--color-brand-primary)',
                    color: 'var(--color-utility-white)',
                    borderRadius: 'var(--radius-8)',
                    border: 'none'
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  파일 선택하기
                </Button>
                <p 
                  className="text-xs mt-4"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  최대 10개 파일, 각 20MB 이하
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />

              {/* Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div className="mt-6">
                  <h4 
                    className="mb-3"
                    style={{
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    업로드된 이미지 ({uploadedImages.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            backgroundColor: 'var(--color-semantic-red)',
                            color: 'var(--color-utility-white)'
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Additional Prompt */}
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
                추가 요청사항 (선택)
              </h3>
              <div>
                <Label htmlFor="additional-prompt">
                  특별한 스타일이나 배경을 원하시나요?
                </Label>
                <Textarea
                  id="additional-prompt"
                  value={additionalPrompt}
                  onChange={(e) => setAdditionalPrompt(e.target.value)}
                  placeholder="예: 럭셔리한 느낌, 미니멀한 배경, 따뜻한 조명 등..."
                  className="mt-2 min-h-24"
                  style={{
                    borderRadius: 'var(--radius-8)',
                    borderColor: 'var(--color-border-primary)',
                    backgroundColor: 'var(--color-input-background)'
                  }}
                />
                <p 
                  className="text-xs mt-2"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  선택사항이며, 비워둬도 AI가 최적의 광고 이미지를 생성합니다.
                </p>
              </div>
            </Card>
          </div>

          {/* Right: Preview & Info */}
          <div className="space-y-6">
            {/* Model Preview */}
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
                선택된 AI 모델
              </h3>
              <div className="text-center">
                <img
                  src={selectedModel.imageUrl}
                  alt={selectedModel.name}
                  className="w-48 h-48 mx-auto rounded-lg object-cover mb-4"
                />
                <h4 
                  className="mb-2"
                  style={{
                    fontSize: 'var(--font-size-regular)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {selectedModel.name}
                </h4>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {selectedModel.description}
                </p>
              </div>
            </Card>

            {/* Generation Info */}
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-secondary)',
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
                생성될 광고 이미지
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-semantic-green)' }}
                  />
                  <span 
                    className="text-sm"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    AI 모델과 제품이 자연스럽게 합성
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-semantic-green)' }}
                  />
                  <span 
                    className="text-sm"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    고해상도 광고용 이미지 (1024x1024)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-semantic-green)' }}
                  />
                  <span 
                    className="text-sm"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    다양한 배경과 스타일 옵션
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-semantic-green)' }}
                  />
                  <span 
                    className="text-sm"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    상업적 이용 가능한 라이선스
                  </span>
                </div>
              </div>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={uploadedImages.length === 0 || isGenerating}
              className="w-full h-12"
              style={{
                backgroundColor: 'var(--color-brand-primary)',
                color: 'var(--color-utility-white)',
                borderRadius: 'var(--radius-8)',
                border: 'none',
                opacity: (uploadedImages.length === 0 || isGenerating) ? 0.6 : 1,
                fontSize: 'var(--font-size-regular)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  AI 광고 이미지 생성 중...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  AI 광고 이미지 생성하기
                </>
              )}
            </Button>

            {uploadedImages.length === 0 && (
              <p 
                className="text-center text-sm"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                제품 이미지를 업로드하면 생성 버튼이 활성화됩니다.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}