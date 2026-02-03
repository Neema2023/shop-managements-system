import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface OrdersPageProps {
  orders: any[];
  loading: boolean;
  getStatusColor: (status: string) => string;
  formatDate: (dateString: string) => string;
}

export function OrdersPage({ 
  orders, 
  loading, 
  getStatusColor, 
  formatDate 
}: OrdersPageProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">My Orders</h2>

      {loading && (
        <div className="text-center py-8">Loading orders...</div>
      )}

      <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <span className="font-medium text-gray-800">#{order.orderNumber}</span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-gray-600">
                    {order.items.length} items
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <span className="font-semibold text-gray-800">${order.totalAmount.toFixed(2)}</span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-500">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
          </div>
        )}
      </div>
    </div>
  );
}