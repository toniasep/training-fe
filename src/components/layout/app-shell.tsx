import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50/50 font-sans text-gray-900 w-full">
        <Sidebar />
        <SidebarInset className="flex-1 flex flex-col h-screen overflow-hidden bg-transparent">
          <Topbar />
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
