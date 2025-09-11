// @ts-ignore
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { NavigationBar } from "./NavigationBar";
import { UserProfile, PointTransaction } from "../App";

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  periodDays: number;
  dailyLimit: number;
}

interface PointsSubscriptionPageProps {
  userProfile: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  onAdGeneration: () => void;
  onModelCreation: () => void;
  onMarketplace: () => void;
  onMyPage: () => void;
  onAdmin?: () => void;
  onPointsSubscription?: () => void;
}

export default function PointsSubscriptionPage({
  userProfile,
  onLogin,
  onLogout,
  onAdGeneration,
  onModelCreation,
  onMarketplace,
  onMyPage,
  onAdmin,
  onPointsSubscription,
}: PointsSubscriptionPageProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [activeTab, setActiveTab] = useState<"charge" | "subscription" | "history">("subscription");

  useEffect(() => {
    // ✅ 백엔드에서 구독 플랜 조회 API 호출 (예: GET /subscriptions/plans)
    fetch("http://localhost:8080/subscriptions/plans")
      .then((res) => res.json())
      .then((data) => setPlans(data.response || []));
  }, []);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    const response = await fetch("http://localhost:8080/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Member-Id": "1" // 로그인된 사용자 ID (실제론 JWT로 처리)
      },
      body: JSON.stringify({
        subscriptionId: selectedPlan.id,
        paidAmount: selectedPlan.price,
        paymentMethodId: 1, // 더미
        customerUid: `user_${Date.now()}`, // PortOne 빌링키 UID
      }),
    });

    const result = await response.json();
    if (result.success) {
      alert(`✅ ${selectedPlan.name} 구독 결제 성공!`);
    } else {
      alert("❌ 결제 실패: " + result.error?.message);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background-primary)' }}>
      <NavigationBar
        onLogin={onLogin}
        onLogout={onLogout}
        onAdGeneration={onAdGeneration}
        onModelCreation={onModelCreation}
        onMarketplace={onMarketplace}
        onMyPage={onMyPage}
        onAdmin={onAdmin}
        isAdmin={userProfile?.isAdmin}
        onHome={onMyPage} // 여기서는 마이페이지로 돌아가는 것을 홈으로 간주
        isLoggedIn={!!userProfile}
        isLandingPage={false}
        onPointsSubscription={onPointsSubscription}
      />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">포인트 & 구독 관리</h1>

        {/* 보유 포인트 및 구독 상태 표시 */}
        {userProfile && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">보유 포인트</p>
              <p className="text-xl font-bold text-primary">{userProfile.points.toLocaleString()} P</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">현재 구독</p>
              <p className="text-xl font-bold text-green-600">{userProfile.planType.toUpperCase()}</p>
            </div>
          </div>
        )}

        {/* 탭 UI */}
        <div className="flex gap-4 border-b mb-6">
          <button 
            className={`pb-2 ${activeTab === "subscription" ? "border-b-2 border-primary text-primary" : "text-gray-400"}`}
            onClick={() => setActiveTab("subscription")}
          >
            구독 플랜
          </button>
          <button 
            className={`pb-2 ${activeTab === "charge" ? "border-b-2 border-primary text-primary" : "text-gray-400"}`}
            onClick={() => setActiveTab("charge")}
          >
            포인트 충전
          </button>
          <button 
            className={`pb-2 ${activeTab === "history" ? "border-b-2 border-primary text-primary" : "text-gray-400"}`}
            onClick={() => setActiveTab("history")}
          >
            사용 내역
          </button>
        </div>

        {/* 탭 내용 */} 
        {activeTab === "subscription" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`p-4 border rounded-lg shadow cursor-pointer ${
                  selectedPlan?.id === plan.id ? "border-primary" : "border-gray-200"
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <h2 className="font-bold text-lg">{plan.name}</h2>
                <p className="text-sm text-gray-500">{plan.description}</p>
                <p className="mt-2 font-semibold">{plan.price}원 / {plan.periodDays}일</p>
                <p className="text-xs text-gray-400">일일 {plan.dailyLimit === -1 ? "무제한" : `${plan.dailyLimit}회`} 사용</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "charge" && (
          <div className="p-4 border rounded-lg shadow">
            <h2 className="font-bold text-lg mb-4">포인트 충전</h2>
            <p>포인트 충전 기능이 여기에 들어갑니다.</p>
            {/* TODO: 포인트 충전 UI 구현 */}
          </div>
        )}

        {activeTab === "history" && (
          <div className="p-4 border rounded-lg shadow">
            <h2 className="font-bold text-lg mb-4">사용 내역</h2>
            <p>포인트 사용 내역이 여기에 들어갑니다.</p>
            {/* TODO: 포인트 사용 내역 UI 구현 */}
          </div>
        )}

        {/* 구독 결제 버튼 (구독 플랜 탭에서만 표시) */}
        {selectedPlan && activeTab === "subscription" && (
          <div className="mt-6 text-center">
            <Button onClick={handleSubscribe} className="px-6 py-2">
              {selectedPlan.name} 구독 결제하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
