import { useParams, Link } from 'react-router-dom';
import { useRequestDetail } from '../_hooks/use-request-detail';
import { useUpdateRequestStatus } from '../_hooks/use-update-request-status';
import { useToast } from '@/components/layout/toast-context';
import { StatusBadge } from '@/components/common/status-badge';
import { ArrowLeft, FileText, Calendar, Hash, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { ErrorState } from '@/components/common/error-state';
import { useState } from 'react';

const RequestDetailPage = () => {
    const { id } = useParams();
    const { data: request, isLoading, error, refetch } = useRequestDetail(id);
    const { mutate: updateStatus } = useUpdateRequestStatus();
    const { toast } = useToast();
    const [updating, setUpdating] = useState(false);

    const handleUpdateStatus = (newStatus: 'Approved' | 'Rejected') => {
        if (!request) return;
        setUpdating(true);

        updateStatus(
            { id: request.id, data: { status: newStatus } },
            {
                onSuccess: () => {
                    const statusLabel = newStatus === 'Approved' ? 'disetujui' : 'ditolak';
                    toast(`Permohonan "${request.title}" berhasil ${statusLabel}.`, 'success');
                    setUpdating(false);
                },
                onError: (err) => {
                    toast(err.message || 'Gagal mengubah status permohonan.', 'error');
                    setUpdating(false);
                },
            }
        );
    };

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
                <ErrorState
                    title="Gagal Memuat Detail Request"
                    message={error?.message || `Tidak ada request dengan ID "${id}" di database.`}
                    onRetry={refetch}
                />
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

                        {/* Approval / Rejection Actions for Pending requests */}
                        {request.status === 'Pending' && (
                            <div className="flex items-center gap-3 mt-6 border-t border-border pt-6 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => handleUpdateStatus('Rejected')}
                                    disabled={updating}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200"
                                >
                                    {updating ? <Spinner className="h-3.5 w-3.5 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                                    Tolak Permohonan
                                </Button>
                                <Button
                                    onClick={() => handleUpdateStatus('Approved')}
                                    disabled={updating}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    {updating ? <Spinner className="h-3.5 w-3.5 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                                    Setujui Permohonan
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RequestDetailPage;
