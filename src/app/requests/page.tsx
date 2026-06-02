import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/app/_components/page-header';
import { RequestListFilter } from './_components/request-list-filter';
import { RequestTable } from './_components/request-table';
import { useRequestsQuery } from './_hooks/use-requests-query';
import { Spinner } from '@/app/_components/ui/spinner';
import { ErrorState } from '@/app/_components/error-state';
import type { SortingState, PaginationState } from '@tanstack/react-table';

const RequestsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Parse URL parameters (Single Source of Truth)
    const querySearch = searchParams.get('search') || '';
    const queryStatus = searchParams.get('status') || '';
    const queryPriority = searchParams.get('priority') || '';
    const querySortBy = searchParams.get('sortBy') || '';
    const querySortOrder = searchParams.get('sortOrder') || 'asc';
    const queryPage = Number(searchParams.get('page')) || 1;
    const queryLimit = Number(searchParams.get('limit')) || 10;

    // Local input state for fluid UI typing response
    const [inputValue, setInputValue] = useState(querySearch);
    const [prevQuerySearch, setPrevQuerySearch] = useState(querySearch);

    // Sync input value if URL parameter changes externally
    if (querySearch !== prevQuerySearch) {
        setPrevQuerySearch(querySearch);
        setInputValue(querySearch);
    }

    // Debounced update to the URL search parameter
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchParams((prev) => {
                const nextParams = new URLSearchParams(prev);
                if (inputValue) {
                    nextParams.set('search', inputValue);
                    nextParams.set('page', '1'); // Reset to page 1 on new search
                } else {
                    nextParams.delete('search');
                }
                return nextParams;
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [inputValue, setSearchParams]);

    // Fetch requests from API
    const { data, isLoading, error, refetch } = useRequestsQuery({
        page: queryPage,
        limit: queryLimit,
        search: querySearch,
        status: queryStatus,
        priority: queryPriority,
        sortBy: querySortBy,
        sortOrder: querySortOrder,
    });

    const requests = data?.data || [];
    const totalRequests = data?.total || 0;


    // Helper to update URL params
    const updateParams = (newParams: Record<string, string | number | null | undefined>) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            Object.entries(newParams).forEach(([key, val]) => {
                if (val === null || val === undefined || val === '') {
                    next.delete(key);
                } else {
                    next.set(key, String(val));
                }
            });
            return next;
        });
    };

    // Map table states to URL parameters
    const sorting: SortingState = querySortBy
        ? [{ id: querySortBy, desc: querySortOrder === 'desc' }]
        : [];

    const pagination: PaginationState = {
        pageIndex: queryPage - 1,
        pageSize: queryLimit,
    };

    const handleSortingChange = (nextSorting: SortingState) => {
        if (nextSorting.length > 0) {
            updateParams({
                sortBy: nextSorting[0].id,
                sortOrder: nextSorting[0].desc ? 'desc' : 'asc',
                page: 1, // Reset page index on sorting change
            });
        } else {
            updateParams({
                sortBy: null,
                sortOrder: null,
            });
        }
    };

    const handlePaginationChange = (nextPagination: PaginationState) => {
        updateParams({
            page: nextPagination.pageIndex + 1,
            limit: nextPagination.pageSize,
        });
    };

    const handleStatusChange = (status: string) => {
        updateParams({ status, page: 1 });
    };

    const handlePriorityChange = (priority: string) => {
        updateParams({ priority, page: 1 });
    };

    const handleResetFilters = () => {
        setInputValue('');
        setSearchParams(new URLSearchParams());
    };

    const isFiltered = !!querySearch || !!queryStatus || !!queryPriority;

    return (
        <div>
            <PageHeader
                title="Daftar Request"
                description="Kelola dan verifikasi permohonan data"
            />

            <div className="mb-6">
                <RequestListFilter
                    searchQuery={inputValue}
                    onSearchChange={setInputValue}
                    statusFilter={queryStatus}
                    onStatusChange={handleStatusChange}
                    priorityFilter={queryPriority}
                    onPriorityChange={handlePriorityChange}
                    onReset={handleResetFilters}
                    isFiltered={isFiltered}
                />
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-900/20 rounded-xl border border-slate-800/40">
                    <Spinner className="h-8 w-8 text-indigo-500 mb-2" />
                    <p className="text-sm text-slate-400">Memuat data request...</p>
                </div>
            ) : error ? (
                <ErrorState
                    title="Gagal Memuat Data"
                    message={error.message || 'Gagal mengambil data request.'}
                    onRetry={refetch}
                    status={error.status}
                />
            ) : (
                <RequestTable
                    requests={requests}
                    totalCount={totalRequests}
                    sorting={sorting}
                    onSortingChange={handleSortingChange}
                    pagination={pagination}
                    onPaginationChange={handlePaginationChange}
                    isFiltered={isFiltered}
                    onResetFilters={handleResetFilters}
                />
            )}
        </div>
    );
};

export default RequestsPage;
