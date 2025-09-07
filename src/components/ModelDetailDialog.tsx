import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';
import {
  Star, Users, Download, Eye, Calendar, Crown,
  Image as ImageIcon, FileText, ExternalLink, Loader2
} from 'lucide-react';
import { getModelFullDetail } from '../services/modelApi';
import { AIModelDetailResponse, FileInfo, ReviewResponse } from '../types/model';
import { toast } from 'sonner';

interface ModelDetailDialogProps {
  modelId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onModelSelect?: (modelId: number) => void;
}

export const ModelDetailDialog: React.FC<ModelDetailDialogProps> = ({
  modelId,
  open,
  onOpenChange,
  onModelSelect
}) => {
  const [modelDetail, setModelDetail] = useState<AIModelDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && modelId) {
      fetchModelDetail();
    } else {
      setModelDetail(null);
      setError(null);
    }
  }, [open, modelId]);

  const fetchModelDetail = async () => {
    if (!modelId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getModelFullDetail(modelId);
      if (response.success) {
        setModelDetail(response.response);
      } else {
        setError('모델 정보를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('모델 상세 정보 조회 에러:', err);
      setError('모델 정보를 불러오는 중 오류가 발생했습니다.');
      toast.error('모델 정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleModelSelect = () => {
    if (modelDetail && onModelSelect) {
      onModelSelect(modelDetail.modelId);
      onOpenChange(false);
    }
  };

  const FilePreview = ({ file }: { file: FileInfo }) => (
    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0">
        {file.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
          <ImageIcon className="h-8 w-8 text-blue-500" />
        ) : (
          <FileText className="h-8 w-8 text-gray-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.fileName}</p>
        {file.isPrimary && (
          <Badge variant="outline" className="text-xs mt-1">
            주요 파일
          </Badge>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.open(file.fileUrl, '_blank')}
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  );

  const ReviewItem = ({ review }: { review: ReviewResponse }) => (
    <div className="flex gap-3 p-4 border rounded-lg">
      <Avatar>
        <AvatarFallback>
          {review.reviewerName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium">{review.reviewerName}</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm">{review.rating}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
        <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>모델 상세 정보</DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchModelDetail} variant="outline">
              다시 시도
            </Button>
          </div>
        )}

        {modelDetail && !loading && (
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback>
                  {modelDetail.modelName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold">{modelDetail.modelName}</h3>
                  {modelDetail.ownType === 'ADMIN' && (
                    <Badge className="bg-yellow-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      관리자
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-2">by {modelDetail.ownerName}</p>
                <p className="text-sm text-gray-600">{modelDetail.description}</p>
              </div>
              {onModelSelect && (
                <Button onClick={handleModelSelect}>
                  이 모델 선택
                </Button>
              )}
            </div>

            {/* 통계 정보 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <div>
                    <p className="text-sm text-gray-500">평점</p>
                    <p className="font-semibold">{modelDetail.avgRating.toFixed(1)}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">리뷰</p>
                    <p className="font-semibold">{modelDetail.reviewCount.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <Download className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">다운로드</p>
                    <p className="font-semibold">{modelDetail.downloadCount.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <Eye className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500">조회</p>
                    <p className="font-semibold">{modelDetail.viewCount.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 가격 정보 */}
            {modelDetail.price > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">가격</span>
                    <span className="text-2xl font-bold text-green-600">
                      {modelDetail.price.toLocaleString()}원
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            <hr className="border-gray-200" />

            {/* 파일 목록 */}
            {modelDetail.files.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-4">관련 파일</h4>
                <div className="space-y-2">
                  {modelDetail.files.map((file) => (
                    <FilePreview key={file.fileId} file={file} />
                  ))}
                </div>
              </div>
            )}

            <hr className="border-gray-200" />

            {/* 리뷰 목록 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                리뷰 ({modelDetail.reviews.length})
              </h4>
              {modelDetail.reviews.length > 0 ? (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {modelDetail.reviews.map((review) => (
                    <ReviewItem key={review.reviewId} review={review} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  아직 리뷰가 없습니다.
                </p>
              )}
            </div>

            {/* 생성일 */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>생성일: {formatDate(modelDetail.createdAt)}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};