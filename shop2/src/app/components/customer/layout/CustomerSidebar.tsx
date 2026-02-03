import React from 'react';
import { X } from 'lucide-react';

interface CustomerSidebarProps {
  menuItems: any[];
  activeTab: string;
  sidebarOpen: boolean;
  userData: any;
  onTabChange: (tab: string) => void;
  onCloseSidebar: () => void;
}

export function CustomerSidebar({ 
  menuItems, 
  activeTab, 
  sidebarOpen, 
  userData, 
  onTabChange, 
  onCloseSidebar
}: CustomerSidebarProps) {
  return (
    <>
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed md:relative z-40 md:z-0
        w-64 md:w-64 h-full
        bg-gradient-to-b from-emerald-800 to-green-900 text-white 
        transition-transform duration-300 ease-in-out
        flex flex-col
      `}>
        <div className="p-4 md:p-6 border-b border-emerald-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl text-emerald-600">🛒</span>
              </div>
              <div>
                <h2 className="font-bold text-lg">ShopManager</h2>
                <p className="text-xs text-emerald-200">Customer Portal</p>
              </div>
            </div>
            <button
              onClick={onCloseSidebar}
              className="md:hidden p-1 hover:bg-emerald-700/30 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-emerald-50 text-emerald-800 shadow-lg'
                  : 'text-white hover:bg-emerald-700/40'
              }`}
            >
              <item.icon size={18} />
              <span className="font-medium text-sm md:text-base">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="p-3 md:p-4 border-t border-emerald-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
              {userData?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'CU'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{userData?.name || 'Customer User'}</p>
              <p className="text-xs text-emerald-200 truncate">Customer</p>
            </div>
          </div>
          <div className="text-xs text-emerald-300">
            <p>Member since: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Today'}</p>
          </div>
        </div>
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onCloseSidebar}
        />
      )}
    </>
  );
}