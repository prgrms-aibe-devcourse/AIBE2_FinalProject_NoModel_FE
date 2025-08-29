import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { ArrowLeft, Users, Camera, Palette, Lightbulb } from 'lucide-react';
import { ProductImage, StyleSettings } from '../ImageGenerationWorkflow';

interface StyleSelectionProps {
  productImages: ProductImage[];
  category: string;
  onStyleSelected: (settings: StyleSettings) => void;
  onBack: () => void;
}

const modelTypes = [
  {
    id: 'young-female',
    name: '젊은 여성',
    description: '20대 초반, 자연스러운 표현',
    preview: 'https://images.unsplash.com/photo-1494790108755-2616b612b1ff?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'young-male',
    name: '젊은 남성',
    description: '20대 초반, 캐주얼한 느낌',
    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'mature-female',
    name: '성인 여성',
    description: '30대 중반, 전문적인 이미지',
    preview: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'mature-male',
    name: '성인 남성',
    description: '30대 중반, 신뢰감 있는 모습',
    preview: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  }
];

const backgrounds = [
  {
    id: 'studio-white',
    name: '화이트 스튜디오',
    description: '깔끔한 흰색 배경',
    preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop'
  },
  {
    id: 'studio-gradient',
    name: '그라데이션 스튜디오',
    description: '부드러운 그라데이션 배경',
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=150&fit=crop'
  },
  {
    id: 'lifestyle-home',
    name: '홈 라이프스타일',
    description: '자연스러운 일상 공간',
    preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop'
  },
  {
    id: 'outdoor-natural',
    name: '자연 배경',
    description: '야외 자연스러운 배경',
    preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=150&fit=crop'
  }
];

const styles = [
  { id: 'minimal', name: '미니멀', description: '깔끔하고 단순한 스타일' },
  { id: 'luxury', name: '럭셔리', description: '고급스럽고 세련된 느낌' },
  { id: 'casual', name: '캐주얼', description: '편안하고 친근한 분위기' },
  { id: 'professional', name: '프로페셔널', description: '전문적이고 신뢰감 있는 스타일' }
];

const lightingOptions = [
  { id: 'natural', name: '자연광', description: '부드럽고 자연스러운 조명' },
  { id: 'studio', name: '스튜디오 조명', description: '균등하고 밝은 조명' },
  { id: 'dramatic', name: '드라마틱 조명', description: '대비가 강한 분위기 있는 조명' },
  { id: 'soft', name: '소프트 조명', description: '부드럽고 따뜻한 조명' }
];

export function StyleSelection({ productImages, category, onStyleSelected, onBack }: StyleSelectionProps) {
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedLighting, setSelectedLighting] = useState('');

  const isComplete = selectedModel && selectedBackground && selectedStyle && selectedLighting;

  const handleContinue = () => {
    if (!isComplete) return;
    
    onStyleSelected({
      modelType: selectedModel,
      background: selectedBackground,
      style: selectedStyle,
      lighting: selectedLighting
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">스타일 선택</h1>
          <p className="text-muted-foreground">
            원하는 모델, 배경, 스타일을 선택하여 완벽한 제품 이미지를 만들어보세요
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          이전
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Panel - Product Preview */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold">제품 미리보기</h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {productImages.slice(0, 4).map((image, index) => (
              <div key={image.id} className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img 
                  src={image.url} 
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {productImages.length > 4 && (
            <p className="text-sm text-muted-foreground">
              +{productImages.length - 4}개 더 있음
            </p>
          )}
        </div>

        {/* Right Panel - Style Options */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="model" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="model" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                모델
              </TabsTrigger>
              <TabsTrigger value="background" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                배경
              </TabsTrigger>
              <TabsTrigger value="style" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                스타일
              </TabsTrigger>
              <TabsTrigger value="lighting" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                조명
              </TabsTrigger>
            </TabsList>

            <TabsContent value="model" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">AI 모델 선택</h3>
                {selectedModel && <Badge variant="secondary">선택됨</Badge>}
              </div>
              <RadioGroup value={selectedModel} onValueChange={setSelectedModel}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {modelTypes.map((model) => (
                    <Card key={model.id} className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedModel === model.id ? 'ring-2 ring-primary' : ''
                    }`}>
                      <Label htmlFor={model.id} className="cursor-pointer">
                        <div className="p-4 flex items-center gap-4">
                          <RadioGroupItem value={model.id} id={model.id} />
                          <img 
                            src={model.preview} 
                            alt={model.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{model.name}</h4>
                            <p className="text-sm text-muted-foreground">{model.description}</p>
                          </div>
                        </div>
                      </Label>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
            </TabsContent>

            <TabsContent value="background" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">배경 선택</h3>
                {selectedBackground && <Badge variant="secondary">선택됨</Badge>}
              </div>
              <RadioGroup value={selectedBackground} onValueChange={setSelectedBackground}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {backgrounds.map((bg) => (
                    <Card key={bg.id} className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedBackground === bg.id ? 'ring-2 ring-primary' : ''
                    }`}>
                      <Label htmlFor={bg.id} className="cursor-pointer">
                        <div className="p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={bg.id} id={bg.id} />
                            <div className="flex-1">
                              <h4 className="font-medium">{bg.name}</h4>
                              <p className="text-sm text-muted-foreground">{bg.description}</p>
                            </div>
                          </div>
                          <div className="h-20 rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={bg.preview} 
                              alt={bg.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </Label>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
            </TabsContent>

            <TabsContent value="style" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">스타일 선택</h3>
                {selectedStyle && <Badge variant="secondary">선택됨</Badge>}
              </div>
              <RadioGroup value={selectedStyle} onValueChange={setSelectedStyle}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {styles.map((style) => (
                    <Card key={style.id} className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedStyle === style.id ? 'ring-2 ring-primary' : ''
                    }`}>
                      <Label htmlFor={style.id} className="cursor-pointer">
                        <div className="p-4 flex items-center gap-3">
                          <RadioGroupItem value={style.id} id={style.id} />
                          <div>
                            <h4 className="font-medium">{style.name}</h4>
                            <p className="text-sm text-muted-foreground">{style.description}</p>
                          </div>
                        </div>
                      </Label>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
            </TabsContent>

            <TabsContent value="lighting" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">조명 선택</h3>
                {selectedLighting && <Badge variant="secondary">선택됨</Badge>}
              </div>
              <RadioGroup value={selectedLighting} onValueChange={setSelectedLighting}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lightingOptions.map((lighting) => (
                    <Card key={lighting.id} className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedLighting === lighting.id ? 'ring-2 ring-primary' : ''
                    }`}>
                      <Label htmlFor={lighting.id} className="cursor-pointer">
                        <div className="p-4 flex items-center gap-3">
                          <RadioGroupItem value={lighting.id} id={lighting.id} />
                          <div>
                            <h4 className="font-medium">{lighting.name}</h4>
                            <p className="text-sm text-muted-foreground">{lighting.description}</p>
                          </div>
                        </div>
                      </Label>
                    </Card>
                  ))}
                </div>
              </RadioGroup>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-8">
        <Button 
          size="lg" 
          onClick={handleContinue}
          disabled={!isComplete}
          className="min-w-48"
        >
          AI 이미지 생성하기
        </Button>
      </div>
    </div>
  );
}