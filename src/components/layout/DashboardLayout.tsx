import type { ReactNode } from 'react';
import { SideNav } from './SideNav';
import { TopNav } from './TopNav';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary noise-texture">
      <SideNav />
      <TopNav />

      <main className="ml-20 pt-20">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
