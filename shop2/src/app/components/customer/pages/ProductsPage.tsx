import React, { useState, useEffect } from 'react';
import { Package, Heart, Search, Filter } from 'lucide-react';
import * as api from '../../../../services/api'; // Correct: 4 levels up to src, then services

interface ProductsPageProps {
  onAddToCart: (product: any) => void;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: 'available' | 'out_of_stock' | 'low_stock';
  image?: string;
}

export function ProductsPage({ onAddToCart }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [categories, setCategories] = useState<string[]>([]);

  // Transform API data to match our Product interface
  const transformProductData = (apiProduct: any): Product => {
    return {
      _id: apiProduct._id || apiProduct.id,
      name: apiProduct.name || '',
      description: apiProduct.description || '',
      price: apiProduct.sellingPrice || apiProduct.price || 0,
      stock: apiProduct.quantity || apiProduct.stock || 0,
      category: apiProduct.category || 'Uncategorized',
      status: apiProduct.status || (() => {
        const stock = apiProduct.quantity || apiProduct.stock || 0;
        if (stock === 0) return 'out_of_stock';
        if (stock < 10) return 'low_stock';
        return 'available';
      })(),
      image: apiProduct.image || ''
    };
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCustomerProducts(); // Use the customer endpoint
      
      // Transform API data
      const transformedProducts = data.map(transformProductData);
      setProducts(transformedProducts);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(transformedProducts.map(product => product.category).filter(Boolean))
      );
      setCategories(uniqueCategories);
      
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      
      // Mock data for development
      setProducts([
        { 
          _id: '1', 
          name: 'Laptop Dell XPS 15', 
          description: 'High performance laptop with 16GB RAM, 512GB SSD', 
          price: 1299.99, 
          stock: 15, 
          category: 'Electronics',
          status: 'available',
          image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'
        },
        { 
          _id: '2', 
          name: 'Wireless Mouse', 
          description: 'Ergonomic wireless mouse with RGB lighting', 
          price: 29.99, 
          stock: 5, 
          category: 'Electronics',
          status: 'low_stock',
          image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop'
        },
        { 
          _id: '3', 
          name: 'Coffee Maker', 
          description: 'Programmable coffee maker with thermal carafe', 
          price: 89.99, 
          stock: 32, 
          category: 'Appliances',
          status: 'available',
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'
        },
        { 
          _id: '4', 
          name: 'Nike Air Max Shoes', 
          description: 'Comfortable running shoes with air cushioning', 
          price: 129.99, 
          stock: 0, 
          category: 'Clothing',
          status: 'out_of_stock',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'
        },
        { 
          _id: '5', 
          name: 'Smartphone X', 
          description: 'Latest smartphone with 5G and triple camera', 
          price: 899.99, 
          stock: 8, 
          category: 'Electronics',
          status: 'low_stock',
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'
        },
      ]);
      
      // Extract unique categories from mock data
      const uniqueCategories = Array.from(
        new Set([
          'Electronics',
          'Appliances',
          'Clothing',
          'All Categories'
        ])
      );
      setCategories(uniqueCategories);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle refresh
  const handleRefresh = () => {
    fetchProducts();
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Products</h2>
          <p className="text-gray-600 text-sm">Browse our collection of products</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300 text-sm"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              disabled={loading}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              disabled={loading}
            >
              <option value="All Categories">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
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
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
              {/* Product Image */}
              <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden relative">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center">
                            <Package class="w-16 h-16 text-gray-300" />
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                
                {/* Stock Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'available' ? 'bg-green-100 text-green-700' :
                    product.status === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {product.status === 'available' ? 'In Stock' :
                     product.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              
              {/* Product Details */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{product.description}</p>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {product.category}
                    </span>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded ml-2">
                    <Heart size={18} className="text-gray-400 hover:text-red-500 transition-colors" />
                  </button>
                </div>
                
                {/* Price and Action */}
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-lg font-bold text-gray-800">${product.price.toFixed(2)}</span>
                    {product.stock > 0 && (
                      <p className="text-xs text-gray-500">{product.stock} units available</p>
                    )}
                  </div>
                  <button
                    onClick={() => onAddToCart(product)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    disabled={product.stock === 0 || loading}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
                
                {/* Low Stock Warning */}
                {product.stock > 0 && product.stock < 10 && (
                  <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                    ⚠️ Only {product.stock} left in stock!
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {searchTerm || selectedCategory !== 'All Categories' 
              ? 'No matching products found' 
              : 'No Products Available'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'All Categories'
              ? 'Try adjusting your search or filter criteria'
              : 'Check back later for new products'}
          </p>
          {(searchTerm || selectedCategory !== 'All Categories') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}