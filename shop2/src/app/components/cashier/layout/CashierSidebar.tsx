import React from 'react';
import { X } from 'lucide-react';

interface CashierSidebarProps {
  menuItems: any[];
  activeTab: string;
  sidebarOpen: boolean;
  userData: any;
  onTabChange: (tab: string) => void;
  onCloseSidebar: () => void;
}

export function CashierSidebar({ 
  menuItems, 
  activeTab, 
  sidebarOpen, 
  userData, 
  onTabChange, 
  onCloseSidebar
}: CashierSidebarProps) {
  return (
    <>
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed md:relative z-40 md:z-0
        w-64 md:w-64 h-full
        bg-gradient-to-b from-green-600 to-emerald-700 text-white 
        transition-transform duration-300 ease-in-out
        flex flex-col overflow-hidden
      `}>
        <div className="p-4 md:p-6 border-b border-green-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl text-green-600">💰</span>
              </div>
              <div>
                <h2 className="font-bold text-lg">Cashier POS</h2>
                <p className="text-xs text-green-100">Point of Sale</p>
              </div>
            </div>
            <button
              onClick={onCloseSidebar}
              className="md:hidden p-1 hover:bg-green-500/30 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-green-50 text-green-700 shadow-lg'
                  : 'text-white hover:bg-green-500/40'
              }`}
            >
              <item.icon size={18} />
              <span className="font-medium text-sm md:text-base">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Shift Info */}
        <div className="p-3 md:p-4 border-t border-green-500/30">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs text-green-100 mb-1">Current Shift</p>
            <p className="font-semibold text-sm">{userData?.shift || 'Morning Shift'}</p>
            <p className="text-xs text-green-100 mt-1">Started: {userData?.shiftStart || '8:00 AM'}</p>
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