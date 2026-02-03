import React from 'react';
import { Package2, Plus, Edit, Trash2, Eye, Tag } from 'lucide-react';

export function ProductPage() {
  const products = [
    { id: 1, name: 'Smartphone X', sku: 'SPX-001', category: 'Electronics', price: 699.99, stock: 45 },
    { id: 2, name: 'Ergonomic Chair', sku: 'EC-002', category: 'Furniture', price: 299.99, stock: 12 },
    { id: 3, name: 'Coffee Maker Pro', sku: 'CMP-003', category: 'Appliances', price: 149.99, stock: 8 },
    { id: 4, name: 'LED Desk Lamp', sku: 'LDL-004', category: 'Home', price: 39.99, stock: 67 },
    { id: 5, name: 'Wireless Mouse', sku: 'WM-005', category: 'Electronics', price: 29.99, stock: 120 },
    { id: 6, name: 'Premium Notebooks', sku: 'PN-006', category: 'Stationery', price: 24.99, stock: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
            <p className="text-gray-600">Manage all products in your store</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
            <Plus size={20} />
            Add New Product
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package2 className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.sku}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.stock > 20 
                    ? 'bg-green-100 text-green-800' 
                    : product.stock > 5 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock} in stock
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="font-bold text-lg">${product.price}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 border border-blue-600 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2">
                  <Eye size={16} />
                  View
                </button>
                <button className="flex-1 border border-green-600 text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition flex items-center justify-center gap-2">
                  <Edit size={16} />
                  Edit
                </button>
                <button className="flex-1 border border-red-600 text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-2">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}