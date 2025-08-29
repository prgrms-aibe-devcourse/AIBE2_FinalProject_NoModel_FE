import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../ui/utils';

export interface CarouselItem {
  id: string;
  content: React.ReactNode;
  image?: string;
  title?: string;
  description?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  className?: string;
  itemClassName?: string;
  variant?: 'default' | 'card' | 'fullWidth';
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide';
  gap?: number;
  slidesToShow?: number;
  onSlideChange?: (index: number) => void;
}

export function Carousel({
  items,
  autoPlay = false,
  autoPlayInterval = 5000,
  showIndicators = true,
  showArrows = true,
  className,
  itemClassName,
  variant = 'default',
  aspectRatio = 'video',
  gap = 16,
  slidesToShow = 1,
  onSlideChange
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[21/9]'
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    onSlideChange?.(index);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? items.length - slidesToShow : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex >= items.length - slidesToShow ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  useEffect(() => {
    if (autoPlay && !isHovered && items.length > slidesToShow) {
      const interval = setInterval(goToNext, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [currentIndex, autoPlay, autoPlayInterval, isHovered, items.length, slidesToShow]);

  const renderContent = (item: CarouselItem) => {
    if (item.content) {
      return item.content;
    }

    if (item.image) {
      return (
        <div className="relative w-full h-full">
          <img
            src={item.image}
            alt={item.title || ''}
            className="w-full h-full object-cover"
            style={{ borderRadius: 'var(--radius-12)' }}
          />
          {(item.title || item.description) && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              {item.title && (
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
              )}
              {item.description && (
                <p className="text-white/90 text-sm">{item.description}</p>
              )}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Carousel Container */}
      <div className="relative overflow-hidden" style={{ borderRadius: 'var(--radius-16)' }}>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / slidesToShow}%)`,
            gap: `${gap}px`
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex-shrink-0",
                aspectRatioClasses[aspectRatio],
                itemClassName
              )}
              style={{
                width: `calc(${100 / slidesToShow}% - ${(gap * (slidesToShow - 1)) / slidesToShow}px)`
              }}
            >
              {variant === 'card' ? (
                <div
                  className="h-full bg-background border"
                  style={{
                    borderRadius: 'var(--radius-12)',
                    borderColor: 'var(--color-border-primary)',
                    padding: 'var(--spacing-block)'
                  }}
                >
                  {renderContent(item)}
                </div>
              ) : (
                renderContent(item)
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && items.length > slidesToShow && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all"
            style={{
              backgroundColor: 'var(--color-background-primary)',
              boxShadow: 'var(--shadow-medium)',
              opacity: isHovered ? 1 : 0,
              transform: `translateY(-50%) translateX(${isHovered ? 0 : '-10px'})`
            }}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" style={{ color: 'var(--color-text-primary)' }} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all"
            style={{
              backgroundColor: 'var(--color-background-primary)',
              boxShadow: 'var(--shadow-medium)',
              opacity: isHovered ? 1 : 0,
              transform: `translateY(-50%) translateX(${isHovered ? 0 : '10px'})`
            }}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" style={{ color: 'var(--color-text-primary)' }} />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && items.length > slidesToShow && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(items.length / slidesToShow) }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index * slidesToShow)}
              className="transition-all"
              style={{
                width: currentIndex === index * slidesToShow ? '24px' : '8px',
                height: '8px',
                borderRadius: 'var(--radius-rounded)',
                backgroundColor: currentIndex === index * slidesToShow 
                  ? 'var(--color-brand-primary)' 
                  : 'var(--color-border-secondary)'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}