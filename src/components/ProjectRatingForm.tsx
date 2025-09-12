import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { StarRating } from './StarRating';
import { 
  Star, ThumbsUp, ThumbsDown, MessageCircle, Award, 
  Target, Lightbulb, TrendingUp, Save
} from 'lucide-react';
import { ProjectRating } from '../App';

interface ProjectRatingFormProps {
  existingRating?: ProjectRating;
  onSubmit: (rating: ProjectRating) => void;
  onCancel?: () => void;
}

export function ProjectRatingForm({ existingRating, onSubmit, onCancel }: ProjectRatingFormProps) {
  const [overallRating, setOverallRating] = useState(existingRating?.overallRating || 0);
  const [categoryRatings, setCategoryRatings] = useState({
    quality: existingRating?.categoryRatings.quality || 0,
    accuracy: existingRating?.categoryRatings.accuracy || 0,
    creativity: existingRating?.categoryRatings.creativity || 0,
    usefulness: existingRating?.categoryRatings.usefulness || 0
  });
  const [feedback, setFeedback] = useState(existingRating?.feedback || '');
  const [pros, setPros] = useState<string[]>(existingRating?.pros || []);
  const [cons, setCons] = useState<string[]>(existingRating?.cons || []);
  const [wouldRecommend, setWouldRecommend] = useState(existingRating?.wouldRecommend || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryInfo = {
    quality: { label: '이미지 품질', icon: Award, description: '생성된 이미지의 해상도와 선명도' },
    accuracy: { label: '프롬프트 정확도', icon: Target, description: '요청한 내용과의 일치도' },
    creativity: { label: '창의성', icon: Lightbulb, description: '독창적이고 인상적인 결과' },
    usefulness: { label: '유용성', icon: TrendingUp, description: '실제 사용 가능성과 활용도' }
  };

  const handleCategoryRatingChange = (category: keyof typeof categoryRatings, rating: number) => {
    setCategoryRatings(prev => ({ ...prev, [category]: rating }));
  };

  const addPro = () => {
    setPros(prev => [...prev, '']);
  };

  const addCon = () => {
    setCons(prev => [...prev, '']);
  };

  const updatePro = (index: number, value: string) => {
    setPros(prev => prev.map((pro, i) => i === index ? value : pro));
  };

  const updateCon = (index: number, value: string) => {
    setCons(prev => prev.map((con, i) => i === index ? value : con));
  };

  const removePro = (index: number) => {
    setPros(prev => prev.filter((_, i) => i !== index));
  };

  const removeCon = (index: number) => {
    setCons(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (overallRating === 0) {
      alert('전체 평점을 선택해주세요.');
      return;
    }

    setIsSubmitting(true);

    const rating: ProjectRating = {
      overallRating,
      categoryRatings,
      feedback,
      pros: pros.filter(pro => pro.trim() !== ''),
      cons: cons.filter(con => con.trim() !== ''),
      ratedAt: new Date(),
      wouldRecommend
    };

    // Simulate API call
    setTimeout(() => {
      onSubmit(rating);
      setIsSubmitting(false);
    }, 1000);
  };

  const isFormValid = overallRating > 0;

  return (
    <Card 
      className="p-6"
      style={{
        backgroundColor: 'var(--color-background-primary)',
        borderColor: 'var(--color-border-primary)',
        borderRadius: 'var(--radius-16)'
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Star 
            className="w-6 h-6"
            style={{ color: 'var(--color-semantic-orange)' }}
          />
          <h3 
            style={{
              fontSize: 'var(--font-size-title3)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            }}
          >
            {existingRating ? '평가 수정' : '결과물 평가'}
          </h3>
        </div>

        {/* Overall Rating */}
        <div className="space-y-3">
          <Label style={{ color: 'var(--color-text-primary)' }}>
            전체 만족도 <span style={{ color: 'var(--color-semantic-red)' }}>*</span>
          </Label>
          <div className="flex items-center gap-4">
            <StarRating
              rating={overallRating}
              onRatingChange={setOverallRating}
              size="lg"
              showText
            />
          </div>
        </div>

        <Separator />

        {/* Category Ratings */}
        <div className="space-y-4">
          <Label style={{ color: 'var(--color-text-primary)' }}>
            세부 평가
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(categoryInfo).map(([key, info]) => {
              const IconComponent = info.icon;
              return (
                <div 
                  key={key}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: 'var(--color-background-secondary)',
                    border: `1px solid var(--color-border-primary)`
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-brand-accent-tint)' }}
                    >
                      <IconComponent 
                        className="w-4 h-4"
                        style={{ color: 'var(--color-brand-primary)' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 
                        className="text-sm truncate"
                        style={{
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-primary)'
                        }}
                      >
                        {info.label}
                      </h4>
                      <p 
                        className="text-xs line-clamp-2"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        {info.description}
                      </p>
                    </div>
                  </div>
                  <div className="w-full">
                    <StarRating
                      rating={categoryRatings[key as keyof typeof categoryRatings]}
                      onRatingChange={(rating) => handleCategoryRatingChange(key as keyof typeof categoryRatings, rating)}
                      size="sm"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Feedback */}
        <div className="space-y-3">
          <Label style={{ color: 'var(--color-text-primary)' }}>
            상세 피드백
          </Label>
          <Textarea
            placeholder="결과물에 대한 상세한 의견을 남겨주세요..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-24"
            style={{
              borderRadius: 'var(--radius-8)',
              borderColor: 'var(--color-border-primary)',
              backgroundColor: 'var(--color-input-background)'
            }}
          />
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pros */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ThumbsUp 
                className="w-4 h-4"
                style={{ color: 'var(--color-semantic-green)' }}
              />
              <Label style={{ color: 'var(--color-text-primary)' }}>
                좋았던 점
              </Label>
            </div>
            <div className="space-y-2">
              {pros.map((pro, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={pro}
                    onChange={(e) => updatePro(index, e.target.value)}
                    placeholder="좋았던 점을 입력하세요"
                    className="flex-1 px-3 py-2 text-sm rounded-lg"
                    style={{
                      borderRadius: 'var(--radius-8)',
                      border: `1px solid var(--color-border-primary)`,
                      backgroundColor: 'var(--color-input-background)',
                      fontSize: 'var(--font-size-small)'
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePro(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addPro}
                className="w-full"
                style={{
                  borderRadius: 'var(--radius-8)',
                  borderColor: 'var(--color-semantic-green)',
                  color: 'var(--color-semantic-green)'
                }}
              >
                + 좋았던 점 추가
              </Button>
            </div>
          </div>

          {/* Cons */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ThumbsDown 
                className="w-4 h-4"
                style={{ color: 'var(--color-semantic-red)' }}
              />
              <Label style={{ color: 'var(--color-text-primary)' }}>
                아쉬웠던 점
              </Label>
            </div>
            <div className="space-y-2">
              {cons.map((con, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={con}
                    onChange={(e) => updateCon(index, e.target.value)}
                    placeholder="아쉬웠던 점을 입력하세요"
                    className="flex-1 px-3 py-2 text-sm rounded-lg"
                    style={{
                      borderRadius: 'var(--radius-8)',
                      border: `1px solid var(--color-border-primary)`,
                      backgroundColor: 'var(--color-input-background)',
                      fontSize: 'var(--font-size-small)'
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCon(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addCon}
                className="w-full"
                style={{
                  borderRadius: 'var(--radius-8)',
                  borderColor: 'var(--color-semantic-red)',
                  color: 'var(--color-semantic-red)'
                }}
              >
                + 아쉬웠던 점 추가
              </Button>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background-secondary)' }}>
          <div>
            <h4 
              style={{
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-regular)'
              }}
            >
              다른 사용자에게 추천하시겠습니까?
            </h4>
            <p 
              className="text-sm"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              비슷한 프로젝트를 진행하는 사용자들에게 도움이 됩니다
            </p>
          </div>
          <Switch
            checked={wouldRecommend}
            onCheckedChange={setWouldRecommend}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          {onCancel && (
            <Button 
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              style={{
                borderRadius: 'var(--radius-8)',
                borderColor: 'var(--color-border-primary)'
              }}
            >
              취소
            </Button>
          )}
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="flex-1"
            style={{
              backgroundColor: 'var(--color-brand-primary)',
              color: 'var(--color-utility-white)',
              borderRadius: 'var(--radius-8)',
              border: 'none',
              opacity: (!isFormValid || isSubmitting) ? 0.6 : 1
            }}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? '저장 중...' : existingRating ? '평가 수정' : '평가 저장'}
          </Button>
        </div>
      </div>
    </Card>
  );
}