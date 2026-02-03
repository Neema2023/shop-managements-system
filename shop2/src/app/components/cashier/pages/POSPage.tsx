import React from 'react';
import { Search, ShoppingCart, CreditCard, DollarSign, Trash2, Plus, Minus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface POSPageProps {
  products: Product[];
  cart: CartItem[];
  searchTerm: string;
  onSearch: (term: string) => void;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveFromCart: (id: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  total: number;
  tax: number;
  grandTotal: number;
}

export function POSPage({
  products,
  cart,
  searchTerm,
  onSearch,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onCheckout,
  total,
  tax,
  grandTotal
}: POSPageProps) {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Products Section */}
      <div className="lg:col-span-2 space-y-3 md:space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm md:text-base"
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all group"
            >
              <div className="text-4xl md:text-5xl mb-2 md:mb-3">{product.image}</div>
              <h3 className="font-semibold text-gray-800 mb-1 text-xs md:text-sm truncate">{product.name}</h3>
              <p className="text-base md:text-lg font-bold text-green-600">${product.price}</p>
              <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Click to add
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg md:rounded-xl shadow-lg border border-gray-200 sticky top-3 md:top-6">
          <div className="p-3 md:p-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg md:rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-bold">Current Sale</h2>
              {cart.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs md:text-sm hover:text-red-200 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="p-3 md:p-4 max-h-64 md:max-h-80 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-6 md:py-8 text-gray-400">
                <ShoppingCart size={32} className="mx-auto mb-2 md:mb-3 opacity-50" />
                <p className="text-sm md:text-base">No items in cart</p>
              </div>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl md:text-3xl">{item.image}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-xs md:text-sm truncate">{item.name}</h4>
                      <p className="text-xs md:text-sm text-gray-600">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 md:w-7 md:h-7 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 md:w-8 text-center font-semibold text-xs md:text-sm">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 md:w-7 md:h-7 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="w-6 h-6 md:w-7 md:h-7 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-3 md:p-4 border-t border-gray-200 space-y-2 md:space-y-3">
              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-base md:text-lg pt-1 md:pt-2 border-t border-gray-200">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-green-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="px-3 md:px-4 py-2 md:py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm">
                  <DollarSign size={14} />
                  Cash
                </button>
                <button
                  onClick={onCheckout}
                  className="px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition-all shadow-lg flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                >
                  <CreditCard size={14} />
                  Pay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}