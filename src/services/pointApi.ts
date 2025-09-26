import { GetAxiosInstance, PostAxiosInstance } from './ApiService';
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
      const response = await PostAxiosInstance<any>('/points/use', request);
      console.log('포인트 사용 응답:', response);
      console.log('응답 데이터:', response.data);
      
      // 백엔드 응답이 success 형태인지 확인
      if (response.data.success) {
        console.log('포인트 사용 성공!');
        return response.data;
      } else {
        // success가 false인 경우
        console.log('포인트 사용 실패 (success=false):', response.data.error);
        throw new Error(response.data.error?.message || response.data.message || '포인트 사용에 실패했습니다.');
      }
      
    } catch (error: any) {
      console.error('포인트 사용 실패:', error);
      console.error('에러 응답:', error.response);
      console.error('에러 데이터:', error.response?.data);
      
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
