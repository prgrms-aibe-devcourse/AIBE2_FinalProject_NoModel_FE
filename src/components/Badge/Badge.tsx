import React from 'react';
import type { BadgeProps } from './Badge.types';
import './Badge.css';

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  color,
  className = '',
  ...rest
}) => {
  const badgeClasses = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    color && `badge--color-${color}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClasses} {...rest}>
      {children}
    </span>
  );
};