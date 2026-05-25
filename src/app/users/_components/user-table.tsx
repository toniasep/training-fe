import { Link } from 'react-router-dom';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
    type PaginationState,
} from '@tanstack/react-table';
import {
    Eye,
    Pencil,
    UserCheck,
    UserX,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { StatusBadge } from '@/app/_components/status-badge';
import { EmptyState } from '@/app/_components/empty-state';
import type { TUser } from '@/api/users/types';
import { Button } from '@/components/ui/button';
import { useUpdateUserStatusMutation } from '../_hooks/use-update-user-status-mutation';
import { useToast } from '@/app/_components/toast-context';
import { useState, useMemo, useCallback } from 'react';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface UserTableProps {
    users: TUser[];
    onEdit: (user: TUser) => void;
    sorting: SortingState;
    onSortingChange: (sorting: SortingState) => void;
    pagination: PaginationState;
    onPaginationChange: (pagination: PaginationState) => void;
    roleFilter: string;
    statusFilter: string;
    searchFilter: string;
    isFiltered: boolean;
    onResetFilters: () => void;
}

export const UserTable = ({
    users,
    onEdit,
    sorting,
    onSortingChange,
    pagination,
    onPaginationChange,
    roleFilter,
    statusFilter,
    searchFilter,
    isFiltered,
    onResetFilters,
}: UserTableProps) => {
    const { mutate: updateStatus } = useUpdateUserStatusMutation();
    const { toast } = useToast();
    const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

    const handleToggleStatus = useCallback((user: TUser) => {
        const nextStatus = user.status === 'Aktif' ? 'Inactive' : 'Aktif';
        const actionLabel = nextStatus === 'Aktif' ? 'mengaktifkan' : 'menonaktifkan';
        setLoadingUserId(user.id);

        updateStatus(
            { id: user.id, status: nextStatus },
            {
                onSuccess: () => {
                    toast(`Berhasil ${actionLabel} user ${user.name}.`, 'success');
                    setLoadingUserId(null);
                },
                onError: (error) => {
                    toast(error.message || `Gagal ${actionLabel} user.`, 'error');
                    setLoadingUserId(null);
                },
            }
        );
    }, [updateStatus, toast]);

    // Define columns
    const columns = useMemo<ColumnDef<TUser>[]>(() => [
        {
            accessorKey: 'id',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-3 h-8 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                    ID
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-3.5 w-3.5" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-3.5 w-3.5" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-slate-600" />
                    )}
                </Button>
            ),
            cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('id')}</span>,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-3 h-8 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                    Nama
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-3.5 w-3.5" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-3.5 w-3.5" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-slate-600" />
                    )}
                </Button>
            ),
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <Link
                        to={`/users/${user.id}`}
                        className="font-medium hover:underline hover:text-indigo-500 transition-colors"
                    >
                        {user.name}
                    </Link>
                );
            },
        },
        {
            accessorKey: 'email',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-3 h-8 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                    Email
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-3.5 w-3.5" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-3.5 w-3.5" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-slate-600" />
                    )}
                </Button>
            ),
        },
        {
            accessorKey: 'role',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-3 h-8 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                    Role
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-3.5 w-3.5" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-3.5 w-3.5" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-slate-600" />
                    )}
                </Button>
            ),
            cell: ({ row }) => {
                const role = row.getValue('role') as string;
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        role === 'Admin'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300'
                            : role === 'Developer'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300'
                    }`}>
                        {role}
                    </span>
                );
            },
            filterFn: 'equals',
        },
        {
            accessorKey: 'status',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-3 h-8 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                    Status
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-3.5 w-3.5" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-3.5 w-3.5" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-slate-600" />
                    )}
                </Button>
            ),
            cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
            filterFn: 'equals',
        },
        {
            id: 'actions',
            header: () => <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-2 block">Aksi</span>,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-2 pl-2">
                        <Button variant="outline" size="sm" asChild className="h-8">
                            <Link to={`/users/${user.id}`}>
                                <Eye className="h-3.5 w-3.5 mr-1 text-slate-500" />
                                Detail
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onEdit(user)} className="h-8">
                            <Pencil className="h-3.5 w-3.5 mr-1 text-slate-500" />
                            Edit
                        </Button>
                        {user.status === 'Aktif' ? (
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={loadingUserId === user.id}
                                onClick={() => handleToggleStatus(user)}
                                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900/50"
                            >
                                {loadingUserId === user.id ? (
                                    <Spinner className="h-3 w-3 mr-1" />
                                ) : (
                                    <UserX className="h-3.5 w-3.5 mr-1" />
                                )}
                                Nonaktifkan
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={loadingUserId === user.id}
                                onClick={() => handleToggleStatus(user)}
                                className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/40 border-green-200 dark:border-green-900/50"
                            >
                                {loadingUserId === user.id ? (
                                    <Spinner className="h-3 w-3 mr-1" />
                                ) : (
                                    <UserCheck className="h-3.5 w-3.5 mr-1" />
                                )}
                                Aktifkan
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ], [loadingUserId, onEdit, handleToggleStatus]);

    // Setup column filters
    const columnFilters = useMemo(() => {
        const filters = [];
        if (roleFilter) filters.push({ id: 'role', value: roleFilter });
        if (statusFilter) filters.push({ id: 'status', value: statusFilter });
        return filters;
    }, [roleFilter, statusFilter]);

    const table = useReactTable({
        data: users,
        columns,
        state: {
            sorting,
            pagination,
            columnFilters,
            globalFilter: searchFilter,
        },
        onSortingChange: (updater) => {
            const nextSorting = typeof updater === 'function' ? updater(sorting) : updater;
            onSortingChange(nextSorting);
        },
        onPaginationChange: (updater) => {
            const nextPagination = typeof updater === 'function' ? updater(pagination) : updater;
            onPaginationChange(nextPagination);
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: (row, columnId, filterValue) => {
            const val = row.getValue(columnId);
            if (!val) return false;
            return String(val).toLowerCase().includes(String(filterValue).toLowerCase());
        },
    });

    const hasRows = table.getRowModel().rows.length > 0;

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-950/50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="h-11">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {hasRows ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-3 px-4">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="p-0">
                                    <EmptyState
                                        title={isFiltered ? "Pencarian/Filter Tidak Ditemukan" : "Data User Kosong"}
                                        description={
                                            isFiltered
                                                ? "Tidak ada data user yang sesuai dengan filter pencarian Anda."
                                                : "Belum ada data user di sistem ini."
                                        }
                                        actionLabel={isFiltered ? "Reset Semua Filter" : undefined}
                                        onAction={isFiltered ? onResetFilters : undefined}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {hasRows && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Baris per halaman:</span>
                        <Select
                            value={String(table.getState().pagination.pageSize)}
                            onValueChange={(val) => table.setPageSize(Number(val))}
                        >
                            <SelectTrigger className="w-16 h-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={String(pageSize)}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="text-sm font-medium">
                        Halaman {table.getState().pagination.pageIndex + 1} dari{' '}
                        {table.getPageCount() || 1} ({table.getFilteredRowModel().rows.length} total baris)
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-white dark:bg-slate-900"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-white dark:bg-slate-900"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-white dark:bg-slate-900"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-white dark:bg-slate-900"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
