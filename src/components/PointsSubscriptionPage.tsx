// @ts-ignore
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { NavigationBar } from "./NavigationBar";
import { UserProfile } from "../App";

interface SubscriptionPlan {
    id: number;
    planType: string;
    description: string;
    price: number;
    period: number;
}

interface CurrentSubscription {
    id: number;
    memberId: number;
    subscriptionId: number;
    status: string;
    expiresAt: string;
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
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
        null
    );
    const [currentSubscription, setCurrentSubscription] =
        useState<CurrentSubscription | null>(null);
    const [activeTab, setActiveTab] = useState<
        "charge" | "subscription" | "history"
    >("subscription");

    // subscriptionId → planType 매핑
    const planTypeMap: Record<number, string> = {
        1: "FREE",
        2: "PRO",
        3: "ENTERPRISE",
    };

    // ✅ 구독 현황 + 구독 플랜 목록 불러오기 함수
    const loadSubscriptions = () => {
        // 구독 현황 조회
        fetch("http://localhost:8080/api/subscriptions", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setCurrentSubscription(data || null))
            .catch(() => setCurrentSubscription(null));

        // 구독 플랜 목록 조회
        fetch("http://localhost:8080/api/subscriptions/plans", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setPlans(data || []))
            .catch(() => setPlans([]));
    };

    useEffect(() => {
        loadSubscriptions();
    }, []);

    // ✅ PortOne SDK 타입 선언
    declare global {
        interface Window {
            IMP: any;
        }
    }

    // ✅ 구독 신청
    const handleSubscribe = async () => {
        if (!selectedPlan) return;

        // 사용자 인증 검증
        if (!userProfile) {
            alert("❌ 로그인이 필요합니다. 로그인 페이지로 이동합니다.");
            onLogin();
            return;
        }

        if (!userProfile.email) {
            alert("❌ 사용자 이메일 정보가 없습니다. 다시 로그인해 주세요.");
            onLogin();
            return;
        }

        // buyer_name 설정: name이 없으면 email 앞부분 사용
        const buyerName = userProfile.name || userProfile.email.split('@')[0];

        // ✅ 0원 플랜은 PG 거치지 않고 바로 백엔드에 등록
        if (selectedPlan.price === 0) {
            const response = await fetch("http://localhost:8080/api/subscriptions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    subscriptionId: selectedPlan.id,
                    paidAmount: 0,
                    paymentMethodId: null, // 무료니까 결제수단 없음
                    customerUid: null,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert("✅ FREE 플랜 등록 완료!");
                loadSubscriptions(); // 새로고침 대신 현황 갱신
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert("❌ FREE 플랜 등록 실패: " + (errorData.message || response.statusText));
            }
            return;
        }

        const IMP = window.IMP;
        IMP.init("imp57477065"); // 본인 PortOne 가맹점 식별코드

        IMP.request_pay(
            {
                pg: "kakaopay.TC0ONETIME", // ✅ 카카오페이 테스트
                pay_method: "card",
                merchant_uid: `order_${Date.now()}`,
                name: `${selectedPlan.planType} 구독`,
                amount: selectedPlan.price,
                customer_uid: `user_${Date.now()}`, // 정기결제용 UID
                buyer_email: userProfile.email,
                buyer_name: buyerName,
            },
            async (rsp: any) => {
                if (rsp.success) {
                    const response = await fetch("http://localhost:8080/api/subscriptions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                            subscriptionId: selectedPlan.id,
                            paidAmount: selectedPlan.price,
                            paymentMethodId: 1,
                            customerUid: rsp.customer_uid,
                        }),
                    });

                    if (response.ok) {
                        const result = await response.json();
                        alert(`✅ ${selectedPlan.planType} 구독 결제 성공 및 등록 완료!`);
                        loadSubscriptions(); // 🔥 새로고침 대신 현황 갱신
                    } else {
                        const errorData = await response.json().catch(() => ({}));
                        alert("❌ 백엔드 등록 실패: " + (errorData.message || response.statusText));
                    }
                } else {
                    alert("❌ 결제 실패: " + rsp.error_msg);
                }
            }
        );
    };

    // ✅ 구독 취소
    const handleCancelSubscription = async () => {
        const response = await fetch(
            "http://localhost:8080/api/subscriptions?reason=USER_REQUESTED",
            {
                method: "DELETE",
                credentials: "include",
            }
        );

        if (response.ok) {
            const result = await response.json();
            alert("✅ 구독이 취소되었습니다.");
            loadSubscriptions(); // 🔥 새로고침 대신 현황 갱신
        } else {
            const errorData = await response.json().catch(() => ({}));
            alert("❌ 구독 취소 실패: " + (errorData.message || response.statusText));
        }
    };

    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: "var(--color-background-primary)" }}
        >
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

            <div className="max-w-4xl mx-auto px-6 py-10 mt-30">
                <h1 className="text-2xl font-bold mb-6">포인트 & 구독 관리</h1>

                {/* 보유 포인트 및 구독 상태 */}
                {userProfile && (
                    <div className="mb-6 p-4 border rounded-lg bg-gray-50 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">보유 포인트</p>
                            <p className="text-xl font-bold text-primary">
                                {userProfile.points.toLocaleString()} P
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">현재 구독</p>
                            {currentSubscription ? (
                                <>
                                    <p className="text-xl font-bold text-green-600">
                                        {planTypeMap[currentSubscription.subscriptionId] || "미구독"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        만료일:{" "}
                                        {new Date(currentSubscription.expiresAt).toLocaleDateString()}
                                    </p>
                                    {currentSubscription.status === "ACTIVE" && (
                                        <div className="mt-4 text-right">
                                            <Button
                                                onClick={handleCancelSubscription}
                                                variant="destructive"
                                                className="px-6 py-2"
                                            >
                                                구독 취소하기
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-xl font-bold text-gray-400">미구독</p>
                            )}
                        </div>
                    </div>
                )}

                {/* 탭 UI */}
                <div className="flex gap-4 border-b mb-6">
                    <button
                        className={`pb-2 ${
                            activeTab === "subscription"
                                ? "border-b-2 border-primary text-primary"
                                : "text-gray-400"
                        }`}
                        onClick={() => setActiveTab("subscription")}
                    >
                        구독 플랜
                    </button>
                    <button
                        className={`pb-2 ${
                            activeTab === "charge"
                                ? "border-b-2 border-primary text-primary"
                                : "text-gray-400"
                        }`}
                        onClick={() => setActiveTab("charge")}
                    >
                        포인트 충전
                    </button>
                    <button
                        className={`pb-2 ${
                            activeTab === "history"
                                ? "border-b-2 border-primary text-primary"
                                : "text-gray-400"
                        }`}
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
                                    selectedPlan?.id === plan.id
                                        ? "border-primary"
                                        : "border-gray-200"
                                }`}
                                onClick={() => setSelectedPlan(plan)}
                            >
                                <h2 className="font-bold text-lg">{plan.planType}</h2>
                                <p className="text-sm text-gray-500">{plan.description}</p>
                                <p className="mt-2 font-semibold">
                                    {plan.price}$ / {plan.period}일
                                </p>
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
