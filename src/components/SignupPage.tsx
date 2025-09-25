import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { NavigationBar } from './NavigationBar';
import { ArrowLeft, Sparkles, Mail, Lock, Eye, EyeOff, User, CheckCircle, Chrome, Github, Zap, Shield, Clock, AlertCircle } from 'lucide-react';
import { authService } from '../services/auth';
import type { SignupRequest } from '../types/auth';
import { TermsModal } from './common/TermsModal';
import { API_BASE_URL } from '../config/env';

interface SignupPageProps {
  onSignupSuccess: (isAutoLogin?: boolean) => void;
  onLogin: () => void;
  onBack: () => void;
}

export function SignupPage({ onSignupSuccess, onLogin, onBack }: SignupPageProps) {
  const [formData, setFormData] = useState({
    username: '',
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
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAgreementChange = (field: string, checked: boolean) => {
    setAgreements(prev => ({ ...prev, [field]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (!agreements.terms || !agreements.privacy) {
      setError('필수 약관에 동의해주세요.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (formData.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const signupData: SignupRequest = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        agreeToTerms: agreements.terms,
        agreeToPrivacy: agreements.privacy,
        agreeToMarketing: agreements.marketing,
      };

      const result = await authService.signup(signupData);
      
      if (result.success) {
        setSuccess('계정이 성공적으로 생성되었습니다! 로그인하시기 바랍니다.');
        // Auto redirect to login after 2 seconds
        setTimeout(() => {
          onLogin();
        }, 2000);
      } else {
        setError(result.error?.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('네트워크 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider: 'google' | 'github') => {
    // 실제 소셜 로그인 처리 - 로그인 페이지와 동일한 로직
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  const isFormValid = formData.username && formData.email && formData.password &&
                      formData.confirmPassword && agreements.terms && agreements.privacy;

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar
        onLogin={onLogin}
        onLogout={() => {}}
        onAdGeneration={() => {}}
        onModelCreation={() => {}}
        onMarketplace={() => {}}
        onMyPage={() => {}}
        onHome={onBack}
        isLoggedIn={false}
        isLandingPage={false}
        currentPage="other"
      />

      {/* Main Content */}
      <main className="py-8 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              첫 3장 이미지 생성 무료!
            </Badge>
            
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              무료로 시작하기
            </h1>
            <p className="text-muted-foreground">
              몇 초 만에 계정을 만들고 AI 이미지 생성을 시작하세요
            </p>
          </div>

          <Card className="p-8 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            {/* Benefits Banner */}
            <div className="p-6 mb-6 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
              <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                무료 계정 혜택
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: Zap, title: '첫 3장 무료 생성', desc: '신용카드 불필요' },
                  { icon: Shield, title: '500+ AI 모델', desc: '다양한 스타일 선택' },
                  { icon: Clock, title: '5분 내 완성', desc: '초고속 AI 처리' }
                ].map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {benefit.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {benefit.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Signup */}
            <div className="space-y-3 mb-6">
              <Button 
                variant="outline" 
                className="w-full h-12 text-base font-medium border-2 hover:bg-muted/50 transition-all duration-200"
                onClick={() => handleSocialSignup('google')}
              >
                <Chrome className="w-5 h-5 mr-3" />
                Google로 계속하기
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full h-12 text-base font-medium border-2 hover:bg-muted/50 transition-all duration-200"
                onClick={() => handleSocialSignup('github')}
              >
                <Github className="w-5 h-5 mr-3" />
                GitHub로 계속하기
              </Button>
            </div>

            <div className="relative mb-6">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 text-sm text-muted-foreground bg-card">
                  또는 이메일로 가입
                </span>
              </div>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            {/* Email Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  사용자명
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    minLength={2}
                    maxLength={20}
                    required
                    className="pl-10 h-12 text-base bg-background border-2 focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  이메일
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="pl-10 h-12 text-base bg-background border-2 focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  비밀번호
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="8자 이상의 비밀번호"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    minLength={8}
                    className="pl-10 pr-10 h-12 text-base bg-background border-2 focus:border-primary/50 transition-colors"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 
                      <EyeOff className="w-4 h-4 text-muted-foreground" /> : 
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    }
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  비밀번호 확인
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    className="pl-10 pr-10 h-12 text-base bg-background border-2 focus:border-primary/50 transition-colors"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? 
                      <EyeOff className="w-4 h-4 text-muted-foreground" /> : 
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    }
                  </Button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">비밀번호 요구사항:</p>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className={`flex items-center gap-1 ${formData.password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}`}>
                    <CheckCircle className="w-3 h-3" />
                    8자 이상
                  </div>
                  <div className={`flex items-center gap-1 ${formData.password === formData.confirmPassword && formData.confirmPassword ? 'text-green-600' : 'text-muted-foreground'}`}>
                    <CheckCircle className="w-3 h-3" />
                    비밀번호 일치
                  </div>
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="terms"
                    checked={agreements.terms}
                    onCheckedChange={(checked) => handleAgreementChange('terms', !!checked)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="terms" 
                    className="text-sm cursor-pointer leading-relaxed text-muted-foreground"
                  >
                    <span className="text-red-500">* </span> 
                    <Button 
                      variant="link" 
                      className="text-sm p-0 h-auto text-primary hover:text-primary/80 hover:underline"
                      onClick={() => setShowTerms(true)}
                    >
                      이용약관
                    </Button>에 동의합니다
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="privacy"
                    checked={agreements.privacy}
                    onCheckedChange={(checked) => handleAgreementChange('privacy', !!checked)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="privacy" 
                    className="text-sm cursor-pointer leading-relaxed text-muted-foreground"
                  >
                    <span className="text-red-500">* </span> 
                    <Button 
                      variant="link" 
                      className="text-sm p-0 h-auto text-primary hover:text-primary/80 hover:underline"
                      onClick={() => setShowPrivacy(true)}
                    >
                      개인정보처리방침
                    </Button>에 동의합니다
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="marketing"
                    checked={agreements.marketing}
                    onCheckedChange={(checked) => handleAgreementChange('marketing', !!checked)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="marketing" 
                    className="text-sm cursor-pointer leading-relaxed text-muted-foreground"
                  >
                    마케팅 정보 수신에 동의합니다 (선택)
                  </Label>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={!isFormValid || isLoading}
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
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              이미 계정이 있으신가요?{' '}
              <Button 
                variant="link" 
                className="text-sm p-0 h-auto font-semibold text-primary hover:text-primary/80 hover:underline"
                onClick={onLogin}
              >
                로그인하기
              </Button>
            </p>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 text-center">
            <p className="text-xs text-muted-foreground mb-4">
              가입하면 다음에 동의하는 것으로 간주됩니다
            </p>
            <div className="flex justify-center space-x-8 text-xs text-muted-foreground">
              <Button 
                variant="link" 
                className="text-xs p-0 h-auto text-muted-foreground hover:text-foreground"
                onClick={() => setShowTerms(true)}
              >
                이용약관
              </Button>
              <Button 
                variant="link" 
                className="text-xs p-0 h-auto text-muted-foreground hover:text-foreground"
                onClick={() => setShowPrivacy(true)}
              >
                개인정보처리방침
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Terms Modal */}
      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        type="terms"
      />
      
      {/* Privacy Modal */}
      <TermsModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        type="privacy"
      />
    </div>
  );
}
