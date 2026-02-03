import React from 'react';
import { Plus } from 'lucide-react';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  shift: string;
  performance: number;
  status: 'On Duty' | 'Break' | 'Off Duty';
}

interface StaffPageProps {
  staffMembers: StaffMember[];
}

export function StaffPage({ staffMembers }: StaffPageProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Staff Management</h2>
        <button className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm md:text-base w-full sm:w-auto">
          <Plus size={16} />
          Add Staff Member
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {staffMembers.map((staff) => (
          <div key={staff.id} className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                {staff.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">{staff.name}</h3>
                <p className="text-xs md:text-sm text-gray-500">{staff.role}</p>
              </div>
            </div>
            
            <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-gray-600">Shift:</span>
                <span className="font-medium text-gray-800">{staff.shift}</span>
              </div>
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-gray-600">Performance:</span>
                <span className="font-medium text-gray-800">{staff.performance}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-1.5 md:h-2 rounded-full" 
                  style={{ width: `${staff.performance}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                staff.status === 'On Duty' ? 'bg-green-100 text-green-700' :
                staff.status === 'Break' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {staff.status}
              </span>
              <button className="text-teal-600 hover:text-teal-700 text-xs md:text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}