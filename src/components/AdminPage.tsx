import React, {useEffect, useMemo, useState} from 'react';
import {Button} from './ui/button';
import {Card} from './ui/card';
import {Badge} from './ui/badge';
import {Input} from './ui/input';
import {Textarea} from './ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './ui/select';
import {Tabs, TabsContent, TabsList, TabsTrigger} from './ui/tabs';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from './ui/dialog';
import {Alert, AlertDescription} from './ui/alert';
import {NavigationBar} from './NavigationBar';
import {
  AlertOctagon,
  ArrowLeft,
  Ban,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Coins,
  Copyright,
  Eye,
  FileText,
  Flag,
  ImageIcon,
  MoreHorizontal,
  Search,
  Shield,
  Star,
  User,
  Users,
  XCircle
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {ModelReport, UserProfile} from '../App';
import type {AdminReportItem, ReportStatus} from '../services/reportApi';
import {fetchAdminReports, fetchReportSummary, processAdminReport, UiSummary} from '../services/reportApi';
import {
  type DashboardMetrics, fetchStatisticsSummary,
  fetchStatisticsMonthly, type MonthlyStat,
  fetchDailyActivity, type DailyActivity,
  fetchRatingDistribution, type RatingItem } from '../services/statisticsApi';

interface AdminPageProps {
  userProfile: UserProfile | null;
  modelReports: ModelReport[];
  onBack: () => void;
  onReportStatusUpdate: (reportId: string, status: ModelReport['status'], reviewNotes?: string, resolution?: ModelReport['resolution']) => void;
  onLogin: () => void;
  onLogout: () => void;
  onAdGeneration: () => void;
  onModelCreation: () => void;
  onMarketplace: () => void;
  onMyPage: () => void;
  onPointsSubscription: () => void;
}

const reportTypeLabels = {
  inappropriate_content: '부적절한 콘텐츠',
  copyright: '저작권 침해',
  spam: '스팸 또는 중복',
  fake: '가짜 또는 허위',
  other: '기타',
  model: '모델',
  review: '리뷰'
};

const reportTypeIcons = {
  inappropriate_content: <Eye className="w-4 h-4" />,
  copyright: <Copyright className="w-4 h-4" />,
  spam: <Ban className="w-4 h-4" />,
  fake: <Flag className="w-4 h-4" />,
  other: <MoreHorizontal className="w-4 h-4" />
};

const statusColors = {
  pending: 'var(--color-semantic-orange)',
  reviewed: 'var(--color-semantic-blue)',
  resolved: 'var(--color-semantic-green)',
  dismissed: 'var(--color-text-quaternary)'
};

const statusLabels = {
  pending: '대기 중',
  reviewed: '검토 중',
  resolved: '해결됨',
  dismissed: '기각됨'
};

const resolutionLabels = {
  model_removed: '모델 삭제',
  warning_issued: '경고 발송',
  no_action: '조치 없음',
  user_banned: '사용자 차단'
};

// Mock data for statistics
const mockStatsData = {
  // 월별 프로젝트 생성량 (최근 6개월)
  projectsByMonth: [
    { month: '6월', projects: 1240, revenue: 12400 },
    { month: '7월', projects: 1240, revenue: 12400 },
    { month: '8월', projects: 1240, revenue: 12400 },
    { month: '9월', projects: 1580, revenue: 15800 },
    { month: '10월', projects: 1890, revenue: 18900 },
    { month: '11월', projects: 2150, revenue: 21500 },
    { month: '12월', projects: 2480, revenue: 24800 },
    { month: '1월', projects: 2890, revenue: 28900 },
  ],
  // 모델 카테고리별 사용량
  modelUsageByCategory: [
    { category: '패션', usage: 3420, percentage: 35 },
    { category: '뷰티', usage: 2890, percentage: 30 },
    { category: '전자제품', usage: 1920, percentage: 20 },
    { category: '홈&리빙', usage: 980, percentage: 10 },
    { category: '기타', usage: 490, percentage: 5 },
  ],
  // 일별 사용자 활동 (최근 7일)
  dailyActivity: [
    { day: '월', users: 245, projects: 89 },
    { day: '화', users: 289, projects: 102 },
    { day: '수', users: 312, projects: 125 },
    { day: '목', users: 298, projects: 98 },
    { day: '금', users: 356, projects: 142 },
    { day: '토', users: 234, projects: 78 },
    { day: '일', users: 198, projects: 56 },
  ],
  // 모델 평점 분포
  ratingDistribution: [
    { rating: '5점', count: 2450, percentage: 45 },
    { rating: '4점', count: 1890, percentage: 35 },
    { rating: '3점', count: 678, percentage: 12.5 },
    { rating: '2점', count: 245, percentage: 4.5 },
    { rating: '1점', count: 167, percentage: 3 },
  ],
  // 전체 통계
  totalStats: {
    totalUsers: 15420,
    newUsersThisMonth: 1240,
    totalProjects: 47890,
    projectsThisMonth: 2890,
    totalModels: 8920,
    modelsThisMonth: 156,
    totalRevenue: 489200,
    revenueThisMonth: 28900,
    averageRating: 4.2,
    totalDownloads: 142650,
  }
};

const COLORS = ['#7170ff', '#4ea7fc', '#4cb782', '#fc7840', '#f2c94c'];

const mapServerStatusToUi = (s: ReportStatus): ModelReport['status'] => {
  switch (s) {
    case 'PENDING': return 'pending';
    case 'UNDER_REVIEW': return 'reviewed';
    case 'RESOLVED':
    case 'ACCEPTED': return 'resolved';
    case 'REJECTED': return 'dismissed';
    default: return 'pending';
  }
};

const toModelReport = (r: AdminReportItem): ModelReport => ({
  id: String(r.reportId),
  status: mapServerStatusToUi(r.reportStatus),
  reportType: 'other',                   // 서버에 타입 필드 없으니 기본값
  modelName: `${r.targetType} #${r.targetId}`,
  modelId: r.targetId,
  modelImageUrl: '/placeholder-report.png', // 썸네일 없으면 플레이스홀더
  reporterName: r.createdBy ?? '알 수 없음',
  createdAt: new Date(r.createdAt),
  reviewedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
  description: r.reasonDetail ?? '',
  reviewNotes: r.adminNote ?? undefined,
  // UI에서 접근하는 선택 필드들 기본값
  attachments: [],
  resolution: undefined,
});


export function AdminPage({ 
  userProfile, 
  modelReports, 
  onBack, 
  onReportStatusUpdate,
  onLogin,
  onLogout,
  onAdGeneration,
  onModelCreation,
  onMarketplace,
  onMyPage,
  onPointsSubscription
}: AdminPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<ModelReport | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [selectedResolution, setSelectedResolution] = useState<ModelReport['resolution']>('no_action');
  const [activeTab, setActiveTab] = useState<string>('statistics');

  // 신고 요약
  const [summary, setSummary] = useState<UiSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // 신고 목록
  const [apiReports, setApiReports] = useState<ModelReport[]>([]);
  const [listPage, setListPage] = useState(0);
  const [listSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // UI 상태필터 → 서버 상태필터 매핑
  const uiToServerStatus: Record<string, ReportStatus | undefined> = {
    all: undefined,
    pending: 'PENDING',
    reviewed: 'UNDER_REVIEW',
    resolved: 'RESOLVED',
    dismissed: 'REJECTED',
  };

  // 신고 처리
  const [processing, setProcessing] = useState(false);
  const [reloadTick, setReloadTick] = useState(0);
  const [openReportId, setOpenReportId] = useState<string | null>(null);

  // 통계 요약
  const [dash, setDash] = useState<DashboardMetrics | null>(null);
  const [dashLoading, setDashLoading] = useState(false);
  const [dashError, setDashError] = useState<string | null>(null);

  // 월별 통계
  const [monthly, setMonthly] = useState<MonthlyStat[] | null>(null);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [monthlyError, setMonthlyError] = useState<string | null>(null);

  // 일별 통계
  const [daily, setDaily] = useState<DailyActivity[] | null>(null);
  const [dailyLoading, setDailyLoading] = useState(false);
  const [dailyError, setDailyError] = useState<string | null>(null);

  // 평점 조회
  const [ratingDist, setRatingDist] = useState<RatingItem[] | null>(null);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);

  const uiToServerStatusForProcess: Record<ModelReport['status'], ReportStatus> = {
    pending: 'PENDING',
    reviewed: 'UNDER_REVIEW',
    resolved: 'RESOLVED',
    dismissed: 'REJECTED',
  };

  // Filter reports
  const filteredReports = useMemo(() => {
    return apiReports
        .filter(report => {
          if (typeFilter !== 'all' && report.reportType !== typeFilter) return false;
          if (
              searchQuery &&
              !report.modelName.toLowerCase().includes(searchQuery.toLowerCase()) &&
              !report.reporterName.toLowerCase().includes(searchQuery.toLowerCase())
          ) return false;
          return true;
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [apiReports, searchQuery, typeFilter]);



  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // 신고 요약
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        setSummaryLoading(true);
        setSummaryError(null);
        const ui = await fetchReportSummary(); // 필요시 {startAt, endAt, targetType} 전달
        if (!abort) setSummary(ui);
      } catch (e: any) {
        if (!abort) setSummaryError(e?.message ?? '요약 조회 실패');
      } finally {
        if (!abort) setSummaryLoading(false);
      }
    })();
    return () => { abort = true; };
  }, []);

  const computedStats = useMemo(() => {
    const pending = modelReports.filter(r => r.status === 'pending').length;
    const reviewed = modelReports.filter(r => r.status === 'reviewed').length;
    const resolved = modelReports.filter(r => r.status === 'resolved').length;
    const dismissed = modelReports.filter(r => r.status === 'dismissed').length;
    return { pending, reviewed, resolved, dismissed, total: modelReports.length };
  }, [modelReports]);

  const adminStats = summary ?? computedStats; // ← 카드에 이 값을 그대로 사용

  // 신고 목록
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        setListLoading(true);
        setListError(null);
        const pageRes = await fetchAdminReports({
          page: listPage,
          size: listSize,
          reportStatus: uiToServerStatus[statusFilter], // 'all'이면 undefined로 전달
          // targetType 필요하면 여기 추가: targetType: 'MODEL' | 'REVIEW'
        });
        if (abort) return;
        setApiReports(pageRes.content.map(toModelReport));
        setTotalPages(pageRes.totalPages);
      } catch (e: any) {
        if (!abort) setListError(e?.message ?? '신고 목록을 불러오지 못했습니다');
      } finally {
        if (!abort) setListLoading(false);
      }
    })();
    return () => { abort = true; };
  }, [listPage, listSize, statusFilter, reloadTick]);

  // 신고 처리
  const handleStatusUpdate = async (status: ModelReport['status']) => {
    if (!selectedReport) return;

    try {
      setProcessing(true);

      const res = await processAdminReport(selectedReport.id, {
        reportStatus: uiToServerStatusForProcess[status],
        adminNote: reviewNotes.trim() || undefined,
      });

      // 1) ApiUtils.success(...) 언래핑 (서비스에서 이미 언래핑했다면 그대로 사용)
      const serverItem: AdminReportItem = res as AdminReportItem;

      // 2) UI 모델로 변환
      const updated = toModelReport(serverItem);

      // 3) 모달 내용(선택된 항목) 갱신
      setSelectedReport(updated);

      // 4) 리스트의 해당 카드도 동기화
      setApiReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));

      // 입력 초기화(선택)
      setReviewNotes(updated.reviewNotes || '');
      setSelectedResolution(updated.resolution || 'no_action');

      // 요약도 갱신(선택)
      try {
        const ui = await fetchReportSummary();
        setSummary(ui);
      } catch {}

    } catch (e: any) {
      alert(e?.message ?? '신고 처리에 실패했습니다.');
    } finally {
      setProcessing(false);
    }
  };

  // 통계 요약
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        setDashLoading(true);
        setDashError(null);
        const data = await fetchStatisticsSummary();
        if (!abort) setDash(data);
      } catch (e: any) {
        if (!abort) setDashError(e?.message ?? '대시보드 조회 실패');
      } finally {
        if (!abort) setDashLoading(false);
      }
    })();
    return () => { abort = true; };
  }, []);

  // 일별 통계
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        setDailyLoading(true);
        setDailyError(null);
        const data = await fetchDailyActivity();
        if (abort) return;
        setDaily(data);
      } catch (e: any) {
        if (!abort) setDailyError(e?.message ?? '일별 통계 조회 실패');
      } finally {
        if (!abort) setDailyLoading(false);
      }
    })();
    return () => { abort = true; };
  }, []);

  const DAY_ORDER = ['월','화','수','목','금','토','일'];

  const dailyChartData = useMemo(() => {
    if (!daily || daily.length === 0) return mockStatsData.dailyActivity; // fallback
    // 응답이 토, 일, 월 … 처럼 섞여와도 월→일 순으로 정렬
    return [...daily].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));
  }, [daily]);

  const totals = useMemo(() => ({
    totalUsers:          dash?.totalUsers          ?? mockStatsData.totalStats.totalUsers,
    newUsersThisMonth:   dash?.newUsersThisMonth   ?? mockStatsData.totalStats.newUsersThisMonth,
    totalProjects:       dash?.totalProjects       ?? mockStatsData.totalStats.totalProjects,
    newProjectsThisMonth:dash?.newProjectsThisMonth?? mockStatsData.totalStats.projectsThisMonth, // 이름 다름 주의
    totalSales:          dash?.totalSales          ?? mockStatsData.totalStats.totalRevenue,      // 이름 다름 주의
    salesThisMonth:      dash?.salesThisMonth      ?? mockStatsData.totalStats.revenueThisMonth,  // 이름 다름 주의
    averageRating:       dash?.averageRating       ?? mockStatsData.totalStats.averageRating,
    totalDownloads:      dash?.totalDownloads      ?? mockStatsData.totalStats.totalDownloads,
  }), [dash]);

  // 월별 통계
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        setMonthlyLoading(true);
        setMonthlyError(null);
        const data = await fetchStatisticsMonthly();
        if (!abort) setMonthly(data);
      } catch (e: any) {
        if (!abort) setMonthlyError(e?.message ?? '월별 통계 조회 실패');
      } finally {
        if (!abort) setMonthlyLoading(false);
      }
    })();
    return () => { abort = true; };
  }, []);

  const monthlyChartData = useMemo(() => {
    if (!monthly) return mockStatsData.projectsByMonth; // fallback
    // API 필드명이 이미 {month, projects, revenue}라 그대로 사용 가능
    return monthly;
  }, [monthly]);

  // 평점 조회
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        setRatingLoading(true);
        setRatingError(null);
        const data = await fetchRatingDistribution();
        if (!abort) setRatingDist(data);
      } catch (e: any) {
        if (!abort) setRatingError(e?.message ?? '평점 분포 조회 실패');
      } finally {
        if (!abort) setRatingLoading(false);
      }
    })();
    return () => { abort = true; };
  }, []);

  const ratingChartData = useMemo(() => {
    if (!ratingDist || ratingDist.length === 0) return mockStatsData.ratingDistribution;
    // UI는 'x점' 라벨을 기대하므로 변환
    return ratingDist
        .sort((a, b) => a.rating - b.rating)
        .map((r) => ({
          rating: `${r.rating}점`,
          count: r.count,
          percentage: r.percentage,
        }));
  }, [ratingDist]);

  if (!userProfile?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background-primary)' }}>
        <Alert style={{
          backgroundColor: 'var(--color-semantic-red)' + '10',
          borderColor: 'var(--color-semantic-red)' + '30',
          borderRadius: 'var(--radius-12)',
          maxWidth: '400px'
        }}>
          <AlertOctagon className="h-4 w-4" />
          <AlertDescription style={{ color: 'var(--color-text-primary)' }}>
            관리자 권한이 필요합니다.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background-primary)' }}>
      <NavigationBar
        onLogin={onLogin}
        onLogout={onLogout}
        onAdGeneration={onAdGeneration}
        onModelCreation={onModelCreation}
        onMarketplace={onMarketplace}
        onMyPage={onMyPage}
        onHome={onBack}
        isLoggedIn={true}
        isLandingPage={false}
        onPointsSubscription={onPointsSubscription}
      />

      {/* Admin Header */}
      <div className="linear-header border-b" style={{ backgroundColor: 'var(--color-background-primary)' }}>
        <div className="linear-container h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 px-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                   style={{ backgroundColor: 'var(--color-semantic-red)' + '20' }}>
                <Shield className="w-5 h-5" style={{ color: 'var(--color-semantic-red)' }} />
              </div>
              <h1 style={{ 
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)'
              }}>
                관리자 페이지
              </h1>
            </div>
          </div>

          <Badge style={{
            backgroundColor: 'var(--color-semantic-red)' + '20',
            color: 'var(--color-semantic-red)',
            borderRadius: 'var(--radius-rounded)',
            fontSize: 'var(--font-size-small)',
            fontWeight: 'var(--font-weight-medium)',
            padding: '4px 12px'
          }}>
            ADMIN
          </Badge>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              통계 대시보드
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              신고 관리
            </TabsTrigger>
          </TabsList>

          {/* Statistics Dashboard */}
          <TabsContent value="statistics" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {dashLoading && (
                  <p style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>대시보드 불러오는 중…</p>
              )}
              {dashError && (
                  <p style={{ color: 'var(--color-semantic-red)', fontSize: 12 }}>대시보드 에러: {dashError}</p>
              )}


              <Card className="p-6" style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-small)' }}>
                      총 사용자
                    </p>
                    <p style={{
                      fontSize: 'var(--font-size-title2)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}>
                      {totals.totalUsers.toLocaleString()}
                    </p>
                    <p style={{ color: 'var(--color-semantic-green)', fontSize: 'var(--font-size-small)' }}>
                      +{totals.newUsersThisMonth.toLocaleString()} 이번 달
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                       style={{ backgroundColor: 'var(--color-semantic-blue)' + '20' }}>
                    <Users className="w-6 h-6" style={{ color: 'var(--color-semantic-blue)' }} />
                  </div>
                </div>
              </Card>

              <Card className="p-6" style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-small)' }}>
                      총 프로젝트
                    </p>
                    <p style={{
                      fontSize: 'var(--font-size-title2)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}>
                      {totals.totalProjects.toLocaleString()}
                    </p>
                    <p style={{ color: 'var(--color-semantic-green)', fontSize: 'var(--font-size-small)' }}>
                      +{totals.newProjectsThisMonth.toLocaleString()} 이번 달
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                       style={{ backgroundColor: 'var(--color-brand-accent-tint)' }}>
                    <ImageIcon className="w-6 h-6" style={{ color: 'var(--color-brand-primary)' }} />
                  </div>
                </div>
              </Card>

              <Card className="p-6" style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-small)' }}>
                      총 매출
                    </p>
                    <p style={{
                      fontSize: 'var(--font-size-title2)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}>
                      {totals.totalSales.toLocaleString()}P
                    </p>
                    <p style={{ color: 'var(--color-semantic-green)', fontSize: 'var(--font-size-small)' }}>
                      +{totals.salesThisMonth.toLocaleString()}P 이번 달
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                       style={{ backgroundColor: 'var(--color-semantic-orange)' + '20' }}>
                    <Coins className="w-6 h-6" style={{ color: 'var(--color-semantic-orange)' }} />
                  </div>
                </div>
              </Card>

              <Card className="p-6" style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-small)' }}>
                      평균 평점
                    </p>
                    <p style={{
                      fontSize: 'var(--font-size-title2)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}>
                      {totals.averageRating}
                    </p>
                    <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-small)' }}>
                      {totals.totalDownloads.toLocaleString()} 다운로드
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                       style={{ backgroundColor: 'var(--color-semantic-yellow)' + '20' }}>
                    <Star className="w-6 h-6" style={{ color: 'var(--color-semantic-yellow)' }} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Projects & Revenue Chart */}
              <Card className="p-6" style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}>
                <h3 style={{
                  fontSize: 'var(--font-size-large)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: '24px'
                }}>
                  월별 프로젝트 생성 & 매출
                </h3>

                {monthlyLoading && (
                    <p style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>월별 통계 불러오는 중…</p>
                )}
                {monthlyError && (
                    <p style={{ color: 'var(--color-semantic-red)', fontSize: 12 }}>에러: {monthlyError}</p>
                )}

                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-primary)" />
                    <XAxis dataKey="month" stroke="var(--color-text-tertiary)" />
                    <YAxis stroke="var(--color-text-tertiary)" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--color-background-primary)',
                        border: '1px solid var(--color-border-primary)',
                        borderRadius: 'var(--radius-8)'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="projects" 
                      stroke="#7170ff" 
                      fill="#7170ff" 
                      fillOpacity={0.2}
                      name="프로젝트 수"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#fc7840" 
                      fill="#fc7840" 
                      fillOpacity={0.2}
                      name="매출 (포인트)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Model Category Usage */}
              {/*<Card className="p-6" style={{*/}
              {/*  backgroundColor: 'var(--color-background-primary)',*/}
              {/*  borderColor: 'var(--color-border-primary)',*/}
              {/*  borderRadius: 'var(--radius-16)'*/}
              {/*}}>*/}
              {/*  <h3 style={{*/}
              {/*    fontSize: 'var(--font-size-large)',*/}
              {/*    fontWeight: 'var(--font-weight-semibold)',*/}
              {/*    color: 'var(--color-text-primary)',*/}
              {/*    marginBottom: '24px'*/}
              {/*  }}>*/}
              {/*    카테고리별 모델 사용량*/}
              {/*  </h3>*/}
              {/*  <ResponsiveContainer width="100%" height={300}>*/}
              {/*    <PieChart>*/}
              {/*      <Pie*/}
              {/*        data={mockStatsData.modelUsageByCategory}*/}
              {/*        cx="50%"*/}
              {/*        cy="50%"*/}
              {/*        outerRadius={100}*/}
              {/*        fill="#8884d8"*/}
              {/*        dataKey="usage"*/}
              {/*        label={({ category, percentage }) => `${category} ${percentage}%`}*/}
              {/*      >*/}
              {/*        {mockStatsData.modelUsageByCategory.map((entry, index) => (*/}
              {/*          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />*/}
              {/*        ))}*/}
              {/*      </Pie>*/}
              {/*      <Tooltip />*/}
              {/*    </PieChart>*/}
              {/*  </ResponsiveContainer>*/}
              {/*</Card>*/}

              {/* Daily Activity */}
              <Card className="p-6" style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}>
                <h3 style={{
                  fontSize: 'var(--font-size-large)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: '24px'
                }}>
                  일별 사용자 활동 (최근 7일)
                </h3>

                {dailyLoading && (
                    <p style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>일별 통계 불러오는 중…</p>
                )}
                {dailyError && (
                    <p style={{ color: 'var(--color-semantic-red)', fontSize: 12 }}>에러: {dailyError}</p>
                )}

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-primary)" />
                    <XAxis dataKey="day" stroke="var(--color-text-tertiary)" />
                    <YAxis stroke="var(--color-text-tertiary)" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--color-background-primary)',
                        border: '1px solid var(--color-border-primary)',
                        borderRadius: 'var(--radius-8)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="users" fill="#4ea7fc" name="활성 사용자" />
                    <Bar dataKey="projects" fill="#4cb782" name="생성된 프로젝트" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Rating Distribution */}
              <Card className="p-6" style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}>
                <h3 style={{
                  fontSize: 'var(--font-size-large)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: '24px'
                }}>
                  평점 분포
                </h3>

                {ratingLoading && (
                    <p style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>평점 분포 불러오는 중…</p>
                )}
                {ratingError && (
                    <p style={{ color: 'var(--color-semantic-red)', fontSize: 12 }}>에러: {ratingError}</p>
                )}

                <div className="space-y-4">
                  {ratingChartData.map((item, index) => (
                    <div key={item.rating} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span style={{ 
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-regular)',
                          fontWeight: 'var(--font-weight-medium)',
                          minWidth: '40px'
                        }}>
                          {item.rating}
                        </span>
                        <div 
                          className="h-6 rounded-full"
                          style={{ 
                            backgroundColor: COLORS[index],
                            width: `${item.percentage * 3}px`,
                            minWidth: '20px'
                          }}
                        />
                      </div>
                      <div className="text-right">
                        <span style={{ 
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-regular)',
                          fontWeight: 'var(--font-weight-medium)'
                        }}>
                          {item.count.toLocaleString()}
                        </span>
                        <span style={{ 
                          color: 'var(--color-text-tertiary)',
                          fontSize: 'var(--font-size-small)',
                          marginLeft: '8px'
                        }}>
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Management */}
          <TabsContent value="reports" className="space-y-6">
            {/* Admin Stats */}
            {summaryLoading && (
                <p style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>요약 불러오는 중…</p>
            )}
            {summaryError && (
                <p style={{ color: 'var(--color-semantic-red)', fontSize: 12 }}>요약 에러: {summaryError}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="p-4" style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-12)'
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                       style={{ backgroundColor: 'var(--color-semantic-orange)' + '20' }}>
                    <Clock className="w-5 h-5" style={{ color: 'var(--color-semantic-orange)' }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>대기 중</p>
                    <p style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}>
                      {adminStats.pending}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4" style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-12)'
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                       style={{ backgroundColor: 'var(--color-semantic-blue)' + '20' }}>
                    <Eye className="w-5 h-5" style={{ color: 'var(--color-semantic-blue)' }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>검토 중</p>
                    <p style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}>
                      {adminStats.reviewed}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4" style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-12)'
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                       style={{ backgroundColor: 'var(--color-semantic-green)' + '20' }}>
                    <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-semantic-green)' }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>해결됨</p>
                    <p style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}>
                      {adminStats.resolved}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4" style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-12)'
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                       style={{ backgroundColor: 'var(--color-text-quaternary)' + '20' }}>
                    <XCircle className="w-5 h-5" style={{ color: 'var(--color-text-quaternary)' }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>기각됨</p>
                    <p style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}>
                      {adminStats.dismissed}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4" style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-12)'
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                       style={{ backgroundColor: 'var(--color-brand-accent-tint)' }}>
                    <FileText className="w-5 h-5" style={{ color: 'var(--color-brand-primary)' }} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>전체 신고</p>
                    <p style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}>
                      {adminStats.total}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <Card className="p-6" style={{
              backgroundColor: 'var(--color-background-primary)',
              borderColor: 'var(--color-border-primary)',
              borderRadius: 'var(--radius-16)'
            }}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                         style={{ color: 'var(--color-text-tertiary)' }} />
                  <Input
                    placeholder="모델명 또는 신고자명으로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    style={{
                      backgroundColor: 'var(--color-background-level1)',
                      borderColor: 'var(--color-border-primary)',
                      borderRadius: 'var(--radius-8)'
                    }}
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="상태 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 상태</SelectItem>
                    <SelectItem value="pending">대기 중</SelectItem>
                    <SelectItem value="reviewed">검토 중</SelectItem>
                    <SelectItem value="resolved">해결됨</SelectItem>
                    <SelectItem value="dismissed">기각됨</SelectItem>
                  </SelectContent>
                </Select>

                {/*<Select value={typeFilter} onValueChange={setTypeFilter}>*/}
                {/*  <SelectTrigger className="w-full md:w-40">*/}
                {/*    <SelectValue placeholder="유형 필터" />*/}
                {/*  </SelectTrigger>*/}
                {/*  <SelectContent>*/}
                {/*    <SelectItem value="all">모든 유형</SelectItem>*/}
                {/*    <SelectItem value="inappropriate_content">부적절한 콘텐츠</SelectItem>*/}
                {/*    <SelectItem value="copyright">저작권 침해</SelectItem>*/}
                {/*    <SelectItem value="spam">스팸</SelectItem>*/}
                {/*    <SelectItem value="fake">가짜</SelectItem>*/}
                {/*    <SelectItem value="other">기타</SelectItem>*/}
                {/*  </SelectContent>*/}
                {/*</Select>*/}
              </div>
            </Card>

            {/* Reports List */}
            {listLoading && (
                <p style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>목록 불러오는 중…</p>
            )}
            {listError && (
                <p style={{ color: 'var(--color-semantic-red)', fontSize: 12 }}>에러: {listError}</p>
            )}
            <div className="flex items-center gap-2 justify-end">
              <Button variant="outline" disabled={listPage === 0} onClick={() => setListPage(p => Math.max(0, p - 1))}>
                이전
              </Button>
              <span style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}>
                {listPage + 1} / {Math.max(1, totalPages)}
              </span>
              <Button variant="outline" disabled={listPage + 1 >= totalPages} onClick={() => setListPage(p => p + 1)}>
                다음
              </Button>
            </div>

            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <Card className="p-8 text-center" style={{
                  backgroundColor: 'var(--color-background-primary)',
                  borderColor: 'var(--color-border-primary)',
                  borderRadius: 'var(--radius-16)'
                }}>
                  <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
                  <h3 style={{
                    fontSize: 'var(--font-size-large)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: '8px'
                  }}>
                    신고 내역이 없습니다
                  </h3>
                  <p style={{ color: 'var(--color-text-tertiary)' }}>
                    검색 조건을 변경하거나 다시 시도해보세요.
                  </p>
                </Card>
              ) : (
                filteredReports.map((report) => (
                  <Card key={report.id} className="p-6 transition-all hover:shadow-md" style={{
                    backgroundColor: 'var(--color-background-primary)',
                    borderColor: report.status === 'pending' ? 'var(--color-semantic-orange)' + '50' : 'var(--color-border-primary)',
                    borderRadius: 'var(--radius-16)',
                    borderWidth: report.status === 'pending' ? '2px' : '1px'
                  }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/*<img */}
                        {/*  src={report.modelImageUrl} */}
                        {/*  alt={report.modelName}*/}
                        {/*  className="w-20 h-20 object-cover cursor-pointer hover:opacity-80 transition-opacity"*/}
                        {/*  style={{ borderRadius: 'var(--radius-12)' }}*/}
                        {/*  onClick={() => window.open(report.modelImageUrl, '_blank')}*/}
                        {/*/>*/}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 style={{
                              fontSize: 'var(--font-size-large)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-text-primary)'
                            }}>
                              {report.modelName}
                            </h3>
                            <Badge className="flex items-center gap-1" style={{
                              backgroundColor: statusColors[report.status] + '20',
                              color: statusColors[report.status],
                              borderRadius: 'var(--radius-rounded)',
                              fontSize: 'var(--font-size-small)',
                              padding: '6px 12px',
                              fontWeight: 'var(--font-weight-medium)'
                            }}>
                              {statusLabels[report.status]}
                            </Badge>
                            <Badge className="flex items-center gap-1" style={{
                              backgroundColor: 'var(--color-background-tertiary)',
                              color: 'var(--color-text-secondary)',
                              borderRadius: 'var(--radius-rounded)',
                              fontSize: 'var(--font-size-small)',
                              padding: '6px 12px'
                            }}>
                              {reportTypeIcons[report.reportType]}
                              {reportTypeLabels[report.reportType]}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
                              <span style={{ 
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-small)'
                              }}>
                                신고자: <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{report.reporterName}</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
                              <span style={{ 
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-small)'
                              }}>
                                {formatDate(report.createdAt)}
                              </span>
                            </div>
                            {report.reviewedAt && (
                              <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
                                <span style={{ 
                                  color: 'var(--color-text-secondary)',
                                  fontSize: 'var(--font-size-small)'
                                }}>
                                  검토일: {formatDate(report.reviewedAt)}
                                </span>
                              </div>
                            )}
                            {/*{report.attachments && report.attachments.length > 0 && (*/}
                            {/*  <div className="flex items-center gap-2">*/}
                            {/*    <FileText className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />*/}
                            {/*    <span style={{ */}
                            {/*      color: 'var(--color-text-secondary)',*/}
                            {/*      fontSize: 'var(--font-size-small)'*/}
                            {/*    }}>*/}
                            {/*      첨부파일: {report.attachments.length}개*/}
                            {/*    </span>*/}
                            {/*  </div>*/}
                            {/*)}*/}
                          </div>

                          <p style={{ 
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--font-size-regular)',
                            lineHeight: '1.6',
                            marginBottom: '16px',
                            padding: '12px',
                            backgroundColor: 'var(--color-background-level1)',
                            borderRadius: 'var(--radius-8)',
                            border: '1px solid var(--color-border-primary)'
                          }}>
                            {report.description.length > 150 
                              ? `${report.description.substring(0, 150)}...` 
                              : report.description
                            }
                          </p>

                          {report.reviewNotes && (
                            <div className="p-4 rounded-lg mb-3" style={{ 
                              backgroundColor: 'var(--color-background-level2)',
                              border: '1px solid var(--color-border-secondary)'
                            }}>
                              <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4" style={{ color: 'var(--color-semantic-blue)' }} />
                                <span style={{
                                  color: 'var(--color-semantic-blue)',
                                  fontSize: 'var(--font-size-small)',
                                  fontWeight: 'var(--font-weight-medium)'
                                }}>
                                  관리자 검토 메모
                                </span>
                              </div>
                              <p style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-small)',
                                lineHeight: '1.5'
                              }}>
                                {report.reviewNotes}
                              </p>
                            </div>
                          )}

                          {report.resolution && (
                            <div className="mt-3">
                              <Badge style={{
                                backgroundColor: 'var(--color-semantic-green)' + '20',
                                color: 'var(--color-semantic-green)',
                                borderRadius: 'var(--radius-rounded)',
                                fontSize: 'var(--font-size-small)',
                                padding: '6px 12px',
                                fontWeight: 'var(--font-weight-medium)'
                              }}>
                                최종 조치: {resolutionLabels[report.resolution]}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedReport(report);
                              setReviewNotes(report.reviewNotes || '');
                              setSelectedResolution(report.resolution || 'no_action');
                            }}
                            style={{
                              borderColor: 'var(--color-border-primary)',
                              color: 'var(--color-text-primary)',
                              borderRadius: 'var(--radius-8)',
                              minWidth: '100px'
                            }}
                          >
                            상세보기
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle style={{ 
                              fontSize: 'var(--font-size-title3)',
                              color: 'var(--color-text-primary)' 
                            }}>
                              신고 상세 내용 및 검토
                            </DialogTitle>
                          </DialogHeader>
                          
                          {selectedReport && (
                            <div className="space-y-6">
                              {/* 신고 기본 정보 */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 style={{ 
                                    fontSize: 'var(--font-size-large)',
                                    fontWeight: 'var(--font-weight-semibold)',
                                    color: 'var(--color-text-primary)',
                                    marginBottom: '12px'
                                  }}>
                                    모델 정보
                                  </h4>
                                  <div className="flex items-start gap-4">
                                    <img 
                                      src={selectedReport.modelImageUrl} 
                                      alt={selectedReport.modelName}
                                      className="w-24 h-24 object-cover cursor-pointer hover:opacity-80"
                                      style={{ borderRadius: 'var(--radius-12)' }}
                                      onClick={() => window.open(selectedReport.modelImageUrl, '_blank')}
                                    />
                                    <div>
                                      <h5 style={{ 
                                        fontWeight: 'var(--font-weight-medium)',
                                        color: 'var(--color-text-primary)',
                                        marginBottom: '4px'
                                      }}>
                                        {selectedReport.modelName}
                                      </h5>
                                      <p style={{ 
                                        color: 'var(--color-text-tertiary)',
                                        fontSize: 'var(--font-size-small)'
                                      }}>
                                        모델 ID: {selectedReport.modelId}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 style={{ 
                                    fontSize: 'var(--font-size-large)',
                                    fontWeight: 'var(--font-weight-semibold)',
                                    color: 'var(--color-text-primary)',
                                    marginBottom: '12px'
                                  }}>
                                    신고 정보
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                      <Badge style={{
                                        backgroundColor: statusColors[selectedReport.status] + '20',
                                        color: statusColors[selectedReport.status],
                                        borderRadius: 'var(--radius-rounded)',
                                        fontSize: 'var(--font-size-small)',
                                        padding: '6px 12px'
                                      }}>
                                        {statusLabels[selectedReport.status]}
                                      </Badge>
                                      <Badge style={{
                                        backgroundColor: 'var(--color-background-tertiary)',
                                        color: 'var(--color-text-secondary)',
                                        borderRadius: 'var(--radius-rounded)',
                                        fontSize: 'var(--font-size-small)',
                                        padding: '6px 12px'
                                      }}>
                                        {reportTypeIcons[selectedReport.reportType]}
                                        {reportTypeLabels[selectedReport.reportType]}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-small)' }}>
                                        신고자: <span style={{ color: 'var(--color-text-primary)' }}>{selectedReport.reporterName}</span>
                                      </p>
                                      <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-small)' }}>
                                        신고일: <span style={{ color: 'var(--color-text-primary)' }}>{formatDate(selectedReport.createdAt)}</span>
                                      </p>
                                      {selectedReport.reviewedAt && (
                                        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-small)' }}>
                                          검토일: <span style={{ color: 'var(--color-text-primary)' }}>{formatDate(selectedReport.reviewedAt)}</span>
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* 신고 내용 */}
                              <div>
                                <h4 style={{ 
                                  fontSize: 'var(--font-size-large)',
                                  fontWeight: 'var(--font-weight-semibold)',
                                  color: 'var(--color-text-primary)',
                                  marginBottom: '12px'
                                }}>
                                  신고 내용
                                </h4>
                                <div className="p-4 rounded-lg" style={{ 
                                  backgroundColor: 'var(--color-background-level1)',
                                  border: '1px solid var(--color-border-primary)'
                                }}>
                                  <p style={{ 
                                    color: 'var(--color-text-primary)',
                                    fontSize: 'var(--font-size-regular)',
                                    lineHeight: '1.6'
                                  }}>
                                    {selectedReport.description}
                                  </p>
                                </div>
                              </div>

                              {/* 첨부파일 */}
                              {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                                <div>
                                  <h4 style={{ 
                                    fontSize: 'var(--font-size-large)',
                                    fontWeight: 'var(--font-weight-semibold)',
                                    color: 'var(--color-text-primary)',
                                    marginBottom: '12px'
                                  }}>
                                    첨부 파일 ({selectedReport.attachments.length}개)
                                  </h4>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {selectedReport.attachments.map((attachment, index) => (
                                      <div key={index} className="relative group">
                                        <img 
                                          src={attachment}
                                          alt={`첨부파일 ${index + 1}`}
                                          className="w-full h-32 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                          style={{ borderRadius: 'var(--radius-8)' }}
                                          onClick={() => window.open(attachment, '_blank')}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                                          <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* 관리자 검토 섹션 */}
                              <div className="border-t pt-6" style={{ borderColor: 'var(--color-border-primary)' }}>
                                <h4 style={{ 
                                  fontSize: 'var(--font-size-large)',
                                  fontWeight: 'var(--font-weight-semibold)',
                                  color: 'var(--color-text-primary)',
                                  marginBottom: '16px'
                                }}>
                                  관리자 검토
                                </h4>
                                
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                                      검토 메모 
                                      {selectedReport.reviewNotes && (
                                        <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 'normal' }}> (기존 메모가 있습니다)</span>
                                      )}
                                    </label>
                                    <Textarea
                                      value={reviewNotes}
                                      onChange={(e) => setReviewNotes(e.target.value)}
                                      placeholder="신고 내용에 대한 검토 의견을 작성하세요..."
                                      rows={4}
                                      style={{
                                        backgroundColor: 'var(--color-background-level1)',
                                        borderColor: 'var(--color-border-primary)',
                                        color: 'var(--color-text-primary)'
                                      }}
                                    />
                                  </div>

                                  {/*{selectedReport.status !== 'resolved' && selectedReport.status !== 'dismissed' && (*/}
                                  {/*  <div>*/}
                                  {/*    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>*/}
                                  {/*      조치 방법*/}
                                  {/*    </label>*/}
                                  {/*    <Select value={selectedResolution} onValueChange={setSelectedResolution}>*/}
                                  {/*      <SelectTrigger>*/}
                                  {/*        <SelectValue placeholder="조치 방법을 선택하세요" />*/}
                                  {/*      </SelectTrigger>*/}
                                  {/*      <SelectContent>*/}
                                  {/*        <SelectItem value="no_action">조치 없음 - 신고 내용이 부적절함</SelectItem>*/}
                                  {/*        <SelectItem value="warning_issued">경고 발송 - 모델 제작자에게 경고</SelectItem>*/}
                                  {/*        <SelectItem value="model_removed">모델 삭제 - 해당 모델을 플랫폼에서 제거</SelectItem>*/}
                                  {/*        <SelectItem value="user_banned">사용자 차단 - 계정 정지 조치</SelectItem>*/}
                                  {/*      </SelectContent>*/}
                                  {/*    </Select>*/}
                                  {/*  </div>*/}
                                  {/*)}*/}

                                  {(selectedReport.status === 'resolved' || selectedReport.status === 'dismissed') && selectedReport.resolution && (
                                    <div className="p-4 rounded-lg" style={{ 
                                      backgroundColor: 'var(--color-semantic-green)' + '10',
                                      border: '1px solid ' + 'var(--color-semantic-green)' + '30'
                                    }}>
                                      <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-semantic-green)' }} />
                                        <span style={{
                                          color: 'var(--color-semantic-green)',
                                          fontWeight: 'var(--font-weight-medium)'
                                        }}>
                                          완료된 조치: {resolutionLabels[selectedReport.resolution]}
                                        </span>
                                      </div>
                                      {selectedReport.reviewNotes && (
                                        <p style={{
                                          color: 'var(--color-text-secondary)',
                                          fontSize: 'var(--font-size-small)',
                                          lineHeight: '1.5'
                                        }}>
                                          {selectedReport.reviewNotes}
                                        </p>
                                      )}
                                    </div>
                                  )}

                                  <div className="flex gap-3 pt-4">
                                    {selectedReport.status === 'pending' && (
                                      <Button
                                        onClick={() => handleStatusUpdate('reviewed')}
                                        className="flex-1"
                                        style={{
                                          backgroundColor: 'var(--color-semantic-blue)',
                                          color: 'var(--color-utility-white)',
                                          border: 'none'
                                        }}
                                      >
                                        검토 시작
                                      </Button>
                                    )}
                                    
                                    {(selectedReport.status === 'pending' || selectedReport.status === 'reviewed') && (
                                      <>
                                        <Button
                                          onClick={() => handleStatusUpdate('resolved')}
                                          className="flex-1"
                                          style={{
                                            backgroundColor: 'var(--color-semantic-green)',
                                            color: 'var(--color-utility-white)',
                                            border: 'none'
                                          }}
                                        >
                                          해결 완료
                                        </Button>
                                        <Button
                                          onClick={() => handleStatusUpdate('dismissed')}
                                          variant="outline"
                                          className="flex-1"
                                          style={{
                                            borderColor: 'var(--color-text-quaternary)',
                                            color: 'var(--color-text-quaternary)'
                                          }}
                                        >
                                          신고 기각
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}