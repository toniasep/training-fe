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
import { Eye, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { StatusBadge } from '@/app/_components/status-badge';
import { EmptyState } from '@/app/_components/empty-state';
import type { TRequest } from '@/api/requests/types';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
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

interface RequestTableProps {
    requests: TRequest[];
    sorting: SortingState;
    onSortingChange: (sorting: SortingState) => void;
    pagination: PaginationState;
    onPaginationChange: (pagination: PaginationState) => void;
    statusFilter: string;
    priorityFilter: string;
    searchFilter: string;
    isFiltered: boolean;
    onResetFilters: () => void;
}

export const RequestTable = ({
    requests,
    sorting,
    onSortingChange,
    pagination,
    onPaginationChange,
    statusFilter,
    priorityFilter,
    searchFilter,
    isFiltered,
    onResetFilters,
}: RequestTableProps) => {

    const columns = useMemo<ColumnDef<TRequest>[]>(() => [
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
            cell: ({ row }) => <span className="font-mono text-xs font-semibold">{row.getValue('id')}</span>,
        },
        {
            accessorKey: 'title',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-3 h-8 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                    Judul
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
                const req = row.original;
                return (
                    <Link
                        to={`/requests/${req.id}`}
                        className="font-medium hover:underline hover:text-indigo-500 transition-colors"
                    >
                        {req.title}
                    </Link>
                );
            },
        },
        {
            accessorKey: 'description',
            header: () => <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deskripsi</span>,
            cell: ({ row }) => <p className="max-w-xs truncate text-slate-500 dark:text-slate-400">{row.getValue('description')}</p>,
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-3 h-8 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                    Tanggal Dibuat
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-3.5 w-3.5" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-3.5 w-3.5" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-slate-600" />
                    )}
                </Button>
            ),
            cell: ({ row }) => <span>{row.getValue('createdAt')}</span>,
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
            accessorKey: 'priority',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-3 h-8 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                    Prioritas
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
                const priority = (row.getValue('priority') || 'Medium') as string;
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        priority === 'High'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                            : priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                    }`}>
                        {priority}
                    </span>
                );
            },
            filterFn: 'equals',
        },
        {
            accessorKey: 'assignee',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-3 h-8 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                    Assignee
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-3.5 w-3.5" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-3.5 w-3.5" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-slate-600" />
                    )}
                </Button>
            ),
            cell: ({ row }) => <span className="text-slate-600 dark:text-slate-300">{row.getValue('assignee') || 'Belum ditugaskan'}</span>,
        },
        {
            id: 'actions',
            header: () => <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-2 block">Aksi</span>,
            cell: ({ row }) => {
                const req = row.original;
                return (
                    <div className="flex items-center gap-2 pl-2">
                        <Button variant="outline" size="sm" asChild className="h-8">
                            <Link to={`/requests/${req.id}`}>
                                <Eye className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                                Detail
                            </Link>
                        </Button>
                    </div>
                );
            },
        },
    ], []);

    // Setup column filters
    const columnFilters = useMemo(() => {
        const filters = [];
        if (statusFilter) filters.push({ id: 'status', value: statusFilter });
        if (priorityFilter) filters.push({ id: 'priority', value: priorityFilter });
        return filters;
    }, [statusFilter, priorityFilter]);

    const table = useReactTable({
        data: requests,
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
                                        title={isFiltered ? "Pencarian/Filter Tidak Ditemukan" : "Data Request Kosong"}
                                        description={
                                            isFiltered
                                                ? "Tidak ada data request yang sesuai dengan filter pencarian Anda."
                                                : "Belum ada data request di sistem ini."
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
