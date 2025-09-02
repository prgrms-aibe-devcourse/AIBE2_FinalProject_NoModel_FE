import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Sparkles, Mail, Lock, Eye, EyeOff, Chrome, Github, AlertCircle } from 'lucide-react';
import { authService } from '../services/auth';
import type { LoginRequest } from '../types/auth';

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
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const loginData: LoginRequest = {
        email,
        password,
      };

      const result = await authService.login(loginData);
      
      if (result.success) {
        // Get user profile after successful login
        try {
          await authService.getUserProfile();
          onLoginSuccess();
        } catch (profileError) {
          console.error('Failed to fetch user profile:', profileError);
          // Still proceed with login success even if profile fetch fails
          onLoginSuccess();
        }
      } else {
        setError(result.error || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('네트워크 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Simulate social login
    setTimeout(() => {
      onLoginSuccess();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg border-b bg-background/95">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-muted/50"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로 가기
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">
              NoModel
            </h1>
          </div>

          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              로그인
            </h1>
            <p className="text-muted-foreground">
              계정에 로그인하여 AI 이미지 생성을 시작하세요
            </p>
          </div>

          <Card className="p-8 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <Button 
                variant="outline" 
                className="w-full h-12 text-base font-medium border-2 hover:bg-muted/50 transition-all duration-200"
                onClick={() => handleSocialLogin('google')}
              >
                <Chrome className="w-5 h-5 mr-3" />
                Google로 계속하기
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full h-12 text-base font-medium border-2 hover:bg-muted/50 transition-all duration-200"
                onClick={() => handleSocialLogin('github')}
              >
                <Github className="w-5 h-5 mr-3" />
                GitHub로 계속하기
              </Button>
            </div>

            <div className="relative mb-6">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 text-sm text-muted-foreground bg-card">
                  또는 이메일로
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Email Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <Label 
                    htmlFor="remember" 
                    className="text-sm cursor-pointer text-muted-foreground"
                  >
                    로그인 상태 유지
                  </Label>
                </div>
                <Button 
                  variant="link" 
                  className="text-sm p-0 h-auto text-primary hover:text-primary/80"
                >
                  비밀번호 찾기
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
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
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              아직 계정이 없으신가요?{' '}
              <Button 
                variant="link" 
                className="text-sm p-0 h-auto font-semibold text-primary hover:text-primary/80 hover:underline"
                onClick={onSignup}
              >
                무료로 가입하기
              </Button>
            </p>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 text-center">
            <p className="text-xs text-muted-foreground mb-4">
              로그인하면 다음에 동의하는 것으로 간주됩니다
            </p>
            <div className="flex justify-center space-x-6 text-xs text-muted-foreground">
              <Button variant="link" className="text-xs p-0 h-auto text-muted-foreground hover:text-foreground">
                이용약관
              </Button>
              <Button variant="link" className="text-xs p-0 h-auto text-muted-foreground hover:text-foreground">
                개인정보처리방침
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}