import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ProgressIndicator } from '../ui/progress-indicator';
import { ArrowLeft, Upload, Palette, Sparkles, Edit, Download, User } from 'lucide-react';
import { WorkflowStep } from '../ImageGenerationWorkflow';
import { SelectedModel } from '../../App';

interface WorkflowHeaderProps {
  currentStep: WorkflowStep;
  selectedCategory: string;
  selectedModel: SelectedModel | null;
  onBack: () => void;
}

const steps = [
  { id: 'upload', label: '업로드', icon: Upload },
  { id: 'style', label: '스타일 선택', icon: Palette },
  { id: 'generate', label: 'AI 생성', icon: Sparkles },
  { id: 'edit', label: '편집', icon: Edit },
  { id: 'download', label: '다운로드', icon: Download }
];

const categoryNames: Record<string, string> = {
  fashion: '패션',
  electronics: '전자제품',
  beauty: '뷰티',
  home: '홈&리빙',
  food: '식품',
  lifestyle: '라이프스타일'
};

export function WorkflowHeader({ currentStep, selectedCategory, selectedModel, onBack }: WorkflowHeaderProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <header 
      className="linear-header sticky top-0 z-50"
      style={{
        backgroundColor: 'var(--color-header-background)',
        borderBottom: `1px solid var(--color-header-border)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      <div className="linear-container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onBack} 
              className="p-2"
              style={{
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-8)'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <h1 
                style={{
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                NoModel
              </h1>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary"
                  style={{
                    backgroundColor: 'var(--color-background-tertiary)',
                    color: 'var(--color-text-secondary)',
                    borderRadius: 'var(--radius-6)',
                    fontSize: 'var(--font-size-mini)',
                    fontWeight: 'var(--font-weight-medium)',
                    padding: '4px 8px'
                  }}
                >
                  {categoryNames[selectedCategory] || selectedCategory}
                </Badge>
                {selectedModel && (
                  <Badge 
                    variant="outline"
                    className="flex items-center gap-2"
                    style={{
                      borderColor: 'var(--color-brand-primary)',
                      color: 'var(--color-brand-primary)',
                      borderRadius: 'var(--radius-6)',
                      fontSize: 'var(--font-size-mini)',
                      fontWeight: 'var(--font-weight-medium)',
                      padding: '4px 8px'
                    }}
                  >
                    <div 
                      className="w-4 h-4 rounded-full overflow-hidden"
                      style={{ 
                        backgroundColor: 'var(--color-background-tertiary)',
                        border: `1px solid var(--color-border-primary)`
                      }}
                    >
                      <img 
                        src={selectedModel.imageUrl} 
                        alt={selectedModel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {selectedModel.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Progress Steps */}
          <ProgressIndicator 
            steps={steps} 
            currentStep={currentStep}
            className="hidden md:flex"
          />

          {/* Mobile Progress */}
          <ProgressIndicator 
            steps={steps} 
            currentStep={currentStep}
            variant="compact"
            className="md:hidden"
          />
        </div>

        {/* Mobile Step Name */}
        <div className="md:hidden pb-3">
          <div className="flex items-center gap-2">
            {React.createElement(steps[currentStepIndex]?.icon, { 
              className: "w-4 h-4", 
              style: { color: 'var(--color-brand-primary)' }
            })}
            <span 
              className="text-sm"
              style={{
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)'
              }}
            >
              {steps[currentStepIndex]?.label}
            </span>
            {selectedModel && (
              <span 
                className="text-sm mx-2"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                •
              </span>
            )}
            {selectedModel && (
              <span 
                className="text-sm"
                style={{ 
                  color: 'var(--color-brand-primary)',
                  fontWeight: 'var(--font-weight-medium)'
                }}
              >
                {selectedModel.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}