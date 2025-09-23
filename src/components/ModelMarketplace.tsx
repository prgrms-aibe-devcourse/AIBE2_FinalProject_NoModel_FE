import React, { useState } from 'react';
import { NavigationBar } from './NavigationBar';
import { 
  ShoppingCart
} from 'lucide-react';
import { UserProfile, SelectedModel, UserModel } from '../App';
import { AIModelBrowser } from './AIModelBrowser';
import { ModelReportModal } from './ModelReportModal';
import { AIModelDocument, AIModelSearchResponse } from '../types/model';
import { getModelFullDetail } from '../services/modelApi';

interface ModelMarketplaceProps {
  userProfile: UserProfile | null;
  onBack: () => void;
  onModelPurchase: (model: SelectedModel) => void;
  onCreateModel: () => void;
  onModelReport: (model: UserModel) => void;
  onLogin: () => void;
  onLogout: () => void;
  onAdGeneration: () => void;
  onMyPage: () => void;
  onAdmin?: () => void;
  onPointsSubscription?: () => void;
}


export function ModelMarketplace({ 
  userProfile, 
  onBack, 
  onModelPurchase, 
  onCreateModel, 
  onModelReport,
  onLogin,
  onLogout,
  onAdGeneration,
  onMyPage,
  onAdmin,
  onPointsSubscription
}: ModelMarketplaceProps) {
  const [reportingModel, setReportingModel] = useState<AIModelSearchResponse | null>(null);

  const handleSearchModelSelect = async (model: AIModelSearchResponse) => {
    try {
      console.log('모델 선택됨:', model.modelName, '모델 ID:', model.modelId);
      console.log('전체 모델 데이터:', model);
      
      // 올바른 API를 사용해서 모델의 파일 정보 조회
      const modelDetailResponse = await getModelFullDetail(model.modelId);
      
      if (!modelDetailResponse.success || !modelDetailResponse.response) {
        throw new Error('모델 상세 정보를 가져올 수 없습니다.');
      }
      
      const modelDetail = modelDetailResponse.response;
      console.log('모델 상세 정보:', modelDetail);
      
      if (!modelDetail.files || modelDetail.files.length === 0) {
        throw new Error('모델 파일 정보를 찾을 수 없습니다.');
      }
      
      // 첫 번째 파일의 fileId를 사용
      const firstFile = modelDetail.files[0];
      const fileId = firstFile.fileId;
      
      console.log('사용할 파일 ID:', fileId);
      
      const selectedModel: SelectedModel = {
        id: model.modelId.toString(),
        name: model.modelName,
        prompt: model.prompt,
        seedValue: fileId.toString(), // 실제 file_id를 사용
        imageUrl: model.primaryImageUrl || (model.imageUrls && model.imageUrls.length > 0 ? model.imageUrls[0] : ''),
        category: model.ownType,
        isCustom: false,
        metadata: {
          age: '',
          gender: '',
          style: '',
          ethnicity: ''
        },
        // 가격 정보 추가
        price: model.price || 0,
        creator: {
          id: model.ownerId.toString(),
          name: model.ownerName
        }
      };
      
      console.log('변환된 SelectedModel:', selectedModel);
      onModelPurchase(selectedModel);
      
    } catch (error) {
      console.error('모델 선택 중 오류:', error);
      alert(`모델 선택 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  const handleAPIModelReport = (model: AIModelSearchResponse) => {
    setReportingModel(model);
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
        onModelCreation={onCreateModel}
        onMarketplace={() => {}}
        onMyPage={onMyPage}
        onAdmin={onAdmin}
        isAdmin={userProfile?.role === 'ADMIN'}
        onHome={onBack}
        onBack={onBack}
        showBackButton={true}
        isLoggedIn={!!userProfile}
        isLandingPage={false}
        onPointsSubscription={onPointsSubscription}
        userPoints={userProfile?.points}
        currentPage="marketplace"
      />

      {/* Main Content */}
      <main className="page-container">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart 
              className="w-8 h-8"
              style={{ color: 'var(--color-brand-primary)' }}
            />
            <div>
              <h1 style={{
                fontSize: 'var(--font-size-title1)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)'
              }}>
                마켓플레이스
              </h1>
            </div>
          </div>
          
        </div>

        {/* AI Model Browser */}
        <AIModelBrowser
          userProfile={userProfile}
          onModelSelect={handleSearchModelSelect}
          onModelReport={handleAPIModelReport}
          onLogin={onLogin}
        />
      </main>

      {/* Report Modal */}
      <ModelReportModal
        model={reportingModel}
        isOpen={!!reportingModel}
        onClose={() => setReportingModel(null)}
        onReportSuccess={(reportId) => {
          console.log('Report submitted with ID:', reportId);
        }}
      />
    </div>
  );
}