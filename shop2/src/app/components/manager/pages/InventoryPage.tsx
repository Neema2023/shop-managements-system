import React from 'react';
import { Package, TrendingUp, AlertTriangle, BarChart2, Search, Plus, Edit, Trash2 } from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
}

interface InventoryPageProps {
  inventoryItems: InventoryItem[];
  searchTerm: string;
  onSearch: (term: string) => void;
  totalItems: number;
  inStock: number;
  lowStock: number;
  categories: number;
}

export function InventoryPage({
  inventoryItems,
  searchTerm,
  onSearch,
  totalItems,
  inStock,
  lowStock,
  categories
}: InventoryPageProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <Package className="text-teal-600" size={18} />
            </div>
            <h3 className="text-gray-500 text-xs md:text-sm">Total Items</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-800">{totalItems}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" size={18} />
            </div>
            <h3 className="text-gray-500 text-xs md:text-sm">In Stock</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-800">{inStock}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-orange-600" size={18} />
            </div>
            <h3 className="text-gray-500 text-xs md:text-sm">Low Stock</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-800">{lowStock}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <BarChart2 className="text-emerald-600" size={18} />
            </div>
            <h3 className="text-gray-500 text-xs md:text-sm">Categories</h3>
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-800">{categories}</p>
        </div>
      </div>

      {/* Inventory Management */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Inventory Items</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm md:text-base"
                />
              </div>
              <button className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm md:text-base">
                <Plus size={16} />
                Add Item
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventoryItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-lg flex items-center justify-center text-xl md:text-2xl">
                        {item.image}
                      </div>
                      <span className="font-medium text-gray-800 text-sm md:text-base">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-gray-600 text-sm md:text-base">{item.category}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <span className={`font-semibold text-sm md:text-base ${item.stock < 20 ? 'text-orange-600' : 'text-gray-800'}`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-gray-800 text-sm md:text-base">${item.price}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex gap-1 md:gap-2">
                      <button className="p-1.5 md:p-1.5 text-teal-600 hover:bg-teal-50 rounded transition-colors">
                        <Edit size={14} />
                      </button>
                      <button className="p-1.5 md:p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
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