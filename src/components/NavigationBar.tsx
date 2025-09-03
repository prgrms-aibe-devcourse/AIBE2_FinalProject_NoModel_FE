import * as React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Menu, X, Camera, ShoppingBag, User, Palette, LogOut, Coins, ArrowLeft } from 'lucide-react';

interface NavigationBarProps {
  onLogin: () => void;
  onLogout: () => void;
  onAdGeneration: () => void;
  onModelCreation: () => void;
  onMarketplace: () => void;
  onMyPage: () => void;
  onHome: () => void;
  onBack?: () => void;
  isLoggedIn: boolean;
  isLandingPage?: boolean;
  showBackButton?: boolean;
  userPoints?: number;
  pageTitle?: string;
}

export function NavigationBar({
  onLogin,
  onLogout,
  onAdGeneration,
  onModelCreation,
  onMarketplace,
  onMyPage,
  onHome,
  onBack,
  isLoggedIn,
  isLandingPage = false,
  showBackButton = false,
  userPoints,
  pageTitle
}: NavigationBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg border-b bg-background">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && onBack ? (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-muted/50 px-3 py-2 h-9"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">뒤로</span>
            </Button>
          ) : (
            <button 
              onClick={onHome}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary shadow-sm">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">
                NoModel
              </h1>
            </button>
          )}
          
          {pageTitle && (
            <>
              <div className="w-px h-6 bg-border mx-1" />
              <h2 className="text-lg font-medium text-foreground hidden sm:block">
                {pageTitle}
              </h2>
            </>
          )}
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {!isLoggedIn ? (
            // 로그인 전 네비게이션
            <>
              {isLandingPage ? (
                // 랜딩 페이지에서는 앵커 링크
                <>
                  {[
                    { label: '홈', href: '#home' },
                    { label: '기능', href: '#features' },
                    { label: '고객사례', href: '#testimonials' },
                    { label: '요금제', href: '#pricing' }
                  ].map((item, index) => (
                    <a 
                      key={index}
                      href={item.href} 
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  ))}
                </>
              ) : (
                // 다른 페이지에서는 기능적 네비게이션
                <>
                  <button 
                    onClick={onHome}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    홈
                  </button>
                  <button 
                    onClick={onLogin}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    시작하기
                  </button>
                </>
              )}
              <Button 
                variant="outline" 
                size="default"
                onClick={onLogin}
                className="rounded-full px-6"
              >
                로그인
              </Button>
            </>
          ) : (
            // 로그인 후 네비게이션
            <>
              <button 
                onClick={onAdGeneration}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                광고 생성
              </button>
              <button 
                onClick={onModelCreation}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                모델 제작
              </button>
              <button 
                onClick={onMarketplace}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                마켓플레이스
              </button>
              <button 
                onClick={onMyPage}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                마이 페이지
              </button>
              
              {/* Points Display */}
              {typeof userPoints === 'number' && (
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-2 px-3 py-1 bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
                  onClick={onMyPage}
                >
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-primary">
                    {userPoints.toLocaleString()}P
                  </span>
                </Badge>
              )}
              
              <Button 
                variant="outline" 
                size="default"
                onClick={onLogout}
                className="rounded-full px-6"
              >
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background backdrop-blur-lg">
          <nav className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex flex-col gap-4">
            {!isLoggedIn ? (
              // 로그인 전 모바일 메뉴
              <>
                {isLandingPage ? (
                  // 랜딩 페이지에서는 앵커 링크
                  <>
                    {[
                      { label: '홈', href: '#home' },
                      { label: '기능', href: '#features' },
                      { label: '고객사례', href: '#testimonials' },
                      { label: '요금제', href: '#pricing' }
                    ].map((item, index) => (
                      <a 
                        key={index}
                        href={item.href} 
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </>
                ) : (
                  // 다른 페이지에서는 기능적 네비게이션
                  <>
                    <button 
                      onClick={() => {
                        onHome();
                        setMobileMenuOpen(false);
                      }}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 text-left"
                    >
                      홈
                    </button>
                    <button 
                      onClick={() => {
                        onLogin();
                        setMobileMenuOpen(false);
                      }}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 text-left"
                    >
                      시작하기
                    </button>
                  </>
                )}
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={() => {
                    onLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-full w-fit px-6"
                >
                  로그인
                </Button>
              </>
            ) : (
              // 로그인 후 모바일 메뉴
              <>
                <button 
                  onClick={() => {
                    onAdGeneration();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  광고 생성
                </button>
                <button 
                  onClick={() => {
                    onModelCreation();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 flex items-center gap-2"
                >
                  <Palette className="w-4 h-4" />
                  모델 제작
                </button>
                <button 
                  onClick={() => {
                    onMarketplace();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  마켓플레이스
                </button>
                <button 
                  onClick={() => {
                    onMyPage();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  마이 페이지
                </button>
                
                {/* Mobile Points Display */}
                {typeof userPoints === 'number' && (
                  <div 
                    onClick={() => {
                      onMyPage();
                      setMobileMenuOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Badge 
                      variant="secondary" 
                      className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 transition-colors w-fit"
                    >
                      <Coins className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-primary">
                        {userPoints.toLocaleString()} 포인트
                      </span>
                    </Badge>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-full w-fit px-6"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}