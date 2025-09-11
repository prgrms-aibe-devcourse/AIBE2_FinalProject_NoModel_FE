/**
 * 기본 아바타 이미지 생성 유틸리티
 * 백엔드 프로필 이미지 관리 기능이 추가될 때까지 사용
 */

// 기본 아바타 색상 팔레트
const avatarColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-cyan-500',
];

/**
 * 사용자 이름을 기반으로 일관된 색상 클래스 반환 (한글 지원)
 */
export function getAvatarColorClass(name: string): string {
  if (!name) return avatarColors[0];
  
  // 한글 이름의 경우 더 안정적인 해시 생성
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32비트 정수로 변환
  }
  
  const colorIndex = Math.abs(hash) % avatarColors.length;
  return avatarColors[colorIndex];
}

/**
 * 사용자 이름에서 이니셜 추출 (최대 2글자, 한글 지원)
 */
export function getInitials(name: string): string {
  if (!name) return 'U';
  
  const trimmedName = name.trim();
  const parts = trimmedName.split(' ').filter(Boolean);
  
  if (parts.length === 0) return 'U';
  
  if (parts.length === 1) {
    // 한 단어인 경우
    const word = parts[0];
    
    // 한글인지 확인 (한글 유니코드 범위: AC00-D7AF)
    const isKorean = /[가-힣]/.test(word.charAt(0));
    
    if (isKorean) {
      // 한글인 경우: 첫 글자만 사용 (한글은 한 글자가 충분히 식별 가능)
      return word.charAt(0);
    } else {
      // 영문인 경우: 첫 2글자 사용
      return word.length >= 2 
        ? word.substring(0, 2).toUpperCase()
        : word.charAt(0).toUpperCase();
    }
  }
  
  // 여러 단어인 경우: 각 단어의 첫 글자 사용 (최대 2개)
  return parts
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}

/**
 * 기본 아바타 props 생성
 */
export function getDefaultAvatarProps(name: string) {
  return {
    initials: getInitials(name),
    colorClass: getAvatarColorClass(name),
  };
}

/**
 * Gravatar URL 생성 (이메일 기반 아바타 서비스)
 * 추후 백엔드 프로필 이미지 시스템으로 대체 예정
 */
export function getGravatarUrl(email: string, size: number = 100): string {
  // 이메일을 MD5 해시로 변환하는 대신, 현재는 기본 이미지 반환
  // 실제 구현 시 crypto-js 등을 사용하여 MD5 해시 생성 필요
  const defaultImage = 'identicon'; // Gravatar의 기본 아바타 스타일
  return `https://www.gravatar.com/avatar/?d=${defaultImage}&s=${size}`;
}

/**
 * 프로필 이미지 URL 처리
 * 백엔드 이미지 URL이 있으면 사용, 없으면 null 반환
 */
export function getProfileImageUrl(profileImageUrl?: string | null): string | null {
  // 백엔드에서 프로필 이미지 URL이 제공되면 사용
  if (profileImageUrl && profileImageUrl.trim() !== '') {
    return profileImageUrl;
  }
  
  // 없으면 null 반환 (AvatarFallback이 표시됨)
  return null;
}