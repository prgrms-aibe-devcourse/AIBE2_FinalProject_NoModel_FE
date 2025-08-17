/**
 * Hero Component
 * Modern hero section with flexible layouts and animations
 */

import React, { useEffect, useState } from 'react';
import type { HeroProps, HeroAction } from './Hero.types';
import { Button } from '../Button/Button';
import './Hero.css';

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  actions = [],
  media,
  backgroundImage,
  backgroundVideo,
  layout = 'center',
  size = 'large',
  overlayOpacity = 0.5,
  textColor = 'auto',
  gradient = false,
  bottomContent,
  showScrollIndicator = false,
  animation = 'fade-up',
  className = '',
  style,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleActionClick = (action: HeroAction, event: React.MouseEvent) => {
    if (action.disabled) {
      event.preventDefault();
      return;
    }

    if (action.onClick) {
      event.preventDefault();
      action.onClick();
    }
  };

  const renderAction = (action: HeroAction) => {
    const content = (
      <Button
        variant={action.variant || 'primary'}
        size={action.size || 'large'}
        loading={action.loading}
        disabled={action.disabled}
        onClick={(e) => handleActionClick(action, e)}
      >
        {action.icon && <span className="hero__action-icon">{action.icon}</span>}
        {action.label}
        {action.external && (
          <svg 
            className="hero__external-icon" 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
            aria-hidden="true"
          >
            <path 
              d="M6 4H12M12 4V10M12 4L6 10" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
      </Button>
    );

    if (action.href && !action.onClick) {
      return (
        <a
          key={action.id}
          href={action.href}
          className="hero__action-link"
          target={action.external ? '_blank' : undefined}
          rel={action.external ? 'noopener noreferrer' : undefined}
          tabIndex={action.disabled ? -1 : undefined}
          aria-disabled={action.disabled}
        >
          {content}
        </a>
      );
    }

    return <div key={action.id}>{content}</div>;
  };

  const renderScrollIndicator = () => (
    <button
      type="button"
      className="hero__scroll-indicator"
      onClick={() => {
        const nextSection = document.querySelector('main > *:not(.hero)') as HTMLElement;
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      }}
      aria-label="아래로 스크롤"
    >
      <svg 
        className="hero__scroll-arrow" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none"
        aria-hidden="true"
      >
        <path 
          d="M7 13L12 18L17 13" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M7 6L12 11L17 6" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  const heroClassName = [
    'hero',
    `hero--${layout}`,
    `hero--${size}`,
    `hero--${textColor}`,
    gradient && 'hero--gradient',
    isLoaded && `hero--${animation}`,
    backgroundImage && 'hero--with-bg-image',
    backgroundVideo && 'hero--with-bg-video',
    className,
  ].filter(Boolean).join(' ');

  const heroStyle = {
    ...style,
    ...(backgroundImage && {
      '--hero-bg-image': `url(${backgroundImage})`,
    }),
    ...(overlayOpacity !== 0.5 && {
      '--hero-overlay-opacity': overlayOpacity,
    }),
  } as React.CSSProperties;

  return (
    <section 
      className={heroClassName} 
      style={heroStyle}
      role="banner"
      {...props}
    >
      {/* Background Video */}
      {backgroundVideo && (
        <div className="hero__background-video">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="hero__video"
            onLoadedData={() => setVideoLoaded(true)}
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          {!videoLoaded && <div className="hero__video-placeholder" />}
        </div>
      )}

      {/* Background Overlay */}
      {(backgroundImage || backgroundVideo) && (
        <div className="hero__overlay" />
      )}

      <div className="hero__container">
        <div className="hero__content">
          {/* Text Content */}
          <div className="hero__text">
            {subtitle && (
              <p className="hero__subtitle">
                {subtitle}
              </p>
            )}
            
            <h1 className="hero__title">
              {title}
            </h1>
            
            {description && (
              <div className="hero__description">
                {typeof description === 'string' ? (
                  <p>{description}</p>
                ) : (
                  description
                )}
              </div>
            )}
            
            {/* Actions */}
            {actions.length > 0 && (
              <div className="hero__actions">
                {actions.map(renderAction)}
              </div>
            )}
            
            {/* Bottom Content */}
            {bottomContent && (
              <div className="hero__bottom-content">
                {bottomContent}
              </div>
            )}
          </div>

          {/* Media Content */}
          {media && layout === 'split' && (
            <div className="hero__media">
              {media}
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        {showScrollIndicator && renderScrollIndicator()}
      </div>

      {/* Full Width Media for non-split layouts */}
      {media && layout !== 'split' && (
        <div className="hero__media hero__media--full">
          {media}
        </div>
      )}
    </section>
  );
};