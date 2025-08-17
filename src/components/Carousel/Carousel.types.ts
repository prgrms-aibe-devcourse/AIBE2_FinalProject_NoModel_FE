import type { ReactNode } from 'react';

export type CarouselOrientation = 'horizontal' | 'vertical';
export type CarouselIndicatorStyle = 'dots' | 'lines' | 'numbers';

export interface CarouselItem {
  id: string;
  content: ReactNode;
  alt?: string;
}

export interface CarouselProps {
  /**
   * Array of carousel items to display
   */
  items: CarouselItem[];
  
  /**
   * Orientation of the carousel
   * @default 'horizontal'
   */
  orientation?: CarouselOrientation;
  
  /**
   * Whether to show navigation arrows
   * @default true
   */
  showArrows?: boolean;
  
  /**
   * Whether to show indicators
   * @default true
   */
  showIndicators?: boolean;
  
  /**
   * Style of the indicators
   * @default 'dots'
   */
  indicatorStyle?: CarouselIndicatorStyle;
  
  /**
   * Whether to auto-play the carousel
   * @default false
   */
  autoPlay?: boolean;
  
  /**
   * Auto-play interval in milliseconds
   * @default 5000
   */
  autoPlayInterval?: number;
  
  /**
   * Whether the carousel should loop
   * @default true
   */
  loop?: boolean;
  
  /**
   * Whether to pause auto-play on hover
   * @default true
   */
  pauseOnHover?: boolean;
  
  /**
   * Initial slide index
   * @default 0
   */
  initialSlide?: number;
  
  /**
   * Callback when slide changes
   */
  onSlideChange?: (index: number) => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Accessible label for the carousel
   */
  'aria-label'?: string;
}