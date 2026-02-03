import React from 'react';
import { ManagerSidebar } from './ManagerSidebar';
import { ManagerHeader } from './ManagerHeader';

interface ManagerLayoutProps {
  children: React.ReactNode;
  menuItems: any[];
  activeTab: string;
  sidebarOpen: boolean;
  userData: any;
  error: string | null;
  onTabChange: (tab: string) => void;
  onToggleSidebar: () => void;
  onCloseSidebar: () => void;
  onLogout: () => void;
  onClearError: () => void;
}

export function ManagerLayout({
  children,
  menuItems,
  activeTab,
  sidebarOpen,
  userData,
  error,
  onTabChange,
  onToggleSidebar,
  onCloseSidebar,
  onLogout,
  onClearError
}: ManagerLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ManagerSidebar
        menuItems={menuItems}
        activeTab={activeTab}
        sidebarOpen={sidebarOpen}
        userData={userData}
        onTabChange={onTabChange}
        onCloseSidebar={onCloseSidebar}
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <ManagerHeader
          sidebarOpen={sidebarOpen}
          error={error}
          userData={userData}
          onToggleSidebar={onToggleSidebar}
          onClearError={onClearError}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}