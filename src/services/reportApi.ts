import {GetAxiosInstance} from "./ApiService";

type BackendEnvelope<T> = {
    success: boolean;
    response: T | null;
    error: any
};
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
