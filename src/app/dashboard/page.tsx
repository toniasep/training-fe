import { Link } from 'react-router-dom';
import { useUsersQuery } from '@/app/users/_hooks/use-users-query';
import { useRequestsQuery } from '@/app/requests/_hooks/use-requests-query';
import { useAuditLogsQuery } from '@/app/audit-logs/_hooks/use-audit-logs-query';
import { Users, FileText, ClipboardList, ArrowRight, Clock, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/app/_components/status-badge';
import { Spinner } from '@/components/ui/spinner';

const DashboardPage = () => {
  // Fetch users, requests, and audit logs with minimum limits to get totals and recent entries
  const { data: usersData, isLoading: loadingUsers } = useUsersQuery({ page: 1, limit: 1 });
  const { data: requestsData, isLoading: loadingRequests } = useRequestsQuery({ page: 1, limit: 5 });
  const { data: logsData, isLoading: loadingLogs } = useAuditLogsQuery({ page: 1, limit: 5 });

  const totalUsers = usersData?.total || 0;
  const totalRequests = requestsData?.total || 0;
  const totalLogs = logsData?.total || 0;

  const recentRequests = requestsData?.data || [];
  const recentLogs = logsData?.data || [];

  const isLoading = loadingUsers || loadingRequests || loadingLogs;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 bg-slate-900/10 rounded-xl border border-slate-800/10">
        <Spinner className="h-10 w-10 text-indigo-500 mb-2" />
        <p className="text-sm text-slate-500">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Dashboard Operasional
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Ringkasan aktivitas operasional internal, pengelolaan pengguna, dan audit sistem.
        </p>
      </div>

      {/* Grid operational summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Pengguna
            </CardTitle>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{totalUsers}</div>
            <Link
              to="/users"
              className="inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-4 hover:underline"
            >
              Kelola pengguna <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Request
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{totalRequests}</div>
            <Link
              to="/requests"
              className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-4 hover:underline"
            >
              Lihat semua request <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Audit Logs
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <ClipboardList className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{totalLogs}</div>
            <Link
              to="/audit-logs"
              className="inline-flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 mt-4 hover:underline"
            >
              Buka audit logs <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent requests card list */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-500" /> Request Terbaru
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1">Daftar permohonan masuk paling akhir</p>
            </div>
            <Link to="/requests" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Semua
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentRequests.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">Tidak ada request terbaru.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {recentRequests.map((req) => (
                  <div key={req.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <div className="space-y-1">
                      <Link to={`/requests/${req.id}`} className="font-semibold text-sm text-slate-800 dark:text-slate-100 hover:underline block">
                        {req.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">
                          {req.id}
                        </span>
                        <span>•</span>
                        <span>Oleh: {req.requesterName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 font-bold uppercase rounded ${
                        req.priority === 'high' ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' :
                        req.priority === 'medium' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400' :
                        'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                      }`}>
                        {req.priority}
                      </span>
                      <StatusBadge status={req.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Audit Activities */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-indigo-500" /> Audit Log Terbaru
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1">Catatan aktivitas sistem paling akhir</p>
            </div>
            <Link to="/audit-logs" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Semua
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentLogs.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">Tidak ada log aktivitas terbaru.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {recentLogs.map((log) => (
                  <div key={log.id} className="p-4 flex items-start gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <div className="mt-0.5">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'LOGIN' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300' :
                        log.action.startsWith('CREATE') ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300' :
                        log.action.startsWith('UPDATE') ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300' :
                        'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300'
                      }`}>
                        {log.action}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {log.details || `Aktivitas ${log.action} dilakukan pada target ${log.targetType} (${log.targetId})`}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Aktor: {log.actorName} • {new Date(log.createdAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
