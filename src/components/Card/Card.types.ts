import type { ReactNode } from 'react';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type CardPadding = 'none' | 'small' | 'medium' | 'large';
export type CardShadow = 'none' | 'tiny' | 'low' | 'medium' | 'high';

export interface CardProps {
  /**
   * Content to be displayed inside the card
   */
  children: ReactNode;
  
  /**
   * Visual style variant of the card
   * @default 'default'
   */
  variant?: CardVariant;
  
  /**
   * Internal padding of the card
   * @default 'medium'
   */
  padding?: CardPadding;
  
  /**
   * Shadow style of the card
   * @default 'low'
   */
  shadow?: CardShadow;
  
  /**
   * Whether the card should have interactive states
   * @default false
   */
  interactive?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Click handler - when provided, card becomes clickable
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
  
  /**
   * HTML id attribute
   */
  id?: string;
  
  /**
   * Additional props
   */
  [key: string]: any;
}