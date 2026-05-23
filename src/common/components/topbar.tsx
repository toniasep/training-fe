import { useAuth } from '../auth-context';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export const Topbar = () => {
  const { user, logout } = useAuth();

  // Dapatkan inisial nama untuk avatar (misal: "John Doe" -> "JD")
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      {/* Kiri: Title/Breadcrumb opsional, kosongkan saja dulu */}
      <div></div>

      {/* Kanan: Info User & Logout */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm" title={user.email}>
              {getInitials(user.name)}
            </div>

            {/* Tombol Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-gray-500 hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
