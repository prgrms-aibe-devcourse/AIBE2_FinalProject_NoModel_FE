import {GetAxiosInstance, PatchAxiosInstance} from "./ApiService";

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
    size: number; // 요청한 size
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
};

type ApiEnvelope<T> = {
    success: boolean;
    response: T | null;
    error: any
};

type AIModelDocument = {
    id: string;
    modelId: number;
    modelName: string;
    suggest?: string[];
    prompt?: string;
    tags?: string[];
    ownType?: string; // 'ADMIN' | 'USER'
    ownerId?: number;
    ownerName?: string;
    price?: number | null;
    isPublic?: boolean;
    usageCount?: number;
    viewCount?: number;
    rating?: number;
    reviewCount?: number;
    createdAt?: string; // ISO
    updatedAt?: string; // ISO
};


type UiModel = {
    id: string;
    modelId: number;
    name: string;
    prompt: string;
    tags: string[];
    ownerName: string;
    price: number | null | undefined;
    rating: number;
    reviewCount: number;
    viewCount: number;
    usageCount: number;
    isPublic: boolean;
    imageUrl: string;
    createdAt?: string;
};

function mapDocToUi(m: AIModelDocument): UiModel {
    return {
        id: m.id,
        modelId: m.modelId,
        name: m.modelName,
        prompt: m.prompt || "",
        tags: (m.tags as string[] | undefined) ?? [],
        ownerName: m.ownerName || "관리자",
        price: (m as any).price,
        rating: m.rating ?? 0,
        reviewCount: m.reviewCount ?? 0,
        viewCount: m.viewCount ?? 0,
        usageCount: m.usageCount ?? 0,
        isPublic: m.isPublic,
        imageUrl: "",
        createdAt: m.createdAt,
    };
}

type AdminModelPage = PageResponse<UiModel>;

export async function fetchAdminModels(params: {
    page?: number; // 0-base
    size?: number; // default 10
    keyword?: string; // optional
    isFree?: boolean | null; // true: 무료만, false: 유료만, null/undefined: 전체
}): Promise<AdminModelPage> {
    const { page = 0, size = 12, keyword, isFree } = params;


    const res = await GetAxiosInstance<ApiEnvelope<PageResponse<AIModelDocument>>>(
        "/admin/models",
        {
            params: {
                page,
                size,
                ...(keyword && keyword.trim() ? { keyword: keyword.trim() } : {}),
            },
        }
    );


    if (!res.data.success || !res.data.response) {
        const msg = res.data.error?.message || "모델 목록을 불러오지 못했습니다";
        throw new Error(msg);
    }


    const pageData = res.data.response;
    return {
        ...pageData,
        content: pageData.content.map(mapDocToUi),
    };
}

export async function updateAdminModelPrice(modelId: string, price: number): Promise<AIModelDocument> {

    const res = await PatchAxiosInstance<ApiEnvelope<AIModelDocument>>(
        "/admin/models/price/" + modelId,
        price
    );

    if (!res.data.success || !res.data.response) {
        const msg = res.data.error?.message || "모델 목록을 불러오지 못했습니다";
        throw new Error(msg);
    }

    return res.data.response;
}

export async function updateAdminModelIsPublic(modelId: string, isPublic: boolean): Promise<AIModelDocument> {

    const res = await PatchAxiosInstance<ApiEnvelope<AIModelDocument>>(
        "/admin/models/isPublic/" + modelId,
        isPublic
    );

    if (!res.data.success || !res.data.response) {
        const msg = res.data.error?.message || "모델 목록을 불러오지 못했습니다";
        throw new Error(msg);
    }

    return res.data.response;
}