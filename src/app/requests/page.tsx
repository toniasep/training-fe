import { useState } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { RequestListFilter } from './_components/request-list-filter';
import { RequestTable } from './_components/request-table';
import { useRequests } from './_hooks/use-requests';
import { Spinner } from '@/components/ui/spinner';
import { AlertTriangle } from 'lucide-react';

const RequestsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: requests = [], isLoading, error } = useRequests(searchQuery);

    return (
        <div>
            <PageHeader
                title="Daftar Request"
                description="Kelola dan verifikasi permohonan data"
            />

            <div className="mb-6 max-w-xs">
                <RequestListFilter
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-900/20 rounded-xl border border-slate-800/40">
                    <Spinner className="h-8 w-8 text-indigo-500 mb-2" />
                    <p className="text-sm text-slate-400">Memuat data request...</p>
                </div>
            ) : error ? (
                <div className="flex items-start gap-3 p-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-slate-100">Gagal Memuat Data</h4>
                        <p className="text-sm mt-1">{error.message || 'Gagal mengambil data request.'}</p>
                    </div>
                </div>
            ) : (
                <RequestTable requests={requests} />
            )}
        </div>
    );
};

export default RequestsPage;
