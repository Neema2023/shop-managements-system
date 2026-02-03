import React, { useState } from 'react';
import { CashierLayout } from './layout/CashierLayout';
import { POSPage } from './pages/POSPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { DailySummaryPage } from './pages/DailySummaryPage';
import { ShoppingCart, Receipt, TrendingUp } from 'lucide-react';

interface CashierDashboardProps {
  onLogout: () => void;
  authToken: string;
  userData: any;
}

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

interface Transaction {
  id: string;
  time: string;
  items: number;
  total: number;
  payment: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export function CashierDashboard({ onLogout, authToken, userData }: CashierDashboardProps) {
  const [activeTab, setActiveTab] = useState('pos');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'daily', label: 'Daily Summary', icon: TrendingUp },
  ];

  // Mock products data
  const products: Product[] = [
    { id: 1, name: 'Laptop', price: 1299, category: 'Electronics', image: '💻', stock: 45 },
    { id: 2, name: 'iPhone', price: 999, category: 'Electronics', image: '📱', stock: 12 },
    { id: 3, name: 'Headphones', price: 199, category: 'Electronics', image: '🎧', stock: 78 },
    { id: 4, name: 'Keyboard', price: 89, category: 'Electronics', image: '⌨️', stock: 32 },
    { id: 5, name: 'Mouse', price: 29, category: 'Electronics', image: '🖱️', stock: 150 },
    { id: 6, name: 'Monitor', price: 399, category: 'Electronics', image: '🖥️', stock: 25 },
    { id: 7, name: 'Webcam', price: 79, category: 'Electronics', image: '📷', stock: 40 },
    { id: 8, name: 'Tablet', price: 599, category: 'Electronics', image: '📱', stock: 18 },
  ];

  // Mock transactions data
  const recentTransactions: Transaction[] = [
    { id: '#T001', time: '10:30 AM', items: 3, total: 247, payment: 'Card' },
    { id: '#T002', time: '10:45 AM', items: 1, total: 1299, payment: 'Cash' },
    { id: '#T003', time: '11:15 AM', items: 5, total: 456, payment: 'Card' },
    { id: '#T004', time: '11:30 AM', items: 2, total: 178, payment: 'Card' },
  ];

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleCheckout = async () => {
    try {
      // API call to process sale
      console.log('Processing sale:', cart);
      alert('Sale processed successfully!');
      clearCart();
    } catch (err: any) {
      setError('Failed to process sale: ' + err.message);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = total * 0.1;
  const grandTotal = total + tax;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'pos':
        return (
          <POSPage
            products={products}
            cart={cart}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            onAddToCart={addToCart}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onClearCart={clearCart}
            onCheckout={handleCheckout}
            total={total}
            tax={tax}
            grandTotal={grandTotal}
          />
        );
      case 'transactions':
        return (
          <TransactionsPage
            transactions={recentTransactions}
          />
        );
      case 'daily':
        return (
          <DailySummaryPage
            dailySales={3247}
            transactionsCount={47}
            shiftHours={6.5}
          />
        );
      default:
        return (
          <POSPage
            products={products}
            cart={cart}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            onAddToCart={addToCart}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onClearCart={clearCart}
            onCheckout={handleCheckout}
            total={total}
            tax={tax}
            grandTotal={grandTotal}
          />
        );
    }
  };

  return (
    <CashierLayout
      menuItems={menuItems}
      activeTab={activeTab}
      sidebarOpen={sidebarOpen}
      userData={{
        ...userData,
        shift: userData?.shift || 'Morning Shift',
        shiftStart: userData?.shiftStart || '8:00 AM'
      }}
      cartCount={cart.length}
      error={error}
      onTabChange={setActiveTab}
      onToggleSidebar={toggleSidebar}
      onCloseSidebar={() => setSidebarOpen(false)}
      onLogout={onLogout}
      onClearError={() => setError(null)}
    >
      {renderActivePage()}
    </CashierLayout>
  );
}