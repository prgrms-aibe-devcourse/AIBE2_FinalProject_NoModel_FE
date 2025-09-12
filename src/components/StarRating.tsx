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

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-0',
    md: 'p-1',
    lg: 'p-1'
  };

  const gapClasses = {
    sm: 'gap-0',
    md: 'gap-1',
    lg: 'gap-1'
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const displayRating = rating;

  return (
    <div className={`flex items-center gap-1 ${className}`} style={{ maxWidth: '100%' }}>
      <div 
        className="flex items-center justify-between"
        style={{ 
          width: '100%',
          maxWidth: '100%'
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            className={`${buttonSizeClasses[size]} flex-1 hover:bg-transparent focus:bg-transparent active:bg-transparent`}
            onClick={() => handleStarClick(star)}
            onMouseDown={handleStarMouseDown}
            disabled={readonly}
            style={{
              cursor: readonly ? 'default' : 'pointer',
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: size === 'sm' ? '20px' : 'auto',
              padding: size === 'sm' ? '2px' : '4px',
              margin: '0px'
            }}
          >
            <Star
              className="transition-colors"
              style={{
                width: size === 'sm' ? '14px' : size === 'md' ? '20px' : '24px',
                height: size === 'sm' ? '14px' : size === 'md' ? '20px' : '24px',
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
    </div>
  );
}