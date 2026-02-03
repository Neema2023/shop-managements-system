import React from 'react';
import { DollarSign, Receipt, Clock } from 'lucide-react';

interface DailySummaryPageProps {
  dailySales: number;
  transactionsCount: number;
  shiftHours: number;
}

export function DailySummaryPage({ 
  dailySales, 
  transactionsCount, 
  shiftHours 
}: DailySummaryPageProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">Daily Summary</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={18} />
            </div>
            <h3 className="text-gray-600 text-sm md:text-base">Today's Sales</h3>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">${dailySales.toLocaleString()}</p>
          <p className="text-xs md:text-sm text-green-600 mt-1 md:mt-2">+18% from yesterday</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <Receipt className="text-teal-600" size={18} />
            </div>
            <h3 className="text-gray-600 text-sm md:text-base">Transactions</h3>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{transactionsCount}</p>
          <p className="text-xs md:text-sm text-teal-600 mt-1 md:mt-2">Average: ${Math.round(dailySales / transactionsCount)} per sale</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Clock className="text-emerald-600" size={18} />
            </div>
            <h3 className="text-gray-600 text-sm md:text-base">Shift Hours</h3>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{shiftHours}h</p>
          <p className="text-xs md:text-sm text-emerald-600 mt-1 md:mt-2">Started at 8:00 AM</p>
        </div>
      </div>
    </div>
  );
}