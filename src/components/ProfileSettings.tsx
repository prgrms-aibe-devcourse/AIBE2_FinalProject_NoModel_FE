import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, Sparkles, Save, Eye, EyeOff, Crown, 
  Bell, Shield, CreditCard, User, Mail, MapPin, Globe,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, PointTransaction } from '../App';
import { DefaultAvatar } from './common/DefaultAvatar';

interface ProfileSettingsProps {
  userProfile: UserProfile | null;
  pointTransactions: PointTransaction[];
  onBack: () => void;
  onProfileUpdate: (updatedProfile: Partial<UserProfile>) => void;
}

export function ProfileSettings({ userProfile, pointTransactions, onBack, onProfileUpdate }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    bio: userProfile?.bio || '',
    company: userProfile?.company || '',
    location: userProfile?.location || '',
    website: userProfile?.website || ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    marketingEmails: false,
    securityAlerts: true
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showProjects: true,
    showStats: false
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleProfileFormChange = (field: string, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordFormChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onProfileUpdate(profileForm);
      setIsLoading(false);
      // Show success toast in real app
    }, 1000);
  };

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      // Show error toast in real app
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsLoading(false);
      // Show success toast in real app
    }, 1000);
  };


  if (!userProfile) {
    return <div>Loading...</div>;
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background-primary)' }}>
      {/* Header */}
      <header className="linear-header sticky top-0 z-50">
        <div className="linear-container h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
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
          </div>

          <div className="flex items-center gap-2">
            <Badge 
              className="hidden md:inline-flex"
              style={{
                backgroundColor: 'var(--color-brand-accent-tint)',
                color: 'var(--color-brand-primary)',
                borderRadius: 'var(--radius-rounded)',
                fontSize: 'var(--font-size-small)',
                fontWeight: 'var(--font-weight-medium)',
                padding: '8px 16px'
              }}
            >
              프로필 설정
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 
            className="mb-2"
            style={{
              fontSize: 'var(--font-size-title1)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            }}
          >
            계정 설정
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            프로필 정보와 계정 설정을 관리하세요
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList 
            className="grid w-full max-w-md grid-cols-4"
            style={{
              backgroundColor: 'var(--color-background-secondary)',
              borderRadius: 'var(--radius-12)',
              padding: '4px'
            }}
          >
            <TabsTrigger 
              value="profile"
              className="flex items-center gap-2"
              style={{
                borderRadius: 'var(--radius-8)',
                fontSize: 'var(--font-size-small)',
                padding: '8px 12px'
              }}
            >
              <User className="w-4 h-4" />
              프로필
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className="flex items-center gap-2"
              style={{
                borderRadius: 'var(--radius-8)',
                fontSize: 'var(--font-size-small)',
                padding: '8px 12px'
              }}
            >
              <Shield className="w-4 h-4" />
              보안
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="flex items-center gap-2"
              style={{
                borderRadius: 'var(--radius-8)',
                fontSize: 'var(--font-size-small)',
                padding: '8px 12px'
              }}
            >
              <Bell className="w-4 h-4" />
              알림
            </TabsTrigger>
            <TabsTrigger 
              value="billing"
              className="flex items-center gap-2"
              style={{
                borderRadius: 'var(--radius-8)',
                fontSize: 'var(--font-size-small)',
                padding: '8px 12px'
              }}
            >
              <CreditCard className="w-4 h-4" />
              결제
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <h3 
                className="mb-6"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                기본 정보
              </h3>

              {/* Profile Avatar */}
              <div className="flex items-center gap-6 mb-8 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                <DefaultAvatar 
                  name={userProfile.name}
                  imageUrl={userProfile.avatar}
                  className="w-20 h-20"
                />
                <div>
                  <h4 
                    className="mb-2"
                    style={{
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    프로필 이미지
                  </h4>
                  <p 
                    className="text-sm mb-3"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    프로필 이미지는 추후 업데이트 예정입니다. 현재는 이름의 첫 글자로 자동 생성됩니다.
                  </p>
                  <Button 
                    variant="outline" 
                    disabled
                    style={{
                      borderRadius: 'var(--radius-8)',
                      opacity: 0.5
                    }}
                  >
                    이미지 업로드 (준비 중)
                  </Button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => handleProfileFormChange('name', e.target.value)}
                      className="pl-10"
                      style={{
                        borderRadius: 'var(--radius-8)',
                        borderColor: 'var(--color-border-primary)',
                        backgroundColor: 'var(--color-input-background)',
                        height: '48px'
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => handleProfileFormChange('email', e.target.value)}
                      className="pl-10"
                      style={{
                        borderRadius: 'var(--radius-8)',
                        borderColor: 'var(--color-border-primary)',
                        backgroundColor: 'var(--color-input-background)',
                        height: '48px'
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">회사</Label>
                  <Input
                    id="company"
                    value={profileForm.company}
                    onChange={(e) => handleProfileFormChange('company', e.target.value)}
                    style={{
                      borderRadius: 'var(--radius-8)',
                      borderColor: 'var(--color-border-primary)',
                      backgroundColor: 'var(--color-input-background)',
                      height: '48px'
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">위치</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={profileForm.location}
                      onChange={(e) => handleProfileFormChange('location', e.target.value)}
                      className="pl-10"
                      style={{
                        borderRadius: 'var(--radius-8)',
                        borderColor: 'var(--color-border-primary)',
                        backgroundColor: 'var(--color-input-background)',
                        height: '48px'
                      }}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="website">웹사이트</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="website"
                      type="url"
                      value={profileForm.website}
                      onChange={(e) => handleProfileFormChange('website', e.target.value)}
                      className="pl-10"
                      style={{
                        borderRadius: 'var(--radius-8)',
                        borderColor: 'var(--color-border-primary)',
                        backgroundColor: 'var(--color-input-background)',
                        height: '48px'
                      }}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="bio">소개</Label>
                  <Textarea
                    id="bio"
                    value={profileForm.bio}
                    onChange={(e) => handleProfileFormChange('bio', e.target.value)}
                    placeholder="자신에 대해 간단히 소개해주세요"
                    className="min-h-24"
                    style={{
                      borderRadius: 'var(--radius-8)',
                      borderColor: 'var(--color-border-primary)',
                      backgroundColor: 'var(--color-input-background)'
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  onClick={handleProfileSave}
                  disabled={isLoading}
                  style={{
                    backgroundColor: 'var(--color-brand-primary)',
                    color: 'var(--color-utility-white)',
                    borderRadius: 'var(--radius-8)',
                    border: 'none'
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? '저장 중...' : '변경사항 저장'}
                </Button>
              </div>
            </Card>

            {/* Plan Information */}
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <h3 
                className="mb-4"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                요금제 정보
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge 
                    className="flex items-center gap-1"
                    style={{
                      backgroundColor: userProfile.planType === 'pro' ? 'var(--color-brand-accent-tint)' : 'var(--color-background-tertiary)',
                      color: userProfile.planType === 'pro' ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                      borderRadius: 'var(--radius-rounded)',
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-medium)',
                      padding: '8px 16px'
                    }}
                  >
                    {userProfile.planType === 'pro' && <Crown className="w-4 h-4" />}
                    {userProfile.planType.toUpperCase()} 플랜
                  </Badge>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {formatDate(userProfile.joinedAt)} 가입
                  </p>
                </div>
                <Button variant="outline">
                  업그레이드
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <h3 
                className="mb-6"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                비밀번호 변경
              </h3>

              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">현재 비밀번호</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                      className="pr-10"
                      style={{
                        borderRadius: 'var(--radius-8)',
                        borderColor: 'var(--color-border-primary)',
                        backgroundColor: 'var(--color-input-background)',
                        height: '48px'
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                      className="pr-10"
                      style={{
                        borderRadius: 'var(--radius-8)',
                        borderColor: 'var(--color-border-primary)',
                        backgroundColor: 'var(--color-input-background)',
                        height: '48px'
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                      className="pr-10"
                      style={{
                        borderRadius: 'var(--radius-8)',
                        borderColor: 'var(--color-border-primary)',
                        backgroundColor: 'var(--color-input-background)',
                        height: '48px'
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handlePasswordSave}
                  disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || isLoading}
                  style={{
                    backgroundColor: 'var(--color-brand-primary)',
                    color: 'var(--color-utility-white)',
                    borderRadius: 'var(--radius-8)',
                    border: 'none'
                  }}
                >
                  {isLoading ? '변경 중...' : '비밀번호 변경'}
                </Button>
              </div>
            </Card>

            {/* Privacy Settings */}
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <h3 
                className="mb-6"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                개인정보 설정
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      프로필 공개
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                      다른 사용자가 내 프로필을 볼 수 있도록 허용
                    </p>
                  </div>
                  <Switch
                    checked={privacy.profilePublic}
                    onCheckedChange={(checked) => handlePrivacyChange('profilePublic', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      프로젝트 공개
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                      내가 생성한 프로젝트를 다른 사용자가 볼 수 있도록 허용
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showProjects}
                    onCheckedChange={(checked) => handlePrivacyChange('showProjects', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      통계 정보 공개
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                      생성한 이미지 수, 다운로드 수 등의 통계를 공개
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showStats}
                    onCheckedChange={(checked) => handlePrivacyChange('showStats', checked)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <h3 
                className="mb-6"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                알림 설정
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      이메일 알림
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                      중요한 계정 업데이트를 이메일로 받기
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      프로젝트 업데이트
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                      이미지 생성 완료, 처리 상태 변경 등의 알림
                    </p>
                  </div>
                  <Switch
                    checked={notifications.projectUpdates}
                    onCheckedChange={(checked) => handleNotificationChange('projectUpdates', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      마케팅 이메일
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                      새로운 기능, 팁, 프로모션 정보 받기
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      보안 알림
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                      로그인, 비밀번호 변경 등의 보안 관련 알림
                    </p>
                  </div>
                  <Switch
                    checked={notifications.securityAlerts}
                    onCheckedChange={(checked) => handleNotificationChange('securityAlerts', checked)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <h3 
                className="mb-6"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                결제 정보
              </h3>

              <div 
                className="p-4 rounded-lg border-2 border-dashed text-center"
                style={{
                  borderColor: 'var(--color-border-primary)',
                  backgroundColor: 'var(--color-background-secondary)'
                }}
              >
                <CreditCard 
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: 'var(--color-text-tertiary)' }}
                />
                <h4 
                  className="mb-2"
                  style={{
                    fontSize: 'var(--font-size-regular)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  결제 기능 준비 중
                </h4>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  현재 {userProfile.planType.toUpperCase()} 플랜을 사용 중입니다. <br />
                  결제 기능은 곧 제공될 예정입니다.
                </p>
              </div>
            </Card>

            {/* Danger Zone */}
            <Card 
              className="p-6 border-2"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-semantic-red)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle 
                  className="w-6 h-6"
                  style={{ color: 'var(--color-semantic-red)' }}
                />
                <h3 
                  style={{
                    fontSize: 'var(--font-size-title3)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-semantic-red)'
                  }}
                >
                  계정 삭제
                </h3>
              </div>
              
              <p 
                className="mb-4"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                계정을 삭제하면 모든 프로젝트, 생성된 이미지, 개인 데이터가 영구적으로 삭제됩니다.
                이 작업은 되돌릴 수 없습니다.
              </p>
              
              <Button 
                variant="destructive"
                onClick={() => {
                  // Show confirmation dialog in real app
                  console.log('Account deletion requested');
                }}
                style={{
                  backgroundColor: 'var(--color-semantic-red)',
                  color: 'var(--color-utility-white)',
                  borderRadius: 'var(--radius-8)',
                  border: 'none'
                }}
              >
                계정 삭제
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}