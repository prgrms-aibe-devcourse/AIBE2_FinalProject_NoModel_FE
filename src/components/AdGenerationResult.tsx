import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  ArrowLeft, Download,
  CheckCircle, RefreshCw
} from 'lucide-react';
import { UserProfile, UserModel } from '../App';
import { NavigationBar } from './NavigationBar';
import { buildApiUrl } from '@/config/env';

interface AdGenerationResultProps {
  userProfile: UserProfile | null;
  selectedModel: UserModel;
  originalImage: string;
  generatedImageUrl: string;
  resultFileId?: number; // 추가: compose API에서 받은 resultFileId
  additionalPrompt?: string;
  onBack: () => void;
  onNewGeneration: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onAdGeneration: () => void;
  onModelCreation: () => void;
  onMarketplace: () => void;
  onMyPage: () => void;
  onHome: () => void;
  onAdmin?: () => void;
}

export function AdGenerationResult({ 
  userProfile,
  selectedModel,
  originalImage,
  generatedImageUrl,
  resultFileId,
  additionalPrompt,
  onBack,
  onNewGeneration,
  onLogin, 
  onLogout, 
  onAdGeneration, 
  onModelCreation, 
  onMarketplace, 
  onMyPage, 
  onHome, 
  onAdmin 
}: AdGenerationResultProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      console.log('resultFileId:', resultFileId);
      
      if (resultFileId) {
        // buildApiUrl을 사용하여 다운로드 URL 생성
        const downloadUrl = buildApiUrl(`/files/${resultFileId}/download`);
        console.log('Download URL:', downloadUrl);
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `AI광고이미지_${Date.now()}.png`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('resultFileId가 없습니다.');
      }
    } catch (error) {
      console.error('다운로드 실패:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
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
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <CheckCircle 
              className="w-8 h-8"
              style={{ color: 'var(--color-semantic-green)' }}
            />
            <h1 
              style={{
                fontSize: 'var(--font-size-title1)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)'
              }}
            >
              AI 광고 이미지 생성 완료!
            </h1>
          </div>
          <p 
            className="text-lg"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            고품질의 광고 이미지가 성공적으로 생성되었습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Original Image */}
          <div>
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <h3 
                className="mb-4 text-center"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                원본 제품 이미지
              </h3>
              <img
                src={originalImage}
                alt="Original Product"
                className="w-full rounded-lg object-cover"
                style={{ aspectRatio: '1/1' }}
              />
            </Card>
          </div>

          {/* Center: Generated Image */}
          <div>
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-brand-primary)',
                borderWidth: '2px',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <h3 
                className="mb-4 text-center"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-brand-primary)'
                }}
              >
                생성된 AI 광고 이미지
              </h3>
              <div className="relative">
                <img
                  src={generatedImageUrl}
                  alt="Generated Ad"
                  className="w-full rounded-lg object-cover"
                  style={{ aspectRatio: '1/1' }}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="mt-4">
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full"
                  style={{
                    backgroundColor: 'var(--color-brand-primary)',
                    color: 'var(--color-utility-white)',
                    borderRadius: 'var(--radius-8)',
                    border: 'none'
                  }}
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      다운로드 중...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      다운로드
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right: Model & Details */}
          <div className="space-y-6">
            {/* Model Info */}
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
              <div className="text-center">
                <img
                  src={selectedModel.imageUrl}
                  alt={selectedModel.name}
                  className="w-32 h-32 mx-auto rounded-lg object-cover mb-3"
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

            {/* Generation Details */}
            {additionalPrompt && (
              <Card 
                className="p-6"
                style={{
                  backgroundColor: 'var(--color-background-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  borderRadius: 'var(--radius-16)'
                }}
              >
                <h4 
                  className="mb-3"
                  style={{
                    fontSize: 'var(--font-size-regular)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  추가 요청사항
                </h4>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {additionalPrompt}
                </p>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={onNewGeneration}
                className="w-full"
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-utility-white)',
                  borderRadius: 'var(--radius-8)',
                  border: 'none'
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                새로운 광고 이미지 생성
              </Button>
              <Button
                onClick={onMyPage}
                variant="outline"
                className="w-full"
                style={{
                  borderRadius: 'var(--radius-8)',
                  borderColor: 'var(--color-border-primary)'
                }}
              >
                내 프로젝트로 이동
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}