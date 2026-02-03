import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, RefreshCw, AlertCircle, Eye, CheckCircle } from 'lucide-react';
import * as api from '../../../../services/api'; // Adjust path as needed

interface StockItem {
  _id: string;
  productId?: string;
  productName: string;
  category: string;
  quantity: number;
  lowStockThreshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'reorder';
  location?: string;
  receivedDate?: string;
  batchNumber?: string;
  supplier?: string;
}

interface ReceiveStockFormData {
  productId: string;
  quantity: number;
  batchNumber: string;
  supplier: string;
  location: string;
  notes?: string;
}

export function StockPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const [showStockDetails, setShowStockDetails] = useState<StockItem | null>(null);
  
  // Receive stock form state
  const [receiveForm, setReceiveForm] = useState<ReceiveStockFormData>({
    productId: '',
    quantity: 0,
    batchNumber: '',
    supplier: '',
    location: 'Main Warehouse',
    notes: ''
  });

  const [categories, setCategories] = useState<string[]>([]);

  // Fetch stock data
  const fetchStock = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // You'll need to add this function to your api.ts file
      // Example: const data = await api.getManagerStock();
      
      // For now, using mock data
      const mockData: StockItem[] = [
        { 
          _id: '1', 
          productId: 'P001',
          productName: 'Laptop Dell XPS', 
          category: 'Electronics', 
          quantity: 45, 
          lowStockThreshold: 10, 
          status: 'in_stock',
          location: 'Main Warehouse',
          receivedDate: '2024-01-15',
          batchNumber: 'BATCH001',
          supplier: 'Dell Suppliers'
        },
        { 
          _id: '2', 
          productId: 'P002',
          productName: 'Office Chair', 
          category: 'Furniture', 
          quantity: 12, 
          lowStockThreshold: 5, 
          status: 'low_stock',
          location: 'Main Warehouse',
          receivedDate: '2024-01-18',
          batchNumber: 'BATCH002',
          supplier: 'Office Furniture Co'
        },
        { 
          _id: '3', 
          productId: 'P003',
          productName: 'Coffee Machine', 
          category: 'Appliances', 
          quantity: 8, 
          lowStockThreshold: 3, 
          status: 'reorder',
          location: 'Main Warehouse',
          receivedDate: '2024-01-10',
          batchNumber: 'BATCH003',
          supplier: 'Kitchen Appliances Ltd'
        },
        { 
          _id: '4', 
          productId: 'P004',
          productName: 'Desk Lamp', 
          category: 'Home', 
          quantity: 67, 
          lowStockThreshold: 15, 
          status: 'in_stock',
          location: 'Main Warehouse',
          receivedDate: '2024-01-20',
          batchNumber: 'BATCH004',
          supplier: 'Home Decor Inc'
        },
        { 
          _id: '5', 
          productId: 'P005',
          productName: 'Wireless Mouse', 
          category: 'Electronics', 
          quantity: 120, 
          lowStockThreshold: 20, 
          status: 'in_stock',
          location: 'Main Warehouse',
          receivedDate: '2024-01-22',
          batchNumber: 'BATCH005',
          supplier: 'Tech Gadgets Co'
        },
        { 
          _id: '6', 
          productId: 'P006',
          productName: 'Notebooks (Pack)', 
          category: 'Stationery', 
          quantity: 5, 
          lowStockThreshold: 10, 
          status: 'reorder',
          location: 'Main Warehouse',
          receivedDate: '2024-01-05',
          batchNumber: 'BATCH006',
          supplier: 'Office Supplies Ltd'
        },
      ];
      
      setStockItems(mockData);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(mockData.map(item => item.category).filter(Boolean))
      );
      setCategories(['All', ...uniqueCategories]);
      
    } catch (err: any) {
      console.error('Error fetching stock:', err);
      setError('Failed to load stock data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle receiving new stock
  const handleReceiveStock = async () => {
    try {
      if (!receiveForm.productId || receiveForm.quantity <= 0) {
        setError('Please fill in all required fields');
        return;
      }

      // You'll need to add this function to your api.ts file
      // Example: await api.receiveStock(receiveForm);
      
      console.log('Receiving stock:', receiveForm);
      
      // Mock success response
      setError(null);
      alert('Stock received successfully!');
      
      // Reset form
      setReceiveForm({
        productId: '',
        quantity: 0,
        batchNumber: '',
        supplier: '',
        location: 'Main Warehouse',
        notes: ''
      });
      setShowReceiveForm(false);
      
      // Refresh stock data
      fetchStock();
      
    } catch (err: any) {
      console.error('Error receiving stock:', err);
      setError('Failed to receive stock. Please try again.');
    }
  };

  // Handle viewing stock details
  const handleViewStockDetails = (item: StockItem) => {
    setShowStockDetails(item);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'reorder':
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'reorder': return 'Reorder';
      case 'out_of_stock': return 'Out of Stock';
      default: return status;
    }
  };

  // Filter stock items
  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.productId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics
  const totalItems = stockItems.length;
  const lowStockItems = stockItems.filter(item => item.status === 'low_stock').length;
  const reorderItems = stockItems.filter(item => item.status === 'reorder').length;
  const totalQuantity = stockItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    fetchStock();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Items</p>
              <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Quantity</p>
              <p className="text-2xl font-bold text-gray-800">{totalQuantity}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Low Stock</p>
              <p className="text-2xl font-bold text-gray-800">{lowStockItems}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Need Reorder</p>
              <p className="text-2xl font-bold text-gray-800">{reorderItems}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Stock Management Card */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Stock Management</h2>
            <p className="text-gray-600">Manage and track your stock levels</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => fetchStock()}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <button 
              onClick={() => setShowReceiveForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={20} />
              Receive Stock
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by product name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button className="border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
              <Filter size={20} />
              Filter
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading stock data...</p>
          </div>
        ) : (
          <>
            {/* Stock Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Product ID</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Product Name</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Category</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Low Stock Level</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Location</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-600 font-mono">{item.productId}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <Package size={16} className="text-blue-600" />
                          </div>
                          <span className="font-medium">{item.productName}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{item.category}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.quantity <= item.lowStockThreshold 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{item.lowStockThreshold}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{item.location}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewStockDetails(item)}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button className="text-green-600 hover:text-green-800 text-sm">Update</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No stock items found</h3>
                  <p className="text-gray-600">
                    {searchTerm || selectedCategory !== 'All' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'No stock items available'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Summary */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredItems.length} of {stockItems.length} stock items
            </div>
          </>
        )}
      </div>

      {/* Receive Stock Modal */}
      {showReceiveForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Receive New Stock</h3>
                <button 
                  onClick={() => setShowReceiveForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product ID *
                  </label>
                  <input
                    type="text"
                    value={receiveForm.productId}
                    onChange={(e) => setReceiveForm({...receiveForm, productId: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter product ID"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={receiveForm.quantity}
                    onChange={(e) => setReceiveForm({...receiveForm, quantity: parseInt(e.target.value) || 0})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter quantity"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Number *
                  </label>
                  <input
                    type="text"
                    value={receiveForm.batchNumber}
                    onChange={(e) => setReceiveForm({...receiveForm, batchNumber: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter batch number"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier *
                  </label>
                  <input
                    type="text"
                    value={receiveForm.supplier}
                    onChange={(e) => setReceiveForm({...receiveForm, supplier: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter supplier name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <select
                    value={receiveForm.location}
                    onChange={(e) => setReceiveForm({...receiveForm, location: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="Main Warehouse">Main Warehouse</option>
                    <option value="Store A">Store A</option>
                    <option value="Store B">Store B</option>
                    <option value="Backroom Storage">Backroom Storage</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={receiveForm.notes}
                    onChange={(e) => setReceiveForm({...receiveForm, notes: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleReceiveStock}
                  className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Receive Stock
                </button>
                <button
                  onClick={() => setShowReceiveForm(false)}
                  className="flex-1 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Details Modal */}
      {showStockDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Stock Details</h3>
                <button 
                  onClick={() => setShowStockDetails(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">{showStockDetails.productName}</h4>
                    <p className="text-gray-600 text-sm">{showStockDetails.productId}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium">{showStockDetails.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Quantity</p>
                    <p className="font-medium">{showStockDetails.quantity} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Low Stock Level</p>
                    <p className="font-medium">{showStockDetails.lowStockThreshold} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(showStockDetails.status)}`}>
                      {getStatusText(showStockDetails.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{showStockDetails.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Supplier</p>
                    <p className="font-medium">{showStockDetails.supplier || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Batch Number</p>
                    <p className="font-medium">{showStockDetails.batchNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Received</p>
                    <p className="font-medium">
                      {showStockDetails.receivedDate 
                        ? new Date(showStockDetails.receivedDate).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
                
                {showStockDetails.quantity <= showStockDetails.lowStockThreshold && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-700">
                      <AlertCircle size={20} />
                      <span className="font-medium">Low Stock Alert</span>
                    </div>
                    <p className="text-sm text-yellow-600 mt-1">
                      Current quantity ({showStockDetails.quantity}) is at or below the low stock threshold ({showStockDetails.lowStockThreshold}). Consider reordering.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => setShowStockDetails(null)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}