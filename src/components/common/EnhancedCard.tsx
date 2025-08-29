import React from 'react';
import { cn } from '../ui/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export interface EnhancedCardProps {
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
  image?: string;
  imageAlt?: string;
  imagePlacement?: 'top' | 'left' | 'right' | 'background';
  imageAspectRatio?: 'square' | 'video' | 'portrait' | 'wide';
  title: string;
  subtitle?: string;
  description?: string;
  badges?: Array<{ label: string; variant?: 'default' | 'secondary' | 'destructive' | 'outline' }>;
  rating?: number;
  ratingCount?: number;
  price?: string;
  originalPrice?: string;
  currency?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'default' | 'lg';
  }>;
  footer?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

export function EnhancedCard({
  variant = 'default',
  image,
  imageAlt = '',
  imagePlacement = 'top',
  imageAspectRatio = 'video',
  title,
  subtitle,
  description,
  badges,
  rating,
  ratingCount,
  price,
  originalPrice,
  currency = '₩',
  actions,
  footer,
  onClick,
  className,
  hoverable = true,
  selected = false,
  disabled = false
}: EnhancedCardProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[21/9]'
  };

  const isHorizontal = variant === 'horizontal' || imagePlacement === 'left' || imagePlacement === 'right';

  const renderImage = () => {
    if (!image) return null;

    const imageElement = (
      <div 
        className={cn(
          "relative overflow-hidden bg-muted",
          !isHorizontal && aspectRatioClasses[imageAspectRatio],
          isHorizontal && "w-1/3 h-full"
        )}
      >
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {badges && badges.length > 0 && imagePlacement === 'top' && (
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant || 'default'}>
                {badge.label}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );

    if (imagePlacement === 'background') {
      return (
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      );
    }

    return imageElement;
  };

  const renderRating = () => {
    if (!rating) return null;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4"
            fill={i < Math.floor(rating) ? 'var(--color-semantic-orange)' : 'none'}
            stroke="var(--color-semantic-orange)"
            strokeWidth="1"
            viewBox="0 0 24 24"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {rating.toFixed(1)}
        </span>
        {ratingCount && (
          <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            ({ratingCount})
          </span>
        )}
      </div>
    );
  };

  const renderPrice = () => {
    if (!price) return null;

    return (
      <div className="flex items-baseline gap-2">
        {originalPrice && (
          <span 
            className="text-sm line-through"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            {currency}{originalPrice}
          </span>
        )}
        <span 
          className="text-lg font-semibold"
          style={{ color: originalPrice ? 'var(--color-semantic-red)' : 'var(--color-text-primary)' }}
        >
          {currency}{price}
        </span>
        {originalPrice && (
          <Badge variant="destructive" className="text-xs">
            {Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100)}% OFF
          </Badge>
        )}
      </div>
    );
  };

  const cardContent = (
    <>
      {imagePlacement === 'background' && renderImage()}
      
      <div className={cn(
        "flex",
        isHorizontal ? "flex-row" : "flex-col",
        imagePlacement === 'background' && "relative z-10"
      )}>
        {imagePlacement === 'left' && renderImage()}
        {imagePlacement === 'top' && !isHorizontal && renderImage()}
        
        <div className={cn(
          "flex flex-col flex-1",
          variant === 'compact' ? "p-3" : "p-4 lg:p-6",
          imagePlacement === 'background' && "text-white"
        )}>
          {/* Badges for non-image placements */}
          {badges && badges.length > 0 && imagePlacement !== 'top' && (
            <div className="flex gap-2 flex-wrap mb-3">
              {badges.map((badge, index) => (
                <Badge key={index} variant={badge.variant || 'default'}>
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}

          {/* Title and Subtitle */}
          <div className="mb-2">
            <h3 
              className={cn(
                "font-semibold",
                variant === 'compact' ? "text-base" : "text-lg"
              )}
              style={{ 
                color: imagePlacement === 'background' ? 'inherit' : 'var(--color-text-primary)',
                fontSize: variant === 'featured' ? 'var(--font-size-title3)' : undefined
              }}
            >
              {title}
            </h3>
            {subtitle && (
              <p 
                className="text-sm mt-1"
                style={{ 
                  color: imagePlacement === 'background' ? 'inherit' : 'var(--color-text-secondary)' 
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Description */}
          {description && (
            <p 
              className={cn(
                "mb-4",
                variant === 'compact' ? "text-sm line-clamp-2" : "text-sm line-clamp-3"
              )}
              style={{ 
                color: imagePlacement === 'background' ? 'inherit' : 'var(--color-text-secondary)' 
              }}
            >
              {description}
            </p>
          )}

          {/* Rating */}
          {renderRating()}

          {/* Price */}
          <div className="mt-auto pt-4">
            {renderPrice()}
          </div>

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="flex gap-2 mt-4">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  size={action.size || 'default'}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  className="flex-1"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Footer */}
          {footer && (
            <div 
              className="mt-4 pt-4"
              style={{ borderTop: `1px solid var(--color-border-primary)` }}
            >
              {footer}
            </div>
          )}
        </div>
        
        {imagePlacement === 'right' && renderImage()}
      </div>
    </>
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden transition-all",
        hoverable && !disabled && "hover:shadow-lg cursor-pointer",
        selected && "ring-2 ring-primary",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      style={{
        backgroundColor: imagePlacement === 'background' ? 'transparent' : 'var(--color-background-primary)',
        border: imagePlacement === 'background' ? 'none' : '1px solid var(--color-border-primary)',
        borderRadius: 'var(--radius-12)',
        boxShadow: variant === 'featured' ? 'var(--shadow-medium)' : 'var(--shadow-low)'
      }}
      onClick={onClick}
    >
      {cardContent}
    </div>
  );
}