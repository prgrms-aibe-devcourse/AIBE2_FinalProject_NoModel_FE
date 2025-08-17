/**
 * Footer Component
 * Comprehensive footer with links, social media, and newsletter signup
 */

import React, { useState } from 'react';
import type { FooterProps, FooterLink, FooterSection, SocialLink } from './Footer.types';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import './Footer.css';

export const Footer: React.FC<FooterProps> = ({
  logo,
  description,
  sections = [],
  socialLinks = [],
  copyright,
  bottomLinks = [],
  newsletter,
  variant = 'default',
  background = 'default',
  className = '',
  ...props
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim() || !newsletter?.onSubmit) return;
    
    setNewsletterLoading(true);
    try {
      await newsletter.onSubmit(newsletterEmail);
      setNewsletterEmail('');
    } catch (error) {
      console.error('Newsletter signup failed:', error);
    } finally {
      setNewsletterLoading(false);
    }
  };

  const handleLinkClick = (link: FooterLink, event: React.MouseEvent) => {
    if (link.onClick) {
      event.preventDefault();
      link.onClick();
    }
  };

  const renderLink = (link: FooterLink) => {
    const linkClassName = [
      'footer__link',
      link.icon && 'footer__link--with-icon',
    ].filter(Boolean).join(' ');

    const content = (
      <>
        {link.icon && <span className="footer__link-icon">{link.icon}</span>}
        <span>{link.label}</span>
        {link.external && (
          <svg 
            className="footer__external-icon" 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none"
            aria-hidden="true"
          >
            <path 
              d="M3.5 3H8.5M8.5 3V8M8.5 3L3.5 8" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
      </>
    );

    if (link.href) {
      return (
        <a
          key={link.id}
          href={link.href}
          className={linkClassName}
          onClick={(e) => handleLinkClick(link, e)}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        key={link.id}
        type="button"
        className={linkClassName}
        onClick={(e) => handleLinkClick(link, e)}
      >
        {content}
      </button>
    );
  };

  const renderSection = (section: FooterSection) => (
    <div key={section.id} className="footer__section">
      <h3 className="footer__section-title">{section.title}</h3>
      <ul className="footer__link-list" role="list">
        {section.links.map((link) => (
          <li key={link.id} role="listitem">
            {renderLink(link)}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderSocialLink = (social: SocialLink) => (
    <a
      key={social.id}
      href={social.href}
      className="footer__social-link"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      title={social.platform}
    >
      {social.icon}
    </a>
  );

  const footerClassName = [
    'footer',
    `footer--${variant}`,
    `footer--${background}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <footer className={footerClassName} role="contentinfo" {...props}>
      <div className="footer__container">
        {/* Main Content */}
        {variant !== 'minimal' && (
          <div className="footer__main">
            {/* Company Info */}
            <div className="footer__company">
              {logo && (
                <div className="footer__logo">
                  {logo}
                </div>
              )}
              
              {description && (
                <p className="footer__description">
                  {description}
                </p>
              )}
              
              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="footer__social">
                  <span className="footer__social-title">팔로우하기</span>
                  <div className="footer__social-links">
                    {socialLinks.map(renderSocialLink)}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Sections */}
            {sections.length > 0 && (
              <div className="footer__sections">
                {sections.map(renderSection)}
              </div>
            )}

            {/* Newsletter */}
            {newsletter && (
              <div className="footer__newsletter">
                <h3 className="footer__newsletter-title">{newsletter.title}</h3>
                {newsletter.description && (
                  <p className="footer__newsletter-description">
                    {newsletter.description}
                  </p>
                )}
                
                <form 
                  className="footer__newsletter-form" 
                  onSubmit={handleNewsletterSubmit}
                  noValidate
                >
                  <div className="footer__newsletter-input">
                    <Input
                      type="email"
                      placeholder={newsletter.placeholder || '이메일을 입력하세요'}
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                      aria-label="뉴스레터 이메일"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!newsletterEmail.trim() || newsletterLoading}
                    loading={newsletterLoading}
                    aria-label="뉴스레터 구독"
                  >
                    {newsletter.buttonText || '구독'}
                  </Button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            {/* Copyright */}
            {copyright && (
              <p className="footer__copyright">
                {copyright}
              </p>
            )}

            {/* Bottom Links */}
            {bottomLinks.length > 0 && (
              <nav className="footer__bottom-nav" aria-label="Footer navigation">
                <ul className="footer__bottom-links" role="list">
                  {bottomLinks.map((link) => (
                    <li key={link.id} role="listitem">
                      {renderLink(link)}
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};