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
      
      // 파일 ID 처리
      let fileId: string;
      if (modelDetail.files && modelDetail.files.length > 0) {
        fileId = modelDetail.files[0].fileId.toString();
      } else {
        // 파일이 없을 때 fallback 처리
        console.warn('⚠️ 모델 파일이 없어 기본값으로 처리합니다.');
        fileId = '0'; // 기본값
      }
      // 이미지 처리 (없을 때 fallback 이미지 사용)
      const imageUrl =
      model.primaryImageUrl ||
      (model.imageUrls && model.imageUrls.length > 0
        ? model.imageUrls[0]
        : 'https://img.icons8.com/ios/50/empty_1.png');
      
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
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
            
            {/* 직접 모델 만들기 버튼 */}
            <button
              onClick={onCreateModel}
              className="px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md"
              style={{
                backgroundColor: 'var(--color-brand-primary)',
                color: 'var(--color-utility-white)',
                borderRadius: 'var(--radius-8)',
                border: 'none',
                fontSize: 'var(--font-size-small)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              + 직접 모델 만들기
            </button>
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