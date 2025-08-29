import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Upload, X, Image, AlertCircle, CheckCircle, User } from 'lucide-react';
import { ProductImage } from '../ImageGenerationWorkflow';
import { SelectedModel } from '../../App';

interface ProductUploadProps {
  onUploadComplete: (images: ProductImage[]) => void;
  category: string;
  selectedModel: SelectedModel | null;
}

export function ProductUpload({ onUploadComplete, category, selectedModel }: ProductUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<ProductImage[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback((files: FileList) => {
    const newImages: ProductImage[] = [];
    
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const id = `${Date.now()}-${index}`;
        const url = URL.createObjectURL(file);
        newImages.push({ id, file, url });
      }
    });

    setUploadedImages(prev => [...prev, ...newImages]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      // Clean up object URL
      const removed = prev.find(img => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return updated;
    });
  };

  const handleContinue = async () => {
    if (uploadedImages.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const processedImages = uploadedImages.map(img => ({
        ...img,
        processedUrl: img.url // In real app, this would be the processed image
      }));
      
      setIsProcessing(false);
      onUploadComplete(processedImages);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 
          className="mb-4"
          style={{
            fontSize: '2rem',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: '1.125',
            letterSpacing: '-0.022em',
            color: 'var(--color-text-primary)'
          }}
        >
          제품 이미지 업로드
        </h1>
        <p 
          className="mb-6"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-regular)'
          }}
        >
          고품질의 제품 사진을 업로드해주세요. AI가 자동으로 배경을 제거하고 최적화합니다.
        </p>
        <Badge 
          variant="outline" 
          className="mb-8"
          style={{
            borderColor: 'var(--color-border-primary)',
            color: 'var(--color-text-tertiary)',
            borderRadius: 'var(--radius-rounded)',
            fontSize: 'var(--font-size-small)',
            padding: '8px 16px'
          }}
        >
          권장: PNG/JPG 형식, 1024x1024 이상 해상도
        </Badge>
      </div>

      {/* Selected Model Info */}
      {selectedModel && (
        <Card 
          className="p-6"
          style={{
            backgroundColor: 'var(--color-brand-accent-tint)',
            borderColor: 'var(--color-brand-primary)',
            borderRadius: 'var(--radius-16)'
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-full overflow-hidden"
              style={{ 
                backgroundColor: 'var(--color-background-primary)',
                border: `2px solid var(--color-brand-primary)`
              }}
            >
              <img 
                src={selectedModel.imageUrl} 
                alt={selectedModel.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 
                className="mb-1"
                style={{
                  fontSize: 'var(--font-size-regular)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                선택된 AI 모델: {selectedModel.name}
              </h3>
              <div className="flex gap-2 mb-2">
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{
                    backgroundColor: 'var(--color-utility-white)',
                    color: 'var(--color-brand-primary)',
                    borderRadius: 'var(--radius-4)',
                    fontSize: 'var(--font-size-micro)',
                    padding: '2px 6px'
                  }}
                >
                  {selectedModel.metadata.age}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                  style={{
                    backgroundColor: 'var(--color-utility-white)',
                    color: 'var(--color-brand-primary)',
                    borderRadius: 'var(--radius-4)',
                    fontSize: 'var(--font-size-micro)',
                    padding: '2px 6px'
                  }}
                >
                  {selectedModel.metadata.style}
                </Badge>
              </div>
              <p 
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                이 모델의 스타일과 특성으로 제품 이미지가 생성됩니다
              </p>
            </div>
            <CheckCircle 
              className="w-6 h-6"
              style={{ color: 'var(--color-brand-primary)' }}
            />
          </div>
        </Card>
      )}

      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          borderRadius: 'var(--radius-16)',
          borderColor: dragOver ? 'var(--color-brand-primary)' : 'var(--color-border-primary)',
          backgroundColor: dragOver ? 'var(--color-brand-accent-tint)' : 'transparent'
        }}
      >
        <div className="p-12 text-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              backgroundColor: 'var(--color-brand-accent-tint)'
            }}
          >
            <Upload 
              className="w-8 h-8"
              style={{ color: 'var(--color-brand-primary)' }}
            />
          </div>
          <h3 
            className="mb-2"
            style={{
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            }}
          >
            이미지를 드래그하여 업로드
          </h3>
          <p 
            className="text-sm mb-6"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            또는 파일을 직접 선택하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button 
              variant="default"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) handleFileSelect(files);
                };
                input.click();
              }}
              style={{
                backgroundColor: 'var(--color-brand-primary)',
                color: 'var(--color-utility-white)',
                borderRadius: 'var(--radius-8)',
                fontSize: 'var(--font-size-regular)',
                fontWeight: 'var(--font-weight-medium)',
                height: '48px',
                padding: '0 24px',
                border: 'none'
              }}
            >
              파일 선택하기
            </Button>
            <p 
              className="text-xs"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              최대 10개 파일, 각 20MB 이하
            </p>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>촬영 팁:</strong> 제품이 명확히 보이고, 그림자나 반사가 적은 사진이 좋습니다. 
          여러 각도의 사진을 업로드하면 더 다양한 결과를 얻을 수 있어요.
        </AlertDescription>
      </Alert>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <h3 
            style={{
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            }}
          >
            업로드된 이미지 ({uploadedImages.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((image) => (
              <Card 
                key={image.id} 
                className="p-2 relative group"
                style={{
                  backgroundColor: 'var(--color-background-primary)',
                  borderColor: 'var(--color-border-primary)',
                  borderRadius: 'var(--radius-12)'
                }}
              >
                <div 
                  className="aspect-square rounded-lg overflow-hidden"
                  style={{ backgroundColor: 'var(--color-background-tertiary)' }}
                >
                  <img 
                    src={image.url} 
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(image.id)}
                  style={{
                    backgroundColor: 'var(--color-semantic-red)',
                    color: 'var(--color-utility-white)',
                    borderRadius: 'var(--radius-circle)',
                    border: 'none'
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
                <div className="flex items-center justify-center mt-2">
                  <CheckCircle 
                    className="w-4 h-4"
                    style={{ color: 'var(--color-semantic-green)' }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-center pt-8">
        <Button 
          size="lg" 
          onClick={handleContinue}
          disabled={uploadedImages.length === 0 || isProcessing}
          className="min-w-48"
          style={{
            backgroundColor: 'var(--color-brand-primary)',
            color: 'var(--color-utility-white)',
            borderRadius: 'var(--radius-8)',
            fontSize: '16px',
            fontWeight: 'var(--font-weight-medium)',
            height: '48px',
            padding: '0 24px',
            border: 'none',
            opacity: (uploadedImages.length === 0 || isProcessing) ? 0.6 : 1
          }}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
              AI 처리중...
            </>
          ) : (
            `다음 단계 (${uploadedImages.length})`
          )}
        </Button>
      </div>
    </div>
  );
}