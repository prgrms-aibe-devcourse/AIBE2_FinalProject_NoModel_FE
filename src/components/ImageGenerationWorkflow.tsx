import React, { useState } from 'react';
import { ProductUpload } from './workflow/ProductUpload';
import { StyleSelection } from './workflow/StyleSelection';
import { AIGeneration } from './workflow/AIGeneration';
import { EditingTools } from './workflow/EditingTools';
import { ResultDownload } from './workflow/ResultDownload';
import { WorkflowHeader } from './workflow/WorkflowHeader';
import { SelectedModel, GeneratedProject } from '../App';


interface ImageGenerationWorkflowProps {
  selectedCategory: string;
  selectedModel: SelectedModel | null;
  onBack: () => void;
  onComplete?: (project: GeneratedProject) => void;
  selectedModel: { id: number } | null;
}

export type WorkflowStep = 'upload' | 'style' | 'generate' | 'edit' | 'download';

export interface ProductImage {
  id: string;
  file: File;
  url: string;
  processedUrl?: string;
}

export interface StyleSettings {
  modelType: string;
  background: string;
  style: string;
  lighting: string;
  pose?: string;
}

export function ImageGenerationWorkflow({ selectedCategory, selectedModel, onBack, onComplete }: ImageGenerationWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [styleSettings, setStyleSettings] = useState<StyleSettings>({
    modelType: selectedModel?.id || '',
    background: '',
    style: selectedModel?.metadata.style || '',
    lighting: '',
    pose: selectedModel?.metadata.style || ''
  });
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleStepChange = (step: WorkflowStep) => {
    setCurrentStep(step);
  };

  const handleProductUpload = (images: ProductImage[]) => {
    setProductImages(images);
    setCurrentStep('style');
  };

  const handleStyleSelection = (settings: StyleSettings) => {
    setStyleSettings(settings);
    setCurrentStep('generate');
  };

  const handleGenerationComplete = (images: string[]) => {
    setGeneratedImages(images);
    setCurrentStep('edit');
  };

  const handleEditingComplete = () => {
    setCurrentStep('download');
  };

  const handleWorkflowComplete = () => {
    if (onComplete && selectedModel && productImages.length > 0) {
      // Create a new project object
      const newProject: GeneratedProject = {
        id: `project-${Date.now()}`,
        title: `${getCategoryName(selectedCategory)} - ${selectedModel.name}`,
        thumbnail: generatedImages[0] || productImages[0].url,
        category: selectedCategory,
        model: selectedModel,
        originalPrompt: selectedModel.prompt,
        finalPrompt: generateFinalPrompt(selectedModel, styleSettings),
        generatedImages: generatedImages,
        productImages: productImages.map(img => img.url),
        createdAt: new Date(),
        status: 'completed',
        settings: {
          background: styleSettings.background,
          style: styleSettings.style,
          lighting: styleSettings.lighting,
          pose: styleSettings.pose
        },
        downloadCount: 0,
        isPublic: true
      };

      onComplete(newProject);
    }
  };

  const getCategoryName = (category: string): string => {
    const categoryNames: Record<string, string> = {
      fashion: '패션',
      electronics: '전자제품',
      beauty: '뷰티',
      home: '홈&리빙',
      food: '식품',
      lifestyle: '라이프스타일'
    };
    return categoryNames[category] || category;
  };

  const generateFinalPrompt = (model: SelectedModel, settings: StyleSettings): string => {
    const parts = [
      model.prompt,
      `${settings.background} background`,
      `${settings.style} style`,
      `${settings.lighting} lighting`
    ];
    
    if (settings.pose) {
      parts.push(`${settings.pose} pose`);
    }
    
    return parts.join(', ');
  };

  return (
    <div className="min-h-screen bg-background">
      <WorkflowHeader 
        currentStep={currentStep}
        selectedCategory={selectedCategory}
        selectedModel={selectedModel}
        onBack={onBack}
      />

      <main className="page-container">
        {currentStep === 'upload' && (
          <ProductUpload 
            onUploadComplete={handleProductUpload}
            category={selectedCategory}
            selectedModel={selectedModel}
          />
        )}

        {currentStep === 'style' && (
          <StyleSelection 
            productImages={productImages}
            category={selectedCategory}
            selectedModel={selectedModel}
            onStyleSelected={handleStyleSelection}
            onBack={() => setCurrentStep('upload')}
          />
        )}

        {currentStep === 'generate' && (
          <AIGeneration 
            productImages={productImages}
            styleSettings={styleSettings}
            selectedModel={selectedModel}
            onGenerationComplete={handleGenerationComplete}
            onBack={() => setCurrentStep('style')}
          />
        )}

        {currentStep === 'edit' && (
          <EditingTools 
            productImages={productImages}
            generatedImages={generatedImages}
            styleSettings={styleSettings}
            selectedModel={selectedModel}
            onEditingComplete={handleEditingComplete}
            onBack={() => setCurrentStep('generate')}
          />
        )}

        {currentStep === 'download' && (
          <ResultDownload 
            generatedImages={generatedImages}
            styleSettings={styleSettings}
            selectedModel={selectedModel}
            onBack={() => setCurrentStep('edit')}
            onNewGeneration={() => setCurrentStep('upload')}
            onComplete={handleWorkflowComplete}
          />
        )}
      </main>
    </div>
  );
}