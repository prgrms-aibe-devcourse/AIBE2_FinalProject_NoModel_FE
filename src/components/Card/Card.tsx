import React from 'react';
import type { CardProps } from './Card.types';
import './Card.css';

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  shadow = 'low',
  interactive = false,
  className = '',
  onClick,
  id,
  ...rest
}) => {
  const cardClasses = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    `card--shadow-${shadow}`,
    interactive && 'card--interactive',
    className
  ].filter(Boolean).join(' ');

  if (onClick) {
    return (
      <button
        className={cardClasses}
        onClick={onClick}
        role="button"
        tabIndex={0}
        id={id}
        type="button"
      >
        {children}
      </button>
    );
  }

  return (
    <div
      className={cardClasses}
      id={id}
      {...rest}
    >
      {children}
    </div>
  );
};