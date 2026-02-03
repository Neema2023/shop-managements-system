import React from 'react';
import { CustomerSidebar } from './CustomerSidebar';
import { CustomerHeader } from './CustomerHeader';

interface CustomerLayoutProps {
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
  onLogout: () => void; // Simple logout function
  onClearError: () => void;
  onNavigateToCart: () => void;
}

export function CustomerLayout({
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
  onClearError,
  onNavigateToCart
}: CustomerLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <CustomerSidebar
        menuItems={menuItems}
        activeTab={activeTab}
        sidebarOpen={sidebarOpen}
        userData={userData}
        onTabChange={onTabChange}
        onCloseSidebar={onCloseSidebar}
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <CustomerHeader
          sidebarOpen={sidebarOpen}
          error={error}
          userData={userData}
          cartCount={cartCount}
          onToggleSidebar={onToggleSidebar}
          onClearError={onClearError}
          onNavigateToCart={onNavigateToCart}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}