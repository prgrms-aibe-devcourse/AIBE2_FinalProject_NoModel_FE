import React, {  useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { StarRating } from "./StarRating";
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { buildApiUrl } from '@/config/env';

interface ProjectRatingFormProps {
    modelId: number | string; // 리뷰를 등록할 모델 ID (기존 DB 모델: number, 새로 생성된 모델: string)
    onSuccess: (review: any) => void;
    onCancel?: () => void;
    // 수정 모드 관련 props
    isEditMode?: boolean;
    reviewId?: number;
    initialRating?: number;
    initialContent?: string;
}

export function ProjectRatingForm({ 
    modelId, 
    onSuccess, 
    onCancel, 
    isEditMode = false, 
    reviewId, 
    initialRating = 0, 
    initialContent = "" 
}: ProjectRatingFormProps) {
    const [rating, setRating] = useState<number>(initialRating);
    const [content, setContent] = useState<string>(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>("");
    const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
    const [countdown, setCountdown] = useState(5);

    // 중복 리뷰 Alert 5초 후 자동 닫기 + 카운트다운
    useEffect(() => {
        if (showDuplicateAlert) {
            setCountdown(5);

            const countdownInterval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        setShowDuplicateAlert(false);
                        if (onCancel) {
                            onCancel(); // 다이얼로그도 닫기
                        }
                        return 5;
                    }
                    return prev - 1;
                });
            }, 1000);

            // 컴포넌트가 언마운트되거나 showDuplicateAlert가 변경되면 인터벌 정리
            return () => clearInterval(countdownInterval);
        }
    }, [showDuplicateAlert, onCancel]);

    const handleSubmit = async () => {
        if (rating === 0 || content.trim() === "") return; // 필수 조건

        setIsSubmitting(true);
        setError("");
        setShowDuplicateAlert(false);

        try {
            // 새로 생성된 모델인지 기존 DB 모델인지 구분
            const isNewModel = typeof modelId === 'string' && modelId.startsWith('model-');
            
            let response;
            
            if (isNewModel) {
                // 새로 생성된 모델의 경우: 로컬 저장 또는 다른 방식으로 처리
                console.log('새로 생성된 모델에 대한 리뷰:', { modelId, rating, content });
                
                // 임시로 성공 응답 모방 (실제로는 로컬 스토리지나 다른 방식으로 저장)
                setTimeout(() => {
                    const mockReview = {
                        id: `review-${Date.now()}`,
                        modelId,
                        rating,
                        content,
                        createdAt: new Date().toISOString(),
                        authorName: '사용자' // 실제로는 userProfile에서 가져와야 함
                    };
                    onSuccess(mockReview);
                }, 1000);
                return;
            } else {
                // 기존 DB 모델의 경우: API 호출
                if (isEditMode && reviewId) {
                    // 수정 모드: PUT 요청
                    response = await fetch(buildApiUrl(`/reviews/${reviewId}`), {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include", // 쿠키 포함
                        body: JSON.stringify({ rating, content }),
                    });
                } else {
                    // 등록 모드: POST 요청
                    response = await fetch(buildApiUrl(`/models/${modelId}/reviews`), {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include", // 쿠키 포함
                        body: JSON.stringify({ rating, content }),
                    });
                }

                const result = await response.json();
                
                // 디버깅: 응답 상태와 내용 확인
                console.log('응답 상태:', response.status);
                console.log('응답 내용:', result);
                
                if (isEditMode) {
                    // 수정 모드일 때
                    if (result.success) {
                        onSuccess(result.response);
                    } else {
                        setError(result.error?.message || "리뷰 수정에 실패했습니다.");
                    }
                } else {
                    // 등록 모드일 때
                    // 중복 리뷰 에러 처리 (409 또는 400 상태 코드와 특정 메시지)
                    if (response.status === 409 || 
                        (response.status === 400 && 
                         (result.error?.includes("Review already exists") || 
                          result.error?.includes("이미 리뷰") ||
                          result.message?.includes("Review already exists") ||
                          result.message?.includes("이미 리뷰")))) {
                        console.log('중복 리뷰 감지, 다이얼로그 표시');
                        setShowDuplicateAlert(true);
                        return;
                    }

                    if (result.success) {
                        onSuccess(result.response);
                    } else {
                        setError(result.error?.message || "리뷰 등록에 실패했습니다.");
                    }
                }
            }
        } catch (error) {
            console.error("리뷰 등록 중 오류:", error);
            setError("네트워크 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 별점 & 피드백 필수 조건
    const isFormValid = rating > 0 && content.trim() !== "";

    return (
        <Card className="p-8 w-full max-w-2xl mx-auto space-y-6">
            {/* 중복 리뷰 알림 */}
            {showDuplicateAlert && (
                <Alert variant="destructive" className="mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>이미 리뷰를 작성하셨습니다</AlertTitle>
                    <AlertDescription className="space-y-2">
                        <p>이 모델에 대한 리뷰를 이미 작성하셨습니다. 한 모델당 하나의 리뷰만 작성할 수 있습니다.</p>
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium">{countdown}초</span> 후 자동으로 닫힙니다.
                        </p>
                    </AlertDescription>
                </Alert>
            )}
                {/* 에러 메시지 */}
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>오류가 발생했습니다</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

            <div>
                <Label className="block mb-2">평점</Label>
                <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    size="lg"
                    showText
                />
            </div>

            <div>
                <Label className="block mb-2">상세 피드백</Label>
                <Textarea
                    placeholder="결과물에 대한 피드백을 입력하세요..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-24 w-full"
                />
            </div>

            <div className="flex gap-3 pt-4">
                {onCancel && (
                    <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
                        취소
                    </Button>
                )}
                <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid || isSubmitting}
                >
                    {isSubmitting ? 
                        (isEditMode ? "수정 중..." : "등록 중...") : 
                        (isEditMode ? "리뷰 수정" : "리뷰 등록")
                    }
                </Button>
            </div>
        </Card>
    );
}
