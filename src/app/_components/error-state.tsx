import { ShieldAlert, ServerCrash, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  status?: number;
}

export const ErrorState = ({ title, message, onRetry, status }: ErrorStateProps) => {
  if (status === 403) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-rose-950/10 border border-rose-900/30 rounded-2xl shadow-xl backdrop-blur-sm max-w-2xl mx-auto my-8 animate-in fade-in duration-300">
        <div className="bg-rose-500/10 p-4 rounded-full mb-6 border border-rose-500/20 text-rose-500">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold text-slate-100 bg-gradient-to-r from-rose-400 to-rose-200 bg-clip-text text-transparent mb-2">Akses Ditolak (403)</h3>
        <p className="text-slate-400 text-center max-w-md mb-8 leading-relaxed">
          {message || 'Maaf, Anda tidak memiliki izin atau hak akses untuk melihat data di halaman ini.'}
        </p>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild className="bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800">
            <Link to="/dashboard" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (status === 500) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-950/10 border border-red-900/30 rounded-2xl shadow-xl backdrop-blur-sm max-w-2xl mx-auto my-8 animate-in fade-in duration-300">
        <div className="bg-red-500/10 p-4 rounded-full mb-6 border border-red-500/20 text-red-500">
          <ServerCrash className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold text-slate-100 bg-gradient-to-r from-red-400 to-red-200 bg-clip-text text-transparent mb-2">Kesalahan Server (500)</h3>
        <p className="text-slate-400 text-center max-w-md mb-8 leading-relaxed">
          {message || 'Terjadi kesalahan sistem internal pada server. Silakan coba beberapa saat lagi.'}
        </p>
        {onRetry && (
          <Button onClick={onRetry} className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium shadow-lg shadow-red-600/10 transition-all duration-300">
            Coba Lagi
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-red-500/5 border-l-4 border-red-500 rounded-r-2xl p-6 flex items-start mb-8 shadow-md border border-red-500/10 animate-in fade-in duration-200">
      <div className="bg-red-500/10 p-2.5 rounded-full mr-4 text-red-500 border border-red-500/20">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-200">{title}</h3>
        <p className="text-slate-400 mt-1 text-sm">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm" className="mt-4 bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800">
            Coba Lagi
          </Button>
        )}
      </div>
    </div>
  );
};
