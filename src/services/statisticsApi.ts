import {GetAxiosInstance} from "./ApiService";
import {mapBackendToUiSummary, UiSummary} from "./reportApi";


type ApiEnvelope<T> = {
    success: boolean;
    response: T | null;
    error: any
};

// 타입: 백엔드 응답의 response 그대로
export type DashboardMetrics = {
    totalUsers: number;
    newUsersThisMonth: number;
    totalProjects: number;
    newProjectsThisMonth: number; // ← 주의: UI쪽의 projectsThisMonth와 이름 다름!
    totalSales: number;
    salesThisMonth: number;
    averageRating: number;
    totalDownloads: number;
};


export async function fetchStatisticsSummary(): Promise<DashboardMetrics> {
    const res = await GetAxiosInstance("/admin/dashboard/summary");
    if (!res.data.success || !res.data.response) throw new Error(res.data.error?.message ?? "summary failed");
    return res.data.response as DashboardMetrics;
}

// 월별 데이터 조회
export type MonthlyStat = {
    month: string;     // "10월"
    projects: number;  // count
    revenue: number;   // sum
};

export async function fetchStatisticsMonthly(): Promise<MonthlyStat[]> {
    const res = await GetAxiosInstance("/admin/dashboard/monthly-stats");
    if (!res.data.success || !res.data.response) throw new Error(res.data.error?.message ?? "월별 통계 조회 실패");
    return res.data.response as MonthlyStat[];
}

// 데일리 데이터 조회
export type DailyActivity = {
    day: string;
    users: number;
    projects: number;
}

export async function fetchDailyActivity(): Promise<DailyActivity[]> {
    const res = await GetAxiosInstance("/admin/dashboard/daily-activity");
    if (!res.data.success || !res.data.response) throw new Error(res.data.error?.message ?? "일별 통계 조회 실패");
    return res.data.response as DailyActivity[];
}