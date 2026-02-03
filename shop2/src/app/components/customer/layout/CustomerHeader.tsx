import React, { useState } from 'react';
import { Menu, X, ShoppingCart, Bell, AlertCircle, LogOut } from 'lucide-react';

interface CustomerHeaderProps {
  sidebarOpen: boolean;
  error: string | null;
  userData: any;
  cartCount: number;
  onToggleSidebar: () => void;
  onClearError: () => void;
  onNavigateToCart: () => void;
  onLogout: () => void; // Changed from onLogoutClick to onLogout (actual logout function)
}

export function CustomerHeader({
  sidebarOpen,
  error,
  userData,
  cartCount,
  onToggleSidebar,
  onClearError,
  onNavigateToCart,
  onLogout
}: CustomerHeaderProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
                <p className="text-gray-500 text-sm">Are you sure you want to logout?</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-800">Customer Dashboard</h1>
              <p className="text-xs md:text-sm text-gray-500">Welcome back, {userData?.name || 'Customer'}</p>
            </div>
          </div>
          
          {error && (
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
              <button onClick={onClearError} className="ml-2 text-red-500 hover:text-red-700">
                <X size={16} />
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={onNavigateToCart}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart size={20} className="text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Logout Button with built-in confirmation */}
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden md:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}