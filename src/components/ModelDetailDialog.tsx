import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { DefaultAvatar } from './common/DefaultAvatar';
import { Skeleton } from './ui/skeleton';
import {
  Star, Users, Download, Eye, Calendar, Crown,
  Image as ImageIcon, FileText, ExternalLink, Loader2, Flag, MessageSquare, Plus, Coins, X
} from 'lucide-react';
import { getModelFullDetail } from '../services/modelApi';
import axiosInstance from '../services/AxiosInstance';
import { AIModelDetailResponse, FileInfo, ReviewResponse } from '../types/model';
import { toast } from 'sonner';
import { ImageViewer } from './ImageViewer';
import { ModelReportModal } from './ModelReportModal';
import { ProjectRatingForm } from './ProjectRatingForm';

interface ModelDetailDialogProps {
  modelId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onModelSelect?: (modelId: number) => void;
  onReport?: (modelId: number, modelName: string) => void;
}

export const ModelDetailDialog: React.FC<ModelDetailDialogProps> = ({
  modelId,
  open,
  onOpenChange,
  onModelSelect,
  onReport
}) => {
  const [modelDetail, setModelDetail] = useState<AIModelDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 리뷰 데이터 별도 관리
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  // 이미지 뷰어 상태
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageFiles, setImageFiles] = useState<FileInfo[]>([]);
  
  // 신고 모달 상태
  const [reportModalOpen, setReportModalOpen] = useState(false);
  
  // 리뷰 작성 다이얼로그 상태
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  
  // 포인트 리워드 토스트 상태
  const [showRewardToast, setShowRewardToast] = useState(false);
  const [toastProgress, setToastProgress] = useState(100);
  const [isToastPaused, setIsToastPaused] = useState(false);

  useEffect(() => {
    if (open && modelId) {
      fetchModelDetail();
      fetchReviews();
    } else {
      setModelDetail(null);
      setError(null);
      setReviews([]);
    }
  }, [open, modelId]);

  // 토스트 프로그레스 바 관리
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

  const fetchModelDetail = async () => {
    if (!modelId) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 모델 상세 정보 요청 - modelId:', modelId);
      const response = await getModelFullDetail(modelId);
      console.log('📦 모델 API 응답 전체:', response);
      
      if (response.success) {
        console.log('✅ 모델 상세 정보:', response.response);
        setModelDetail(response.response);
        
        // 이미지 파일들 분리
        const images = response.response.files.filter(file => 
          file.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        );
        setImageFiles(images);
      } else {
        console.error('❌ 모델 API 응답 실패:', response.error);
        setError('모델 정보를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('💥 모델 상세 정보 조회 에러:', err);
      setError('모델 정보를 불러오는 중 오류가 발생했습니다.');
      toast.error('모델 정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!modelId) return;

    setReviewsLoading(true);

    try {
      console.log('🔍 리뷰 목록 요청 - modelId:', modelId);
      const response = await axiosInstance.get(`/models/${modelId}/reviews`);
      console.log('📦 리뷰 API 응답 전체:', response);
      console.log('📦 리뷰 API 응답 data:', response.data);
      console.log('📦 리뷰 API 응답 status:', response.status);
      
      if (response.data && response.data.success) {
        console.log('✅ 리뷰 목록:', response.data.response);
        console.log('📊 리뷰 개수:', response.data.response?.length || 0);
        
        // 서버 응답을 ReviewResponse 형태로 변환
        const convertedReviews: ReviewResponse[] = response.data.response.map((apiReview: any) => {
          console.log('🔄 리뷰 변환:', apiReview);
          
          // 우선순위에 따른 리뷰어 이름 결정
          let reviewerName = apiReview.reviewerName;  // 1순위
          if (!reviewerName) {
            reviewerName = apiReview.username;        // 2순위
          }
          if (!reviewerName) {
            reviewerName = `사용자${apiReview.reviewerId}`; // 3순위 (폴백)
          }
          
          return {
            reviewId: apiReview.id,
            reviewerName: reviewerName,
            rating: apiReview.rating,
            comment: apiReview.content,
            createdAt: apiReview.createdAt
          };
        });
        
        setReviews(convertedReviews);
      } else {
        console.error('❌ 리뷰 API 응답 실패:', response.data);
        console.error('❌ 에러 상세:', response.data?.error);
        setReviews([]);
      }
    } catch (err: any) {
      console.error('💥 리뷰 조회 에러:', err);
      console.error('💥 에러 응답:', err.response);
      console.error('💥 에러 메시지:', err.message);
      if (err.response) {
        console.error('💥 HTTP 상태:', err.response.status);
        console.error('💥 응답 데이터:', err.response.data);
      }
      setReviews([]);
    } finally {
      setReviewsLoading(false);
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

  const handleReport = () => {
    if (modelDetail) {
      if (onReport) {
        onReport(modelDetail.modelId, modelDetail.modelName);
      } else {
        setReportModalOpen(true);
      }
    }
  };

  const handleImageClick = (imageIndex: number) => {
    setCurrentImageIndex(imageIndex);
    setImageViewerOpen(true);
  };

  const handleReviewSuccess = (review: any) => {
    console.log("🎉 ModelDetailDialog - 리뷰 등록 성공:", review);
    setReviewDialogOpen(false);
    
    console.log("🍞 기본 토스트 알림 표시");
    toast.success("리뷰가 성공적으로 등록되었습니다!");
    
    console.log("🎁 포인트 리워드 토스트 표시");
    // 포인트 리워드 토스트 표시
    setShowRewardToast(true);
    
    console.log("🔄 리뷰 목록 다시 불러오기");
    // 리뷰 목록 다시 불러오기
    fetchReviews();
  };

  // 토스트 닫기 함수
  const closeToast = () => {
    setShowRewardToast(false);
    setToastProgress(100);
    setIsToastPaused(false);
  };

  const isImageFile = (fileUrl: string) => {
    return fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  };

  const FilePreview = ({ file, imageIndex }: { file: FileInfo; imageIndex?: number }) => {
    const isImage = isImageFile(file.fileUrl);

    return (
      <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex-shrink-0">
          {isImage ? (
            <div 
              className="relative cursor-pointer group"
              onClick={() => imageIndex !== undefined && handleImageClick(imageIndex)}
            >
              <img
                src={file.fileUrl}
                alt={file.fileName}
                className="w-12 h-12 object-cover rounded border group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon className="h-6 w-6 text-white drop-shadow-lg" />
              </div>
            </div>
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
  };

  const ReviewItem = ({ review }: { review: ReviewResponse }) => {
    const reviewerName = review.reviewerName || '익명';
    const reviewComment = review.comment || '';

    return (
      <div className="flex gap-3 p-4 border rounded-lg">
        <DefaultAvatar 
          name={reviewerName}
          className="h-10 w-10"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{reviewerName}</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm">{review.rating || 0}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">{reviewComment}</p>
          <p className="text-xs text-gray-400">
            {review.createdAt ? formatDate(review.createdAt) : '날짜 정보 없음'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="!max-w-[60vw] !w-[60vw] max-h-[90vh] overflow-y-auto"
        style={{ maxWidth: '60vw', width: '60vw' }}
      >
        <DialogHeader>
          <DialogTitle className="sr-only">
            모델 상세 정보
          </DialogTitle>
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

        {modelDetail && !loading && !error && (
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="flex items-start gap-4">
              <DefaultAvatar 
                name={modelDetail.ownerName}
                className="h-16 w-16"
              />
              <div className="flex-1 pr-4">
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
                <div className="flex gap-3 mt-4">
                  {onModelSelect && (
                    <Button onClick={handleModelSelect}>
                      모델 선택
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={handleReport}
                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    신고하기
                  </Button>
                </div>
              </div>
            </div>

            {/* 이미지 갤러리 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                이미지 갤러리 {imageFiles.length > 0 && `(${imageFiles.length})`}
              </h4>
              {imageFiles.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imageFiles.map((image, index) => (
                    <div
                      key={image.fileId}
                      className="relative group cursor-pointer rounded-lg overflow-hidden border hover:border-blue-300 transition-colors"
                      onClick={() => handleImageClick(index)}
                    >
                      <img
                        src={image.fileUrl}
                        alt={image.fileName}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/api/placeholder/300/200?text=Image+Not+Found';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                      </div>
                      {image.isPrimary && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-blue-500 text-white text-xs">
                            주요
                          </Badge>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                        <p className="text-white text-xs truncate">{image.fileName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>등록된 이미지가 없습니다.</p>
                </div>
              )}
            </div>

            {/* 통계 정보 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <Star className="h-6 w-6 text-yellow-400 fill-current flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">평점</p>
                    <p className="font-semibold text-lg">{modelDetail.avgRating.toFixed(1)}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <Users className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">리뷰</p>
                    <p className="font-semibold text-lg">{reviews.length.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <Eye className="h-6 w-6 text-purple-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">조회수</p>
                    <p className="font-semibold text-lg">{modelDetail.viewCount.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <Download className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500 whitespace-nowrap">사용횟수</p>
                    <p className="font-semibold text-lg">{modelDetail.usageCount.toLocaleString()}</p>
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

            {/* 기타 파일 목록 */}
            {modelDetail.files.filter(file => !isImageFile(file.fileUrl)).length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-4">기타 파일</h4>
                <div className="space-y-2">
                  {modelDetail.files
                    .filter(file => !isImageFile(file.fileUrl))
                    .map((file) => (
                      <FilePreview key={file.fileId} file={file} />
                    ))}
                </div>
              </div>
            )}

            <hr className="border-gray-200" />

            {/* 리뷰 목록 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">
                  리뷰 ({reviews.length})
                  {reviewsLoading && <Loader2 className="h-4 w-4 animate-spin inline ml-2" />}
                </h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setReviewDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  리뷰 작성하기
                </Button>
              </div>
              {(() => {
                console.log('🎭 리뷰 렌더링 체크:');
                console.log('- reviews:', reviews);
                console.log('- reviews 타입:', typeof reviews);
                console.log('- reviews 배열인가?', Array.isArray(reviews));
                console.log('- reviews 길이:', reviews?.length);
                return null;
              })()}
              {reviewsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3 p-4 border rounded-lg">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {reviews.map((review, index) => {
                    console.log(`📋 리뷰 ${index + 1}:`, review);
                    return (
                      <ReviewItem key={review.reviewId} review={review} />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="mb-2">아직 리뷰가 없습니다.</p>
                  <p className="text-sm">첫 번째 리뷰를 작성해보세요!</p>
                </div>
              )}
            </div>

            {/* 생성일 */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>생성일: {formatDate(modelDetail.createdAt)}</span>
            </div>
          </div>
        )}

        {/* 이미지 뷰어 */}
        <ImageViewer
          images={imageFiles}
          currentIndex={currentImageIndex}
          open={imageViewerOpen}
          onOpenChange={setImageViewerOpen}
          onImageChange={setCurrentImageIndex}
        />

        {/* 신고 모달 */}
        <ModelReportModal
          model={null}
          modelId={modelDetail?.modelId || null}
          modelName={modelDetail?.modelName || ''}
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          onReportSuccess={(reportId) => {
            console.log('Report submitted with ID:', reportId);
          }}
        />

        {/* 리뷰 작성 다이얼로그 */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>리뷰 작성</DialogTitle>
              <DialogDescription>
                {modelDetail?.modelName}에 대한 리뷰를 작성해주세요!
              </DialogDescription>
            </DialogHeader>
            {modelDetail && (
              <ProjectRatingForm
                modelId={modelDetail.modelId}
                onSuccess={handleReviewSuccess}
                onCancel={() => setReviewDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* 포인트 리워드 토스트 알림 */}
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
      </DialogContent>
    </Dialog>
  );
};