export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface TodoListQuery {
    page?: number;
    limit?: number;
    isActive?: boolean;
    search?: string;
    sortBy?: 'createdAt' | 'time' | 'title';
    sortOrder?: 'ASC' | 'DESC';
}
