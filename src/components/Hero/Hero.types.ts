import type { ReactNode, HTMLAttributes } from 'react';

export interface HeroAction {
  id: string;
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  external?: boolean;
}

export interface HeroProps extends HTMLAttributes<HTMLElement> {
  /**
   * Main headline text
   */
  title: string;
  
  /**
   * Subtitle or description
   */
  subtitle?: string;
  
  /**
   * Additional description content
   */
  description?: ReactNode;
  
  /**
   * Call-to-action buttons
   */
  actions?: HeroAction[];
  
  /**
   * Hero image or media content
   */
  media?: ReactNode;
  
  /**
   * Background image URL
   */
  backgroundImage?: string;
  
  /**
   * Background video URL
   */
  backgroundVideo?: string;
  
  /**
   * Hero layout variant
   * @default 'center'
   */
  layout?: 'center' | 'left' | 'right' | 'split';
  
  /**
   * Hero size variant
   * @default 'large'
   */
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  
  /**
   * Background overlay opacity (0-1)
   * @default 0.5
   */
  overlayOpacity?: number;
  
  /**
   * Text color theme
   * @default 'auto'
   */
  textColor?: 'auto' | 'light' | 'dark';
  
  /**
   * Enable gradient background
   * @default false
   */
  gradient?: boolean;
  
  /**
   * Additional content below actions
   */
  bottomContent?: ReactNode;
  
  /**
   * Scroll indicator
   * @default false
   */
  showScrollIndicator?: boolean;
  
  /**
   * Animation variants
   * @default 'fade-up'
   */
  animation?: 'none' | 'fade-up' | 'fade-in' | 'slide-up' | 'zoom-in';
  
  /**
   * Additional CSS classes
   */
  className?: string;
}