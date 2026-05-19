import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const ForbiddenPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-50 text-center p-4">
            <ShieldAlert className="w-24 h-24 text-red-500 mb-6" />
            <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Akses Ditolak</h2>
            <p className="text-gray-500 mb-8 max-w-md">
                Maaf, Anda tidak memiliki izin atau hak akses untuk melihat halaman ini. Silakan hubungi administrator sistem.
            </p>
            <Link 
                to="/" 
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
                Kembali ke Beranda
            </Link>
        </div>
    );
};

export default ForbiddenPage;
