import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceData {
  name: string;
  sales: number;
  target: number;
}

interface ReportsPageProps {
  performanceData: PerformanceData[];
  weeklySales: number;
  targetAchievement: number;
  avgDailySales: number;
}

export function ReportsPage({ 
  performanceData, 
  weeklySales, 
  targetAchievement, 
  avgDailySales 
}: ReportsPageProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">Performance Reports</h2>

      {/* Performance Chart */}
      <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Weekly Sales vs Target</h3>
        <div className="h-64 md:h-80 lg:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="sales" fill="#14b8a6" name="Actual Sales" />
              <Bar dataKey="target" fill="#94a3b8" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-2">This Week's Sales</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">${weeklySales.toLocaleString()}</p>
          <p className="text-xs md:text-sm text-green-600">+12.5% from last week</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-2">Target Achievement</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{targetAchievement}%</p>
          <p className="text-xs md:text-sm text-green-600">Exceeded by ${Math.round(weeklySales * (targetAchievement - 100) / 100)}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-2">Avg Daily Sales</h3>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">${avgDailySales.toLocaleString()}</p>
          <p className="text-xs md:text-sm text-teal-600">Based on 7 days</p>
        </div>
      </div>
    </div>
  );
}