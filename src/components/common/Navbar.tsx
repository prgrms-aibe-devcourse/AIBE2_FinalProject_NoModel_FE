import React, { useState } from 'react';
import { Menu, X, Search, Bell, User, ChevronDown } from 'lucide-react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  badge?: {
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  children?: NavItem[];
}

export interface UserMenuData {
  user: {
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
  };
  menuItems: Array<{
    id: string;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive';
  }>;
}

interface NavbarProps {
  logo?: {
    text?: string;
    image?: string;
    href?: string;
    onClick?: () => void;
  };
  navItems?: NavItem[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  notifications?: {
    count: number;
    onClick: () => void;
  };
  userMenu?: UserMenuData;
  ctaButton?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'secondary' | 'outline';
  };
  variant?: 'default' | 'transparent' | 'blur';
  position?: 'static' | 'sticky' | 'fixed';
  className?: string;
}

export function Navbar({
  logo,
  navItems = [],
  showSearch = false,
  searchPlaceholder = "Search...",
  onSearch,
  notifications,
  userMenu,
  ctaButton,
  variant = 'default',
  position = 'sticky',
  className
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
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
            style={{ color: 'var(--color-text-primary)' }}
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

  const renderNavItem = (item: NavItem, isMobile = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = activeDropdown === item.id;

    const itemContent = (
      <div className={cn(
        "flex items-center gap-2",
        isMobile ? "w-full justify-between" : ""
      )}>
        <span>{item.label}</span>
        {item.badge && (
          <Badge variant={item.badge.variant || 'default'}>
            {item.badge.label}
          </Badge>
        )}
        {hasChildren && <ChevronDown className="w-4 h-4" />}
      </div>
    );

    if (hasChildren) {
      return (
        <div key={item.id} className="relative">
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors rounded-md",
              item.isActive && "bg-primary/10 text-primary",
              isMobile && "w-full text-left"
            )}
            onClick={() => setActiveDropdown(isDropdownOpen ? null : item.id)}
            style={{ color: item.isActive ? undefined : 'var(--color-text-secondary)' }}
          >
            {itemContent}
          </button>
          
          {isDropdownOpen && (
            <div className={cn(
              "absolute top-full left-0 mt-1 min-w-48 py-2 rounded-md border shadow-lg z-50",
              isMobile ? "relative top-0 mt-2 shadow-none border-l-2 pl-4" : ""
            )}
            style={{
              backgroundColor: 'var(--color-background-primary)',
              borderColor: 'var(--color-border-primary)'
            }}>
              {item.children?.map((child) => renderNavItem(child, isMobile))}
            </div>
          )}
        </div>
      );
    }

    const button = (
      <button
        className={cn(
          "px-4 py-2 text-sm font-medium transition-colors rounded-md",
          item.isActive && "bg-primary/10 text-primary",
          isMobile && "w-full text-left"
        )}
        onClick={item.onClick}
        style={{ color: item.isActive ? undefined : 'var(--color-text-secondary)' }}
      >
        {itemContent}
      </button>
    );

    if (item.href && !item.onClick) {
      return (
        <a key={item.id} href={item.href}>
          {button}
        </a>
      );
    }

    return <div key={item.id}>{button}</div>;
  };

  const renderUserMenu = () => {
    if (!userMenu) return null;

    return (
      <div className="relative">
        <button
          className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-muted"
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        >
          {userMenu.user.avatar ? (
            <img
              src={userMenu.user.avatar}
              alt={userMenu.user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-brand-primary)' }}
            >
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              {userMenu.user.name}
            </p>
            {userMenu.user.role && (
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                {userMenu.user.role}
              </p>
            )}
          </div>
          <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
        </button>

        {isUserMenuOpen && (
          <div 
            className="absolute top-full right-0 mt-2 w-64 py-2 rounded-md border shadow-lg z-50"
            style={{
              backgroundColor: 'var(--color-background-primary)',
              borderColor: 'var(--color-border-primary)'
            }}
          >
            <div 
              className="px-4 py-3 border-b"
              style={{ borderColor: 'var(--color-border-primary)' }}
            >
              <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {userMenu.user.name}
              </p>
              {userMenu.user.email && (
                <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                  {userMenu.user.email}
                </p>
              )}
            </div>
            {userMenu.menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  setIsUserMenuOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-muted",
                  item.variant === 'destructive' && "text-destructive"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      className={cn(
        "w-full z-40",
        position === 'sticky' && "sticky top-0",
        position === 'fixed' && "fixed top-0",
        variant === 'blur' && "backdrop-blur-md",
        className
      )}
      style={{
        backgroundColor: variant === 'transparent' 
          ? 'transparent'
          : variant === 'blur' 
          ? 'var(--color-header-background)'
          : 'var(--color-background-primary)',
        borderBottom: variant !== 'transparent' ? '1px solid var(--color-border-primary)' : undefined
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {renderLogo()}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => renderNavItem(item))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            {showSearch && (
              <form onSubmit={handleSearch} className="hidden md:block">
                <div className="relative">
                  <Search 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-md border text-sm w-64"
                    style={{
                      backgroundColor: 'var(--color-background-secondary)',
                      borderColor: 'var(--color-border-primary)',
                      color: 'var(--color-text-primary)'
                    }}
                  />
                </div>
              </form>
            )}

            {/* Notifications */}
            {notifications && (
              <button
                onClick={notifications.onClick}
                className="relative p-2 rounded-md hover:bg-muted transition-colors"
              >
                <Bell className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                {notifications.count > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center p-0"
                  >
                    {notifications.count > 99 ? '99+' : notifications.count}
                  </Badge>
                )}
              </button>
            )}

            {/* CTA Button */}
            {ctaButton && (
              <Button
                variant={ctaButton.variant || 'default'}
                onClick={ctaButton.onClick}
                className="hidden md:inline-flex"
              >
                {ctaButton.label}
              </Button>
            )}

            {/* User Menu */}
            {renderUserMenu()}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {/* Mobile Search */}
            {showSearch && (
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-md border text-sm"
                    style={{
                      backgroundColor: 'var(--color-background-secondary)',
                      borderColor: 'var(--color-border-primary)',
                      color: 'var(--color-text-primary)'
                    }}
                  />
                </div>
              </form>
            )}

            {/* Mobile Navigation Items */}
            {navItems.map((item) => renderNavItem(item, true))}

            {/* Mobile CTA Button */}
            {ctaButton && (
              <div className="pt-4">
                <Button
                  variant={ctaButton.variant || 'default'}
                  onClick={ctaButton.onClick}
                  className="w-full"
                >
                  {ctaButton.label}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}