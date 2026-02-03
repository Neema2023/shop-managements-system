import React from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users, Calendar } from 'lucide-react';

export function SalesPage() {
  const salesData = [
    { date: 'Today', amount: 12500, orders: 45, customers: 38, avgOrder: 278 },
    { date: 'Yesterday', amount: 11800, orders: 42, customers: 35, avgOrder: 281 },
    { date: 'This Week', amount: 48300, orders: 176, customers: 142, avgOrder: 274 },
    { date: 'This Month', amount: 189200, orders: 698, customers: 520, avgOrder: 271 },
  ];

  const topProducts = [
    { name: 'Laptop Dell XPS', sales: 42, revenue: 29358 },
    { name: 'Smartphone X', sales: 38, revenue: 26598 },
    { name: 'Coffee Maker', sales: 29, revenue: 4347 },
    { name: 'Office Chair', sales: 25, revenue: 7498 },
    { name: 'Wireless Mouse', sales: 120, revenue: 3599 },
  ];

  return (
    <div className="space-y-6">
      {/* Sales Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesData.map((data, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                index === 0 ? 'bg-green-100' :
                index === 1 ? 'bg-blue-100' :
                index === 2 ? 'bg-purple-100' :
                'bg-orange-100'
              }`}>
                <DollarSign className={
                  index === 0 ? 'text-green-600' :
                  index === 1 ? 'text-blue-600' :
                  index === 2 ? 'text-purple-600' :
                  'text-orange-600'
                } size={24} />
              </div>
              <span className="text-sm text-gray-500">{data.date}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">${data.amount.toLocaleString()}</h3>
            <p className="text-sm text-gray-600 mt-2">{data.orders} orders • {data.customers} customers</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart Placeholder */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Sales Trend</h3>
            <button className="text-blue-600 text-sm">View Details</button>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Sales chart visualization</p>
              <p className="text-sm text-gray-400">(Chart would be displayed here)</p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${product.revenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">${Math.round(product.revenue / product.sales)} avg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-6">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left text-sm font-medium text-gray-700">Order ID</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Customer</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'ORD-001', customer: 'John Doe', date: '2024-01-15 10:30', amount: 299.99, status: 'Completed' },
                { id: 'ORD-002', customer: 'Jane Smith', date: '2024-01-15 11:45', amount: 699.99, status: 'Completed' },
                { id: 'ORD-003', customer: 'Bob Johnson', date: '2024-01-15 14:20', amount: 149.99, status: 'Processing' },
                { id: 'ORD-004', customer: 'Alice Brown', date: '2024-01-15 16:10', amount: 89.99, status: 'Completed' },
              ].map((order, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{order.id}</td>
                  <td className="p-3">{order.customer}</td>
                  <td className="p-3 text-gray-600">{order.date}</td>
                  <td className="p-3 font-bold">${order.amount}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}