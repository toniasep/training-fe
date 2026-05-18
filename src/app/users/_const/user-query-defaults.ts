import type { UserListQuery } from "../_types/user-list-query";

export const USER_LIST_QUERY_DEFAULT: UserListQuery = {
    page: 1,
    limit: 10,
    search: '',
    role: '',
    status: '',
}