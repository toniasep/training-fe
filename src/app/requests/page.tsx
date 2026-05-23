import { useState, useEffect } from 'react';
import { PageHeader } from '../../common/components/page-header';
import { RequestListFilter } from './_components/request-list-filter';
import { RequestTable } from './_components/request-table';
import { getRequests } from '../../api/requests/api';
import { Spinner } from '@/components/ui/spinner';
import { AlertTriangle } from 'lucide-react';
import type { TRequest } from '../../api/requests/type';

const RequestsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [requests, setRequests] = useState<TRequest[]>([]);
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

        getRequests(searchQuery)
            .then((data) => {
                if (isMounted) {
                    setRequests(data);
                    setIsLoading(false);
                }
            })
            .catch((err: unknown) => {
                if (isMounted) {
                    console.error('Failed to fetch requests:', err);
                    const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data request.';
                    setError(errorMessage);
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [searchQuery]);

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
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                </div>
            ) : (
                <RequestTable requests={requests} />
            )}
        </div>
    );
};

export default RequestsPage;
