import type { ReactNode, InputHTMLAttributes } from 'react';

export type InputVariant = 'default' | 'filled' | 'outlined';
export type InputSize = 'small' | 'medium' | 'large';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label text displayed above the input
   */
  label?: string;
  
  /**
   * Placeholder text displayed in the input
   */
  placeholder?: string;
  
  /**
   * Error message to display below the input
   */
  error?: string;
  
  /**
   * Helper text displayed below the input when no error
   */
  helperText?: string;
  
  /**
   * Whether the input is required
   * @default false
   */
  required?: boolean;
  
  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Whether the input should take full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Size of the input
   * @default 'medium'
   */
  size?: InputSize;
  
  /**
   * Visual style variant of the input
   * @default 'default'
   */
  variant?: InputVariant;
  
  /**
   * Icon to display on the left side of the input
   */
  leftIcon?: ReactNode;
  
  /**
   * Icon to display on the right side of the input
   */
  rightIcon?: ReactNode;
  
  /**
   * Click handler for left icon
   */
  onLeftIconClick?: () => void;
  
  /**
   * Click handler for right icon
   */
  onRightIconClick?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}