import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/app/_components/page-header';
import { AuditLogFilter } from './_components/audit-log-filter';
import { AuditLogTable } from './_components/audit-log-table';
import { useAuditLogsQuery } from './_hooks/use-audit-logs-query';
import { Spinner } from '@/app/_components/ui/spinner';
import { ErrorState } from '@/app/_components/error-state';
import type { SortingState, PaginationState } from '@tanstack/react-table';

const AuditLogsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Parse URL parameters (Single Source of Truth)
    const querySearch = searchParams.get('search') || '';
    const queryActor = searchParams.get('actor') || '';
    const queryAction = searchParams.get('action') || '';
    const querySortBy = searchParams.get('sortBy') || '';
    const querySortOrder = searchParams.get('sortOrder') || 'desc';
    const queryPage = Number(searchParams.get('page')) || 1;
    const queryLimit = Number(searchParams.get('limit')) || 10;

    // Local input state for search input (to debounce updates)
    const [inputValue, setInputValue] = useState(querySearch);
    const [prevQuerySearch, setPrevQuerySearch] = useState(querySearch);

    // Sync local input value if URL parameter changes externally
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

    // Fetch audit logs via TanStack Query
    const { data, isLoading, error, refetch } = useAuditLogsQuery({
        page: queryPage,
        limit: queryLimit,
        search: querySearch,
        actor: queryActor,
        action: queryAction,
    });

    const auditLogs = data?.data || [];
    const totalAuditLogs = data?.total || 0;

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

    const handleActorChange = (actor: string) => {
        updateParams({ actor, page: 1 });
    };

    const handleActionChange = (action: string) => {
        updateParams({ action, page: 1 });
    };

    const handleResetFilters = () => {
        setInputValue('');
        setSearchParams(new URLSearchParams());
    };

    const isFiltered = !!querySearch || !!queryActor || !!queryAction;

    const uniqueActors = useMemo(() => {
        return ['john.doe@example.com', 'jane.smith@example.com', 'emily.davis@example.com', 'chris.johnson@example.com', 'forbidden@example.com', 'error-500@example.com'];
    }, []);

    const uniqueActions = useMemo(() => {
        return ['LOGIN', 'CREATE_USER', 'UPDATE_USER', 'UPDATE_REQUEST'];
    }, []);

    return (
        <div>
            <PageHeader
                title="Audit Logs"
                description="Catatan aktivitas sistem dan audit log operasi admin"
            />

            <AuditLogFilter
                searchQuery={inputValue}
                onSearchChange={setInputValue}
                actorFilter={queryActor}
                onActorChange={handleActorChange}
                actionFilter={queryAction}
                onActionChange={handleActionChange}
                onReset={handleResetFilters}
                isFiltered={isFiltered}
                uniqueActors={uniqueActors}
                uniqueActions={uniqueActions}
            />

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-900/20 rounded-xl border border-slate-800/40">
                    <Spinner className="h-8 w-8 text-indigo-500 mb-2" />
                    <p className="text-sm text-slate-400">Memuat audit logs...</p>
                </div>
            ) : error ? (
                <ErrorState
                    title="Gagal Memuat Data"
                    message={error.message || 'Gagal mengambil data audit log.'}
                    onRetry={refetch}
                    status={error.status}
                />
            ) : (
                <AuditLogTable
                    auditLogs={auditLogs}
                    totalCount={totalAuditLogs}
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

export default AuditLogsPage;
