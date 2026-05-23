import { useState, useMemo } from 'react';
import { PageHeader } from '../../common/components/page-header';
import { RequestListFilter } from './_components/request-list-filter';
import { RequestTable } from './_components/request-table';
import { getRequests } from '../../api/requests/api';

const RequestsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRequests = useMemo(() => {
        return getRequests(searchQuery);
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

            <RequestTable requests={filteredRequests} />
        </div>
    );
};

export default RequestsPage;
