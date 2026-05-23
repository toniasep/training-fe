import { useParams, Link } from 'react-router-dom';
import { getUserById } from '../../../api/users/api';
import { StatusBadge } from '../../../common/components/status-badge';
import { ArrowLeft, User, Mail, Shield, Activity, Hash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const UserDetailPage = () => {
    const { id } = useParams();
    const user = id ? getUserById(id) : undefined;

    if (!user) {
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
                <Card className="max-w-2xl p-8 text-center">
                    <CardContent className="flex flex-col items-center justify-center">
                        <p className="text-destructive font-medium mb-2">User Tidak Ditemukan</p>
                        <p className="text-muted-foreground text-sm">Tidak ada user dengan ID "{id}" di database.</p>
                    </CardContent>
                </Card>
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
                <StatusBadge status={user.status} />
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
