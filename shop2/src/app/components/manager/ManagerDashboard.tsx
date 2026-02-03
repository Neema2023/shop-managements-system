import React, { useState } from 'react';
import { ManagerLayout } from './layout/ManagerLayout';
import { InventoryPage } from './pages/InventoryPage';
import { StaffPage } from './pages/StaffPage';
import { ReportsPage } from './pages/ReportsPage';
import { ProductPage } from './pages/ProductPage'; // Add this import
import { SalesPage } from './pages/SalesPage'; // Add this import
import { Home, Package, FolderOpen, Package2, TrendingUp, FileText, Settings } from 'lucide-react'; // Add all icons

interface ManagerDashboardProps {
  onLogout: () => void;
  authToken: string;
  userData: any;
}

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
}

interface StaffMember {
  id: number;
  name: string;
  role: string;
  shift: string;
  performance: number;
  status: 'On Duty' | 'Break' | 'Off Duty';
}

interface PerformanceData {
  name: string;
  sales: number;
  target: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export function ManagerDashboard({ onLogout, authToken, userData }: ManagerDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard'); // Changed default to 'dashboard'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Use all 7 menu items that match your sidebar
  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'stock', label: 'Stock', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: FolderOpen },
    { id: 'product', label: 'Product', icon: Package2 },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'report', label: 'Report', icon: FileText },
    { id: 'setting', label: 'Settings', icon: Settings },
  ];

  // Mock data
  const inventoryItems: InventoryItem[] = [
    { id: 1, name: 'Laptop Dell XPS 15', category: 'Electronics', stock: 45, price: 1299, status: 'In Stock', image: '💻' },
    { id: 2, name: 'iPhone 15 Pro', category: 'Electronics', stock: 12, price: 999, status: 'Low Stock', image: '📱' },
    { id: 3, name: 'Nike Air Max', category: 'Clothing', stock: 78, price: 150, status: 'In Stock', image: '👟' },
    { id: 4, name: 'Samsung TV 55"', category: 'Electronics', stock: 5, price: 799, status: 'Low Stock', image: '📺' },
    { id: 5, name: 'Coffee Maker', category: 'Appliances', stock: 32, price: 89, status: 'In Stock', image: '☕' },
    { id: 6, name: 'Wireless Mouse', category: 'Electronics', stock: 150, price: 29, status: 'In Stock', image: '🖱️' },
  ];

  const staffMembers: StaffMember[] = [
    { id: 1, name: 'Alice Johnson', role: 'Cashier', shift: 'Morning', performance: 95, status: 'On Duty' },
    { id: 2, name: 'Bob Smith', role: 'Cashier', shift: 'Evening', performance: 88, status: 'On Duty' },
    { id: 3, name: 'Carol White', role: 'Stock Clerk', shift: 'Morning', performance: 92, status: 'Break' },
    { id: 4, name: 'David Brown', role: 'Cashier', shift: 'Night', performance: 85, status: 'Off Duty' },
  ];

  const performanceData: PerformanceData[] = [
    { name: 'Mon', sales: 4500, target: 5000 },
    { name: 'Tue', sales: 5200, target: 5000 },
    { name: 'Wed', sales: 4800, target: 5000 },
    { name: 'Thu', sales: 6100, target: 5000 },
    { name: 'Fri', sales: 7200, target: 5000 },
    { name: 'Sat', sales: 8500, target: 5000 },
    { name: 'Sun', sales: 6800, target: 5000 },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome back, {userData?.name || 'Manager'}!</h2>
            <p className="text-gray-600 mb-6">Here's what's happening with your store today.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Sales Today</h3>
                <p className="text-3xl font-bold text-blue-900">$12,500</p>
                <p className="text-sm text-blue-700 mt-2">+15% from yesterday</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Active Orders</h3>
                <p className="text-3xl font-bold text-green-900">24</p>
                <p className="text-sm text-green-700 mt-2">3 awaiting processing</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Low Stock Items</h3>
                <p className="text-3xl font-bold text-purple-900">8</p>
                <p className="text-sm text-purple-700 mt-2">Need restocking</p>
              </div>
            </div>
          </div>
        );
      case 'stock':
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Stock Management</h2>
            <p className="text-gray-600">Stock management page content would go here.</p>
          </div>
        );
      case 'inventory':
        return (
          <InventoryPage
            inventoryItems={inventoryItems}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            totalItems={322}
            inStock={298}
            lowStock={24}
            categories={12}
          />
        );
      case 'product':
        return <ProductPage />; // Use the ProductPage component
      case 'sales':
        return <SalesPage />; // Use the SalesPage component
      case 'report':
        return (
          <ReportsPage
            performanceData={performanceData}
            weeklySales={43100}
            targetAchievement={122}
            avgDailySales={6157}
          />
        );
      case 'staff':
        return (
          <StaffPage
            staffMembers={staffMembers}
          />
        );
      case 'setting':
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
            <p className="text-gray-600">Settings page content would go here.</p>
          </div>
        );
      default:
        return (
          <InventoryPage
            inventoryItems={inventoryItems}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            totalItems={322}
            inStock={298}
            lowStock={24}
            categories={12}
          />
        );
    }
  };

  return (
    <ManagerLayout
      menuItems={menuItems}
      activeTab={activeTab}
      sidebarOpen={sidebarOpen}
      userData={{
        ...userData,
        storeStatus: 'Open: 8:00 AM - 10:00 PM',
        staffOnDuty: 3,
        storeOpen: true, // Add this for sidebar status
        dailySales: 12500, // Add this for sidebar
        productCount: 322, // Add this for sidebar
      }}
      error={error}
      onTabChange={setActiveTab}
      onToggleSidebar={toggleSidebar}
      onCloseSidebar={() => setSidebarOpen(false)}
      onLogout={onLogout}
      onClearError={() => setError(null)}
    >
      {renderActivePage()}
    </ManagerLayout>
  );
}