import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onSignup: () => void;
  onBack: () => void;
}

export function LoginPage({ onLoginSuccess, onSignup, onBack }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Simulate social login
    setTimeout(() => {
      onLoginSuccess();
    }, 1000);
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: 'var(--color-background-primary)',
        fontFamily: 'var(--font-family-regular)'
      }}
    >
      {/* Header */}
      <header className="linear-header">
        <div className="linear-container h-full flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2"
            style={{
              color: 'var(--color-text-secondary)',
              borderRadius: 'var(--radius-8)'
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로 가기
          </Button>
          
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-brand-primary)',
                borderRadius: 'var(--radius-8)'
              }}
            >
              <Sparkles className="w-5 h-5" style={{ color: 'var(--color-utility-white)' }} />
            </div>
            <h1 
              style={{ 
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)'
              }}
            >
              NoModel
            </h1>
          </div>

          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md mx-auto" style={{ paddingInline: 'var(--spacing-page-padding-inline)' }}>
          <div className="text-center mb-8">
            <h1 
              className="mb-2"
              style={{
                fontSize: '2rem',
                fontWeight: 'var(--font-weight-semibold)',
                lineHeight: '1.125',
                letterSpacing: '-0.022em',
                color: 'var(--color-text-primary)'
              }}
            >
              로그인
            </h1>
            <p 
              style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-regular)'
              }}
            >
              계정에 로그인하여 AI 이미지 생성을 시작하세요
            </p>
          </div>

          <Card 
            className="p-8"
            style={{
              backgroundColor: 'var(--color-background-primary)',
              borderColor: 'var(--color-border-primary)',
              borderRadius: 'var(--radius-16)',
              boxShadow: 'var(--shadow-medium)'
            }}
          >
            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSocialLogin('google')}
                style={{
                  borderRadius: 'var(--radius-8)',
                  borderColor: 'var(--color-border-primary)',
                  fontSize: 'var(--font-size-regular)',
                  fontWeight: 'var(--font-weight-medium)',
                  height: '48px'
                }}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google로 로그인
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSocialLogin('github')}
                style={{
                  borderRadius: 'var(--radius-8)',
                  borderColor: 'var(--color-border-primary)',
                  fontSize: 'var(--font-size-regular)',
                  fontWeight: 'var(--font-weight-medium)',
                  height: '48px'
                }}
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                GitHub로 로그인
              </Button>
            </div>

            <div className="relative mb-6">
              <Separator 
                style={{ backgroundColor: 'var(--color-border-primary)' }}
              />
              <div 
                className="absolute inset-0 flex items-center justify-center"
              >
                <span 
                  className="px-4 text-sm"
                  style={{ 
                    backgroundColor: 'var(--color-background-primary)',
                    color: 'var(--color-text-tertiary)'
                  }}
                >
                  또는
                </span>
              </div>
            </div>

            {/* Email Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="email"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-weight-medium)',
                    fontSize: 'var(--font-size-small)'
                  }}
                >
                  이메일
                </Label>
                <div className="relative">
                  <Mail 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    style={{
                      borderRadius: 'var(--radius-8)',
                      borderColor: 'var(--color-border-primary)',
                      backgroundColor: 'var(--color-input-background)',
                      fontSize: 'var(--font-size-regular)',
                      height: '48px'
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="password"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-weight-medium)',
                    fontSize: 'var(--font-size-small)'
                  }}
                >
                  비밀번호
                </Label>
                <div className="relative">
                  <Lock 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10"
                    style={{
                      borderRadius: 'var(--radius-8)',
                      borderColor: 'var(--color-border-primary)',
                      backgroundColor: 'var(--color-input-background)',
                      fontSize: 'var(--font-size-regular)',
                      height: '48px'
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <Label 
                    htmlFor="remember" 
                    className="text-sm cursor-pointer"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    로그인 상태 유지
                  </Label>
                </div>
                <Button 
                  variant="link" 
                  className="text-sm p-0"
                  style={{ 
                    color: 'var(--color-link-primary)',
                    textDecoration: 'none' 
                  }}
                >
                  비밀번호 찾기
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-utility-white)',
                  borderRadius: 'var(--radius-8)',
                  fontSize: 'var(--font-size-regular)',
                  fontWeight: 'var(--font-weight-medium)',
                  height: '48px',
                  border: 'none',
                  transition: 'all var(--animation-quick-transition) ease'
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  '로그인'
                )}
              </Button>
            </form>
          </Card>

          {/* Sign up link */}
          <div className="text-center mt-6">
            <p 
              className="text-sm"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              계정이 없으신가요?{' '}
              <Button 
                variant="link" 
                className="text-sm p-0"
                onClick={onSignup}
                style={{ 
                  color: 'var(--color-link-primary)',
                  textDecoration: 'none',
                  fontWeight: 'var(--font-weight-medium)'
                }}
              >
                무료로 가입하기
              </Button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}