import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { AlertTriangle, Loader2, Flag } from 'lucide-react';
import { reportModel } from '../services/modelApi';
import { AIModelDocument } from '../types/model';
import { toast } from 'sonner';

interface ModelReportModalProps {
  model: AIModelDocument | null;
  modelId?: number | null;
  modelName?: string;
  isOpen: boolean;
  onClose: () => void;
  onReportSuccess?: (reportId: number) => void;
}

export const ModelReportModal: React.FC<ModelReportModalProps> = ({
  model,
  modelId,
  modelName,
  isOpen,
  onClose,
  onReportSuccess
}) => {
  const [reasonDetail, setReasonDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const targetModelId = model?.modelId || modelId;
    if (!targetModelId) return;
    
    if (!reasonDetail.trim()) {
      toast.error('신고 사유를 입력해주세요.');
      return;
    }

    if (reasonDetail.length > 1000) {
      toast.error('신고 사유는 1000자 이하로 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await reportModel(targetModelId, {
        reasonDetail: reasonDetail.trim()
      });

      toast.success('신고가 접수되었습니다. 검토 후 처리해드리겠습니다.');
      
      if (onReportSuccess) {
        onReportSuccess(response.response.reportId);
      }
      
      handleClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '신고 처리 중 오류가 발생했습니다.';
      toast.error(errorMessage);
      
      // 중복 신고인 경우 모달을 닫음
      if (errorMessage.includes('이미 신고한 모델입니다') || errorMessage.includes('Report already exists')) {
        handleClose();
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReasonDetail('');
    setIsSubmitting(false);
    onClose();
  };

  if (!model && !modelId) return null;

  const displayName = model?.modelName || modelName || '알 수 없는 모델';
  const displayDeveloper = model?.developer || '알 수 없음';
  const displayCategory = model?.categoryType || '기타';
  const displayDescription = model?.shortDescription || '';
  const displayThumbnail = model?.thumbnailUrl || '/api/placeholder/60/60';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="!max-w-[500px] !w-[500px] !max-h-[80vh] flex flex-col !p-6"
        style={{ 
          width: '500px', 
          maxWidth: '500px',
          maxHeight: '80vh'
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-500" />
            <DialogTitle>모델 신고</DialogTitle>
          </div>
          <DialogDescription>
            부적절한 콘텐츠나 정책 위반 모델을 신고해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
        {/* 신고할 모델 정보 */}
        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
          <div className="flex items-start gap-3">
            <img
              src={displayThumbnail}
              alt={displayName}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-lg">{displayName}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    by {displayDeveloper}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {displayCategory}
                </Badge>
              </div>
              {displayDescription && (
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                  {displayDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 신고 사유 입력 */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="reasonDetail" className="text-sm font-medium">
              신고 사유 <span className="text-red-500">*</span>
            </label>
          </div>
          
          <Textarea
            id="reasonDetail"
            placeholder={`신고하시는 이유를 구체적으로 설명해주세요.

예: 부적절한 콘텐츠, 저작권 침해, 정책 위반 등`}
            value={reasonDetail}
            onChange={(e) => setReasonDetail(e.target.value)}
            maxLength={1000}
            rows={6}
            className="resize-none"
            disabled={isSubmitting}
          />
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              신고 내용은 관리자가 검토 후 처리됩니다.
            </div>
            <div className={`text-xs ${reasonDetail.length > 900 ? 'text-red-500' : 'text-gray-400'}`}>
              {reasonDetail.length}/1000
            </div>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-orange-800">
              <div className="font-medium mb-1">신고 시 주의사항</div>
              <ul className="space-y-1 list-disc list-inside">
                <li>허위 신고 시 이용 제재를 받을 수 있습니다.</li>
                <li>동일한 모델에 대한 중복 신고는 불가능합니다.</li>
                <li>신고 처리 결과는 별도 안내하지 않습니다.</li>
              </ul>
            </div>
          </div>
        </div>
        </div>
        
        {/* 액션 버튼 */}
        <div className="flex justify-end gap-3 mt-3">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !reasonDetail.trim()}
            className="!bg-red-500 hover:!bg-red-600 !text-white disabled:!bg-red-300 disabled:!text-red-100 disabled:cursor-not-allowed !border-red-500 disabled:!border-red-300"
            style={{
              backgroundColor: !reasonDetail.trim() || isSubmitting ? '#fca5a5' : '#ef4444',
              color: 'white',
              borderColor: !reasonDetail.trim() || isSubmitting ? '#fca5a5' : '#ef4444'
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                신고 처리 중...
              </>
            ) : (
              <>
                <Flag className="h-4 w-4 mr-2" />
                신고하기
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};