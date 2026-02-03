import React, { useState, useEffect } from 'react';
import { CustomerLayout } from './layout/CustomerLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { OrdersPage } from './pages/OrdersPage';
import { CartPage } from './pages/CartPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { Home, Package, ShoppingBag, ShoppingCart, Heart, User, Settings } from 'lucide-react';
import * as api from '../../../services/api'; // Correct path: ../../../services/api

interface CustomerDashboardProps {
  onLogout: () => void;
  authToken: string;
  userData: any;
}

// Define TypeScript interfaces
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: 'available' | 'out_of_stock' | 'low_stock';
  image?: string;
  manufactureDate?: string;
  expiryDate?: string;
  stockLocation?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  createdAt: string;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export function CustomerDashboard({ onLogout, authToken, userData }: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState({ products: false, orders: false });
  const [error, setError] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'cart', label: 'My Cart', icon: ShoppingCart },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Transform API product data to match our Product interface
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
      image: apiProduct.image || '',
      manufactureDate: apiProduct.manufactureDate,
      expiryDate: apiProduct.expiryDate,
      stockLocation: apiProduct.stockLocation || ''
    };
  };

  // Fetch products from /api/customer/products endpoint
  const fetchProducts = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      setError(null);
      
      // Use the customer products API endpoint
      const data = await api.getCustomerProducts();
      
      // Transform API data
      const transformedProducts = data.map(transformProductData);
      setProducts(transformedProducts);
      
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again.');
      
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
      ]);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  // Fetch orders from /api/customer/history endpoint
  const fetchOrders = async () => {
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      setError(null);
      
      // Use the customer orders API endpoint
      const data = await api.getCustomerOrders();
      
      // Transform the data to match our interface
      const transformedOrders: Order[] = data.map((order: any) => ({
        _id: order._id || order.id,
        orderNumber: order.orderNumber || `ORD-${order._id?.substring(0, 8).toUpperCase() || '000000'}`,
        totalAmount: order.totalAmount || order.total || 0,
        status: order.status || 'pending',
        items: order.items || order.products || [],
        createdAt: order.createdAt || new Date().toISOString()
      }));
      
      setOrders(transformedOrders);
      
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please try again.');
      
      // Mock data for development
      setOrders([
        {
          _id: '1',
          orderNumber: 'ORD-001',
          totalAmount: 159.97,
          status: 'delivered',
          items: [
            { productId: '1', productName: 'Laptop', quantity: 1, price: 129.99 },
            { productId: '2', productName: 'Mouse', quantity: 1, price: 29.99 }
          ],
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          _id: '2',
          orderNumber: 'ORD-002',
          totalAmount: 89.99,
          status: 'shipped',
          items: [
            { productId: '3', productName: 'Coffee Maker', quantity: 1, price: 89.99 }
          ],
          createdAt: '2024-01-18T14:20:00Z'
        },
        {
          _id: '3',
          orderNumber: 'ORD-003',
          totalAmount: 29.99,
          status: 'processing',
          items: [
            { productId: '2', productName: 'Wireless Mouse', quantity: 1, price: 29.99 }
          ],
          createdAt: '2024-01-20T09:15:00Z'
        }
      ]);
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      setError(`${product.name} is out of stock!`);
      return;
    }
    
    if (product.stock < 10) {
      // Show low stock warning
      setError(`Low stock warning: Only ${product.stock} ${product.name}(s) left!`);
    }
    
    setCart(prev => {
      const existingItem = prev.find(item => item._id === product._id);
      
      if (existingItem) {
        // Check if adding more would exceed stock
        if (existingItem.quantity + 1 > product.stock) {
          setError(`Cannot add more. Only ${product.stock} ${product.name}(s) available!`);
          return prev;
        }
        return prev.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }
    
    // Find the product to check stock
    const product = products.find(p => p._id === productId);
    if (product && quantity > product.stock) {
      setError(`Cannot update quantity. Only ${product.stock} ${product.name}(s) available!`);
      return;
    }
    
    setCart(prev => prev.map(item => 
      item._id === productId ? { ...item, quantity } : item
    ));
  };

  const handleCheckout = async () => {
    try {
      if (cart.length === 0) {
        setError('Your cart is empty!');
        return;
      }
      
      setError(null);
      
      const orderData = {
        items: cart.map(item => ({
          productId: item._id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: totalCartAmount
      };
      
      // Use the sales API endpoint for checkout
      await api.createSale(orderData);
      
      // Clear cart
      setCart([]);
      
      // Show success message
      setError('Order placed successfully!');
      
      // Refresh orders
      fetchOrders();
      
      // Clear success message after 3 seconds
      setTimeout(() => setError(null), 3000);
      
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError('Failed to checkout: ' + (err.message || 'Unknown error'));
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalCartAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Fetch data when tab changes
  useEffect(() => {
    if (!authToken) {
      setError('No authentication token found. Please login again.');
      return;
    }

    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, authToken]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Render active page
  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardPage
            orders={orders}
            totalCartAmount={totalCartAmount}
            cartCount={cartItemCount}
            userData={userData}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        );
      case 'products':
        return (
          <ProductsPage
            onAddToCart={handleAddToCart}
          />
        );
      case 'orders':
        return (
          <OrdersPage
            orders={orders}
            loading={loading.orders}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        );
      case 'cart':
        return (
          <CartPage
            cart={cart}
            totalCartAmount={totalCartAmount}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onCheckout={handleCheckout}
            onBrowseProducts={() => setActiveTab('products')}
          />
        );
      case 'wishlist':
        return (
          <div className="bg-white rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Wishlist</h2>
            <p className="text-gray-600">Wishlist feature coming soon!</p>
          </div>
        );
      case 'profile':
        return <ProfilePage userData={userData} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage
          orders={orders}
          totalCartAmount={totalCartAmount}
          cartCount={cartItemCount}
          userData={userData}
          getStatusColor={getStatusColor}
          formatDate={formatDate}
        />;
    }
  };

  return (
    <>
      {error && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          error.includes('success') 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          <p className="font-medium">{error}</p>
        </div>
      )}
      
      <CustomerLayout
        menuItems={menuItems}
        activeTab={activeTab}
        sidebarOpen={sidebarOpen}
        userData={userData}
        cartCount={cartItemCount}
        error={error}
        onTabChange={setActiveTab}
        onToggleSidebar={toggleSidebar}
        onCloseSidebar={() => setSidebarOpen(false)}
        onLogout={onLogout}
        onClearError={() => setError(null)}
        onNavigateToCart={() => setActiveTab('cart')}
      >
        {renderActivePage()}
      </CustomerLayout>
    </>
  );
}