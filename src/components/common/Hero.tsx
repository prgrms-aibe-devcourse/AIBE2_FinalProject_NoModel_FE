import React from 'react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, ArrowRight } from 'lucide-react';

export interface HeroAction {
  id: string;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
}

interface HeroProps {
  variant?: 'default' | 'centered' | 'split' | 'minimal' | 'video';
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  badge?: {
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  actions?: HeroAction[];
  image?: {
    src: string;
    alt: string;
    position?: 'right' | 'left' | 'background';
  };
  video?: {
    src: string;
    poster?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
  };
  stats?: Array<{
    value: string;
    label: string;
  }>;
  backgroundGradient?: boolean;
  backgroundPattern?: boolean;
  className?: string;
}

export function Hero({
  variant = 'default',
  eyebrow,
  title,
  subtitle,
  description,
  badge,
  actions = [],
  image,
  video,
  stats,
  backgroundGradient = false,
  backgroundPattern = false,
  className
}: HeroProps) {
  const renderAction = (action: HeroAction) => {
    const Icon = action.icon;
    
    return (
      <Button
        key={action.id}
        variant={action.variant || 'default'}
        size={action.size || 'lg'}
        onClick={action.onClick}
        className="gap-2"
      >
        {Icon && action.iconPosition !== 'right' && <Icon className="w-4 h-4" />}
        {action.label}
        {Icon && action.iconPosition === 'right' && <Icon className="w-4 h-4" />}
        {!Icon && action.variant === 'default' && <ArrowRight className="w-4 h-4" />}
      </Button>
    );
  };

  const renderContent = () => (
    <div className={cn(
      "space-y-6",
      variant === 'centered' && "text-center max-w-4xl mx-auto",
      variant === 'split' && "max-w-2xl"
    )}>
      {/* Badge */}
      {badge && (
        <div className={cn(variant === 'centered' && "flex justify-center")}>
          <Badge variant={badge.variant || 'default'} className="text-sm">
            {badge.label}
          </Badge>
        </div>
      )}

      {/* Eyebrow */}
      {eyebrow && (
        <p 
          className="text-sm font-medium tracking-wide uppercase"
          style={{ color: 'var(--color-brand-primary)' }}
        >
          {eyebrow}
        </p>
      )}

      {/* Title */}
      <div className="space-y-4">
        <h1 
          className={cn(
            "font-bold leading-tight",
            variant === 'minimal' ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl lg:text-6xl"
          )}
          style={{ 
            color: image?.position === 'background' ? 'var(--color-utility-white)' : 'var(--color-text-primary)',
            fontSize: variant === 'minimal' ? undefined : 'var(--font-size-title1)',
            letterSpacing: '-0.025em'
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <h2 
            className="text-xl md:text-2xl font-medium"
            style={{ 
              color: image?.position === 'background' 
                ? 'rgba(255, 255, 255, 0.9)' 
                : 'var(--color-text-secondary)' 
            }}
          >
            {subtitle}
          </h2>
        )}
      </div>

      {/* Description */}
      {description && (
        <p 
          className={cn(
            "leading-relaxed",
            variant === 'minimal' ? "text-base" : "text-lg md:text-xl"
          )}
          style={{ 
            color: image?.position === 'background' 
              ? 'rgba(255, 255, 255, 0.8)' 
              : 'var(--color-text-secondary)',
            maxWidth: variant === 'centered' ? '42rem' : undefined,
            margin: variant === 'centered' ? '0 auto' : undefined
          }}
        >
          {description}
        </p>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <div className={cn(
          "flex gap-4 pt-2",
          variant === 'centered' && "justify-center",
          "flex-wrap"
        )}>
          {actions.map(renderAction)}
        </div>
      )}

      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className={cn(
          "flex gap-8 pt-8",
          variant === 'centered' && "justify-center"
        )}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div 
                className="text-2xl md:text-3xl font-bold"
                style={{ 
                  color: image?.position === 'background' 
                    ? 'var(--color-utility-white)' 
                    : 'var(--color-text-primary)' 
                }}
              >
                {stat.value}
              </div>
              <div 
                className="text-sm"
                style={{ 
                  color: image?.position === 'background' 
                    ? 'rgba(255, 255, 255, 0.8)' 
                    : 'var(--color-text-secondary)' 
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMedia = () => {
    if (video) {
      return (
        <div className="relative rounded-2xl overflow-hidden">
          <video
            src={video.src}
            poster={video.poster}
            autoPlay={video.autoPlay}
            loop={video.loop}
            muted={video.muted}
            controls={!video.autoPlay}
            className="w-full h-full object-cover"
          />
          {variant === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                className="p-4 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                onClick={() => {
                  // Handle play button click
                }}
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </button>
            </div>
          )}
        </div>
      );
    }

    if (image) {
      return (
        <div className="relative">
          <img
            src={image.src}
            alt={image.alt}
            className={cn(
              "object-cover",
              image.position !== 'background' ? "rounded-2xl w-full h-full" : "w-full h-full"
            )}
          />
        </div>
      );
    }

    return null;
  };

  // Background image variant
  if (image?.position === 'background') {
    return (
      <section 
        className={cn(
          "relative min-h-[70vh] flex items-center",
          backgroundPattern && "bg-grid-pattern",
          className
        )}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {renderContent()}
          </div>
        </div>
      </section>
    );
  }

  // Split layout variant
  if (variant === 'split') {
    return (
      <section 
        className={cn(
          "py-20 lg:py-32 relative",
          backgroundGradient && "bg-gradient-to-br from-background via-background to-muted/30",
          backgroundPattern && "bg-grid-pattern",
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className={cn(
              image?.position === 'left' && "order-2"
            )}>
              {renderContent()}
            </div>
            <div className={cn(
              "aspect-square lg:aspect-[4/3]",
              image?.position === 'left' && "order-1"
            )}>
              {renderMedia()}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Centered and default variants
  return (
    <section 
      className={cn(
        variant === 'minimal' ? "py-16 lg:py-24" : "py-20 lg:py-32",
        "relative",
        backgroundGradient && "bg-gradient-to-br from-background via-background to-muted/30",
        backgroundPattern && "bg-grid-pattern",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
        
        {/* Media below content for centered variant */}
        {(variant === 'centered' || variant === 'video') && (image || video) && (
          <div className="mt-12 lg:mt-20 max-w-5xl mx-auto">
            <div className={cn(
              video ? "aspect-video" : "aspect-[16/10]",
              "relative"
            )}>
              {renderMedia()}
            </div>
          </div>
        )}
      </div>

      {/* Background decoration */}
      {backgroundGradient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20"
            style={{ 
              background: `radial-gradient(circle, var(--color-brand-primary), transparent 70%)` 
            }}
          />
        </div>
      )}
    </section>
  );
}