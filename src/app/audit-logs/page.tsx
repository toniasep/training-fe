import { useState, useEffect } from 'react';
import { PageHeader } from '../../common/components/page-header';
import { getAuditLogs } from '../../api/audit-log/api';
import type { TAuditLog } from '../../api/audit-log/type';
import { Spinner } from '@/components/ui/spinner';
import { AlertTriangle } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { EmptyState } from '../../common/components/empty-state';

const AuditLogsPage = () => {
    const [auditLogs, setAuditLogs] = useState<TAuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        
        queueMicrotask(() => {
            if (isMounted) {
                setIsLoading(true);
                setError(null);
            }
        });

        getAuditLogs()
            .then((data) => {
                if (isMounted) {
                    setAuditLogs(data);
                    setIsLoading(false);
                }
            })
            .catch((err: unknown) => {
                if (isMounted) {
                    console.error('Failed to fetch audit logs:', err);
                    const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data audit log.';
                    setError(errorMessage);
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

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

    return (
        <div>
            <PageHeader
                title="Audit Logs"
                description="Catatan aktivitas sistem dan audit log operasi admin"
            />

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-900/20 rounded-xl border border-slate-800/40">
                    <Spinner className="h-8 w-8 text-indigo-500 mb-2" />
                    <p className="text-sm text-slate-400">Memuat audit logs...</p>
                </div>
            ) : error ? (
                <div className="flex items-start gap-3 p-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-slate-100">Gagal Memuat Data</h4>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Aksi</TableHead>
                            <TableHead>Aktor</TableHead>
                            <TableHead>Detail Aktivitas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {auditLogs.length > 0 ? (
                            auditLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-muted-foreground whitespace-nowrap">
                                        {formatTimestamp(log.timestamp)}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                            log.action === 'LOGIN' 
                                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                                                : log.action.startsWith('CREATE')
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                        }`}>
                                            {log.action}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-300">
                                        {log.actor}
                                    </TableCell>
                                    <TableCell className="text-slate-400 max-w-md break-words">
                                        {log.details}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="p-0">
                                    <EmptyState
                                        title="Audit Logs Kosong"
                                        description="Belum ada aktivitas tercatat di sistem ini."
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

export default AuditLogsPage;
