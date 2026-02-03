import React from 'react';
import { 
  X, 
  Menu,
  Package, 
  FolderOpen,
  Package2,
  TrendingUp,
  FileText,
  Settings,
  Home
} from 'lucide-react';

interface ManagerSidebarProps {
  activeTab: string;
  sidebarOpen: boolean;
  userData: any;
  menuItems: any[]; // Add this prop
  onTabChange: (tab: string) => void;
  onCloseSidebar: () => void;
}

// Define the 6 menu items you requested
export const managerMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/manager/dashboard'
  },
  {
    id: 'stock',
    label: 'Stock',
    icon: Package,
    path: '/manager/stock'
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: FolderOpen,
    path: '/manager/inventory'
  },
  {
    id: 'product',
    label: 'Product',
    icon: Package2,
    path: '/manager/product'
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: TrendingUp,
    path: '/manager/sales'
  },
  {
    id: 'report',
    label: 'Report',
    icon: FileText,
    path: '/manager/report'
  },
  {
    id: 'setting',
    label: 'Settings',
    icon: Settings,
    path: '/manager/setting'
  }
];

export function ManagerSidebar({ 
  activeTab, 
  sidebarOpen, 
  userData, 
  menuItems, // Add this parameter
  onTabChange, 
  onCloseSidebar
}: ManagerSidebarProps) {
  // Use the menuItems prop if provided, otherwise use the default managerMenuItems
  const itemsToDisplay = menuItems && menuItems.length > 0 ? menuItems : managerMenuItems;
  
  return (
    <>
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed md:relative z-40 md:z-0
        w-64 md:w-64 h-full
        bg-gradient-to-b from-green-900 to-green-950 text-white 
        transition-transform duration-300 ease-in-out
        flex flex-col overflow-hidden
      `}>
        {/* Sidebar Header */}
        <div className="p-4 md:p-6 border-b border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Package className="text-green-700" size={24} />
              </div>
              <div>
                <h2 className="font-bold text-lg">Shop Manager</h2>
                <p className="text-xs text-green-200">Management System</p>
              </div>
            </div>
            <button
              onClick={onCloseSidebar}
              className="md:hidden p-1 hover:bg-green-800 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {itemsToDisplay.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-green-700 text-white shadow-lg'
                    : 'text-green-100 hover:bg-green-800 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium text-sm md:text-base">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Store Stats Card */}
          <div className="px-3 mt-8">
            <div className="bg-green-800/40 backdrop-blur-sm rounded-xl p-4 border border-green-700">
              <h3 className="text-sm font-semibold text-green-100 mb-3">Store Overview</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-200">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userData?.storeOpen 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}>
                    {userData?.storeOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-200">Today's Sales</span>
                  <span className="text-sm font-semibold text-white">
                    ${userData?.dailySales?.toLocaleString() || '0'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-200">Products</span>
                  <span className="text-sm font-semibold text-white">
                    {userData?.productCount?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Footer */}
        <div className="p-4 border-t border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
              <span className="font-semibold text-sm text-white">
                {userData?.name?.charAt(0) || 'M'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userData?.name || 'Manager'}</p>
              <p className="text-xs text-green-200 truncate">
                {userData?.role === 'Admin' ? 'Administrator' : 'Manager'}
              </p>
            </div>
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