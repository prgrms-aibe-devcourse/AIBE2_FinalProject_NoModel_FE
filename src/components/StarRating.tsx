import React, { useState } from 'react';
import { Button } from './ui/button';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const ratingTexts: Record<number, string> = {
  1: '매우 불만족',
  2: '불만족',
  3: '보통',
  4: '만족',
  5: '매우 만족'
};

export function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 'md', 
  showText = false,
  className = ''
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!readonly) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div 
        className="flex items-center gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            className="p-0 h-auto"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            disabled={readonly}
            style={{
              cursor: readonly ? 'default' : 'pointer',
              backgroundColor: 'transparent'
            }}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors`}
              style={{
                color: star <= displayRating ? 'var(--color-semantic-orange)' : 'var(--color-text-quaternary)',
                fill: star <= displayRating ? 'var(--color-semantic-orange)' : 'transparent'
              }}
            />
          </Button>
        ))}
      </div>
      
      {showText && displayRating > 0 && (
        <span 
          className="text-sm ml-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {ratingTexts[displayRating]}
        </span>
      )}
      
      {!showText && displayRating > 0 && (
        <span 
          className="text-sm ml-2"
          style={{ 
            color: 'var(--color-text-tertiary)',
            fontSize: 'var(--font-size-small)'
          }}
        >
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}