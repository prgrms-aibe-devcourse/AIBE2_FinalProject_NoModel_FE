import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  type
}) => {
  const getTitle = () => {
    return type === 'terms' ? '이용약관' : '개인정보처리방침';
  };

  const getContent = () => {
    if (type === 'terms') {
      return (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">제1조 (목적)</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              이 약관은 NoModel AI 플랫폼(이하 "회사")이 제공하는 AI 이미지 생성 서비스(이하 "서비스")의 이용조건 및 절차에 관한 사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제2조 (용어의 정의)</h3>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>1. "서비스"라 함은 회사가 제공하는 AI 기반 제품 광고 이미지 생성 플랫폼을 의미합니다.</p>
              <p>2. "회원"이라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</p>
              <p>3. "아이디(ID)"라 함은 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는 문자 또는 숫자의 조합을 의미합니다.</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제3조 (서비스의 제공)</h3>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>1. AI 기반 제품 광고 이미지 생성</p>
              <p>2. 생성된 이미지의 저장 및 관리</p>
              <p>3. 커뮤니티 및 모델 마켓플레이스 제공</p>
              <p>4. 기타 회사가 정하는 서비스</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제4조 (서비스의 중단)</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              회사는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제5조 (회원가입)</h3>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>1. 회원가입은 신청자가 온라인으로 회사에서 제공하는 소정의 가입신청 양식에서 요구하는 사항을 기록하여 가입을 완료하는 것으로 성립됩니다.</p>
              <p>2. 회사는 다음 각 호에 해당하는 신청에 대하여는 가입을 거절하거나 사후에 이용계약을 해지할 수 있습니다.</p>
              <p>- 실명이 아니거나 타인의 명의를 이용한 경우</p>
              <p>- 허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제6조 (개인정보보호)</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              회사는 관계법령이 정하는 바에 따라 회원 등록정보를 포함한 회원의 개인정보를 보호하기 위해 노력합니다. 회원의 개인정보보호에 관해서는 관련법령 및 회사의 개인정보처리방침이 적용됩니다.
            </p>
          </section>
        </div>
      );
    } else {
      return (
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-3">개인정보처리방침</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              NoModel AI(이하 "회사")는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">1. 개인정보의 처리목적</h3>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
              <p>- 회원가입 및 관리</p>
              <p>- 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산</p>
              <p>- 고충처리</p>
              <p>- 마케팅 및 광고에의 활용</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">2. 개인정보의 처리 및 보유기간</h3>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
              <p>- 회원가입 및 관리: 서비스 이용계약 또는 회원가입 해지시까지</p>
              <p>- 서비스 제공: 서비스 제공계약의 이행완료시까지</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">3. 처리하는 개인정보의 항목</h3>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
              <p>- 필수항목: 이메일, 비밀번호, 이름</p>
              <p>- 선택항목: 프로필 사진, 전화번호</p>
              <p>- 자동 수집 항목: IP주소, 쿠키, MAC주소, 서비스 이용기록, 방문기록</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">4. 개인정보의 제3자 제공</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              회사는 정보주체의 개인정보를 개인정보의 처리목적에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">5. 정보주체의 권리·의무 및 행사방법</h3>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
              <p>- 개인정보 처리현황 통지요구</p>
              <p>- 개인정보 열람요구</p>
              <p>- 개인정보 정정·삭제요구</p>
              <p>- 개인정보 처리정지요구</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">6. 개인정보보호책임자</h3>
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다:</p>
              <p>- 개인정보보호책임자: NoModel AI 운영팀</p>
              <p>- 연락처: privacy@nomodel.ai</p>
            </div>
          </section>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-sm w-full h-[450px] flex flex-col p-4 data-[state=open]:max-w-sm data-[state=open]:h-[450px] [&>button]:hidden"
        style={{ maxWidth: '384px', height: '450px' }}
      >
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <DialogTitle className="text-sm font-semibold">{getTitle()}</DialogTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </DialogHeader>
        
        <ScrollArea className="flex-1 py-3 pr-3" style={{ maxHeight: '300px' }}>
          <div className="text-sm leading-relaxed space-y-4">
            {getContent()}
          </div>
        </ScrollArea>
        
        <div className="flex justify-end pt-4 pb-4 border-t mt-3 px-1">
          <Button onClick={onClose} size="sm" className="px-4 py-2 text-sm h-8 bg-primary text-primary-foreground hover:bg-primary/90">
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};