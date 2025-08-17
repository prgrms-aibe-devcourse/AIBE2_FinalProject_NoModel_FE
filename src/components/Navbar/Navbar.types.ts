import type { ReactNode, HTMLAttributes } from 'react';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  children?: NavItem[];
}

export interface NavbarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * Logo content (text or image)
   */
  logo?: ReactNode;
  
  /**
   * Navigation items
   */
  items?: NavItem[];
  
  /**
   * Right side content (user menu, buttons, etc.)
   */
  rightContent?: ReactNode;
  
  /**
   * Whether to show mobile menu button
   * @default true
   */
  showMobileMenu?: boolean;
  
  /**
   * Whether navbar is fixed to top
   * @default false
   */
  fixed?: boolean;
  
  /**
   * Navbar variant
   * @default 'default'
   */
  variant?: 'default' | 'transparent' | 'filled';
  
  /**
   * Current active item ID
   */
  activeItem?: string;
  
  /**
   * Callback when nav item is clicked
   */
  onItemClick?: (item: NavItem) => void;
  
  /**
   * Callback when mobile menu is toggled
   */
  onMobileMenuToggle?: (isOpen: boolean) => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}