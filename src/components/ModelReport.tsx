import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { DefaultAvatar } from './common/DefaultAvatar';
import { 
  ArrowLeft, AlertTriangle, Upload, X, CheckCircle,
  Flag, Copyright, Ban, Eye, MoreHorizontal
} from 'lucide-react';
import { UserModel, UserProfile, ModelReport as ModelReportType } from '../App';

interface ModelReportProps {
  model: UserModel;
  userProfile: UserProfile | null;
  onBack: () => void;
  onReportSubmit: (report: Omit<ModelReportType, 'id' | 'createdAt'>) => void;
}

const reportTypes = [
  {
    id: 'inappropriate_content',
    label: '부적절한 콘텐츠',
    description: '성인용 콘텐츠, 폭력적 내용, 혐오 표현 등',
    icon: <Eye className="w-5 h-5" />
  },
  {
    id: 'copyright',
    label: '저작권 침해',
    description: '무단 사용된 이미지나 콘텐츠',
    icon: <Copyright className="w-5 h-5" />
  },
  {
    id: 'spam',
    label: '스팸 또는 중복',
    description: '같은 ���델의 반복 업로드 또는 스팸성 콘텐츠',
    icon: <Ban className="w-5 h-5" />
  },
  {
    id: 'fake',
    label: '가짜 또는 허위',
    description: '실제와 다른 정보나 가짜 모델',
    icon: <Flag className="w-5 h-5" />
  },
  {
    id: 'other',
    label: '기타',
    description: '위에 해당하지 않는 다른 문제',
    icon: <MoreHorizontal className="w-5 h-5" />
  }
];

