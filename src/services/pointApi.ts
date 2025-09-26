import { PostAxiosInstance, GetAxiosInstance } from './ApiService';
import { toast } from 'sonner';

export interface PointBalance {
  availablePoints: number;
  pendingPoints: number;
  totalEarnedPoints: number;
  totalUsedPoints: number;
}

export interface PointBalanceResponse {
  success: boolean;
  response: PointBalance;
  error?: any;
}

export interface PointUseRequest {
  amount: number;
  refererId: number; // 모델 ID 또는 관련 참조 ID
}

export interface PointUseResponse {
  success: boolean;
  response: {
    transactionId: number;
    amount: number;
    remainingPoints: number;
    refererId: number;
  };
  error?: any;
}

class PointApiService {
  // 포인트 잔액 조회
  async getPointBalance(): Promise<PointBalanceResponse> {
    try {
      const response = await GetAxiosInstance<PointBalanceResponse>('/points/balance');
      return response.data;
    } catch (error) {
      console.error('포인트 잔액 조회 실패:', error);
      return {
        success: false,
        response: {
          availablePoints: 0,
          pendingPoints: 0,
          totalEarnedPoints: 0,
          totalUsedPoints: 0,
        },
        error: error,
      };
    }
  }

  // 포인트 사용 (모델 사용료 차감)
  async usePoints(request: PointUseRequest): Promise<PointUseResponse> {
    try {
      const response = await PostAxiosInstance<PointUseResponse>('/points/use', request);
      return response.data;
    } catch (error: any) {
      console.error('포인트 사용 실패:', error);
      
      // 에러 메시지 처리
      let errorMessage = '포인트 사용에 실패했습니다.';
      if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        response: {
          transactionId: 0,
          amount: 0,
          remainingPoints: 0,
          refererId: 0,
        },
        error: errorMessage,
      };
    }
  }

  // 포인트 잔액 충분한지 확인
  async checkSufficientPoints(requiredAmount: number): Promise<{ sufficient: boolean; currentBalance: number }> {
    const balanceResponse = await this.getPointBalance();
    
    if (!balanceResponse.success) {
      throw new Error('포인트 잔액을 확인할 수 없습니다.');
    }

    const currentBalance = balanceResponse.response.availablePoints;
    return {
      sufficient: currentBalance >= requiredAmount,
      currentBalance,
    };
  }
}

export const pointApiService = new PointApiService();
