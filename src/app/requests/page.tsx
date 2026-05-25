import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/common/page-header';
import { RequestListFilter } from './_components/request-list-filter';
import { RequestTable } from './_components/request-table';
import { useRequestList } from './_hooks/use-request-list';
import { Spinner } from '@/components/ui/spinner';
import { ErrorState } from '@/components/common/error-state';

const RequestsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const querySearch = searchParams.get('search') || '';

    // Local input state for fluid UI typing response
    const [inputValue, setInputValue] = useState(querySearch);
    const [prevQuerySearch, setPrevQuerySearch] = useState(querySearch);
    
    // Sync input value if URL parameter changes externally
    if (querySearch !== prevQuerySearch) {
        setPrevQuerySearch(querySearch);
        setInputValue(querySearch);
    }

    // Debounced update to the URL search parameter
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchParams((prev) => {
                const nextParams = new URLSearchParams(prev);
                if (inputValue) {
                    nextParams.set('search', inputValue);
                } else {
                    nextParams.delete('search');
                }
                return nextParams;
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [inputValue, setSearchParams]);

    const { data: requests = [], isLoading, error, refetch } = useRequestList({
        page: 1,
        limit: 10,
        search: querySearch,
    });

    return (
        <div>
            <PageHeader
                title="Daftar Request"
                description="Kelola dan verifikasi permohonan data"
            />

            <div className="mb-6 max-w-xs">
                <RequestListFilter
                    searchQuery={inputValue}
                    onSearchChange={setInputValue}
                />
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-900/20 rounded-xl border border-slate-800/40">
                    <Spinner className="h-8 w-8 text-indigo-500 mb-2" />
                    <p className="text-sm text-slate-400">Memuat data request...</p>
                </div>
            ) : error ? (
                <ErrorState
                    title="Gagal Memuat Data"
                    message={error.message || 'Gagal mengambil data request.'}
                    onRetry={refetch}
                />
            ) : (
                <RequestTable requests={requests} isFiltered={!!querySearch} />
            )}
        </div>
    );
};

export default RequestsPage;
