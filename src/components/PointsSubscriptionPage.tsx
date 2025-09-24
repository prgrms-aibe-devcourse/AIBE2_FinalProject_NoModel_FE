// @ts-ignore
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { NavigationBar } from "./NavigationBar";
import { UserProfile } from "../App";
import { buildApiUrl } from "@/config/env";
import { Coins, CreditCard, History, Crown, Star, Gift, TrendingUp, Zap, CheckCircle, Sparkles, Check, Clock } from "lucide-react";

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
    onPointBalanceUpdate: (newBalance: number) => void;
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
                                                   onPointBalanceUpdate,
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
    const [pointTransactions, setPointTransactions] = useState<any[]>([]);

    const typeLabelMap: Record<string, string> = {
        PURCHASE: "포인트 구매",
        CHARGE: "포인트 충전",
        USE: "포인트 사용",
        REWARD: "리뷰 보상",
        COMMISSION: "수수료 수익",
        BONUS: "보너스",
        REFUND: "환불",
        MODEL_USAGE: "모델 사용료",
        WITHDRAWAL: "출금",
        EXPIRY: "만료",
    };

    // 포인트 충전 옵션 정의
    const pointOptions = [
        { points: 100, price: 3000 },
        { points: 500, price: 15000, popular: true },
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
        // 구독 현황 조회
        fetch(buildApiUrl('/subscriptions'), {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => setCurrentSubscription(data || null))
            .catch(() => setCurrentSubscription(null));

        // 구독 플랜 목록 조회
        fetch(buildApiUrl('/subscriptions/plans'), {
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
        fetch(buildApiUrl('/points/balance'), {
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
                const newBalance = data.availablePoints ?? 0;
                setPointBalance(newBalance);
                onPointBalanceUpdate(newBalance);
            })
            .catch((error) => {
                console.error("포인트 잔액 조회 실패:", error);
                setPointBalance(0);
            });
    }, [userProfile?.id, onPointBalanceUpdate]);

    // 포인트 거래 내역 조회 함수
    const loadPointTransactions = React.useCallback(() => {
        if (!userProfile) {
            setPointTransactions([]);
            return;
        }
        fetch(buildApiUrl('/points/transactions?page=0&size=100'), {
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
    }, [userProfile?.id]);

    useEffect(() => {
        loadSubscriptions();
        if (userProfile?.id) {
            loadPointBalance();
            loadPointTransactions();
        }
    }, [userProfile?.id, loadPointBalance, loadPointTransactions]);

    // ✅ 구독 신청
    const handleSubscribe = async () => {
        if (!selectedPlan) return;

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

        const buyerName = userProfile.name || userProfile.email.split('@')[0];

        if (selectedPlan.price === 0) {
            const response = await fetch(buildApiUrl('/subscriptions'), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    subscriptionId: selectedPlan.id,
                    paidAmount: 0,
                    paymentMethodId: null,
                    customerUid: null,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert("✅ FREE 플랜 등록 완료!");
                loadSubscriptions();
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
                customer_uid: `user_${Date.now()}`,
                buyer_email: userProfile.email,
                buyer_name: buyerName,
            },
            async (rsp: any) => {
                if (rsp.success) {
                    const response = await fetch(buildApiUrl('/subscriptions'), {
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
                        loadSubscriptions();
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

        const IMP = window.IMP;
        if (!IMP) {
            alert("❌ 결제 시스템 로딩 실패. 페이지를 새로고침해주세요.");
            return;
        }

        IMP.init(import.meta.env.VITE_PORTONE_IMP_CODE || "imp57477065");

        const merchantUid = `points_${Date.now()}`;

        IMP.request_pay(
            {
                pg: import.meta.env.VITE_KAKAO_PG_CODE || "kakaopay.TC0ONETIME",
                pay_method: "card",
                merchant_uid: merchantUid,
                name: `포인트 ${selectedPointOption.points}P 충전`,
                amount: selectedPointOption.points,
                buyer_email: userProfile.email,
                buyer_name: buyerName,
            },
            async (rsp: any) => {
                if (rsp.success) {
                    const verifyResponse = await fetch(buildApiUrl('/points/payment/verify'), {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                            impUid: rsp.imp_uid,
                            merchantUid: rsp.merchant_uid,
                        }),
                    });

                    if (verifyResponse.ok) {
                        alert(`✅ ${selectedPointOption.points}P 포인트 충전 성공!`);
                        loadPointBalance();
                        loadPointTransactions();
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
    };

    // ✅ 구독 취소
    const handleCancelSubscription = async () => {
        const response = await fetch(
            buildApiUrl('/subscriptions?reason=USER_REQUESTED'),
            {
                method: "DELETE",
                credentials: "include",
            }
        );

        if (response.ok) {
            const result = await response.json();
            alert("✅ 구독이 취소되었습니다.");
            loadSubscriptions();
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
                currentPage="pointsSubscription"
            />

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <Coins className="w-8 h-8" style={{ color: 'var(--color-brand-primary)' }} />
                        <h1 style={{
                            fontSize: 'var(--font-size-title1)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-text-primary)'
                        }}>포인트 & 구독 관리</h1>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                        포인트를 충전하거나 구독 플랜을 선택하여 더 많은 기능을 이용해보세요
                    </p>
                </div>

                {/* Current Status */}
                {userProfile && (
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <Card className="p-4 border rounded-lg" style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-primary)' }}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                    보유 포인트
                                </span>
                                <div className="p-2 rounded-lg" style={{ background: 'var(--color-brand-accent-tint)', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Coins className="h-4 w-4" style={{ color: 'var(--color-brand-primary)' }} />
                                </div>
                            </div>
                            <div className="text-2xl font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                                {pointBalance.toLocaleString()}P
                            </div>
                            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                10포인트 = 1회 AI 생성
                            </p>
                        </Card>

                        <Card className="p-4 border rounded-lg" style={{ background: 'var(--color-background-primary)', borderColor: 'var(--color-border-primary)' }}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                    구독 상태
                                </span>
                                <div className="p-2 rounded-lg" style={{ 
                                    background: currentSubscription && planTypeMap[currentSubscription.subscriptionId] ? 'var(--color-brand-accent-tint)' : '#f3f4f6', 
                                    width: '32px', 
                                    height: '32px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>
                                    <Crown className="h-4 w-4" style={{ 
                                        color: currentSubscription && planTypeMap[currentSubscription.subscriptionId] ? 'var(--color-brand-primary)' : '#6b7280' 
                                    }} />
                                </div>
                            </div>
                            <div className="text-2xl font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                                {currentSubscription && planTypeMap[currentSubscription.subscriptionId] ? `${planTypeMap[currentSubscription.subscriptionId]} 구독중` : '미구독'}
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                        {currentSubscription ? '포인트로 간편하게 구독 관리' : '구독하고 더 많은 혜택을 받아보세요'}
                                    </p>
                                    {currentSubscription?.expiresAt && (
                                        <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                                            만료일: {new Date(currentSubscription.expiresAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                {currentSubscription?.status === "ACTIVE" && (
                                    <Button
                                        onClick={handleCancelSubscription}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs px-3 py-1 transition-all duration-200"
                                        style={{
                                            borderColor: 'var(--color-semantic-red)',
                                            color: 'var(--color-semantic-red)',
                                            borderRadius: 'var(--radius-6)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#fee2e2';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        구독 취소
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                <Tabs defaultValue="charge" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 h-10" style={{ 
                        background: 'var(--color-background-secondary)', 
                        border: '1px solid var(--color-border-primary)',
                        borderRadius: 'var(--radius-8)',
                        padding: '3px'
                    }}>
                        <TabsTrigger value="charge" className="h-7 text-sm" style={{ 
                            borderRadius: 'var(--radius-6)',
                            fontWeight: 'var(--font-weight-medium)'
                        }}>포인트 충전</TabsTrigger>
                        <TabsTrigger value="subscription" className="h-7 text-sm" style={{ 
                            borderRadius: 'var(--radius-6)',
                            fontWeight: 'var(--font-weight-medium)'
                        }}>구독 플랜</TabsTrigger>
                        <TabsTrigger value="history" className="h-7 text-sm" style={{ 
                            borderRadius: 'var(--radius-6)',
                            fontWeight: 'var(--font-weight-medium)'
                        }}>사용 내역</TabsTrigger>
                    </TabsList>

                    {/* Subscription Tab */}
                    <TabsContent value="subscription" className="space-y-6">
                        <div className="p-5 rounded-lg" style={{ background: 'var(--color-background-primary)' }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg" style={{ background: 'var(--color-brand-accent-tint)' }}>
                                    <Crown className="h-4 w-4" style={{ color: 'var(--color-brand-primary)' }} />
                                </div>
                                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>구독 플랜</h3>
                            </div>
                            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                                프로 플랜으로 모든 기능을 무제한 이용하세요
                            </p>
                            <div className="grid md:grid-cols-3 gap-4 overflow-visible">
                                {plans.map((plan) => (
                                    <div 
                                        key={plan.id}
                                        className={`relative p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md overflow-visible ${
                                            selectedPlan?.id === plan.id ? 'border-2' : plan.planType === 'PRO' ? 'border-2' : ''
                                        }`}
                                        style={{
                                            background: 'var(--color-background-primary)',
                                            borderColor: selectedPlan?.id === plan.id ? 'var(--color-brand-primary)' : plan.planType === 'PRO' ? '#fed7aa' : 'var(--color-border-primary)'
                                        }}
                                        onClick={() => setSelectedPlan(plan)}
                                    >
                                        {plan.planType === 'PRO' && (
                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                                <Badge
                                                    className="text-black text-xs px-3 py-1"
                                                    style={{
                                                        background: '#f97316',
                                                        borderRadius: '20px',
                                                    }}
                                                >
                                                    인기 · 10%할인
                                                </Badge>
                                            </div>
                                        )}
                                        {plan.planType === 'ENTERPRISE' && (
                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                                <Badge
                                                    className="text-black text-xs px-3 py-1"
                                                    style={{
                                                        background: '#f97316',
                                                        borderRadius: '20px',
                                                    }}
                                                >
                                                    10%할인
                                                </Badge>
                                            </div>
                                        )}
                                        <div className="relative">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="p-1 rounded-lg" style={{ background: 'color-mix(in lch, var(--color-brand-primary), transparent 90%)' }}>
                                                    {plan.planType === 'PRO' && <Star className="h-3 w-3" style={{ color: 'var(--color-brand-primary)' }} />}
                                                    {plan.planType === 'ENTERPRISE' && <TrendingUp className="h-3 w-3" style={{ color: 'var(--color-brand-primary)' }} />}
                                                    {plan.planType === 'FREE' && <Gift className="h-3 w-3" style={{ color: 'var(--color-brand-primary)' }} />}
                                                </div>
                                                <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                                    {plan.planType}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <div className="text-sm mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
                                                {plan.period}일 구독
                                            </div>
                                            {plan.planType === 'PRO' && (
                                                <div className="text-sm mb-1" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'line-through' }}>
                                                    $22.00
                                                </div>
                                            )}
                                            {plan.planType === 'ENTERPRISE' && (
                                                <div className="text-sm mb-1" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'line-through' }}>
                                                    $222.1
                                                </div>
                                            )}
                                            <div className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                                ${plan.planType === 'PRO' ? '19.99' : plan.planType === 'ENTERPRISE' ? '199.99' : plan.price}
                                            </div>
                                            {plan.planType === 'PRO' && (
                                                <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                                    월 약 28,000원
                                                </div>
                                            )}
                                            {plan.planType === 'ENTERPRISE' && (
                                                <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                                    월 약 280,000원
                                                </div>
                                            )}
                                        </div>
                                        
                                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                            {plan.description}
                                        </p>
                                    </div>
                                ))}
                                </div>

                            {selectedPlan && (
                                <div className="mt-4 p-4 border rounded-lg" style={{ 
                                    background: 'var(--color-background-secondary)', 
                                    borderColor: 'var(--color-border-primary)'
                                }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>
                                                선택한 플랜: {selectedPlan.planType} ({selectedPlan.period}일)
                                            </p>
                                            <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                                                결제 금액: ${selectedPlan.price}
                                            </p>
                                        </div>
                                        <Button 
                                            onClick={handleSubscribe}
                                            className="px-4 py-2 text-sm transition-all duration-200"
                                            style={{ 
                                                background: 'var(--color-brand-primary)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 'var(--radius-6)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.filter = 'brightness(0.9)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.filter = 'brightness(1)';
                                            }}
                                        >
                                            구독 결제하기
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Points Tab */}
                    <TabsContent value="charge" className="space-y-6">
                        <div className="p-5 rounded-lg" style={{ background: 'var(--color-background-primary)' }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg" style={{ background: 'var(--color-brand-accent-tint)' }}>
                                    <Coins className="h-4 w-4" style={{ color: 'var(--color-brand-primary)' }} />
                                </div>
                                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>포인트 충전</h3>
                            </div>
                            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                                포인트를 충전하여 AI 광고 이미지를 생성하세요
                            </p>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-visible">
                                {pointOptions.map((option) => (
                                    <div 
                                        key={option.points}
                                        className={`relative p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md overflow-visible ${
                                            selectedPointOption?.points === option.points ? 'border-2' : option.popular ? 'border-2' : ''
                                        }`}
                                        style={{
                                            background: 'var(--color-background-primary)',
                                            borderColor: selectedPointOption?.points === option.points 
                                                ? 'var(--color-brand-primary)' 
                                                : option.popular ? '#fed7aa' : 'var(--color-border-primary)'
                                        }}
                                        onClick={() => setSelectedPointOption(option)}
                                    >
                                        {option.popular && (
                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                                <Badge
                                                    className="text-black text-xs px-3 py-1"
                                                    style={{
                                                        background: '#f97316',
                                                        borderRadius: '20px',
                                                    }}
                                                >
                                                    인기
                                                </Badge>
                                            </div>
                                        )}
                                        <div className="font-semibold text-lg mb-1" style={{ color: 'var(--color-brand-primary)' }}>
                                            +{option.points.toLocaleString()}P 충전
                                        </div>
                                        <div className="text-xl font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                                            {option.price.toLocaleString()}원
                                        </div>
                                        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                            {(option.price / option.points).toFixed(1)}원/포인트
                                        </p>
                                    </div>
                                ))}
                                </div>

                            {selectedPointOption && (
                                <div className="mt-4 p-4 border rounded-lg" style={{ 
                                    background: 'var(--color-background-secondary)', 
                                    borderColor: 'var(--color-border-primary)'
                                }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>
                                                선택한 패키지: {selectedPointOption.points.toLocaleString()}P
                                            </p>
                                            <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                                                결제 금액: {selectedPointOption.price.toLocaleString()}원
                                            </p>
                                        </div>
                                        <Button 
                                            onClick={handleChargePoints}
                                            className="px-4 py-2 text-sm transition-all duration-200"
                                            style={{ 
                                                background: 'var(--color-brand-primary)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 'var(--radius-6)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.filter = 'brightness(0.9)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.filter = 'brightness(1)';
                                            }}
                                        >
                                            구매하기
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-6">
                        <div className="p-5 rounded-lg" style={{ background: 'var(--color-background-primary)' }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg" style={{ background: 'var(--color-brand-accent-tint)' }}>
                                    <History className="h-4 w-4" style={{ color: 'var(--color-brand-primary)' }} />
                                </div>
                                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>사용 내역</h3>
                            </div>
                            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                                포인트 충전 및 사용 내역을 확인하세요
                            </p>
                            <div>
                            {pointTransactions.length === 0 ? (
                                <div className="text-center py-8">
                                    <History 
                                        className="w-8 h-8 mx-auto mb-3" 
                                        style={{ color: 'var(--color-text-tertiary)' }}
                                    />
                                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                        거래 내역이 없습니다.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {pointTransactions.map((transaction, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                            style={{ 
                                                borderColor: 'var(--color-border-secondary)',
                                                background: index === 0 ? 'var(--color-background-secondary)' : 'transparent'
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 rounded-full" style={{
                                                    background: transaction.direction === 'CREDIT' 
                                                        ? 'color-mix(in lch, var(--color-semantic-green), transparent 85%)' 
                                                        : 'color-mix(in lch, var(--color-semantic-red), transparent 85%)'
                                                }}>
                                                    {transaction.direction === 'CREDIT' && <Coins className="h-4 w-4" style={{ color: 'var(--color-semantic-green)' }} />}
                                                    {transaction.direction === 'DEBIT' && <Zap className="h-4 w-4" style={{ color: 'var(--color-semantic-red)' }} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                                        {typeLabelMap[transaction.transactionType] || "기타"}
                                                    </p>
                                                    <p className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-tertiary)' }}>
                                                        <Clock className="h-2.5 w-2.5" />
                                                        {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : "-"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold mb-1" style={{
                                                    color: transaction.direction === 'CREDIT' ? 'var(--color-semantic-green)' : 'var(--color-semantic-red)'
                                                }}>
                                                    {transaction.direction === 'CREDIT' ? '+' : '-'}{(transaction.pointAmount || 0).toLocaleString()}P
                                                </p>
                                                <Badge className="text-xs px-2 py-0.5" style={{
                                                    background: 'var(--color-semantic-green)',
                                                    color: 'white',
                                                    borderRadius: '12px'
                                                }}>
                                                    완료
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
