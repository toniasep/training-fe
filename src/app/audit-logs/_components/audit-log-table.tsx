import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
    type PaginationState,
} from '@tanstack/react-table';
import {
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { EmptyState } from '@/app/_components/empty-state';
import type { TAuditLog } from '@/api/audit-logs/types';
import { Button } from '@/app/_components/ui/button';
import { useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/_components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select";

interface AuditLogTableProps {
    auditLogs: TAuditLog[];
    totalCount: number;
    sorting: SortingState;
    onSortingChange: (sorting: SortingState) => void;
    pagination: PaginationState;
    onPaginationChange: (pagination: PaginationState) => void;
    isFiltered: boolean;
    onResetFilters: () => void;
}

export const AuditLogTable = ({
    auditLogs,
    totalCount,
    sorting,
    onSortingChange,
    pagination,
    onPaginationChange,
    isFiltered,
    onResetFilters,
}: AuditLogTableProps) => {

    const formatTimestamp = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
            });
        } catch {
            return isoString;
        }
    };

    const columns = useMemo<ColumnDef<TAuditLog>[]>(() => [
        {
            accessorKey: 'createdAt',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-3 h-8 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                    Timestamp
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-3.5 w-3.5" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-3.5 w-3.5" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-slate-600" />
                    )}
                </Button>
            ),
            cell: ({ row }) => (
                <span className="text-muted-foreground whitespace-nowrap text-xs font-mono">
                    {formatTimestamp(row.getValue('createdAt'))}
                </span>
            ),
        },
        {
            accessorKey: 'action',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-3 h-8 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                    Aksi
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
                const action = row.getValue('action') as string;
                return (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        action === 'LOGIN'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : action.startsWith('CREATE')
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : action.startsWith('UPDATE_REQUEST')
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                        {action}
                    </span>
                );
            },
        },
        {
            accessorKey: 'actorName',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-3 h-8 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                    Aktor
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-3.5 w-3.5" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-3.5 w-3.5" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-slate-600" />
                    )}
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-medium text-slate-300 text-sm">
                    {row.getValue('actorName')}
                </span>
            ),
        },
        {
            accessorKey: 'targetType',
            header: () => <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Type</span>,
            cell: ({ row }) => (
                <span className="capitalize text-slate-400 text-xs font-mono">
                    {row.getValue('targetType')}
                </span>
            ),
        },
        {
            accessorKey: 'targetId',
            header: () => <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target ID</span>,
            cell: ({ row }) => (
                <span className="text-slate-400 text-xs font-mono">
                    {row.getValue('targetId')}
                </span>
            ),
        },
        {
            accessorKey: 'details',
            header: () => <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detail Aktivitas</span>,
            cell: ({ row }) => (
                <p className="text-slate-400 text-sm max-w-md break-words">
                    {row.getValue('details')}
                </p>
            ),
        },
    ], []);



    const table = useReactTable({
        data: auditLogs,
        columns,
        state: {
            sorting,
            pagination,
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
        manualPagination: true,
        pageCount: Math.ceil(totalCount / pagination.pageSize),
        manualSorting: true,
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
                                        title={isFiltered ? "Pencarian/Filter Tidak Ditemukan" : "Audit Logs Kosong"}
                                        description={
                                            isFiltered
                                                ? "Tidak ada audit log yang sesuai dengan filter pencarian Anda."
                                                : "Belum ada aktivitas audit log di sistem ini."
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
