import React from 'react';
import { Sidebar } from '@/app/_components/sidebar';
import { Topbar } from '@/app/_components/topbar';
import { SidebarProvider, SidebarInset } from '@/app/_components/ui/sidebar';

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
