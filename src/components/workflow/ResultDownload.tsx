import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import {
    ArrowLeft,
    Download,
    Share2,
    CheckCircle,
    Image,
    Copy,
    Mail,
    MessageSquare,
    Globe,
    Repeat,
    Coins,
    X
} from 'lucide-react';
import { StyleSettings } from '../ImageGenerationWorkflow';
import { ProjectRating, SelectedModel } from "../../App";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { ProjectRatingForm } from "../ProjectRatingForm";

interface ResultDownloadProps {
    generatedImages: string[];
    styleSettings: StyleSettings;
    onBack: () => void;
    onNewGeneration: () => void;
    selectedModel: SelectedModel | null;
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
                                   selectedModel,
                                   onNewGeneration
                               }: ResultDownloadProps) {
    const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set([0]));
    const [downloadFormat, setDownloadFormat] = useState('png');
    const [resolution, setResolution] = useState('4k');
    const [isDownloading, setIsDownloading] = useState(false);

    // ✅ 리뷰 다이얼로그 상태
    const [isRatingOpen, setIsRatingOpen] = useState(false);
    const [submittedRating, setSubmittedRating] = useState<ProjectRating | null>(null);
    
    // ✅ 토스트 알림 상태
    const [showRewardToast, setShowRewardToast] = useState(false);
    const [toastProgress, setToastProgress] = useState(100);
    const [isToastPaused, setIsToastPaused] = useState(false);

    // ✅ 토스트 프로그레스 바 관리
    useEffect(() => {
        if (showRewardToast && !isToastPaused) {
            setToastProgress(100);
            const interval = setInterval(() => {
                setToastProgress(prev => {
                    if (prev <= 0) {
                        clearInterval(interval);
                        setShowRewardToast(false);
                        setIsToastPaused(false);
                        return 0;
                    }
                    return prev - 2; // 100ms마다 2% 감소 (5초 = 5000ms)
                });
            }, 100);
            
            return () => clearInterval(interval);
        }
    }, [showRewardToast, isToastPaused]);

    // ✅ 토스트 닫기 함수
    const closeToast = () => {
        setShowRewardToast(false);
        setToastProgress(100);
        setIsToastPaused(false);
    };

    const toggleImageSelection = (index: number) => {
        setSelectedImages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) newSet.delete(index);
            else newSet.add(index);
            return newSet;
        });
    };

    const selectAllImages = () => setSelectedImages(new Set(generatedImages.map((_, index) => index)));
    const deselectAllImages = () => setSelectedImages(new Set());

    const handleDownload = async () => {
        if (selectedImages.size === 0) return;

        setIsDownloading(true);

        try {
            // 선택된 이미지들을 다운로드
            for (const imageIndex of selectedImages) {
                const imageUrl = generatedImages[imageIndex];
                
                // imageUrl에서 fileId 추출
                const fileIdMatch = imageUrl.match(/\/files\/([^\/]+)\//); 
                if (fileIdMatch) {
                    const fileId = fileIdMatch[1];
                    const downloadUrl = `http://localhost:8080/api/files/${fileId}/download`;
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `생성이미지_${imageIndex + 1}_${Date.now()}.${downloadFormat}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    console.error('fileId를 추출할 수 없습니다:', imageUrl);
                }
                
                // 다음 이미지 다운로드 전에 짧은 지연
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // 리뷰 다이얼로그 열기
            setIsRatingOpen(true);
        } catch (error) {
            console.error('다운로드 실패:', error);
            alert('다운로드 중 오류가 발생했습니다.');
        } finally {
            setIsDownloading(false);
        }
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

            {/* 성공 배너 */}
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
                    <Badge className="bg-green-500 hover:bg-green-600">✨ 첫 번째 생성 무료</Badge>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 좌측 - 이미지 갤러리 */}
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
                                            onClick={(e: React.MouseEvent) => {
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
                                            onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation();
                                                handleShare('link');
                                            }}
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                                    <img src={imageUrl} alt={`Generated ${index + 1}`} className="w-full h-full object-cover" />
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

                {/* 우측 - 다운로드 옵션 */}
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
                </div>
            </div>

            {/* ✅ 리뷰 다이얼로그 */}
            <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
            <DialogContent className="max-w-2xl">
                <DialogTitle>리뷰 등록</DialogTitle>
                <DialogDescription>생성된 모델에 대한 리뷰를 작성해주세요!</DialogDescription>
                    <ProjectRatingForm
                        modelId={typeof selectedModel?.id === 'string' ? selectedModel.id : parseInt(selectedModel?.id!)}  // ✅ 문자열 ID와 숫자 ID 모두 지원
                        onSuccess={(review) => {
                            console.log("리뷰 저장됨:", review);
                            setIsRatingOpen(false);
                            // ✅ 리뷰 등록 성공 시 토스트 표시
                            setShowRewardToast(true);
                        }}
                        onCancel={() => setIsRatingOpen(false)}
                    />

            </DialogContent>
        </Dialog>

        {/* ✅ 포인트 리워드 토스트 알림 */}
        {showRewardToast && (
            <div 
                className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300"
                style={{ width: '400px' }}
            >
                <Card 
                    className="p-6 shadow-lg border-2 cursor-pointer select-none" 
                    style={{ 
                        backgroundColor: '#f0fdf4',
                        borderColor: '#22c55e'
                    }}
                    onMouseDown={() => setIsToastPaused(true)}
                    onMouseUp={() => setIsToastPaused(false)}
                    onMouseLeave={() => setIsToastPaused(false)}
                >
                    <div className="flex items-start gap-4">
                        <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: '#10b981' }}
                        >
                            <Coins className="w-5 h-5" style={{ color: 'white' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>
                                    리뷰가 정상적으로 등록되었습니다
                                </h4>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="w-7 h-7 p-0 -mt-1"
                                    onClick={closeToast}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-base mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                                리뷰 등록 리워드로 <span className="font-bold" style={{ color: '#10b981' }}>+100포인트</span>가 지급되었습니다!
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                    className="h-1.5 rounded-full transition-all duration-100 ease-linear"
                                    style={{ 
                                        backgroundColor: 'var(--color-brand-primary)',
                                        width: `${toastProgress}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        )}
        </div>
    );
}
