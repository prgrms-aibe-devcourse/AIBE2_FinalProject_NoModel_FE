import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getDefaultAvatarProps, getProfileImageUrl } from '../../utils/avatar';
import { cn } from '../ui/utils';

interface DefaultAvatarProps {
  name: string;
  imageUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}

/**
 * 기본 아바타 컴포넌트
 * 프로필 이미지가 있으면 표시, 없으면 이니셜과 색상으로 기본 아바타 생성
 */
export function DefaultAvatar({ 
  name, 
  imageUrl, 
  className,
  fallbackClassName 
}: DefaultAvatarProps) {
  const { initials, colorClass } = getDefaultAvatarProps(name);
  const profileImage = getProfileImageUrl(imageUrl);
  
  return (
    <Avatar className={className}>
      {profileImage && (
        <AvatarImage src={profileImage} alt={name} />
      )}
      <AvatarFallback 
        className={cn(
          colorClass,
          'text-white font-medium',
          fallbackClassName
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}