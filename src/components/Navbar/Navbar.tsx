/**
 * Navbar Component
 * Modern navigation bar with responsive design and mobile menu
 */

import React, { useState, useRef, useEffect } from 'react';
import type { NavbarProps, NavItem } from './Navbar.types';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';
import './Navbar.css';

export const Navbar: React.FC<NavbarProps> = ({
  logo,
  items = [],
  rightContent,
  showMobileMenu = true,
  fixed = false,
  variant = 'default',
  activeItem,
  onItemClick,
  onMobileMenuToggle,
  className = '',
  ...props
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setOpenDropdown(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMobileMenuToggle?.(newState);
    
    if (newState) {
      setOpenDropdown(null);
    }
  };

  const handleItemClick = (item: NavItem, event: React.MouseEvent) => {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    if (item.children && item.children.length > 0) {
      // Toggle dropdown
      setOpenDropdown(openDropdown === item.id ? null : item.id);
      event.preventDefault();
    } else {
      // Close mobile menu when item is clicked
      setIsMobileMenuOpen(false);
      setOpenDropdown(null);
      
      if (item.onClick) {
        item.onClick();
      }
      
      onItemClick?.(item);
    }
  };

  const handleDropdownItemClick = (_parentItem: NavItem, childItem: NavItem) => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
    
    if (childItem.onClick) {
      childItem.onClick();
    }
    
    onItemClick?.(childItem);
  };

  const renderNavItem = (item: NavItem, isDropdown = false) => {
    const isActive = activeItem === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = openDropdown === item.id;

    const itemClassName = [
      'navbar__item',
      isActive && 'navbar__item--active',
      item.disabled && 'navbar__item--disabled',
      hasChildren && 'navbar__item--dropdown',
      isDropdown && 'navbar__dropdown-item',
    ].filter(Boolean).join(' ');

    const content = (
      <>
        {item.icon && <span className="navbar__item-icon">{item.icon}</span>}
        <span className="navbar__item-label">{item.label}</span>
        {item.badge && (
          <Badge variant="filled" color="red" size="small" className="navbar__item-badge">
            {item.badge}
          </Badge>
        )}
        {hasChildren && (
          <svg 
            className={`navbar__dropdown-arrow ${isDropdownOpen ? 'navbar__dropdown-arrow--open' : ''}`}
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
            aria-hidden="true"
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </>
    );

    if (item.href && !hasChildren) {
      return (
        <a
          key={item.id}
          href={item.href}
          className={itemClassName}
          onClick={(e) => handleItemClick(item, e)}
          aria-current={isActive ? 'page' : undefined}
          tabIndex={item.disabled ? -1 : undefined}
          aria-disabled={item.disabled}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        key={item.id}
        type="button"
        className={itemClassName}
        onClick={(e) => handleItemClick(item, e)}
        disabled={item.disabled}
        aria-expanded={hasChildren ? isDropdownOpen : undefined}
        aria-haspopup={hasChildren ? 'menu' : undefined}
      >
        {content}
      </button>
    );
  };

  const renderDropdown = (item: NavItem) => {
    if (!item.children || item.children.length === 0) return null;
    
    const isOpen = openDropdown === item.id;
    
    return (
      <div 
        className={`navbar__dropdown ${isOpen ? 'navbar__dropdown--open' : ''}`}
        role="menu"
        aria-label={`${item.label} submenu`}
      >
        <div className="navbar__dropdown-content">
          {item.children.map((childItem) => (
            <button
              key={childItem.id}
              type="button"
              className={`navbar__dropdown-item ${activeItem === childItem.id ? 'navbar__dropdown-item--active' : ''}`}
              onClick={() => handleDropdownItemClick(item, childItem)}
              disabled={childItem.disabled}
              role="menuitem"
            >
              {childItem.icon && <span className="navbar__item-icon">{childItem.icon}</span>}
              <span className="navbar__item-label">{childItem.label}</span>
              {childItem.badge && (
                <Badge variant="filled" color="red" size="small" className="navbar__item-badge">
                  {childItem.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const navbarClassName = [
    'navbar',
    `navbar--${variant}`,
    fixed && 'navbar--fixed',
    className,
  ].filter(Boolean).join(' ');

  return (
    <nav
      ref={navRef}
      className={navbarClassName}
      role="navigation"
      aria-label="Main navigation"
      {...props}
    >
      <div className="navbar__container">
        {/* Logo */}
        {logo && (
          <div className="navbar__logo">
            {logo}
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="navbar__nav">
          {items.map((item) => (
            <div key={item.id} className="navbar__nav-item">
              {renderNavItem(item)}
              {renderDropdown(item)}
            </div>
          ))}
        </div>

        {/* Right Content */}
        {rightContent && (
          <div className="navbar__right">
            {rightContent}
          </div>
        )}

        {/* Mobile Menu Button */}
        {showMobileMenu && (
          <Button
            variant="ghost"
            size="medium"
            className="navbar__mobile-toggle"
            onClick={handleMobileMenuToggle}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg 
              className={`navbar__hamburger ${isMobileMenuOpen ? 'navbar__hamburger--open' : ''}`}
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none"
              aria-hidden="true"
            >
              <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Button>
        )}
      </div>

      {/* Mobile Menu */}
      <div 
        id="mobile-menu"
        className={`navbar__mobile-menu ${isMobileMenuOpen ? 'navbar__mobile-menu--open' : ''}`}
        role="menu"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="navbar__mobile-content">
          {items.map((item) => (
            <div key={item.id} className="navbar__mobile-item">
              {renderNavItem(item)}
              {item.children && item.children.length > 0 && (
                <div className={`navbar__mobile-dropdown ${openDropdown === item.id ? 'navbar__mobile-dropdown--open' : ''}`}>
                  {item.children.map((childItem) => (
                    <button
                      key={childItem.id}
                      type="button"
                      className={`navbar__mobile-dropdown-item ${activeItem === childItem.id ? 'navbar__mobile-dropdown-item--active' : ''}`}
                      onClick={() => handleDropdownItemClick(item, childItem)}
                      disabled={childItem.disabled}
                      role="menuitem"
                    >
                      {childItem.icon && <span className="navbar__item-icon">{childItem.icon}</span>}
                      <span className="navbar__item-label">{childItem.label}</span>
                      {childItem.badge && (
                        <Badge variant="filled" color="red" size="small" className="navbar__item-badge">
                          {childItem.badge}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* Mobile Right Content */}
          {rightContent && (
            <div className="navbar__mobile-right">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};