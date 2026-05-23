import type { TRequest } from './type';

const mockRequests: TRequest[] = [
    {
        id: 'REQ-001',
        title: 'Permohonan Cuti Tahunan',
        description: 'Pengajuan cuti tahunan selama 5 hari kerja mulai tanggal 1 Juni 2026.',
        status: 'Approved',
        createdAt: '2026-05-10'
    },
    {
        id: 'REQ-002',
        title: 'Pengadaan Laptop Baru',
        description: 'Laptop workstation Macbook Pro M3 16-inch untuk menunjang aktivitas software engineering.',
        status: 'Pending',
        createdAt: '2026-05-15'
    },
    {
        id: 'REQ-003',
        title: 'Reimbursement Internet',
        description: 'Biaya paket internet pascabayar bulan April 2026 sebesar Rp 250.000.',
        status: 'Approved',
        createdAt: '2026-05-02'
    },
    {
        id: 'REQ-004',
        title: 'Akses Repositori GitHub',
        description: 'Request akses read & write ke repositori git organisasi DOT untuk modul training frontend.',
        status: 'Rejected',
        createdAt: '2026-05-18'
    },
    {
        id: 'REQ-005',
        title: 'Izin Sakit',
        description: 'Izin tidak masuk kerja dikarenakan sakit demam tinggi. Surat keterangan dokter terlampir.',
        status: 'Pending',
        createdAt: '2026-05-22'
    },
];

export const getRequests = (searchQuery: string): TRequest[] => {
    return mockRequests.filter(req =>
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
};

export const getRequestById = (id: string): TRequest | undefined => {
    return mockRequests.find(req => req.id === id);
};
