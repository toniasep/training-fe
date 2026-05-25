import type { UserListQuery } from "../_types/user-list-query";
import { DEFAULT_LIST_QUERY } from "@/types/query";

export const USER_LIST_QUERY_DEFAULT: UserListQuery = {
    ...DEFAULT_LIST_QUERY,
    role: '',
    status: '',
};