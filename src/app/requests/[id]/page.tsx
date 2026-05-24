import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRequestById } from '@/api/requests/api';
import { StatusBadge } from '@/components/common/status-badge';
import { ArrowLeft, FileText, Calendar, Hash, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import type { TRequest } from '@/api/requests/type';

const RequestDetailPage = () => {
    const { id } = useParams();
    const [request, setRequest] = useState<TRequest | null>(null);
    const [isLoading, setIsLoading] = useState(!!id);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        let isMounted = true;
        
        queueMicrotask(() => {
            if (isMounted) {
                setIsLoading(true);
                setError(null);
            }
        });

        getRequestById(id)
            .then((data) => {
                if (isMounted) {
                    setRequest(data);
                    setIsLoading(false);
                }
            })
            .catch((err: unknown) => {
                if (isMounted) {
                    console.error('Failed to fetch request details:', err);
                    const errorMessage = err instanceof Error ? err.message : 'Request tidak ditemukan.';
                    setError(errorMessage);
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-900/20 rounded-xl border border-slate-800/40">
                <Spinner className="h-8 w-8 text-indigo-500 mb-2" />
                <p className="text-sm text-slate-400">Memuat detail request...</p>
            </div>
        );
    }

    if (error || !request) {
        return (
            <div>
                <div className="mb-4">
                    <Button variant="ghost" asChild className="pl-0 text-muted-foreground hover:text-foreground">
                        <Link to="/requests" className="inline-flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke daftar request
                        </Link>
                    </Button>
                </div>
                <h1 className="text-2xl font-bold mb-4">Detail Request</h1>
                <Card className="max-w-2xl p-8 text-center border-red-500/20 bg-red-500/5">
                    <CardContent className="flex flex-col items-center justify-center">
                        <AlertTriangle className="h-10 w-10 text-red-500 mb-2" />
                        <p className="text-destructive font-medium mb-2">Gagal Memuat Detail Request</p>
                        <p className="text-muted-foreground text-sm">{error || `Tidak ada request dengan ID "${id}" di database.`}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Helper to get status-specific styling
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Approved':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'Rejected':
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                return <Clock className="h-5 w-5 text-yellow-600" />;
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'Approved':
                return 'from-green-50 to-emerald-100 border-green-200 dark:from-green-950 dark:to-emerald-900 dark:border-green-800';
            case 'Rejected':
                return 'from-red-50 to-rose-100 border-red-200 dark:from-red-950 dark:to-rose-900 dark:border-red-800';
            default:
                return 'from-yellow-50 to-amber-100 border-yellow-200 dark:from-yellow-950 dark:to-amber-900 dark:border-yellow-800';
        }
    };

    return (
        <div>
            <div className="mb-4">
                <Button variant="ghost" asChild className="pl-0 text-muted-foreground hover:text-foreground">
                    <Link to="/requests" className="inline-flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke daftar request
                    </Link>
                </Button>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Detail Request</h1>
                    <p className="text-muted-foreground text-sm">Menampilkan detail permohonan yang diajukan</p>
                </div>
                <StatusBadge status={request.status} />
            </div>

            <Card className="max-w-2xl overflow-hidden p-0 gap-0">
                {/* Header/Banner with status colors */}
                <div className={`h-24 bg-gradient-to-r ${request.status === 'Approved' ? 'from-green-500 to-emerald-600' : request.status === 'Rejected' ? 'from-red-500 to-rose-600' : 'from-yellow-500 to-amber-600'} flex items-end px-6 pb-4`}>
                    <div className="flex items-center gap-4 translate-y-6">
                        <div className="h-16 w-16 rounded-full bg-background border-4 border-background flex items-center justify-center shadow-md">
                            <FileText className={`h-8 w-8 ${request.status === 'Approved' ? 'text-green-600' : request.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`} />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="pt-10 px-6 pb-6 gap-0 flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-foreground">{request.title}</h2>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mt-1">ID: {request.id}</span>
                    </div>

                    <Separator className="my-6" />

                    {/* Status Alert Banner */}
                    <div className={`mb-6 p-4 rounded-xl border flex gap-3 bg-gradient-to-br ${getStatusBg(request.status)}`}>
                        <div className="mt-0.5 animate-pulse">
                            {getStatusIcon(request.status)}
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-foreground">Status Permohonan: {request.status}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {request.status === 'Approved' && 'Permohonan ini telah disetujui dan diproses.'}
                                {request.status === 'Rejected' && 'Permohonan ini telah ditolak oleh verifikator.'}
                                {request.status === 'Pending' && 'Permohonan ini sedang dalam antrean peninjauan.'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                                <FileText className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Deskripsi</span>
                                <p className="text-sm text-foreground leading-relaxed mt-1">{request.description}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                    <Hash className="h-4 w-4" />
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">ID Request</span>
                                    <span className="text-sm font-medium text-foreground">{request.id}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Tanggal Pengajuan</span>
                                    <span className="text-sm font-medium text-foreground">{request.createdAt}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RequestDetailPage;
