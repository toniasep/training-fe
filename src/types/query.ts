export interface ListQuery {
  page: number;
  limit: number;
  search?: string;
  [key: string]: unknown;
}

export const DEFAULT_LIST_QUERY: ListQuery = {
  page: 1,
  limit: 10,
  search: '',
};
