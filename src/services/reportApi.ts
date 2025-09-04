import {GetAxiosInstance, PatchAxiosInstance} from "./ApiService";

type ApiEnvelope<T> = {
    success: boolean;
    response: T | null;
    error: any
};

/** 신고 요약 API **/
type BackendSummary = {
    total:number;
    pending:number;
    inProgress:number;
    resolved:number;
    rejected:number
};
export type UiSummary = {
    total:number;
    pending:number;
    reviewed:number;
    resolved:number;
    dismissed:number
};

export function mapBackendToUiSummary(b: BackendSummary): UiSummary {
    return {
        total: b.total,
        pending: b.pending,
        reviewed: b.inProgress,
        resolved: b.resolved,
        dismissed: b.rejected,
    };
}

export async function fetchReportSummary(): Promise<UiSummary> {
    const res = await GetAxiosInstance("/admin/report/summary");
    if (!res.data.success || !res.data.response) throw new Error(res.data.error?.message ?? "summary failed");
    return mapBackendToUiSummary(res.data.response);
}

/** 신고 목록 api **/
/** ====== 페이지 응답 타입(스프링 Page) ====== */
export type PageResponse<T> = {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        offset: number;
        paged: boolean;
        unpaged: boolean;
        sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    };
    totalElements: number;
    totalPages: number;
    number: number; // 현재 페이지(0-base)
    size: number;   // 요청한 size
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
};

/** ====== 도메인 타입 ====== */
export type ReportStatus = 'ACCEPTED' | 'PENDING' | 'REJECTED' | 'RESOLVED' | 'UNDER_REVIEW';
export type TargetType  = 'MODEL' | 'REVIEW';

export type AdminReportItem = {
    reportId: number;
    createdAt: string;   // ISO
    updatedAt: string;   // ISO
    reportStatus: ReportStatus;
    targetType: TargetType;
    targetId: number;
    createdBy: string;
    adminNote: string | null;
    reasonDetail: string | null;
};

export type AdminReportPage = PageResponse<AdminReportItem>;

/** ====== 목록 조회 API ====== */
export async function fetchAdminReports(params: {
    page?: number;         // 0-base
    size?: number;         // default 10
    targetType?: TargetType | '';   // optional
    reportStatus?: ReportStatus | '';// optional
}) {
    const { page = 0, size = 10, targetType, reportStatus } = params;

    const res = await GetAxiosInstance<ApiEnvelope<AdminReportPage>>(
        '/admin/report',
        {
            params: {
                page,
                size,
                // null/undefined 대신 빈 문자열로 보내면 스프링이 파싱 시 무시 가능
                ...(targetType ? { targetType } : {}),
                ...(reportStatus ? { reportStatus } : {}),
            },
        }
    );

    if (!res.data.success || !res.data.response) {
        const msg = res.data.error?.message || '신고 목록을 불러오지 못했습니다';
        throw new Error(msg);
    }
    return res.data.response;
}

/** 신고 처리 API **/
export type ProcessReportDto = {
    reportStatus: ReportStatus;   // 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED' ...
    adminNote?: string;
};

export async function processAdminReport(
    reportId: number | string,
    payload: ProcessReportDto
) {
    const res = await PatchAxiosInstance<ApiEnvelope<AdminReportItem>>(
        `/admin/report/${reportId}/process`,
        payload
    );

    if (!res.data?.success || !res.data?.response) {
        throw new Error(res.data?.error?.message ?? "신고 처리에 실패했습니다");
    }
    return res.data.response; // AdminReportItem
}