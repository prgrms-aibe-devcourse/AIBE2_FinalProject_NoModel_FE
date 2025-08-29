import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  CheckCircle, 
  Image, 
  FileImage, 
  Copy, 
  Mail,
  MessageSquare,
  Globe,
  Repeat
} from 'lucide-react';
import { StyleSettings } from '../ImageGenerationWorkflow';

interface ResultDownloadProps {
  generatedImages: string[];
  styleSettings: StyleSettings;
  onBack: () => void;
  onNewGeneration: () => void;
}

const downloadFormats = [
  { value: 'jpg', label: 'JPG', description: '웹용 최적화 (작은 용량)' },
  { value: 'png', label: 'PNG', description: '투명 배경 지원 (고품질)' },
  { value: 'webp', label: 'WebP', description: '최신 웹 형식 (압축률 우수)' },
  { value: 'pdf', label: 'PDF', description: '인쇄용 문서' }
];

const resolutions = [
  { value: '1080', label: '1080p (1920×1080)', description: '소셜미디어용' },
  { value: '2k', label: '2K (2560×1440)', description: '웹사이트용' },
  { value: '4k', label: '4K (3840×2160)', description: '인쇄용' },
  { value: 'custom', label: '사용자 정의', description: '원하는 크기로' }
];

export function ResultDownload({ 
  generatedImages, 
  styleSettings, 
  onBack, 
  onNewGeneration 
}: ResultDownloadProps) {
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set([0]));
  const [downloadFormat, setDownloadFormat] = useState('png');
  const [resolution, setResolution] = useState('4k');
  const [isDownloading, setIsDownloading] = useState(false);

  const toggleImageSelection = (index: number) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const selectAllImages = () => {
    setSelectedImages(new Set(generatedImages.map((_, index) => index)));
  };

  const deselectAllImages = () => {
    setSelectedImages(new Set());
  };

  const handleDownload = async () => {
    if (selectedImages.size === 0) return;
    
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      // In real app, this would trigger actual download
      console.log(`Downloading ${selectedImages.size} images in ${downloadFormat} format at ${resolution} resolution`);
    }, 2000);
  };

  const handleShare = (platform: string) => {
    console.log(`Sharing to ${platform}`);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">완성된 이미지</h1>
          <p className="text-muted-foreground">
            고품질 제품 이미지가 준비되었습니다. 다운로드하거나 공유하세요.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전
          </Button>
          <Button onClick={onNewGeneration}>
            <Repeat className="w-4 h-4 mr-2" />
            새로 생성
          </Button>
        </div>
      </div>

      {/* Success Banner */}
      <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 dark:text-green-100">
              이미지 생성 완료!
            </h3>
            <p className="text-green-700 dark:text-green-200">
              {generatedImages.length}개의 고품질 제품 이미지가 성공적으로 생성되었습니다.
            </p>
          </div>
          <Badge className="bg-green-500 hover:bg-green-600">
            ✨ 첫 번째 생성 무료
          </Badge>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Image Gallery */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">생성된 이미지 ({generatedImages.length})</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={selectAllImages}>
                전체 선택
              </Button>
              <Button variant="ghost" size="sm" onClick={deselectAllImages}>
                선택 해제
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {generatedImages.map((imageUrl, index) => (
              <Card 
                key={index}
                className={`relative group cursor-pointer transition-all hover:shadow-lg ${
                  selectedImages.has(index) ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => toggleImageSelection(index)}
              >
                <div className="absolute top-3 left-3 z-10">
                  <Checkbox
                    checked={selectedImages.has(index)}
                    onCheckedChange={() => toggleImageSelection(index)}
                    className="bg-background"
                  />
                </div>
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-8 h-8 p-0 bg-background/90 backdrop-blur"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(imageUrl);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-8 h-8 p-0 bg-background/90 backdrop-blur"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare('link');
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={`Generated ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-background/90 backdrop-blur rounded-lg px-3 py-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        이미지 #{index + 1}
                      </Badge>
                      <span className="text-xs text-muted-foreground">4K 품질</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel - Download Options */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">다운로드 설정</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">파일 형식</label>
                <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {downloadFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div>
                          <div className="font-medium">{format.label}</div>
                          <div className="text-xs text-muted-foreground">{format.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">해상도</label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {resolutions.map((res) => (
                      <SelectItem key={res.value} value={res.value}>
                        <div>
                          <div className="font-medium">{res.label}</div>
                          <div className="text-xs text-muted-foreground">{res.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="w-full mt-6" 
              size="lg"
              onClick={handleDownload}
              disabled={selectedImages.size === 0 || isDownloading}
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  다운로드 중...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  다운로드 ({selectedImages.size})
                </>
              )}
            </Button>
          </div>

          {/* Share Options */}
          <div>
            <h4 className="font-semibold mb-3">공유하기</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleShare('instagram')}
                className="flex flex-col h-auto py-3"
              >
                <Image className="w-4 h-4 mb-1" />
                <span className="text-xs">Instagram</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleShare('facebook')}
                className="flex flex-col h-auto py-3"
              >
                <Globe className="w-4 h-4 mb-1" />
                <span className="text-xs">Facebook</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleShare('email')}
                className="flex flex-col h-auto py-3"
              >
                <Mail className="w-4 h-4 mb-1" />
                <span className="text-xs">이메일</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleShare('message')}
                className="flex flex-col h-auto py-3"
              >
                <MessageSquare className="w-4 h-4 mb-1" />
                <span className="text-xs">메시지</span>
              </Button>
            </div>
          </div>

          {/* Usage Tips */}
          <Card className="p-4">
            <h4 className="font-semibold mb-2">활용 팁</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 소셜미디어: 1080p JPG</li>
              <li>• 웹사이트: 2K WebP</li>
              <li>• 인쇄물: 4K PNG</li>
              <li>• 투명배경 필요: PNG</li>
            </ul>
          </Card>

          {/* Generation Summary */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3">생성 요약</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">모델 타입:</span>
                <span>{styleSettings.modelType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">배경:</span>
                <span>{styleSettings.background}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">스타일:</span>
                <span>{styleSettings.style}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">생성 시간:</span>
                <span>2분 34초</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}