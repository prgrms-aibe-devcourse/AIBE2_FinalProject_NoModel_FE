import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { ArrowLeft, Sparkles, Mail, Lock, Eye, EyeOff, User, CheckCircle } from 'lucide-react';

interface SignupPageProps {
  onSignupSuccess: () => void;
  onLogin: () => void;
  onBack: () => void;
}

export function SignupPage({ onSignupSuccess, onLogin, onBack }: SignupPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAgreementChange = (field: string, checked: boolean) => {
    setAgreements(prev => ({ ...prev, [field]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreements.terms || !agreements.privacy) {
      alert('필수 약관에 동의해주세요.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate signup API call
    setTimeout(() => {
      setIsLoading(false);
      onSignupSuccess();
    }, 1500);
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`Sign up with ${provider}`);
    // Simulate social signup
    setTimeout(() => {
      onSignupSuccess();
    }, 1000);
  };

  const isFormValid = formData.name && formData.email && formData.password && 
                      formData.confirmPassword && agreements.terms && agreements.privacy;

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
            <Badge 
              className="mb-4"
              style={{
                backgroundColor: 'var(--color-brand-accent-tint)',
                color: 'var(--color-brand-primary)',
                borderRadius: 'var(--radius-rounded)',
                fontSize: 'var(--font-size-small)',
                fontWeight: 'var(--font-weight-medium)',
                padding: '8px 16px'
              }}
            >
              🎉 첫 번째 이미지 생성 무료!
            </Badge>
            
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
              무료로 시작하기
            </h1>
            <p 
              style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-regular)'
              }}
            >
              몇 초 만에 계정을 만들고 AI 이미지 생성을 시작하세요
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
            {/* Benefits Banner */}
            <div 
              className="p-4 mb-6 rounded-lg"
              style={{ backgroundColor: 'var(--color-background-secondary)' }}
            >
              <h3 
                className="mb-2 text-sm"
                style={{ 
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                무료 계정 혜택
              </h3>
              <ul className="space-y-1">
                {[
                  '첫 번째 이미지 생성 무료',
                  '다양한 AI 모델과 배경 선택',
                  '고해상도 이미지 다운로드',
                  '24/7 고객 지원'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle 
                      className="w-4 h-4" 
                      style={{ color: 'var(--color-semantic-green)' }}
                    />
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Signup */}
            <div className="space-y-3 mb-6">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSocialSignup('google')}
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
                Google로 계속하기
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSocialSignup('github')}
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
                GitHub로 계속하기
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
                  또는 이메일로 가입
                </span>
              </div>
            </div>

            {/* Email Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="name"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-weight-medium)',
                    fontSize: 'var(--font-size-small)'
                  }}
                >
                  이름
                </Label>
                <div className="relative">
                  <User 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  />
                  <Input
                    id="name"
                    type="text"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
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
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
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
                    placeholder="8자 이상의 비밀번호"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    minLength={8}
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

              <div className="space-y-2">
                <Label 
                  htmlFor="confirmPassword"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-weight-medium)',
                    fontSize: 'var(--font-size-small)'
                  }}
                >
                  비밀번호 확인
                </Label>
                <div className="relative">
                  <Lock 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms"
                    checked={agreements.terms}
                    onCheckedChange={(checked) => handleAgreementChange('terms', !!checked)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="terms" 
                    className="text-sm cursor-pointer leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <span style={{ color: 'var(--color-semantic-red)' }}>*</span> 
                    <Button 
                      variant="link" 
                      className="text-sm p-0 h-auto"
                      style={{ 
                        color: 'var(--color-link-primary)',
                        textDecoration: 'underline' 
                      }}
                    >
                      이용약관
                    </Button>에 동의합니다
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="privacy"
                    checked={agreements.privacy}
                    onCheckedChange={(checked) => handleAgreementChange('privacy', !!checked)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="privacy" 
                    className="text-sm cursor-pointer leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <span style={{ color: 'var(--color-semantic-red)' }}>*</span> 
                    <Button 
                      variant="link" 
                      className="text-sm p-0 h-auto"
                      style={{ 
                        color: 'var(--color-link-primary)',
                        textDecoration: 'underline' 
                      }}
                    >
                      개인정보처리방침
                    </Button>에 동의합니다
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="marketing"
                    checked={agreements.marketing}
                    onCheckedChange={(checked) => handleAgreementChange('marketing', !!checked)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="marketing" 
                    className="text-sm cursor-pointer leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    마케팅 정보 수신에 동의합니다 (선택)
                  </Label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={!isFormValid || isLoading}
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-utility-white)',
                  borderRadius: 'var(--radius-8)',
                  fontSize: 'var(--font-size-regular)',
                  fontWeight: 'var(--font-weight-medium)',
                  height: '48px',
                  border: 'none',
                  transition: 'all var(--animation-quick-transition) ease',
                  opacity: (!isFormValid || isLoading) ? 0.6 : 1
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    계정 생성 중...
                  </>
                ) : (
                  '무료 계정 만들기'
                )}
              </Button>
            </form>
          </Card>

          {/* Login link */}
          <div className="text-center mt-6">
            <p 
              className="text-sm"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              이미 계정이 있으신가요?{' '}
              <Button 
                variant="link" 
                className="text-sm p-0"
                onClick={onLogin}
                style={{ 
                  color: 'var(--color-link-primary)',
                  textDecoration: 'none',
                  fontWeight: 'var(--font-weight-medium)'
                }}
              >
                로그인하기
              </Button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}