export function ModelReport({ model, userProfile, onBack, onReportSubmit }: ModelReportProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !description.trim() || !userProfile) return;

    setIsSubmitting(true);

    try {
      const report: Omit<ModelReportType, 'id' | 'createdAt'> = {
        modelId: model.id,
        modelName: model.name,
        modelImageUrl: model.imageUrl,
        reporterId: userProfile.id,
        reporterName: userProfile.name,
        reportType: selectedType as ModelReportType['reportType'],
        description: description.trim(),
        attachments,
        status: 'pending'
      };

      onReportSubmit(report);
      setIsSubmitted(true);
    } catch (error) {
      console.error('신고 제출 중 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 실제 앱에서는 파일을 업로드하고 URL을 반환받아야 함
    // 여기서는 Mock URL 사용
    const newAttachments = Array.from(files).map((file, index) => 
      `https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&auto=format&q=60&${index}`
    );
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background-primary)' }}>
        {/* Header */}
        <header className="linear-header sticky top-0 z-50">
          <div className="linear-container h-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 style={{ 
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)'
              }}>
                신고 완료
              </h1>
            </div>
          </div>
        </header>

        <main className="linear-container py-8">
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center" style={{
              backgroundColor: 'var(--color-background-primary)',
              borderColor: 'var(--color-border-primary)',
              borderRadius: 'var(--radius-16)'
            }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                   style={{ backgroundColor: 'var(--color-semantic-green)' + '20' }}>
                <CheckCircle className="w-8 h-8" style={{ color: 'var(--color-semantic-green)' }} />
              </div>
              
              <h2 style={{
                fontSize: 'var(--font-size-title3)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)',
                marginBottom: '8px'
              }}>
                신고가 접수되었습니다
              </h2>
              
              <p style={{ 
                color: 'var(--color-text-secondary)',
                marginBottom: '24px',
                lineHeight: '1.5'
              }}>
                신고해주셔서 감사합니다. 관리팀에서 검토 후 적절한 조치를 취하겠습니다.
                일반적으로 1-3일 내에 처리됩니다.
              </p>

              <Button 
                onClick={onBack}
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-utility-white)',
                  borderRadius: 'var(--radius-8)',
                  fontSize: 'var(--font-size-regular)',
                  fontWeight: 'var(--font-weight-medium)',
                  height: '48px',
                  padding: '0 24px',
                  border: 'none',
                  width: '100%'
                }}
              >
                돌아가기
              </Button>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background-primary)' }}>
      {/* Header */}
      <header className="linear-header sticky top-0 z-50">
        <div className="linear-container h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 px-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 style={{ 
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            }}>
              모델 신고하기
            </h1>
          </div>
        </div>
      </header>

      <main className="linear-container py-8">
        <div className="max-w-2xl mx-auto">
          {/* Model Info */}
          <Card className="p-6 mb-6" style={{
            backgroundColor: 'var(--color-background-primary)',
            borderColor: 'var(--color-border-primary)',
            borderRadius: 'var(--radius-16)'
          }}>
            <div className="flex items-start gap-4">
              <img 
                src={model.imageUrl} 
                alt={model.name}
                className="w-20 h-20 object-cover"
                style={{ borderRadius: 'var(--radius-12)' }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 style={{
                    fontSize: 'var(--font-size-large)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)'
                  }}>
                    {model.name}
                  </h3>
                  <Badge style={{
                    backgroundColor: 'var(--color-background-tertiary)',
                    color: 'var(--color-text-secondary)',
                    borderRadius: 'var(--radius-rounded)',
                    fontSize: 'var(--font-size-small)',
                    padding: '4px 8px'
                  }}>
                    {model.category}
                  </Badge>
                </div>
                <p style={{ 
                  color: 'var(--color-text-secondary)',
                  marginBottom: '12px',
                  fontSize: 'var(--font-size-small)'
                }}>
                  {model.description}
                </p>
                <div className="flex items-center gap-2">
                  <DefaultAvatar 
                    name={model.creatorName}
                    imageUrl={model.creatorAvatar}
                    className="h-6 w-6"
                    fallbackClassName="text-xs"
                  />
                  <span style={{ 
                    color: 'var(--color-text-tertiary)',
                    fontSize: 'var(--font-size-small)'
                  }}>
                    {model.creatorName}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Report Form */}
          <Card className="p-6" style={{
            backgroundColor: 'var(--color-background-primary)',
            borderColor: 'var(--color-border-primary)',
            borderRadius: 'var(--radius-16)'
          }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                   style={{ backgroundColor: 'var(--color-semantic-red)' + '20' }}>
                <AlertTriangle className="w-5 h-5" style={{ color: 'var(--color-semantic-red)' }} />
              </div>
              <div>
                <h2 style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}>
                  신고 사유를 선택해주세요
                </h2>
                <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-small)' }}>
                  부적절한 모델을 신고해주시면 검토 후 조치하겠습니다.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Report Type Selection */}
              <div>
                <Label style={{
                  fontSize: 'var(--font-size-regular)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)',
                  marginBottom: '12px',
                  display: 'block'
                }}>
                  신고 유형
                </Label>
                <RadioGroup value={selectedType} onValueChange={setSelectedType}>
                  <div className="space-y-3">
                    {reportTypes.map((type) => (
                      <div key={type.id} className="flex items-start space-x-3">
                        <RadioGroupItem 
                          value={type.id} 
                          id={type.id}
                          className="mt-1"
                        />
                        <div className="flex-1 cursor-pointer" onClick={() => setSelectedType(type.id)}>
                          <div className="flex items-center gap-2 mb-1">
                            {type.icon}
                            <Label 
                              htmlFor={type.id}
                              className="cursor-pointer"
                              style={{
                                fontSize: 'var(--font-size-regular)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-text-primary)'
                              }}
                            >
                              {type.label}
                            </Label>
                          </div>
                          <p style={{
                            color: 'var(--color-text-tertiary)',
                            fontSize: 'var(--font-size-small)',
                            lineHeight: '1.4'
                          }}>
                            {type.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Description */}
              <div>
                <Label style={{
                  fontSize: 'var(--font-size-regular)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  상세 설명
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="신고 사유에 대해 자세히 설명해주세요..."
                  rows={4}
                  style={{
                    backgroundColor: 'var(--color-background-level1)',
                    borderColor: 'var(--color-border-primary)',
                    borderRadius: 'var(--radius-8)',
                    fontSize: 'var(--font-size-regular)',
                    color: 'var(--color-text-primary)',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* File Upload */}
              <div>
                <Label style={{
                  fontSize: 'var(--font-size-regular)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  증거 자료 (선택사항)
                </Label>
                <div className="space-y-3">
                  <div 
                    className="border-2 border-dashed p-6 text-center cursor-pointer transition-colors hover:bg-opacity-50"
                    style={{
                      borderColor: 'var(--color-border-secondary)',
                      borderRadius: 'var(--radius-12)',
                      backgroundColor: 'var(--color-background-level1)'
                    }}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--color-text-tertiary)' }} />
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-small)' }}>
                      스크린샷이나 증거 이미지를 업로드하세요
                    </p>
                    <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-micro)' }}>
                      PNG, JPG 파일 (최대 5MB)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Uploaded Files */}
                  {attachments.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {attachments.map((attachment, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={attachment} 
                            alt={`증거 ${index + 1}`}
                            className="w-full h-24 object-cover"
                            style={{ borderRadius: 'var(--radius-8)' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: 'var(--color-semantic-red)' }}
                          >
                            <X className="w-4 h-4" style={{ color: 'var(--color-utility-white)' }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Warning Alert */}
              <Alert style={{
                backgroundColor: 'var(--color-semantic-orange)' + '10',
                borderColor: 'var(--color-semantic-orange)' + '30',
                borderRadius: 'var(--radius-12)'
              }}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription style={{ color: 'var(--color-text-primary)' }}>
                  허위 신고는 제재 대상이 될 수 있습니다. 신중하게 작성해주세요.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                  style={{
                    borderColor: 'var(--color-border-primary)',
                    color: 'var(--color-text-secondary)',
                    borderRadius: 'var(--radius-8)',
                    height: '48px'
                  }}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedType || !description.trim() || isSubmitting}
                  className="flex-1"
                  style={{
                    backgroundColor: selectedType && description.trim() 
                      ? 'var(--color-semantic-red)' 
                      : 'var(--color-background-quaternary)',
                    color: selectedType && description.trim() 
                      ? 'var(--color-utility-white)' 
                      : 'var(--color-text-quaternary)',
                    borderRadius: 'var(--radius-8)',
                    height: '48px',
                    border: 'none'
                  }}
                >
                  {isSubmitting ? '신고 중...' : '신고하기'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}