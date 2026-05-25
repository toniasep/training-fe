import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/app/_components/page-header';
import { UserListFilter } from './_components/user-list-filter';
import { UserTable } from './_components/user-table';
import { UserFormDialog } from './_components/user-form-dialog';
import { useUsersQuery } from './_hooks/use-users-query';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { TUser } from '@/api/users/types';
import { Spinner } from '@/components/ui/spinner';
import { ErrorState } from '@/app/_components/error-state';
import type { SortingState, PaginationState } from '@tanstack/react-table';

const UsersPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Parse URL parameters (Single Source of Truth)
    const querySearch = searchParams.get('search') || '';
    const queryRole = searchParams.get('role') || '';
    const queryStatus = searchParams.get('status') || '';
    const querySortBy = searchParams.get('sortBy') || '';
    const querySortOrder = searchParams.get('sortOrder') || 'asc';
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

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<TUser | undefined>(undefined);

    // Fetch users using react-query.
    // Note: We only pass search to API because our MSW mock handler filters by search.
    // Sorting, page size, status/role filtering are managed client-side via TanStack Table.
    const { data: users = [], isLoading, error, refetch } = useUsersQuery({
        page: 1,
        limit: 10,
        search: querySearch,
    });

    const handleAddClick = () => {
        setSelectedUser(undefined);
        setDialogOpen(true);
    };

    const handleEditClick = (user: TUser) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleSuccess = () => {
        // Cache invalidation is handled in mutation hooks on success.
    };

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

    const handleRoleChange = (role: string) => {
        updateParams({ role, page: 1 });
    };

    const handleStatusChange = (status: string) => {
        updateParams({ status, page: 1 });
    };

    const handleResetFilters = () => {
        setInputValue('');
        setSearchParams(new URLSearchParams());
    };

    const isFiltered = !!querySearch || !!queryRole || !!queryStatus;

    return (
        <div>
            <PageHeader
                title="Manajemen User"
                description="Kelola data pengguna"
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <UserListFilter
                    searchQuery={inputValue}
                    onSearchChange={setInputValue}
                    roleFilter={queryRole}
                    onRoleChange={handleRoleChange}
                    statusFilter={queryStatus}
                    onStatusChange={handleStatusChange}
                    onReset={handleResetFilters}
                    isFiltered={isFiltered}
                />
                <Button onClick={handleAddClick} className="self-end md:self-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah User
                </Button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-900/20 rounded-xl border border-slate-800/40">
                    <Spinner className="h-8 w-8 text-indigo-500 mb-2" />
                    <p className="text-sm text-slate-400">Memuat data user...</p>
                </div>
            ) : error ? (
                <ErrorState
                    title="Gagal Memuat Data"
                    message={error.message || 'Gagal mengambil data user.'}
                    onRetry={refetch}
                    status={error.status}
                />
            ) : (
                <UserTable
                    users={users}
                    onEdit={handleEditClick}
                    sorting={sorting}
                    onSortingChange={handleSortingChange}
                    pagination={pagination}
                    onPaginationChange={handlePaginationChange}
                    roleFilter={queryRole}
                    statusFilter={queryStatus}
                    searchFilter={querySearch}
                    isFiltered={isFiltered}
                    onResetFilters={handleResetFilters}
                />
            )}

            <UserFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                user={selectedUser}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default UsersPage;