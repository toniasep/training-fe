import { useParams, Link } from 'react-router-dom';
import { useUserDetail } from '../_hooks/use-user-detail';
import { useUpdateUserStatus } from '../_hooks/use-update-user-status';
import { useToast } from '@/components/layout/toast-context';
import { StatusBadge } from '@/components/common/status-badge';
import { ArrowLeft, User, Mail, Shield, Activity, Hash, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { ErrorState } from '@/components/common/error-state';
import { useState } from 'react';

const UserDetailPage = () => {
    const { id } = useParams();
    const { data: user, isLoading, error, refetch } = useUserDetail(id);
    const { mutate: updateStatus } = useUpdateUserStatus();
    const { toast } = useToast();
    const [updating, setUpdating] = useState(false);

    const handleToggleStatus = () => {
        if (!user) return;
        const nextStatus = user.status === 'Aktif' ? 'Inactive' : 'Aktif';
        const actionLabel = nextStatus === 'Aktif' ? 'mengaktifkan' : 'menonaktifkan';
        setUpdating(true);

        updateStatus(
            { id: user.id, status: nextStatus },
            {
                onSuccess: () => {
                    toast(`Berhasil ${actionLabel} user ${user.name}.`, 'success');
                    setUpdating(false);
                },
                onError: (err) => {
                    toast(err.message || `Gagal ${actionLabel} user.`, 'error');
                    setUpdating(false);
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-900/20 rounded-xl border border-slate-800/40">
                <Spinner className="h-8 w-8 text-indigo-500 mb-2" />
                <p className="text-sm text-slate-400">Memuat detail user...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div>
                <div className="mb-4">
                    <Button variant="ghost" asChild className="pl-0 text-muted-foreground hover:text-foreground">
                        <Link to="/users" className="inline-flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke daftar user
                        </Link>
                    </Button>
                </div>
                <h1 className="text-2xl font-bold mb-4">Detail User</h1>
                <ErrorState
                    title="Gagal Memuat Detail User"
                    message={error?.message || `Tidak ada user dengan ID "${id}" di database.`}
                    onRetry={refetch}
                />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <Button variant="ghost" asChild className="pl-0 text-muted-foreground hover:text-foreground">
                    <Link to="/users" className="inline-flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke daftar user
                    </Link>
                </Button>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Detail User</h1>
                    <p className="text-muted-foreground text-sm">Menampilkan informasi lengkap akun pengguna</p>
                </div>
                <div className="flex items-center gap-3">
                    <StatusBadge status={user.status} />
                    {user.status === 'Aktif' ? (
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={updating}
                            onClick={handleToggleStatus}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                            {updating ? <Spinner className="h-3.5 w-3.5 mr-1" /> : <UserX className="h-4 w-4 mr-1" />}
                            Nonaktifkan User
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={updating}
                            onClick={handleToggleStatus}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                        >
                            {updating ? <Spinner className="h-3.5 w-3.5 mr-1" /> : <UserCheck className="h-4 w-4 mr-1" />}
                            Aktifkan User
                        </Button>
                    )}
                </div>
            </div>

            <Card className="max-w-2xl overflow-hidden p-0 gap-0">
                {/* Header Cover Banner */}
                <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-end px-6 pb-4">
                    <div className="flex items-center gap-4 translate-y-6">
                        <div className="h-16 w-16 rounded-full bg-background border-4 border-background flex items-center justify-center shadow-md">
                            <User className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="pt-10 px-6 pb-6 gap-0 flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                        <p className="text-muted-foreground text-sm">{user.role}</p>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                                <Hash className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">ID User</span>
                                <span className="text-sm font-medium text-foreground">{user.id}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                                <Mail className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Email</span>
                                <span className="text-sm font-medium text-foreground">{user.email}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                                <Shield className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Role</span>
                                <span className="text-sm font-medium text-foreground">{user.role}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400">
                                <Activity className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Status</span>
                                <span className="text-sm font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                                    <span className={`h-2 w-2 rounded-full ${user.status === 'Aktif' ? 'bg-green-500' : user.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                    {user.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserDetailPage;
