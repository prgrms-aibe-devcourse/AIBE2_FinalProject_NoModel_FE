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
import { buildApiUrl } from '@/config/env';
import { getModelFullDetail } from '../services/modelApi';
import { pointApiService } from '../services/pointApi';
import { toast } from 'sonner';

interface ProductImageUploadProps {
  userProfile: UserProfile | null;
  selectedModel: UserModel;
  onBack: () => void;
  onGenerateAd: (productImages: string[], resultFileId: number, additionalPrompt?: string) => void; // resultFileId 추가
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'removing_bg' | 'composing' | 'completed'>('upload');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // 첫 번째 파일만 선택
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
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

  const removeImage = () => {
    setUploadedImage(null);
  };

  const handleGenerate = async () => {
    if (!uploadedImage) {
      alert('제품 이미지를 업로드해주세요.');
      return;
    }

    // 포인트 차감 로직 추가
    const requiredPoints = selectedModel.price || 0;
    
    if (requiredPoints > 0) {
      try {
        // 1. 포인트 잔액 확인
        const pointCheck = await pointApiService.checkSufficientPoints(requiredPoints);
        
        if (!pointCheck.sufficient) {
          toast.error(`포인트가 부족합니다. 필요한 포인트: ${requiredPoints.toLocaleString()}, 보유 포인트: ${pointCheck.currentBalance.toLocaleString()}`);
          return;
        }
        
        // 2. 포인트 차감
        const usePointsResponse = await pointApiService.usePoints({
          amount: requiredPoints,
          refererId: parseInt(selectedModel.id) // 모델 ID를 참조 ID로 사용
        });
        
        if (!usePointsResponse.success) {
          toast.error(usePointsResponse.error || '포인트 차감에 실패했습니다.');
          return;
        }
        
        toast.success(`${requiredPoints.toLocaleString()} 포인트가 차감되었습니다. 남은 포인트: ${usePointsResponse.response.remainingPoints.toLocaleString()}`);
        
      } catch (error) {
        console.error('포인트 처리 오류:', error);
        toast.error(`포인트 처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        return;
      }
    }

    setIsGenerating(true);
    setCurrentStep('upload');
    
    try {
      // Step 1: 이미지 업로드
      console.log('Step 1: 이미지 업로드 중...');
      const uploadedFileId = await uploadProductImage(uploadedImage);
      console.log('업로드된 파일 ID:', uploadedFileId);
      
      // Step 2: 배경 제거
      setCurrentStep('removing_bg');
      console.log('Step 2: 배경 제거 중...');
      const removeBgJobId = await requestBackgroundRemoval(uploadedFileId);
      const removeBgResult = await pollJobStatus(removeBgJobId);
      console.log('배경 제거 결과:', removeBgResult);
      
      if (removeBgResult.status !== 'SUCCEEDED' || !removeBgResult.resultFileId) {
        throw new Error('배경 제거에 실패했습니다.');
      }
      
      // Step 3: 모델과 합성
      setCurrentStep('composing');
      console.log('Step 3: 모델과 합성 중...');
      
      // selectedModel의 seedValue가 이미 file_id를 담고 있어야 함
      let modelFileId: number;
      
      // seedValue에서 file_id 가져오기 (마켓플레이스에서 이미 설정됨)
      if (selectedModel.seedValue && !isNaN(parseInt(selectedModel.seedValue))) {
        modelFileId = parseInt(selectedModel.seedValue);
        console.log('모델 파일 ID (seedValue에서):', modelFileId);
      } else if (selectedModel.fileId) {
        // 기존 방식 (fileId 필드가 있는 경우)
        modelFileId = selectedModel.fileId;
        console.log('모델 파일 ID (fileId에서):', modelFileId);
      } else {
        // 마지막 수단: API를 사용해서 모델의 파일 정보를 조회
        console.log('모델의 파일 ID를 조회 중... 모델 ID:', selectedModel.id);
        const modelDetailResponse = await getModelFullDetail(parseInt(selectedModel.id));
        
        if (!modelDetailResponse.success || !modelDetailResponse.response || !modelDetailResponse.response.files || modelDetailResponse.response.files.length === 0) {
          throw new Error('모델 파일을 찾을 수 없습니다.');
        }
        
        modelFileId = modelDetailResponse.response.files[0].fileId;
        console.log('모델 파일 ID (API 조회해서 가져옴):', modelFileId);
      }
      
      // 기본 프롬프트에 사용자의 추가 요청사항을 이어붙이기
      let customPrompt = '모델의 복장,표정 등은 그대로 유지하고 이 제품을 자연스럽게 광고하는 사진으로 바꿔줘.';
      
      // 사용자가 추가 요청사항을 입력했다면 기본 프롬프트에 추가
      if (additionalPrompt && additionalPrompt.trim()) {
        customPrompt += ` ${additionalPrompt.trim()}`;
      }
      
      const composeResult = await composeImage(
        removeBgResult.resultFileId,
        modelFileId,
        customPrompt
      );
      
      console.log('최종 사용할 모델 파일 ID:', modelFileId);
      console.log('합성 결과:', composeResult);
      
      if (composeResult.status !== 'SUCCEEDED' || !composeResult.resultFileUrl) {
        throw new Error('이미지 합성에 실패했습니다.');
      }
      
      setCurrentStep('completed');
      setGeneratedImageUrl(composeResult.resultFileUrl);
      
      // 완료 후 3초 뒤에 결과 화면으로 이동
      setTimeout(() => {
        // composeResult에서 resultFileId를 추출해서 전달
        const resultFileId = composeResult.resultFileId || composeResult.fileId;
        
        onGenerateAd([uploadedImage, composeResult.resultFileUrl], resultFileId, additionalPrompt);
      }, 3000);
      
    } catch (error) {
      console.error('광고 이미지 생성 오류:', error);
      alert(`광고 이미지 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      setIsGenerating(false);
      setCurrentStep('upload');
    }
  };
  
  // 이미지 업로드 함수
  const uploadProductImage = async (imageDataUrl: string): Promise<number> => {
    // Data URL을 File 객체로 변환
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    const file = new File([blob], 'product.png', { type: 'image/png' });
    
    const formData = new FormData();
    formData.append('file', file);
    
    const uploadResponse = await fetch(buildApiUrl('/files'), {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`파일 업로드 실패: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }
    
    const uploadResult = await uploadResponse.json();
    return uploadResult.fileId;
  };
  
  // 배경 제거 요청 함수
  const requestBackgroundRemoval = async (fileId: number): Promise<string> => {
    const response = await fetch(buildApiUrl('/generate/remove-bg'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileId }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`배경 제거 요청 실패: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.jobId;
  };
  
  // 작업 상태 폴링 함수
  const pollJobStatus = async (jobId: string, maxAttempts: number = 30): Promise<any> => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response = await fetch(buildApiUrl(`/generate/jobs/${jobId}`), {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`작업 상태 확인 실패: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.status === 'SUCCEEDED' || result.status === 'FAILED') {
        return result;
      }
      
      // 2초 대기 후 다시 확인
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('작업 완료 대기 시간 초과');
  };
  
  // 이미지 합성 함수
  const composeImage = async (productFileId: number, modelFileId: number, customPrompt: string): Promise<any> => {
    const response = await fetch(buildApiUrl('/compose/compose'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productFileId,
        modelFileId,
        customPrompt
      }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`이미지 합성 요청 실패: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
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

              {/* Upload Area - 이미지가 업로드되지 않았을 때만 표시 */}
              {!uploadedImage && (
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
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />

              {/* Uploaded Image */}
              {uploadedImage && (
                <div className="mt-6">
                  <h4 
                    className="mb-3"
                    style={{
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    업로드된 이미지
                  </h4>
                  <div className="relative group w-36 mx-auto">
                    <img
                      src={uploadedImage}
                      alt="Product"
                      className="w-full rounded-lg"
                      style={{ 
                        backgroundColor: 'var(--color-background-tertiary)',
                        aspectRatio: '1/1',
                        objectFit: 'contain'
                      }}
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        backgroundColor: 'var(--color-semantic-red)',
                        color: 'var(--color-utility-white)'
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
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

            {/* Generate Button */}
            {/* 가격 정보 표시 */}
            {selectedModel.price && selectedModel.price > 0 && (
              <Card 
                className="p-4 mb-4"
                style={{
                  backgroundColor: 'var(--color-background-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  borderRadius: 'var(--radius-12)'
                }}
              >
                <div className="flex items-center justify-between">
                  <span 
                    style={{ 
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-small)' 
                    }}
                  >
                    이미지 생성 비용
                  </span>
                  <span 
                    style={{ 
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-semibold)' 
                    }}
                  >
                    {selectedModel.price.toLocaleString()} 포인트
                  </span>
                </div>
              </Card>
            )}
            
            <Button
              onClick={handleGenerate}
              disabled={!uploadedImage || isGenerating}
              className="w-full h-12"
              style={{
                backgroundColor: 'var(--color-brand-primary)',
                color: 'var(--color-utility-white)',
                borderRadius: 'var(--radius-8)',
                border: 'none',
                opacity: (!uploadedImage || isGenerating) ? 0.6 : 1,
                fontSize: 'var(--font-size-regular)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {currentStep === 'upload' && 'AI 광고 이미지 생성 중...'}
                  {currentStep === 'removing_bg' && '제품 이미지 배경 제거 중...'}
                  {currentStep === 'composing' && '모델과 제품 합성 중...'}
                  {currentStep === 'completed' && '광고 이미지 생성 완료!'}
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 mr-2" />
                  {selectedModel.price && selectedModel.price > 0 
                    ? `AI 광고 이미지 생성하기 (${selectedModel.price.toLocaleString()} 포인트)`
                    : 'AI 광고 이미지 생성하기'
                  }
                </>
              )}
            </Button>

            {!uploadedImage && (
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
