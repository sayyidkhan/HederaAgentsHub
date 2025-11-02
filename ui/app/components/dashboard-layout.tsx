'use client';

import { SidebarNav } from '@/components/sidebar-nav';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1 pl-56">
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

