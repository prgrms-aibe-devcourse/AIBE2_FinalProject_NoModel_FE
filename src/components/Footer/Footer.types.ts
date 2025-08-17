import type { ReactNode, HTMLAttributes } from 'react';

export interface FooterLink {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  icon?: ReactNode;
}

export interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  id: string;
  platform: string;
  href: string;
  icon: ReactNode;
  label: string;
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /**
   * Company logo or name
   */
  logo?: ReactNode;
  
  /**
   * Company description or tagline
   */
  description?: string;
  
  /**
   * Footer sections with links
   */
  sections?: FooterSection[];
  
  /**
   * Social media links
   */
  socialLinks?: SocialLink[];
  
  /**
   * Copyright text
   */
  copyright?: string;
  
  /**
   * Bottom links (Privacy, Terms, etc.)
   */
  bottomLinks?: FooterLink[];
  
  /**
   * Newsletter signup content
   */
  newsletter?: {
    title: string;
    description?: string;
    placeholder?: string;
    buttonText?: string;
    onSubmit?: (email: string) => void;
  };
  
  /**
   * Footer variant
   * @default 'default'
   */
  variant?: 'default' | 'minimal' | 'extended';
  
  /**
   * Background color variant
   * @default 'default'
   */
  background?: 'default' | 'dark' | 'light';
  
  /**
   * Additional CSS classes
   */
  className?: string;
}