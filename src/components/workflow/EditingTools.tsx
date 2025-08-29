import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArrowLeft, Download, Palette, Sun, Contrast, Zap, RotateCw, Crop, Type, Heart } from 'lucide-react';
import { ProductImage, StyleSettings } from '../ImageGenerationWorkflow';

interface EditingToolsProps {
  productImages: ProductImage[];
  generatedImages: string[];
  styleSettings: StyleSettings;
  onEditingComplete: () => void;
  onBack: () => void;
}

interface EditingSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
}

export function EditingTools({ 
  productImages, 
  generatedImages, 
  styleSettings, 
  onEditingComplete, 
  onBack 
}: EditingToolsProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [editingSettings, setEditingSettings] = useState<EditingSettings>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    sharpness: 0
  });
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const selectedImage = generatedImages[selectedImageIndex];

  const handleSliderChange = (key: keyof EditingSettings, value: number[]) => {
    setEditingSettings(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };

  const toggleFavorite = (index: number) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const resetSettings = () => {
    setEditingSettings({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      sharpness: 0
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">편집 및 조정</h1>
          <p className="text-muted-foreground">
            생성된 이미지를 세밀하게 조정하고 브랜드에 맞게 커스터마이징하세요
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전
          </Button>
          <Button onClick={onEditingComplete}>
            <Download className="w-4 h-4 mr-2" />
            완료
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Image Gallery */}
        <div className="space-y-4">
          <h3 className="font-semibold">생성된 이미지 ({generatedImages.length})</h3>
          <div className="grid grid-cols-1 gap-3">
            {generatedImages.map((imageUrl, index) => (
              <Card 
                key={index}
                className={`relative cursor-pointer transition-all hover:shadow-lg ${
                  selectedImageIndex === index ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={`Generated ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-8 h-8 p-0 ${
                      favorites.has(index) 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(index);
                    }}
                  >
                    <Heart className={`w-4 h-4 ${favorites.has(index) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                {selectedImageIndex === index && (
                  <div className="absolute bottom-2 left-2">
                    <Badge className="text-xs">편집 중</Badge>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Center Panel - Main Image */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">미리보기</h3>
            <Badge variant="outline">
              이미지 #{selectedImageIndex + 1}
            </Badge>
          </div>
          <Card className="p-4">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
              <img 
                src={selectedImage} 
                alt="Preview"
                className="w-full h-full object-cover"
                style={{
                  filter: `
                    brightness(${1 + editingSettings.brightness / 100})
                    contrast(${1 + editingSettings.contrast / 100})
                    saturate(${1 + editingSettings.saturation / 100})
                  `
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Crop className="w-4 h-4 mr-2" />
                  자르기
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCw className="w-4 h-4 mr-2" />
                  회전
                </Button>
                <Button variant="outline" size="sm">
                  <Type className="w-4 h-4 mr-2" />
                  텍스트
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={resetSettings}>
                초기화
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Panel - Editing Controls */}
        <div className="space-y-4">
          <h3 className="font-semibold">편집 도구</h3>
          
          <Tabs defaultValue="adjust" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="adjust">
                <Sun className="w-4 h-4 mr-1" />
                조정
              </TabsTrigger>
              <TabsTrigger value="filter">
                <Palette className="w-4 h-4 mr-1" />
                필터
              </TabsTrigger>
              <TabsTrigger value="enhance">
                <Zap className="w-4 h-4 mr-1" />
                향상
              </TabsTrigger>
            </TabsList>

            <TabsContent value="adjust" className="space-y-6">
              <Card className="p-4 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-medium">밝기</label>
                    <span className="text-sm text-muted-foreground">{editingSettings.brightness}</span>
                  </div>
                  <Slider
                    value={[editingSettings.brightness]}
                    onValueChange={(value) => handleSliderChange('brightness', value)}
                    min={-50}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-medium">대비</label>
                    <span className="text-sm text-muted-foreground">{editingSettings.contrast}</span>
                  </div>
                  <Slider
                    value={[editingSettings.contrast]}
                    onValueChange={(value) => handleSliderChange('contrast', value)}
                    min={-50}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-medium">채도</label>
                    <span className="text-sm text-muted-foreground">{editingSettings.saturation}</span>
                  </div>
                  <Slider
                    value={[editingSettings.saturation]}
                    onValueChange={(value) => handleSliderChange('saturation', value)}
                    min={-50}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-medium">선명도</label>
                    <span className="text-sm text-muted-foreground">{editingSettings.sharpness}</span>
                  </div>
                  <Slider
                    value={[editingSettings.sharpness]}
                    onValueChange={(value) => handleSliderChange('sharpness', value)}
                    min={-50}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="filter" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {['원본', '따뜻한', '차가운', '빈티지', '모노크롬', '세피아'].map((filter) => (
                  <Button key={filter} variant="outline" size="sm" className="h-auto py-3">
                    {filter}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="enhance" className="space-y-4">
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  AI 자동 향상
                </Button>
                <Button className="w-full" variant="outline">
                  배경 흐림 효과
                </Button>
                <Button className="w-full" variant="outline">
                  노이즈 제거
                </Button>
                <Button className="w-full" variant="outline">
                  해상도 향상
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">빠른 작업</h4>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="ghost" size="sm">
                브랜드 로고 추가
              </Button>
              <Button className="w-full justify-start" variant="ghost" size="sm">
                워터마크 제거
              </Button>
              <Button className="w-full justify-start" variant="ghost" size="sm">
                배치 편집 적용
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">{generatedImages.length}</div>
          <p className="text-sm text-muted-foreground">생성된 이미지</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">{favorites.size}</div>
          <p className="text-sm text-muted-foreground">즐겨찾기</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">4K</div>
          <p className="text-sm text-muted-foreground">출력 해상도</p>
        </Card>
      </div>
    </div>
  );
}