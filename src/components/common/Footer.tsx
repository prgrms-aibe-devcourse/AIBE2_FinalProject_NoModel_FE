import React from 'react';
import { cn } from '../ui/utils';

export interface FooterLink {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
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
  icon: React.ComponentType<{ className?: string }>;
}

interface FooterProps {
  logo?: {
    text?: string;
    image?: string;
    href?: string;
    onClick?: () => void;
  };
  description?: string;
  sections?: FooterSection[];
  socialLinks?: SocialLink[];
  newsletter?: {
    title: string;
    description?: string;
    placeholder?: string;
    buttonText?: string;
    onSubmit: (email: string) => void;
  };
  bottomLinks?: FooterLink[];
  copyright?: string;
  variant?: 'default' | 'minimal' | 'dark';
  className?: string;
}

export function Footer({
  logo,
  description,
  sections = [],
  socialLinks = [],
  newsletter,
  bottomLinks = [],
  copyright,
  variant = 'default',
  className
}: FooterProps) {
  const [email, setEmail] = React.useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && newsletter?.onSubmit) {
      newsletter.onSubmit(email);
      setEmail('');
    }
  };

  const renderLogo = () => {
    if (!logo) return null;

    const logoContent = (
      <div className="flex items-center gap-3">
        {logo.image && (
          <img 
            src={logo.image} 
            alt="Logo" 
            className="w-8 h-8 object-contain"
          />
        )}
        {logo.text && (
          <span 
            className="text-xl font-bold"
            style={{ 
              color: variant === 'dark' ? 'var(--color-utility-white)' : 'var(--color-text-primary)' 
            }}
          >
            {logo.text}
          </span>
        )}
      </div>
    );

    if (logo.onClick) {
      return (
        <button onClick={logo.onClick} className="flex items-center">
          {logoContent}
        </button>
      );
    }

    if (logo.href) {
      return (
        <a href={logo.href} className="flex items-center">
          {logoContent}
        </a>
      );
    }

    return logoContent;
  };

  const renderLink = (link: FooterLink) => {
    const linkElement = (
      <span 
        className="text-sm transition-colors hover:text-primary cursor-pointer"
        style={{ 
          color: variant === 'dark' ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)' 
        }}
      >
        {link.label}
      </span>
    );

    if (link.onClick) {
      return (
        <button key={link.id} onClick={link.onClick}>
          {linkElement}
        </button>
      );
    }

    if (link.href) {
      return (
        <a key={link.id} href={link.href}>
          {linkElement}
        </a>
      );
    }

    return <div key={link.id}>{linkElement}</div>;
  };

  if (variant === 'minimal') {
    return (
      <footer 
        className={cn("py-8", className)}
        style={{ 
          backgroundColor: 'var(--color-background-secondary)',
          borderTop: '1px solid var(--color-border-primary)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {renderLogo()}
              {copyright && (
                <p 
                  className="text-sm"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {copyright}
                </p>
              )}
            </div>
            
            {bottomLinks.length > 0 && (
              <div className="flex items-center gap-6">
                {bottomLinks.map((link) => renderLink(link))}
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    className="p-2 rounded-md transition-colors hover:bg-muted"
                    aria-label={social.platform}
                  >
                    <social.icon 
                      className="w-5 h-5"
                      style={{ color: 'var(--color-text-secondary)' }}
                    />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer 
      className={cn("pt-16 pb-8", className)}
      style={{ 
        backgroundColor: variant === 'dark' 
          ? 'var(--color-background-marketing)' 
          : 'var(--color-background-secondary)' 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              {renderLogo()}
            </div>
            {description && (
              <p 
                className="text-sm mb-6 leading-relaxed"
                style={{ 
                  color: variant === 'dark' ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)' 
                }}
              >
                {description}
              </p>
            )}
            
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    className="p-2 rounded-md transition-colors hover:bg-muted"
                    aria-label={social.platform}
                    style={{
                      backgroundColor: variant === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'var(--color-background-tertiary)'
                    }}
                  >
                    <social.icon 
                      className="w-5 h-5"
                      style={{ 
                        color: variant === 'dark' ? 'var(--color-utility-white)' : 'var(--color-text-secondary)' 
                      }}
                    />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link Sections */}
          {sections.map((section) => (
            <div key={section.id}>
              <h3 
                className="font-semibold text-sm mb-4"
                style={{ 
                  color: variant === 'dark' ? 'var(--color-utility-white)' : 'var(--color-text-primary)' 
                }}
              >
                {section.title}
              </h3>
              <div className="space-y-3">
                {section.links.map((link) => renderLink(link))}
              </div>
            </div>
          ))}

          {/* Newsletter */}
          {newsletter && (
            <div>
              <h3 
                className="font-semibold text-sm mb-4"
                style={{ 
                  color: variant === 'dark' ? 'var(--color-utility-white)' : 'var(--color-text-primary)' 
                }}
              >
                {newsletter.title}
              </h3>
              {newsletter.description && (
                <p 
                  className="text-sm mb-4"
                  style={{ 
                    color: variant === 'dark' ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)' 
                  }}
                >
                  {newsletter.description}
                </p>
              )}
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder={newsletter.placeholder || "Enter your email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-md border transition-colors"
                  style={{
                    backgroundColor: variant === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'var(--color-background-primary)',
                    borderColor: variant === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'var(--color-border-primary)',
                    color: variant === 'dark' ? 'var(--color-utility-white)' : 'var(--color-text-primary)'
                  }}
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-sm font-medium rounded-md transition-colors"
                  style={{
                    backgroundColor: 'var(--color-brand-primary)',
                    color: 'var(--color-utility-white)'
                  }}
                >
                  {newsletter.buttonText || "Subscribe"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div 
          className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ 
            borderTop: variant === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid var(--color-border-primary)' 
          }}
        >
          {copyright && (
            <p 
              className="text-sm"
              style={{ 
                color: variant === 'dark' ? 'var(--color-text-tertiary)' : 'var(--color-text-tertiary)' 
              }}
            >
              {copyright}
            </p>
          )}

          {bottomLinks.length > 0 && (
            <div className="flex items-center gap-6 flex-wrap">
              {bottomLinks.map((link) => renderLink(link))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}