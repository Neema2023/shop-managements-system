import React from 'react';
import { ShoppingBag, DollarSign, Package, User, ChevronRight } from 'lucide-react';

interface DashboardPageProps {
  orders: any[];
  totalCartAmount: number;
  cartCount: number;
  userData: any;
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
}

export function DashboardPage({ 
  orders, 
  totalCartAmount, 
  cartCount, 
  userData, 
  getStatusColor, 
  formatDate 
}: DashboardPageProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-blue-600" size={18} />
            </div>
          </div>
          <h3 className="text-gray-500 text-xs md:text-sm mb-1">Total Orders</h3>
          <p className="text-xl md:text-2xl font-bold text-gray-800">{orders.length}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={18} />
            </div>
          </div>
          <h3 className="text-gray-500 text-xs md:text-sm mb-1">Cart Total</h3>
          <p className="text-xl md:text-2xl font-bold text-gray-800">${totalCartAmount.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="text-purple-600" size={18} />
            </div>
          </div>
          <h3 className="text-gray-500 text-xs md:text-sm mb-1">Cart Items</h3>
          <p className="text-xl md:text-2xl font-bold text-gray-800">{cartCount}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <User className="text-orange-600" size={18} />
            </div>
          </div>
          <h3 className="text-gray-500 text-xs md:text-sm mb-1">Member Since</h3>
          <p className="text-xl md:text-2xl font-bold text-gray-800">
            {userData?.createdAt ? formatDate(userData.createdAt) : 'Today'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {orders.slice(0, 5).map((order: any) => (
            <div key={order._id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-gray-800">Order #{order.orderNumber}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.items.length} items • ${order.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                  View Details <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No orders yet. Start shopping!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}