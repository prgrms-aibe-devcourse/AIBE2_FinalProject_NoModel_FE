import React from 'react';

interface DynamicFontSizeProps {
  text: string;
  baseSize?: string;
  maxWidth?: string;
  minSize?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 텍스트 길이에 따라 글자 크기를 동적으로 조절하는 컴포넌트
 * 포인트나 긴 숫자 표시에 적합
 */
export function DynamicFontSize({ 
  text, 
  baseSize = 'var(--font-size-title3)',
  maxWidth = '120px',
  minSize = '14px',
  className = '',
  style = {}
}: DynamicFontSizeProps) {
  
  // 텍스트 길이에 따른 글자 크기 계산
  const getFontSize = (text: string) => {
    const length = text.length;
    
    // 길이별 글자 크기 단계별 조정
    if (length <= 5) {
      return baseSize; // 기본 크기 (12,345 P 정도까지)
    } else if (length <= 7) {
      return 'calc(var(--font-size-title3) * 0.9)'; // 90% (1,234,567 P 정도까지)
    } else if (length <= 9) {
      return 'calc(var(--font-size-title3) * 0.8)'; // 80% (123,456,789 P 정도까지)
    } else if (length <= 11) {
      return 'calc(var(--font-size-title3) * 0.7)'; // 70% (12,345,678,901 P 정도까지)
    } else {
      return minSize; // 최소 크기
    }
  };

  const dynamicStyle: React.CSSProperties = {
    fontSize: getFontSize(text),
    fontWeight: 'var(--font-weight-semibold)',
    lineHeight: '1.2',
    maxWidth: maxWidth,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    ...style
  };

  return (
    <span 
      className={className}
      style={dynamicStyle}
      title={text} // 호버 시 전체 텍스트 표시
    >
      {text}
    </span>
  );
}