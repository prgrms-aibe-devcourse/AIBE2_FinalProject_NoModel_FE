// @ts-ignore
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { NavigationBar } from "./NavigationBar";
import { UserProfile } from "../App";

// ✅ PortOne SDK 타입 선언
declare global {
    interface Window {
        IMP: any;
    }
}

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
    onPointBalanceUpdate: (newBalance: number) => void; // 포인트 잔액 업데이트 콜백 다시 추가
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
                                                   onPointBalanceUpdate, // 콜백을 props로 받기
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

    // 포인트 충전 관련 상태 추가
    const [pointBalance, setPointBalance] = useState<number>(0);
    const [pointTransactions, setPointTransactions] = useState<any[]>([]); // 포인트 거래 내역 상태 다시 추가

    // 포인트 충전 옵션 정의
    const pointOptions = [
        { points: 100, price: 3000 },
        { points: 500, price: 15000 },
        { points: 1000, price: 30000 },
        { points: 5000, price: 150000 },
    ];
    const [selectedPointOption, setSelectedPointOption] = useState<{
        points: number;
        price: number;
    } | null>(null);

    // subscriptionId → planType 매핑
    const planTypeMap: Record<number, string> = {
        1: "FREE",
        2: "PRO",
        3: "ENTERPRISE",
    };

    // ✅ 구독 현황 + 구독 플랜 목록 불러오기 함수
    const loadSubscriptions = () => {
        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

        // 구독 현황 조회
        fetch(`${apiBase}/subscriptions`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setCurrentSubscription(data || null))
            .catch(() => setCurrentSubscription(null));

        // 구독 플랜 목록 조회
        fetch(`${apiBase}/subscriptions/plans`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setPlans(data || []))
            .catch(() => setPlans([]));
    };

    // 포인트 잔액 조회 함수 (availablePoints 기준)
    const loadPointBalance = React.useCallback(() => {
        if (!userProfile) {
            setPointBalance(0);
            return;
        }
        fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}/points/balance`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("포인트 잔액 조회 실패");
                }
                return res.json();
            })
            .then((data) => {
                console.log("포인트 잔액 응답:", data);
                // ✅ 응답 구조: { success, response: { availablePoints, ... }, error }
                const newBalance = data.availablePoints ?? 0;
                setPointBalance(newBalance);
                onPointBalanceUpdate(newBalance); // 상위 컴포넌트에 업데이트된 잔액 전달
            })
            .catch((error) => {
                console.error("포인트 잔액 조회 실패:", error);
                setPointBalance(0);
            });
    }, [userProfile?.id, onPointBalanceUpdate]); // userProfile.id와 onPointBalanceUpdate를 의존성으로 추가


    // 포인트 거래 내역 조회 함수
    const loadPointTransactions = React.useCallback(() => {
        if (!userProfile) {
            setPointTransactions([]);
            return;
        }
        fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}/points/transactions?page=0&size=100`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('거래 내역 조회 실패');
                }
                return res.json();
            })
            .then((data) => {
                console.log('거래 내역 응답:', data);
                setPointTransactions(data.content || data || []);
            })
            .catch((error) => {
                console.error("포인트 거래 내역 조회 실패:", error);
                setPointTransactions([]);
            });
    }, [userProfile?.id]); // userProfile.id를 의존성으로 추가

    useEffect(() => {
        loadSubscriptions();
        // 로그인 상태일 때 포인트 잔액 로드
        if (userProfile?.id) { // userProfile?.id를 확인하여 유효한 사용자일 때만 API 호출
            loadPointBalance();
            loadPointTransactions();
        }
    }, [userProfile?.id, loadPointBalance, loadPointTransactions]); // userProfile.id를 의존성으로 추가

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
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}/subscriptions`, {
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
        if (!IMP) {
            alert("❌ 결제 시스템 로딩 실패. 페이지를 새로고침해주세요.");
            return;
        }

        IMP.init(import.meta.env.VITE_PORTONE_IMP_CODE || "imp57477065");

        IMP.request_pay(
            {
                pg: import.meta.env.VITE_KAKAO_PG_CODE || "kakaopay.TC0ONETIME",
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
                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}/subscriptions`, {
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

    // ✅ 포인트 충전
    const handleChargePoints = async () => {
        if (!userProfile) {
            alert("❌ 로그인이 필요합니다.");
            onLogin();
            return;
        }

        if (!selectedPointOption) {
            alert("❌ 충전할 포인트를 선택해주세요.");
            return;
        }

        const buyerName = userProfile.name || userProfile.email.split('@')[0];
        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

        try {
            // 1. 결제 준비 (백엔드)
            const prepareResponse = await fetch(`${apiBase}/points/payment/prepare`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    amount: selectedPointOption.price, // 금액을 백엔드에 전달
                    paymentMethod: "KAKAO", // 카카오페이로 고정
                }),
            });

            if (!prepareResponse.ok) {
                const errorData = await prepareResponse.json().catch(() => ({}));
                alert("❌ 결제 준비 실패: " + (errorData.message || prepareResponse.statusText || "서버 오류"));
                return;
            }

            const { merchantUid } = await prepareResponse.json();

            // 2. 포트원 결제 진행
            const IMP = window.IMP;
            if (!IMP) {
                alert("❌ 결제 시스템 로딩 실패. 페이지를 새로고침해주세요.");
                return;
            }

            IMP.init(import.meta.env.VITE_PORTONE_IMP_CODE || "imp57477065");

            IMP.request_pay(
                {
                    pg: import.meta.env.VITE_KAKAO_PG_CODE || "kakaopay.TC0ONETIME",
                    pay_method: "card", // 카드 결제로 고정 (PortOne 내부적으로 카카오/토스페이와 연동)
                    merchant_uid: merchantUid, // 백엔드에서 받은 merchantUid 사용
                    name: `포인트 ${selectedPointOption.points}P 충전`,
                    amount: selectedPointOption.price,
                    buyer_email: userProfile.email,
                    buyer_name: buyerName,
                    // m_redirect_url: "{YOUR_BACKEND_REDIRECT_URL}", // 모바일 결제 시 리디렉션될 URL (필요시 추가)
                },
                async (rsp: any) => {
                    if (rsp.success) {
                        // 3. 결제 검증 및 포인트 충전 (백엔드)
                        const verifyResponse = await fetch(`${apiBase}/points/payment/verify`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({
                                merchantUid: rsp.merchant_uid, // PortOne에서 반환된 merchantUid 사용
                            }),
                        });

                        if (verifyResponse.ok) {
                            alert(`✅ ${selectedPointOption.points}P 포인트 충전 성공!`);
                            loadPointBalance(); // 포인트 잔액 갱신
                            loadPointTransactions(); // 거래 내역 갱신
                        } else {
                            const errorData = await verifyResponse.json().catch(() => ({}));
                            console.error("포인트 검증 및 충전 백엔드 오류:", errorData);
                            alert("❌ 포인트 충전 실패: " + (errorData.message || verifyResponse.statusText || "서버 오류"));
                        }
                    } else {
                        alert("❌ 결제 실패: " + rsp.error_msg);
                    }
                }
            );
        } catch (error) {
            console.error("포인트 충전 중 오류 발생:", error);
            alert("❌ 포인트 충전 중 알 수 없는 오류가 발생했습니다.");
        }
    };

    // ✅ 구독 취소
    const handleCancelSubscription = async () => {
        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}/subscriptions?reason=USER_REQUESTED`,
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
                isAdmin={userProfile?.role === "ADMIN"}
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
                                {pointBalance.toLocaleString()} P
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
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {pointOptions.map((option) => (
                                <div
                                    key={option.points}
                                    className={`p-4 border rounded-lg shadow cursor-pointer text-center
                                    ${
                                        selectedPointOption?.points === option.points
                                            ? "border-primary bg-primary-foreground"
                                            : "border-gray-200 bg-white"
                                    }`}
                                    onClick={() => setSelectedPointOption(option)}
                                >
                                    <p className="text-2xl font-bold text-primary">{option.points} P</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {option.price.toLocaleString()} 원
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                            <p className="text-sm text-gray-500">선택된 결제 수단</p>
                            <p className="text-lg font-bold">카카오페이</p>
                        </div>
                        <Button
                            onClick={handleChargePoints}
                            className="w-full px-6 py-2"
                            disabled={!selectedPointOption}
                        >
                            {selectedPointOption
                                ? `${selectedPointOption.points}P 충전하기 (${selectedPointOption.price.toLocaleString()}원)`
                                : "포인트를 선택해주세요"}
                        </Button>
                    </div>
                )}

                {activeTab === "history" && (
                    <div className="p-4 border rounded-lg shadow">
                        <h2 className="font-bold text-lg mb-4">포인트 사용 내역</h2>
                        {pointTransactions.length === 0 ? (
                            <p className="text-gray-500">거래 내역이 없습니다.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">타입</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">금액</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">설명</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">일시</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {pointTransactions.map((transaction, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {(transaction.type === 'CHARGE' || transaction.direction === 'CHARGE') && '충전'}
                                                {(transaction.type === 'USE' || transaction.direction === 'USE') && '사용'}
                                                {(transaction.type === 'EXPIRE' || transaction.direction === 'EXPIRE') && '만료'}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                                (transaction.type === 'CHARGE' || transaction.direction === 'CHARGE') ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {(transaction.type === 'CHARGE' || transaction.direction === 'CHARGE') ? '+' : '-'} 
                                                {(transaction.amount || transaction.pointAmount || 0).toLocaleString()} P
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {transaction.description || transaction.transactionType || '포인트 거래'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
