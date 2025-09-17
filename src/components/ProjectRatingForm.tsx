import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { StarRating } from "./StarRating";

interface ProjectRatingFormProps {
    modelId: number; // 리뷰를 등록할 모델 ID
    onSuccess: (review: any) => void;
    onCancel?: () => void;
}

export function ProjectRatingForm({ modelId, onSuccess, onCancel }: ProjectRatingFormProps) {
    const [rating, setRating] = useState<number>(0);
    const [content, setContent] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0 || content.trim() === "") return; // ✅ 필수 조건
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8080/api/models/${modelId}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // ✅ 쿠키 포함
                body: JSON.stringify({ rating, content }),
            });

            const result = await response.json();
            if (result.success) {
                onSuccess(result.response);
            } else {
                alert(`리뷰 등록 실패: ${result.error?.message}`);
            }
        } catch (error) {
            console.error("리뷰 등록 중 오류:", error);
            alert("리뷰 등록 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 별점 & 피드백 필수 조건
    const isFormValid = rating > 0 && content.trim() !== "";

    return (
        <Card className="p-8 w-full max-w-2xl mx-auto space-y-6"> {/* ✅ 넓이 확장 */}
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
                    {isSubmitting ? "등록 중..." : "리뷰 등록"}
                </Button>
            </div>
        </Card>
    );
}
