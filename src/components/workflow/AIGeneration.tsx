import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ArrowLeft, Sparkles, CheckCircle, Clock, Zap } from 'lucide-react';
import { ProductImage, StyleSettings } from '../ImageGenerationWorkflow';

interface AIGenerationProps {
  productImages: ProductImage[];
  styleSettings: StyleSettings;
  onGenerationComplete: (images: string[]) => void;
  onBack: () => void;
}

const generationSteps = [
  { id: 'analysis', label: '제품 분석', description: 'AI가 제품의 특성을 분석하고 있습니다' },
  { id: 'background', label: '배경 제거', description: '제품에서 배경을 깔끔하게 분리하고 있습니다' },
  { id: 'model', label: '모델 생성', description: '선택한 스타일에 맞는 AI 모델을 생성하고 있습니다' },
  { id: 'composite', label: '합성', description: '제품과 모델, 배경을 자연스럽게 합성하고 있습니다' },
  { id: 'enhance', label: '품질 향상', description: '이미지 품질을 향상시키고 최적화하고 있습니다' }
];

// Mock generated images
const mockGeneratedImages = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=600&fit=crop'
];

export function AIGeneration({ productImages, styleSettings, onGenerationComplete, onBack }: AIGenerationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  useEffect(() => {
    let stepTimer: NodeJS.Timeout;
    
    if (currentStep < generationSteps.length && !isComplete) {
      stepTimer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000);
    } else if (currentStep >= generationSteps.length && !isComplete) {
      // Generation complete
      setTimeout(() => {
        setGeneratedImages(mockGeneratedImages);
        setIsComplete(true);
      }, 1000);
    }

    return () => clearTimeout(stepTimer);
  }, [currentStep, isComplete]);

  const handleViewResults = () => {
    onGenerationComplete(generatedImages);
  };

  const progress = isComplete ? 100 : Math.min((currentStep / generationSteps.length) * 100, 95);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI 이미지 생성</h1>
          <p className="text-muted-foreground">
            선택하신 스타일로 제품 이미지를 생성하고 있습니다
          </p>
        </div>
        <Button variant="outline" onClick={onBack} disabled={!isComplete && currentStep > 0}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          이전
        </Button>
      </div>

      {/* Generation Progress */}
      <Card className="p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            {isComplete ? (
              <CheckCircle className="w-10 h-10 text-green-500" />
            ) : (
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isComplete ? '생성 완료!' : '이미지 생성 중...'}
          </h2>
          <p className="text-muted-foreground">
            {isComplete ? '고품질 제품 이미지가 준비되었습니다' : '잠시만 기다려주세요'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <Progress value={progress} className="flex-1 h-3" />
            <Badge variant="outline">{Math.round(progress)}%</Badge>
          </div>

          {/* Generation Steps */}
          <div className="space-y-3">
            {generationSteps.map((step, index) => {
              const isActive = index === currentStep && !isComplete;
              const isCompleted = index < currentStep || isComplete;
              const isPending = index > currentStep && !isComplete;

              return (
                <div key={step.id} className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                  isActive ? 'bg-primary/5 border border-primary/20' : 
                  isCompleted ? 'bg-green-50 dark:bg-green-950/20' : 
                  'bg-muted/50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-primary text-primary-foreground' :
                    'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isActive ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${isActive ? 'text-primary' : ''}`}>
                      {step.label}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Preview Generated Images */}
      {generatedImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-center">생성된 이미지 미리보기</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {generatedImages.map((imageUrl, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted border-2 border-green-200">
                <img 
                  src={imageUrl} 
                  alt={`Generated ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
              <Sparkles className="w-4 h-4 mr-2" />
              {generatedImages.length}개의 고품질 이미지가 생성되었습니다
            </Badge>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-center pt-8">
        <Button 
          size="lg" 
          onClick={handleViewResults}
          disabled={!isComplete}
          className="min-w-48"
        >
          {isComplete ? (
            <>
              <Zap className="w-4 h-4 mr-2" />
              결과 확인 및 편집
            </>
          ) : (
            '생성 중...'
          )}
        </Button>
      </div>
    </div>
  );
}