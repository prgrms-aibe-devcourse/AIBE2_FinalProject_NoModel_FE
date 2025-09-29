import { GetAxiosInstance, PostAxiosInstance } from './ApiService';
import { RefererType } from '@/types/api';
import { toast } from 'sonner';

export interface PointBalance {
  availablePoints: number;
  pendingPoints: number;
  totalEarnedPoints: number;
  totalUsedPoints: number;
}

export interface PointUseRequest {
  amount: number;
  refererId: number; // 모델 ID 또는 관련 참조 ID
  // 옵션 B: 중복 클릭 방지를 위한 멱등키 (백엔드가 지원하는 경우)
  idempotencyKey?: string;
  // 백엔드 enum RefererType 매핑
  refererType?: RefererType;
}

// 백엔드는 2xx로 성공을 반환하며 바디는 트랜잭션 정보만 포함함
export interface PointUseResponse {
  id: number;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  refererId: number;
  // 필요 시 확장 필드 (예: transactionType, createdAt 등)
  [key: string]: any;
}

class PointApiService {
  // 포인트 잔액 조회 (PointsSubscriptionPage 방식 참고)
  async getPointBalance(): Promise<{ success: boolean; balance: PointBalance; error?: string }> {
    try {
      console.log('포인트 잔액 조회 API 호출 시작');
      const response = await GetAxiosInstance('/points/balance');
      console.log('포인트 잔액 조회 응답:', response);
      console.log('응답 데이터:', response.data);
      
      // 응답이 성공적이면 balance 데이터를 직접 반환
      const balance: PointBalance = {
        availablePoints: response.data.availablePoints ?? 0,
        pendingPoints: response.data.pendingPoints ?? 0,
        totalEarnedPoints: response.data.totalEarnedPoints ?? 0,
        totalUsedPoints: response.data.totalUsedPoints ?? 0,
      };
      
      console.log('변환된 balance:', balance);
      
      return {
        success: true,
        balance,
      };
      
    } catch (error: any) {
      console.error('포인트 잔액 조회 실패:', error);
      console.error('에러 응답:', error.response);
      console.error('에러 데이터:', error.response?.data);
      
      let errorMessage = '포인트 잔액을 조회할 수 없습니다.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        balance: {
          availablePoints: 0,
          pendingPoints: 0,
          totalEarnedPoints: 0,
          totalUsedPoints: 0,
        },
        error: errorMessage,
      };
    }
  }

  // 포인트 사용 (모델 사용료 차감)
  async usePoints(request: PointUseRequest): Promise<PointUseResponse> {
    try {
      console.log('포인트 사용 API 호출 시작, 요청 데이터:', request);
      const response = await PostAxiosInstance<PointUseResponse>('/points/use', request);
      console.log('포인트 사용 응답:', response);
      console.log('응답 데이터:', response.data);

      // 2xx면 성공으로 간주하고 바디를 그대로 반환
      return response.data;
    } catch (error: any) {
      console.error('포인트 사용 실패:', error);
      console.error('에러 응답:', error.response);
      console.error('에러 데이터:', error.response?.data);

      // 서버 표준 에러 포맷 우선 추출 (legacy: { success:false, response:null, error:{ message } })
      const serverData = error.response?.data;
      const message = serverData?.error?.message
        || serverData?.message
        || error.message
        || '포인트 사용에 실패했습니다.';
      throw new Error(message);
    }
  }

  // 포인트 잔액 충분한지 확인
  async checkSufficientPoints(requiredAmount: number): Promise<{ sufficient: boolean; currentBalance: number }> {
    const balanceResponse = await this.getPointBalance();
    
    if (!balanceResponse.success) {
      throw new Error(balanceResponse.error || '포인트 잔액을 확인할 수 없습니다.');
    }

    const currentBalance = balanceResponse.balance.availablePoints;
    return {
      sufficient: currentBalance >= requiredAmount,
      currentBalance,
    };
  }
}

export const pointApiService = new PointApiService();
