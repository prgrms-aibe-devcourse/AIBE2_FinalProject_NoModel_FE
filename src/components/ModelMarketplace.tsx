import React, { useState } from 'react';
import { NavigationBar } from './NavigationBar';
import { 
  ShoppingCart
} from 'lucide-react';
import { UserProfile, SelectedModel, UserModel } from '../App';
import { AIModelBrowser } from './AIModelBrowser';
import { ModelReportModal } from './ModelReportModal';
import { AIModelDocument } from '../types/model';

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
  onAdmin
}: ModelMarketplaceProps) {
  const [reportingModel, setReportingModel] = useState<AIModelDocument | null>(null);

  const handleSearchModelSelect = (model: AIModelDocument) => {
    const selectedModel: SelectedModel = {
      id: model.modelId.toString(),
      name: model.modelName,
      prompt: '',
      seedValue: '',
      imageUrl: model.thumbnailUrl || '',
      category: model.categoryType,
      isCustom: false,
      metadata: {
        age: '',
        gender: '',
        style: '',
        ethnicity: ''
      }
    };
    onModelPurchase(selectedModel);
  };

  const handleAPIModelReport = (model: AIModelDocument) => {
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
        userPoints={userProfile?.points}
        currentPage="marketplace"
      />

      {/* Main Content */}
      <main className="py-8 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
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