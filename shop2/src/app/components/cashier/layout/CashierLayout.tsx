import React from 'react';
import { CashierSidebar } from './CashierSidebar';
import { CashierHeader } from './CashierHeader';

interface CashierLayoutProps {
  children: React.ReactNode;
  menuItems: any[];
  activeTab: string;
  sidebarOpen: boolean;
  userData: any;
  cartCount: number;
  error: string | null;
  onTabChange: (tab: string) => void;
  onToggleSidebar: () => void;
  onCloseSidebar: () => void;
  onLogout: () => void;
  onClearError: () => void;
}

export function CashierLayout({
  children,
  menuItems,
  activeTab,
  sidebarOpen,
  userData,
  cartCount,
  error,
  onTabChange,
  onToggleSidebar,
  onCloseSidebar,
  onLogout,
  onClearError
}: CashierLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <CashierSidebar
        menuItems={menuItems}
        activeTab={activeTab}
        sidebarOpen={sidebarOpen}
        userData={userData}
        onTabChange={onTabChange}
        onCloseSidebar={onCloseSidebar}
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <CashierHeader
          sidebarOpen={sidebarOpen}
          error={error}
          userData={userData}
          cartCount={cartCount}
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