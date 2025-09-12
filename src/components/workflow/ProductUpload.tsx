import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { ProductImage } from '../ImageGenerationWorkflow';
import { SelectedModel } from '../../App';

interface ProductUploadProps {
    onUploadComplete: (images: ProductImage[]) => void;
    category: string;
    selectedModel: SelectedModel | null;
}

/** ---- 백엔드 연동 공통 ---- */
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// 백엔드 경로에 맞춘 상수들
const FILE_UPLOAD_URL = `${API_BASE}/files`;                 // POST multipart -> { fileId }
const REMOVE_BG_URL   = `${API_BASE}/generate/remove-bg`;    // POST json {fileId} -> { jobId }
const JOB_STATUS_URL  = (jobId: string) => `${API_BASE}/generate/jobs/${jobId}`; // GET -> { fileUrl }

/** 업로드 중 상태 표현용 타입 확장 */
type JobStatus = 'PENDING' | 'RUNNING' | 'FAILED' | 'SUCCEEDED';
type JobViewResponse = {
    jobId: string;
    status: 'PENDING' | 'RUNNING' | 'FAILED' | 'SUCCEEDED';
    inputFileId?: number;
    resultFileId?: number;
    resultFileUrl?: string;
    inputFileUrl?: string;
    errorMessage?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

type UploadingImage = ProductImage & {
    status?: 'UPLOADING' | 'PROCESSING' | 'DONE' | 'ERROR';
    errorMessage?: string;
    processedUrl?: string;  // 최종 결과(배경 제거된) 이미지 URL (Firebase public URL)
};

/** 1) 파일 업로드 -> fileId 반환 */
async function uploadFile(file: File, token?: string): Promise<number> {
    const form = new FormData();
    form.append('file', file); // 백엔드 @RequestParam("file") 기준

    const res = await fetch(FILE_UPLOAD_URL, {
        method: 'POST',
        body: form,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`파일 업로드 실패 (${res.status})`);
    const data = await res.json();
    // Postman 캡쳐 기준 응답: { "fileId": 66 }
    return data.fileId;
}

/** 2) 배경 제거 요청 -> jobId 반환 */
async function requestRemoveBg(fileId: number, token?: string): Promise<string> {
    const res = await fetch(REMOVE_BG_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ fileId }),
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`remove-bg 요청 실패 (${res.status})`);
    const data = await res.json();
    // 컨트롤러 기준 응답: { "jobId": "uuid" }
    return data.jobId as string;
}

/** 3) 잡 상태 폴링 -> SUCCEEDED 시 resultFileId 반환 */
async function pollJobUntilDone(jobId: string, token?: string, signal?: AbortSignal): Promise<string> {
    const INTERVAL = 1200;
    const TIMEOUT = 60_000;
    const start = Date.now();

    while (true) {
        if (signal?.aborted) throw new Error('사용자가 취소했습니다.');
        if (Date.now() - start > TIMEOUT) throw new Error('처리 시간이 초과되었습니다.');

        const res = await fetch(JOB_STATUS_URL(jobId), {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            credentials: 'include',
            signal,
        });
        if (!res.ok) throw new Error(`잡 조회 실패 (${res.status})`);
        const job = (await res.json()) as JobViewResponse;

        if (job.status === 'SUCCEEDED') {
            if (!job.resultFileUrl) throw new Error('resultFileUrl 이 응답에 없습니다.');
            return job.resultFileUrl;
        }
        if (job.status === 'FAILED') {
            throw new Error(job?.errorMessage || '작업 실패');
        }

        await new Promise((r) => setTimeout(r, INTERVAL));
    }
}

/** 4) 전체 플로우 묶기 -> 최종 processedUrl 반환 */
async function processFileThroughBackend(file: File, token?: string, signal?: AbortSignal): Promise<string> {
    const fileId = await uploadFile(file, token);
    const jobId = await requestRemoveBg(fileId, token);
    return await pollJobUntilDone(jobId, token, signal);
}

