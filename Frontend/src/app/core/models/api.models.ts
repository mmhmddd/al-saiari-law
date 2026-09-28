export interface ApiResponse<T> { success: boolean; message: string; data: T; }
export interface Pagination { page: number; limit: number; total: number; totalPages: number; }
export interface PageData<T> { items: T[]; pagination: Pagination; }
export interface LocalizedString { en: string; ar: string; }
export interface Media { url: string | null; publicId: string | null; }
