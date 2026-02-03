import React from 'react';
import { Clock } from 'lucide-react';

interface Transaction {
  id: string;
  time: string;
  items: number;
  total: number;
  payment: string;
}

interface TransactionsPageProps {
  transactions: Transaction[];
}

export function TransactionsPage({ transactions }: TransactionsPageProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Recent Transactions</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="px-3 md:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base flex-1 sm:flex-none">
            Today
          </button>
          <button className="px-3 md:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base flex-1 sm:flex-none">
            This Week
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 md:px-6 py-3 md:py-4 font-semibold text-gray-800 text-sm md:text-base">{transaction.id}</td>
                <td className="px-4 md:px-6 py-3 md:py-4 text-gray-600">
                  <div className="flex items-center gap-1 md:gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-xs md:text-sm">{transaction.time}</span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4 text-gray-600 text-sm md:text-base">{transaction.items} items</td>
                <td className="px-4 md:px-6 py-3 md:py-4 font-semibold text-green-600 text-sm md:text-base">${transaction.total}</td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                    transaction.payment === 'Card' ? 'bg-teal-100 text-teal-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {transaction.payment}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4">
                  <button className="text-green-600 hover:text-green-700 font-medium text-xs md:text-sm">
                    View Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}