export function ProductUpload({ onUploadComplete, category, selectedModel }: ProductUploadProps) {
    const [uploadedImages, setUploadedImages] = useState<UploadingImage[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const addLocalPreviews = useCallback((files: FileList) => {
        const newImages: UploadingImage[] = [];
        Array.from(files).forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const id = `${Date.now()}-${index}`;
                const url = URL.createObjectURL(file);
                newImages.push({ id, file, url, status: 'UPLOADING' });
            }
        });
        setUploadedImages((prev) => [...prev, ...newImages]);
        return newImages;
    }, []);

    const handleFileSelect = useCallback(async (files: FileList) => {
        const newImages = addLocalPreviews(files);
        setIsProcessing(true);

        const token = localStorage.getItem('accessToken') || undefined;
        const ac = new AbortController();

        try {
            const results = await Promise.allSettled(
                newImages.map(async (img) => {
                    // PROCESSING 표시
                    setUploadedImages(prev =>
                        prev.map(p => (p.id === img.id ? { ...p, status: 'PROCESSING' } : p)),
                    );

                    const processedUrl = await processFileThroughBackend(
                        img.file!, // 업로드한 원본 파일
                        token,
                        ac.signal, // 폴링 취소 대비
                    );

                    // 완료 반영
                    setUploadedImages(prev =>
                        prev.map(p => (p.id === img.id ? { ...p, status: 'DONE', processedUrl } : p)),
                    );

                    return { id: img.id, processedUrl };
                })
            );

            // 부모에게 완료분 전달: 최신 state에서 추출 (stale 방지)
            setUploadedImages(prev => {
                const done = prev.filter(p => !!p.processedUrl) as ProductImage[];
                if (done.length) onUploadComplete(done);
                return prev;
            });

            const anyRejections = results.some(r => r.status === 'rejected');
            if (anyRejections) {
                console.warn('일부 파일 처리 실패', results);
            }
        } finally {
            setIsProcessing(false);
        }
    }, [addLocalPreviews, onUploadComplete]);


    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            handleFileSelect(e.dataTransfer.files);
        },
        [handleFileSelect],
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const removeImage = (id: string) => {
        setUploadedImages((prev) => {
            const updated = prev.filter((img) => img.id !== id);
            const removed = prev.find((img) => img.id === id);
            if (removed) URL.revokeObjectURL(removed.url);
            return updated;
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* 헤더 */}
            <div className="text-center">
                <h1
                    className="mb-4"
                    style={{
                        fontSize: '2rem',
                        fontWeight: 'var(--font-weight-semibold)',
                        lineHeight: '1.125',
                        letterSpacing: '-0.022em',
                        color: 'var(--color-text-primary)',
                    }}
                >
                    제품 이미지 업로드
                </h1>
                <p className="mb-6" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-regular)' }}>
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
                        padding: '8px 16px',
                    }}
                >
                    권장: PNG/JPG 형식, 제품이 선명하게 보이는 이미지
                </Badge>
            </div>

            {/* 선택된 모델 카드 (있으면 표시) */}
            {selectedModel && (
                <Card
                    className="p-6"
                    style={{
                        backgroundColor: 'var(--color-brand-accent-tint)',
                        borderColor: 'var(--color-brand-primary)',
                        borderRadius: 'var(--radius-16)',
                    }}
                >
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-full overflow-hidden"
                            style={{ backgroundColor: 'var(--color-background-primary)', border: `2px solid var(--color-brand-primary)` }}
                        >
                            <img src={selectedModel.imageUrl} alt={selectedModel.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h3
                                className="mb-1"
                                style={{ fontSize: 'var(--font-size-regular)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}
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
                                        padding: '2px 6px',
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
                                        padding: '2px 6px',
                                    }}
                                >
                                    {selectedModel.metadata.style}
                                </Badge>
                            </div>
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                이 모델의 스타일과 특성으로 제품 이미지가 생성됩니다
                            </p>
                        </div>
                        <CheckCircle className="w-6 h-6" style={{ color: 'var(--color-brand-primary)' }} />
                    </div>
                </Card>
            )}

            {/* 업로드 영역 */}
            <Card
                className={`border-2 border-dashed transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-border'}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                    borderRadius: 'var(--radius-16)',
                    borderColor: dragOver ? 'var(--color-brand-primary)' : 'var(--color-border-primary)',
                    backgroundColor: dragOver ? 'var(--color-brand-accent-tint)' : 'transparent',
                }}
            >
                <div className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--color-brand-accent-tint)' }}>
                        <Upload className="w-8 h-8" style={{ color: 'var(--color-brand-primary)' }} />
                    </div>
                    <h3 className="mb-2" style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                        이미지를 드래그하여 업로드
                    </h3>
                    <p className="text-sm mb-6" style={{ color: 'var(--color-text-tertiary)' }}>
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
                                    if (files) void handleFileSelect(files);
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
                                border: 'none',
                            }}
                        >
                            파일 선택하기
                        </Button>
                        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                            최대 10개 파일, 각 20MB 이하
                        </p>
                    </div>
                </div>
            </Card>

            {/* 가이드 */}
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    <strong>촬영 팁:</strong> 제품이 명확히 보이고, 그림자나 반사가 적은 사진이 좋습니다. 여러 각도의 사진을 업로드하면 더 다양한 결과를 얻을 수 있어요.
                </AlertDescription>
            </Alert>

            {/* 업로드된 이미지 + 상태 표시 */}
            {uploadedImages.length > 0 && (
                <div className="space-y-4">
                    <h3 style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
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
                                    borderRadius: 'var(--radius-12)',
                                }}
                            >
                                <div className="aspect-square rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-background-tertiary)' }}>
                                    <img src={image.processedUrl || image.url} alt="Product" className="w-full h-full object-cover" />
                                </div>

                                {/* 상태 뱃지 */}
                                {image.status && (
                                    <div className="absolute left-2 top-2 text-xs px-2 py-1 rounded bg-black/60 text-white">
                                        {image.status === 'UPLOADING' && '업로드 대기'}
                                        {image.status === 'PROCESSING' && 'AI 처리중'}
                                        {image.status === 'DONE' && '완료'}
                                        {image.status === 'ERROR' && '실패'}
                                    </div>
                                )}

                                {/* 삭제 버튼 */}
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeImage(image.id)}
                                    style={{
                                        backgroundColor: 'var(--color-semantic-red)',
                                        color: 'var(--color-utility-white)',
                                        borderRadius: 'var(--radius-circle)',
                                        border: 'none',
                                    }}
                                >
                                    <X className="w-3 h-3" />
                                </Button>

                                <div className="flex items-center justify-center mt-2">
                                    {image.status === 'DONE' ? (
                                        <CheckCircle className="w-4 h-4" style={{ color: 'var(--color-semantic-green)' }} />
                                    ) : image.status === 'ERROR' ? (
                                        <span className="text-xs text-red-500">{image.errorMessage || '업로드 실패'}</span>
                                    ) : null}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* 다음 단계 버튼 */}
            <div className="flex justify-center pt-8">
                <Button
                    size="lg"
                    onClick={() => {
                        const done = uploadedImages.filter((i) => i.processedUrl);
                        if (done.length > 0) onUploadComplete(done as ProductImage[]);
                    }}
                    disabled={uploadedImages.filter((i) => i.processedUrl).length === 0 || isProcessing}
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
                        opacity: uploadedImages.filter((i) => i.processedUrl).length === 0 || isProcessing ? 0.6 : 1,
                    }}
                >
                    {isProcessing ? (
                        <>
                            <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            AI 처리중...
                        </>
                    ) : (
                        `다음 단계 (${uploadedImages.filter((i) => i.processedUrl).length})`
                    )}
                </Button>
            </div>
        </div>
    );
}
