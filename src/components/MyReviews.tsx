import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { NavigationBar } from './NavigationBar';
import { DynamicFontSize } from './common/DynamicFontSize';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Search, Star, Edit, Trash2, MessageSquare, Calendar, ExternalLink } from 'lucide-react';
import { UserProfile } from '../App';
import { MyReviewResponse, ReviewRequest } from '../types/model';
import { getMyAllReviews, updateMyReview, deleteMyReview } from '../services/reviewApi';

interface MyReviewsProps {
  userProfile: UserProfile | null;
  onBack: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onNewProject: () => void;
  onCreateModel: () => void;
  onMarketplace: () => void;
  onMyPage: () => void;
  onAdmin: () => void;
  onPointsSubscription: () => void;
}

export function MyReviews({
  userProfile,
  onBack,
  onLogin,
  onLogout,
  onNewProject,
  onCreateModel,
  onMarketplace,
  onMyPage,
  onAdmin,
  onPointsSubscription
}: MyReviewsProps) {
  const [reviews, setReviews] = useState<MyReviewResponse[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<MyReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 리뷰 상세/수정 다이얼로그 상태
  const [selectedReview, setSelectedReview] = useState<MyReviewResponse | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<ReviewRequest>({
    rating: 1,
    content: ''
  });
  
  // 삭제 다이얼로그 상태
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<MyReviewResponse | null>(null);

  // 리뷰 목록 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      if (!userProfile) return;
      
      try {
        setLoading(true);
        const response = await getMyAllReviews();
        
        if (response.success) {
          // API 응답 데이터 검증 및 정리
          const validReviews = Array.isArray(response.response) 
            ? response.response.filter(isValidReview)
            : [];
            
          console.log('받은 리뷰 데이터:', validReviews); // 디버깅용
          console.log('원본 응답:', response.response); // 디버깅용
          setReviews(validReviews);
          setFilteredReviews(validReviews);
        } else {
          console.error('리뷰 조회 실패:', response.error);
          setReviews([]);
          setFilteredReviews([]);
        }
      } catch (error) {
        console.error('리뷰 조회 중 오류:', error);
        setReviews([]);
        setFilteredReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userProfile]);

  // 검색 필터링
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredReviews(reviews);
    } else {
      const filtered = reviews.filter(review =>
        review.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredReviews(filtered);
    }
  }, [searchQuery, reviews]);

  // 리뷰 클릭 핸들러
  const handleReviewClick = (review: MyReviewResponse) => {
    setSelectedReview(review);
    setEditForm({
      rating: review.rating,
      content: review.content
    });
    setIsEditMode(false);
  };

  // 수정 모드 토글
  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode && selectedReview) {
      setEditForm({
        rating: selectedReview.rating,
        content: selectedReview.content
      });
    }
  };

  // 리뷰 수정 저장
  const handleSaveEdit = async () => {
    if (!selectedReview) return;

    try {
      const response = await updateMyReview(selectedReview.reviewId, editForm);
      
      if (response.success) {
        // 목록 업데이트
        const updatedReviews = reviews.map(review =>
          review.reviewId === selectedReview.reviewId
            ? { ...review, ...response.response }
            : review
        );
        setReviews(updatedReviews);
        setFilteredReviews(updatedReviews);
        
        // 선택된 리뷰 업데이트
        setSelectedReview({ ...selectedReview, ...response.response });
        setIsEditMode(false);
      } else {
        alert('리뷰 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('리뷰 수정 중 오류:', error);
      alert('리뷰 수정 중 오류가 발생했습니다.');
    }
  };

  // 삭제 확인 다이얼로그 열기
  const handleDeleteClick = (review: MyReviewResponse) => {
    setReviewToDelete(review);
    setShowDeleteDialog(true);
  };

  // 리뷰 삭제 실행
  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;

    try {
      const response = await deleteMyReview(reviewToDelete.reviewId);
      
      if (response.success) {
        // 목록에서 제거
        const updatedReviews = reviews.filter(review => review.reviewId !== reviewToDelete.reviewId);
        setReviews(updatedReviews);
        setFilteredReviews(updatedReviews);
        
        // 다이얼로그 닫기
        setShowDeleteDialog(false);
        setReviewToDelete(null);
        
        // 상세 다이얼로그도 닫기 (삭제된 리뷰가 열려있다면)
        if (selectedReview?.reviewId === reviewToDelete.reviewId) {
          setSelectedReview(null);
        }
      } else {
        alert('리뷰 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('리뷰 삭제 중 오류:', error);
      alert('리뷰 삭제 중 오류가 발생했습니다.');
    }
  };

  // 별점 렌더링
  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${interactive ? 'cursor-pointer' : ''} ${
              star <= rating ? 'fill-current text-yellow-400' : 'text-gray-300'
            }`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return '-';
    }
    
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 리뷰 데이터 유효성 검사
  const isValidReview = (review: any): review is MyReviewResponse => {
    return review && 
           typeof review.reviewId === 'number' &&
           typeof review.modelId === 'number' &&
           typeof review.modelName === 'string' &&
           typeof review.rating === 'number' &&
           typeof review.content === 'string';
  };

  if (!userProfile) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background-primary)' }}>
      <NavigationBar
        onLogin={onLogin}
        onLogout={onLogout}
        onAdGeneration={onNewProject}
        onModelCreation={onCreateModel}
        onMarketplace={onMarketplace}
        onMyPage={onMyPage}
        onHome={onNewProject}
        onAdmin={onAdmin}
        isAdmin={userProfile?.role === 'ADMIN'}
        isLoggedIn={!!userProfile}
        isLandingPage={false}
        onPointsSubscription={onPointsSubscription}
        showBackButton={true}
        onBack={onBack}
        currentPage="my-reviews"
      />

      <main className="page-container">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="p-2"
              style={{
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-8)'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1
                style={{
                  fontSize: 'var(--font-size-title1)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                내 리뷰
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                작성한 리뷰를 확인하고 관리하세요
              </p>
            </div>
          </div>

          {/* 검색 바 */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
              style={{ color: 'var(--color-text-tertiary)' }} />
            <Input
              placeholder="모델명 또는 리뷰 내용으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              style={{
                borderRadius: 'var(--radius-8)',
                borderColor: 'var(--color-border-primary)',
                backgroundColor: 'var(--color-input-background)'
              }}
            />
          </div>
        </div>

        {/* 리뷰 목록 */}
        {loading ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--color-text-secondary)' }}>로딩 중...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto mb-4" 
              style={{ color: 'var(--color-text-tertiary)' }} />
            <h3 className="mb-2"
              style={{
                fontSize: 'var(--font-size-title3)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)'
              }}
            >
              {searchQuery ? '검색 결과가 없습니다' : '작성한 리뷰가 없습니다'}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {searchQuery ? '다른 검색어로 시도해보세요' : '모델을 사용한 후 리뷰를 작성해보세요'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              총 {filteredReviews.length}개의 리뷰
            </p>
            
            <div className="grid gap-4">
              {filteredReviews.map((review) => (
                <Card
                  key={review.reviewId}
                  className="p-6 cursor-pointer transition-all hover:shadow-lg"
                  style={{
                    backgroundColor: 'var(--color-background-primary)',
                    borderColor: 'var(--color-border-primary)',
                    borderRadius: 'var(--radius-12)',
                    boxShadow: 'var(--shadow-tiny)'
                  }}
                  onClick={() => handleReviewClick(review)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-tiny)';
                  }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          style={{
                            fontSize: 'var(--font-size-regular)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-text-primary)'
                          }}
                        >
                          {review.modelName}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {renderStars(review.rating)}
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                          {review.rating}.0
                        </span>
                      </div>

                      <p
                        className="line-clamp-2 mb-3"
                        style={{
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--font-size-small)',
                          lineHeight: '1.5'
                        }}
                      >
                        {review.content}
                      </p>

                      <div className="flex items-center gap-4 text-xs" 
                        style={{ color: 'var(--color-text-tertiary)' }}>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>작성일: {formatDate(review.createdAt)}</span>
                        </div>
                        {review.updatedAt !== review.createdAt && (
                          <div className="flex items-center gap-1">
                            <Edit className="w-3 h-3" />
                            <span>수정일: {formatDate(review.updatedAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <ExternalLink className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 리뷰 상세/수정 다이얼로그 */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedReview?.modelName} 리뷰</span>
              <div className="flex items-center gap-2">
                {!isEditMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditToggle}
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    수정
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedReview && handleDeleteClick(selectedReview)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                  삭제
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? '리뷰를 수정하세요' : '리뷰 상세 정보'}
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-6">
              {/* 평점 */}
              <div>
                <label className="block text-sm font-medium mb-2" 
                  style={{ color: 'var(--color-text-primary)' }}>
                  평점
                </label>
                {isEditMode ? (
                  <div className="flex items-center gap-2">
                    {renderStars(editForm.rating, true, (rating) => 
                      setEditForm(prev => ({ ...prev, rating }))
                    )}
                    <span className="text-sm font-medium ml-2">
                      {editForm.rating}.0
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {renderStars(selectedReview.rating)}
                    <span className="text-sm font-medium ml-2">
                      {selectedReview.rating}.0
                    </span>
                  </div>
                )}
              </div>

              {/* 리뷰 내용 */}
              <div>
                <label className="block text-sm font-medium mb-2" 
                  style={{ color: 'var(--color-text-primary)' }}>
                  리뷰 내용
                </label>
                {isEditMode ? (
                  <Textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="리뷰를 작성해주세요..."
                    className="min-h-32"
                    style={{
                      borderRadius: 'var(--radius-8)',
                      borderColor: 'var(--color-border-primary)'
                    }}
                  />
                ) : (
                  <p
                    className="p-3 rounded-lg whitespace-pre-wrap"
                    style={{
                      backgroundColor: 'var(--color-background-secondary)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-small)',
                      lineHeight: '1.6'
                    }}
                  >
                    {selectedReview.content}
                  </p>
                )}
              </div>

              {/* 작성/수정 정보 */}
              <div className="flex flex-col gap-2 text-xs" 
                style={{ color: 'var(--color-text-tertiary)' }}>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>작성일: {formatDate(selectedReview.createdAt)}</span>
                </div>
                {selectedReview.updatedAt !== selectedReview.createdAt && (
                  <div className="flex items-center gap-1">
                    <Edit className="w-3 h-3" />
                    <span>수정일: {formatDate(selectedReview.updatedAt)}</span>
                  </div>
                )}
              </div>

              {/* 버튼 영역 */}
              {isEditMode && (
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleEditToggle}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    style={{
                      backgroundColor: 'var(--color-brand-primary)',
                      color: 'var(--color-utility-white)'
                    }}
                  >
                    저장
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>리뷰 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 리뷰를 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다.
              {reviewToDelete && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm">{reviewToDelete.modelName}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {reviewToDelete.content}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
