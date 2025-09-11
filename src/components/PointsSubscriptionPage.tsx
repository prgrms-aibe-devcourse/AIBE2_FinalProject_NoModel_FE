// @ts-ignore
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { NavigationBar } from "./NavigationBar";
import { UserProfile } from "../App";
import { loadPaymentWidget } from "@portone/browser-sdk"; // ✅ PortOne SDK 추가

interface SubscriptionPlan {
    id: number;
    planType: string;
    description: string;
    price: number;
    period: number;
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
        fetch("http://localhost:8080/api/subscriptions/plans", {
            method: "GET",
            credentials: "include", // ✅ 쿠키 포함
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data) => setPlans(data.response || []))
            .catch((err) => console.error("구독 플랜 불러오기 실패:", err));
    }, []);

    // ✅ PortOne 기반 결제 처리
    declare global {
        interface Window {
            IMP: any;
        }
    }

    const handleSubscribe = async () => {
        if (!selectedPlan) return;

        // 1) PortOne SDK 초기화
        const IMP = window.IMP;
        IMP.init("imp57477065"); // ✅ 본인 PortOne 가맹점 식별코드

        // 2) 결제 요청
        IMP.request_pay(
            {
                pg: "kakaopay.TC0ONETIME", // ✅ 테스트용 카카오페이 PG
                pay_method: "card",
                merchant_uid: `order_${Date.now()}`,
                name: `${selectedPlan.planType} 구독`,
                amount: selectedPlan.price,
                customer_uid: `user_${Date.now()}`, // ✅ 정기결제를 위해 고유 UID
                buyer_email: userProfile?.email || "guest@example.com",
                buyer_name: userProfile?.name || "테스트유저",
            },
            async (rsp: any) => {
                if (rsp.success) {
                    // 3) 결제 성공 → 백엔드로 전달
                    const response = await fetch("http://localhost:8080/api/subscriptions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                            subscriptionId: selectedPlan.id,
                            paidAmount: selectedPlan.price,
                            paymentMethodId: 1,
                            customerUid: rsp.customer_uid, // billingKey 개념
                        }),
                    });

                    const result = await response.json();
                    if (result.success) {
                        alert(`✅ ${selectedPlan.planType} 구독 결제 성공 및 등록 완료!`);
                    } else {
                        alert("❌ 백엔드 등록 실패: " + result.error?.message);
                    }
                } else {
                    alert("❌ 결제 실패: " + rsp.error_msg);
                }
            }
        );
    };


    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--color-background-primary)" }}>
            <NavigationBar
                onLogin={onLogin}
                onLogout={onLogout}
                onAdGeneration={onAdGeneration}
                onModelCreation={onModelCreation}
                onMarketplace={onMarketplace}
                onMyPage={onMyPage}
                onAdmin={onAdmin}
                isAdmin={userProfile?.isAdmin}
                onHome={onMyPage}
                isLoggedIn={!!userProfile}
                isLandingPage={false}
                onPointsSubscription={onPointsSubscription}
            />

            <div className="max-w-4xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold mb-6">포인트 & 구독 관리</h1>

                {/* 보유 포인트 및 구독 상태 */}
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
                                <h2 className="font-bold text-lg">{plan.planType}</h2>
                                <p className="text-sm text-gray-500">{plan.description}</p>
                                <p className="mt-2 font-semibold">{plan.price}원 / {plan.period}일</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "charge" && (
                    <div className="p-4 border rounded-lg shadow">
                        <h2 className="font-bold text-lg mb-4">포인트 충전</h2>
                        <p>포인트 충전 기능이 여기에 들어갑니다.</p>
                    </div>
                )}

                {activeTab === "history" && (
                    <div className="p-4 border rounded-lg shadow">
                        <h2 className="font-bold text-lg mb-4">사용 내역</h2>
                        <p>포인트 사용 내역이 여기에 들어갑니다.</p>
                    </div>
                )}

                {/* 구독 결제 버튼 */}
                {selectedPlan && activeTab === "subscription" && (
                    <div className="mt-6 text-center">
                        <Button onClick={handleSubscribe} className="px-6 py-2">
                            {selectedPlan.planType} 구독 결제하기
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
