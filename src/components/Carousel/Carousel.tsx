import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { CarouselProps } from './Carousel.types';
import './Carousel.css';

export const Carousel: React.FC<CarouselProps> = ({
  items,
  orientation = 'horizontal',
  showArrows = true,
  showIndicators = true,
  indicatorStyle = 'dots',
  autoPlay = false,
  autoPlayInterval = 5000,
  loop = true,
  pauseOnHover = true,
  initialSlide = 0,
  onSlideChange,
  className = '',
  'aria-label': ariaLabel = 'Image carousel',
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialSlide);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const intervalRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const totalSlides = items.length;

  const goToSlide = useCallback((index: number) => {
    if (index < 0) {
      setCurrentIndex(loop ? totalSlides - 1 : 0);
    } else if (index >= totalSlides) {
      setCurrentIndex(loop ? 0 : totalSlides - 1);
    } else {
      setCurrentIndex(index);
    }
  }, [totalSlides, loop]);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && isPlaying && totalSlides > 1) {
      intervalRef.current = window.setInterval(nextSlide, autoPlayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, isPlaying, nextSlide, autoPlayInterval, totalSlides]);

  // Notify about slide changes
  useEffect(() => {
    onSlideChange?.(currentIndex);
  }, [currentIndex, onSlideChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!carouselRef.current?.contains(event.target as Node)) return;

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          nextSlide();
          break;
        case 'Home':
          event.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          event.preventDefault();
          goToSlide(totalSlides - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide, totalSlides]);

  const handleMouseEnter = () => {
    if (pauseOnHover && autoPlay) {
      setIsPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && autoPlay) {
      setIsPlaying(true);
    }
  };

  const carouselClasses = [
    'carousel',
    `carousel--${orientation}`,
    className
  ].filter(Boolean).join(' ');

  const slideStyle = {
    transform: orientation === 'horizontal' 
      ? `translateX(-${currentIndex * 100}%)`
      : `translateY(-${currentIndex * 100}%)`
  };

  // Icon components
  const ChevronLeftIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15,18 9,12 15,6"/>
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9,18 15,12 9,6"/>
    </svg>
  );

  const ChevronUpIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="18,15 12,9 6,15"/>
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6,9 12,15 18,9"/>
    </svg>
  );

  if (totalSlides === 0) {
    return null;
  }

  return (
    <div
      ref={carouselRef}
      className={carouselClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <div className="carousel__container">
        {/* Navigation Arrows */}
        {showArrows && totalSlides > 1 && (
          <>
            <button
              className="carousel__arrow carousel__arrow--prev"
              onClick={prevSlide}
              aria-label="Previous slide"
              disabled={!loop && currentIndex === 0}
            >
              {orientation === 'horizontal' ? <ChevronLeftIcon /> : <ChevronUpIcon />}
            </button>
            <button
              className="carousel__arrow carousel__arrow--next"
              onClick={nextSlide}
              aria-label="Next slide"
              disabled={!loop && currentIndex === totalSlides - 1}
            >
              {orientation === 'horizontal' ? <ChevronRightIcon /> : <ChevronDownIcon />}
            </button>
          </>
        )}

        {/* Slides */}
        <div className="carousel__viewport">
          <div 
            className="carousel__slides"
            style={slideStyle}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className="carousel__slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${totalSlides}${item.alt ? `: ${item.alt}` : ''}`}
                aria-hidden={index !== currentIndex}
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>

        {/* Indicators */}
        {showIndicators && totalSlides > 1 && (
          <div className="carousel__indicators">
            {items.map((_, index) => (
              <button
                key={index}
                className={`carousel__indicator carousel__indicator--${indicatorStyle} ${
                  index === currentIndex ? 'carousel__indicator--active' : ''
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              >
                {indicatorStyle === 'numbers' && (
                  <span>{index + 1}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Screen reader announcement */}
      <div className="carousel__sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {totalSlides}
      </div>
    </div>
  );
};