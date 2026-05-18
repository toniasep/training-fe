export type UserListQuery = {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    status?: string;
};