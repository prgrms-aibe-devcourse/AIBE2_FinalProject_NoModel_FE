import type { ReactNode, HTMLAttributes } from 'react';

export type BadgeVariant = 'default' | 'filled' | 'outlined' | 'ghost';
export type BadgeSize = 'small' | 'medium' | 'large';
export type BadgeColor = 
  | 'blue' 
  | 'red' 
  | 'green' 
  | 'orange' 
  | 'yellow' 
  | 'indigo' 
  | 'purple' 
  | 'gray';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Content to be displayed inside the badge
   */
  children: ReactNode;
  
  /**
   * Visual style variant of the badge
   * @default 'default'
   */
  variant?: BadgeVariant;
  
  /**
   * Size of the badge
   * @default 'medium'
   */
  size?: BadgeSize;
  
  /**
   * Color theme of the badge
   */
  color?: BadgeColor;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}