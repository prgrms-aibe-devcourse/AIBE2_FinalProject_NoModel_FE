import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from '../services/auth';
import { tokenCookies } from '../utils/cookieUtils';
import { API_BASE_URL } from '../config/env';

const LoginTest: React.FC = () => {
  const [email, setEmail] = useState('test@nomodel.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleLogin = async () => {
    setIsLoading(true);
    setResult('');

    try {
      console.log('Login attempt with:', { email, password });
      
      const response = await authService.login({ email, password });
      
      console.log('Login response:', response);
      
      if (response.success) {
        setResult(`✅ 로그인 성공!
응답: ${JSON.stringify(response.response, null, 2)}

쿠키에 저장된 토큰:
- Access Token: ${tokenCookies.getAccessToken()?.substring(0, 50)}...
- Refresh Token: ${tokenCookies.getRefreshToken()?.substring(0, 50)}...
- 인증 상태: ${tokenCookies.isAuthenticated() ? '인증됨' : '인증되지 않음'}`);
      } else {
        const message = response.error?.message || '로그인에 실패했습니다.';
        setResult(`❌ 로그인 실패: ${message}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setResult(`❌ 네트워크 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setResult('🔓 로그아웃 완료 - 모든 토큰이 쿠키에서 제거되었습니다.');
  };

  const checkAuthStatus = () => {
    const isAuth = tokenCookies.isAuthenticated();
    const accessToken = tokenCookies.getAccessToken();
    const refreshToken = tokenCookies.getRefreshToken();
    const userInfo = tokenCookies.getUserInfo();

    setResult(`🔍 인증 상태 확인:
- 인증됨: ${isAuth ? 'Yes' : 'No'}
- Access Token: ${accessToken ? accessToken.substring(0, 50) + '...' : 'None'}
- Refresh Token: ${refreshToken ? refreshToken.substring(0, 50) + '...' : 'None'}
- User Info: ${userInfo ? JSON.stringify(userInfo, null, 2) : 'None'}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>백엔드 API 로그인 테스트</CardTitle>
          <CardDescription>
            쿠키 기반 토큰 저장 방식으로 로그인을 테스트합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">이메일</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@nomodel.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">비밀번호</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleLogin} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? '로그인 중...' : '🔐 로그인 테스트'}
            </Button>
            <Button 
              onClick={checkAuthStatus} 
              variant="outline"
              className="flex-1"
            >
              🔍 인증 상태 확인
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="destructive"
            >
              🔓 로그아웃
            </Button>
          </div>

          {result && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">결과:</h3>
              <pre className="text-sm whitespace-pre-wrap">{result}</pre>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">테스트 설정:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Backend URL:</strong> {API_BASE_URL}</p>
              <p><strong>Login Endpoint:</strong> POST /auth/login</p>
              <p><strong>Token Storage:</strong> HTTP Cookies (Secure)</p>
              <p><strong>Test Credentials:</strong> test@nomodel.com / password123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginTest;
