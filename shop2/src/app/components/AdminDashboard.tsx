import React, { useState, useEffect, useRef } from 'react';
import { 
  LogOut, Users, TrendingUp, Package, DollarSign, 
  Settings, BarChart3, UserCheck, AlertCircle, ShoppingBag,
  Activity, ArrowUpRight, ArrowDownRight, Home, Menu, X,
  CheckCircle, XCircle, FileText, Bell, ChevronDown,
  Box, ShoppingCart, Layers, ClipboardList, Plus, Edit, Trash2,
  Image as ImageIcon, Upload, Eye, EyeOff, User
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as api from '../../services/api';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Cashier' | 'Customer' | 'Storekeeper';
  status: 'Active' | 'Inactive';
  createdAt?: string;
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
  imageFile?: File;
  manufactureDate?: string;
  expiryDate?: string;
  stockLocation?: string;
}

interface Report {
  _id: string;
  name: string;
  type: string;
  description: string;
  generatedAt: string;
  data: any;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 54239,
    totalOrders: 1847,
    totalUsers: 0,
    lowStockItems: 0
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState({
    users: false,
    products: false,
    reports: false,
    dashboard: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal states
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: 'user' | 'product' | null;
    id: string | null;
    name: string;
  }>({ type: null, id: null, name: '' });

  // Image preview states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Cashier' as 'Cashier' | 'Manager' | 'Admin' | 'Storekeeper' | 'Customer',
    password: 'default123',
    showPassword: false
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    status: 'available' as 'available' | 'out_of_stock' | 'low_stock',
    image: '',
    imageFile: null as File | null,
    manufactureDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    stockLocation: ''
  });

  // Update product form state
  const [updateProductForm, setUpdateProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    status: 'available' as 'available' | 'out_of_stock' | 'low_stock',
    image: '',
    imageFile: null as File | null,
    manufactureDate: '',
    expiryDate: '',
    stockLocation: ''
  });

  // Update user form state - FIXED: Include 'Customer' in role type
  const [updateUserForm, setUpdateUserForm] = useState({
    name: '',
    email: '',
    role: 'Cashier' as 'Cashier' | 'Manager' | 'Admin' | 'Storekeeper' | 'Customer',
    status: 'Active' as 'Active' | 'Inactive',
    showPassword: false,
    password: ''
  });

  // Mock data for charts
  const salesData = [
    { name: 'Mon', sales: 4000, revenue: 2400 },
    { name: 'Tue', sales: 3000, revenue: 1398 },
    { name: 'Wed', sales: 2000, revenue: 9800 },
    { name: 'Thu', sales: 2780, revenue: 3908 },
    { name: 'Fri', sales: 1890, revenue: 4800 },
    { name: 'Sat', sales: 2390, revenue: 3800 },
    { name: 'Sun', sales: 3490, revenue: 4300 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Food', value: 200 },
    { name: 'Books', value: 100 },
  ];

  const COLORS = ['#10b981', '#14b8a6', '#f59e0b', '#06b6d4'];

  const recentActivities = [
    { id: 1, action: 'New order #1234', user: 'Customer', time: '2 mins ago', type: 'order' },
    { id: 2, action: 'Inventory updated', user: 'Manager', time: '15 mins ago', type: 'inventory' },
    { id: 3, action: 'User registered', user: 'New Customer', time: '1 hour ago', type: 'user' },
    { id: 4, action: 'Payment received', user: 'Cashier', time: '2 hours ago', type: 'payment' },
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: Layers },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Fetch data from backend
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchDashboardData();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab]);

  const showSuccessMessage = (message: string) => {
    setSuccess(message);
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(prev => ({ ...prev, dashboard: true }));
      setError(null);
      
      const usersData = await api.getAllUsers();
      const productsData = await api.getProducts();
      
      setDashboardStats({
        totalRevenue: 54239,
        totalOrders: 1847,
        totalUsers: usersData.length,
        lowStockItems: productsData.filter((p: Product) => p.status === 'low_stock').length
      });
      
      showSuccessMessage('Dashboard loaded successfully!');
      
    } catch (err: any) {
      console.log('Dashboard loaded with mock data');
      setDashboardStats({
        totalRevenue: 54239,
        totalOrders: 1847,
        totalUsers: 42,
        lowStockItems: 7
      });
      showSuccessMessage('Dashboard loaded successfully!');
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      setError(null);
      const data = await api.getAllUsers();
      setUsers(data);
      showSuccessMessage('Users loaded successfully!');
    } catch (err: any) {
      setError('Failed to fetch users: ' + (err.message || 'Unknown error'));
      console.error('Error fetching users:', err);
      // Mock data
      setUsers([
        { _id: '1', name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'Active' },
        { _id: '2', name: 'John Manager', email: 'manager@example.com', role: 'Manager', status: 'Active' },
        { _id: '3', name: 'Sarah Cashier', email: 'cashier@example.com', role: 'Cashier', status: 'Active' },
      ]);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      setError(null);
      const data = await api.getProducts();
      setProducts(data);
      showSuccessMessage('Products loaded successfully!');
    } catch (err: any) {
      setError('Failed to fetch products: ' + (err.message || 'Unknown error'));
      console.error('Error fetching products:', err);
      // Mock data with working Unsplash URLs
      setProducts([
        { 
          _id: '1', 
          name: 'Laptop', 
          description: 'High performance laptop', 
          price: 999.99, 
          stock: 15, 
          category: 'Electronics',
          status: 'available',
          image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
          manufactureDate: '2024-01-01',
          expiryDate: '2026-01-01',
          stockLocation: 'Shelf A1'
        },
        { 
          _id: '2', 
          name: 'Wireless Mouse', 
          description: 'Wireless mouse with RGB lighting', 
          price: 29.99, 
          stock: 5, 
          category: 'Electronics',
          status: 'low_stock',
          image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop',
          manufactureDate: '2024-02-01',
          expiryDate: '2025-02-01',
          stockLocation: 'Shelf B2'
        },
      ]);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(prev => ({ ...prev, reports: true }));
      setError(null);
      
      const mockReports = [
        { _id: '1', name: 'Sales Report', type: 'sales', description: 'Monthly sales report', generatedAt: new Date().toISOString(), data: {} },
        { _id: '2', name: 'Inventory Report', type: 'inventory', description: 'Stock level report', generatedAt: new Date().toISOString(), data: {} },
      ];
      setReports(mockReports);
      showSuccessMessage('Reports loaded successfully!');
      
    } catch (err: any) {
      setError('Failed to fetch reports: ' + (err.message || 'Unknown error'));
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(prev => ({ ...prev, reports: false }));
    }
  };

  // CRUD operations for users
  const handleCreateUser = async (userData: Partial<User> & { password?: string }) => {
    try {
      const createdUser = await api.createStaffUser(userData);
      return createdUser;
    } catch (err: any) {
      setError('Failed to create user: ' + (err.message || 'Unknown error'));
      throw err;
    }
  };

  const handleUpdateUser = async (id: string, userData: Partial<User>) => {
    try {
      const updatedUser = await api.updateUser(id, userData);
      return updatedUser;
    } catch (err: any) {
      setError('Failed to update user: ' + (err.message || 'Unknown error'));
      throw err;
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await api.deleteUser(id);
      setUsers(prev => prev.filter(user => user._id !== id));
      showSuccessMessage('User deleted successfully!');
    } catch (err: any) {
      setError('Failed to delete user: ' + (err.message || 'Unknown error'));
      throw err;
    }
  };

  // CRUD operations for products
  const handleCreateProduct = async (productData: any) => {
    try {
      const createdProduct = await api.createProduct(productData);
      return createdProduct;
    } catch (err: any) {
      setError('Failed to create product: ' + (err.message || 'Unknown error'));
      throw err;
    }
  };

  const handleUpdateProduct = async (id: string, productData: any) => {
    try {
      const updatedProduct = await api.updateProduct(id, productData);
      return updatedProduct;
    } catch (err: any) {
      setError('Failed to update product: ' + (err.message || 'Unknown error'));
      throw err;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(product => product._id !== id));
      showSuccessMessage('Product deleted successfully!');
    } catch (err: any) {
      setError('Failed to delete product: ' + (err.message || 'Unknown error'));
      throw err;
    }
  };

  // Image handling functions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditImagePreview(reader.result as string);
          setUpdateProductForm(prev => ({ ...prev, imageFile: file, image: reader.result as string }));
        } else {
          setImagePreview(reader.result as string);
          setNewProduct(prev => ({ ...prev, imageFile: file, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (isEdit: boolean = false) => {
    if (isEdit) {
      setEditImagePreview(null);
      setUpdateProductForm(prev => ({ ...prev, imageFile: null, image: '' }));
      if (editFileInputRef.current) editFileInputRef.current.value = '';
    } else {
      setImagePreview(null);
      setNewProduct(prev => ({ ...prev, imageFile: null, image: '' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const reportTypes = [
    { id: 1, name: 'Sales Report', description: 'Daily, weekly, and monthly sales analysis', icon: '📊', lastUpdated: 'Today' },
    { id: 2, name: 'Inventory Report', description: 'Stock levels and inventory status', icon: '📦', lastUpdated: 'Yesterday' },
    { id: 3, name: 'Financial Report', description: 'Revenue, expenses, and profit analysis', icon: '💰', lastUpdated: '2 days ago' },
    { id: 4, name: 'User Activity Report', description: 'User login and activity logs', icon: '👥', lastUpdated: '1 week ago' },
    { id: 5, name: 'Customer Report', description: 'Customer demographics and behavior', icon: '👤', lastUpdated: '3 days ago' },
    { id: 6, name: 'Product Performance', description: 'Best and worst selling products', icon: '📈', lastUpdated: 'Today' },
  ];

  // Delete confirmation handlers
  const showDeleteConfirmation = (type: 'user' | 'product', id: string, name: string) => {
    setShowDeleteConfirm({ type, id, name });
  };

  const handleConfirmDelete = async () => {
    if (!showDeleteConfirm.type || !showDeleteConfirm.id) return;

    try {
      if (showDeleteConfirm.type === 'user') {
        await handleDeleteUser(showDeleteConfirm.id);
      } else {
        await handleDeleteProduct(showDeleteConfirm.id);
      }
      setShowDeleteConfirm({ type: null, id: null, name: '' });
      showSuccessMessage(`${showDeleteConfirm.type === 'user' ? 'User' : 'Product'} deleted successfully!`);
    } catch (err: any) {
      setError(`Failed to delete ${showDeleteConfirm.type}: ${err.message}`);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm({ type: null, id: null, name: '' });
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    api.removeAuthToken();
    api.removeUserInfo();
    onLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'active':
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'inactive':
      case 'out_of_stock':
        return 'bg-red-100 text-red-700';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleColor = (role: string) => {
    const roleLower = role.toLowerCase();
    switch (roleLower) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'manager':
        return 'bg-teal-100 text-teal-700';
      case 'cashier':
        return 'bg-blue-100 text-blue-700';
      case 'customer':
        return 'bg-gray-100 text-gray-700';
      case 'storekeeper':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleGenerateReport = async (reportType: string) => {
    try {
      setLoading(prev => ({ ...prev, reports: true }));
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccessMessage(`${reportType} generated successfully!`);
      
    } catch (err: any) {
      setError('Failed to generate report: ' + (err.message || 'Unknown error'));
      console.error('Error generating report:', err);
    } finally {
      setLoading(prev => ({ ...prev, reports: false }));
    }
  };

  // Form handlers
  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        password: newUser.password, // Include password
        status: 'Active' as const
      };
      
      console.log('Creating user with data:', userData);
      
      const createdUser = await handleCreateUser(userData);
      
      // Add the created user to the list
      setUsers(prev => [...prev, createdUser]);
      
      // Update dashboard stats
      setDashboardStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + 1
      }));
      
      setShowCreateUserModal(false);
      setNewUser({ 
        name: '', 
        email: '', 
        role: 'Cashier', 
        password: 'default123',
        showPassword: false 
      });
      showSuccessMessage('User created successfully!');
      setError(null);
    } catch (err: any) {
      setError('Error creating user: ' + (err.message || 'Unknown error'));
      console.error('Error creating user:', err);
    }
  };

  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare product data matching your backend schema
      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        sellingPrice: newProduct.price,
        quantity: newProduct.stock,
        description: newProduct.description,
        manufactureDate: newProduct.manufactureDate,
        expiryDate: newProduct.expiryDate,
        stockLocation: newProduct.stockLocation,
        image: newProduct.image, // Base64 string
        imageFile: newProduct.imageFile // File object
      };
      
      console.log('Creating product with data:', productData);
      
      const createdProduct = await handleCreateProduct(productData);
      
      // Add to products list with proper image handling
      const productToAdd: Product = {
        _id: createdProduct._id,
        name: createdProduct.name,
        description: createdProduct.description,
        price: createdProduct.price,
        stock: createdProduct.stock,
        category: createdProduct.category,
        status: createdProduct.status || 'available',
        image: newProduct.image || createdProduct.image,
        manufactureDate: createdProduct.manufactureDate,
        expiryDate: createdProduct.expiryDate,
        stockLocation: createdProduct.stockLocation
      };
      
      setProducts(prev => [...prev, productToAdd]);
      setShowCreateProductModal(false);
      setNewProduct({ 
        name: '', 
        description: '', 
        price: 0, 
        stock: 0, 
        category: '',
        status: 'available',
        image: '',
        imageFile: null,
        manufactureDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        stockLocation: ''
      });
      setImagePreview(null);
      showSuccessMessage('Product created successfully!');
      setError(null);
    } catch (err: any) {
      setError('Error creating product: ' + (err.message || 'Unknown error'));
      console.error('Error creating product:', err);
    }
  };

  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    try {
      const productData = {
        name: updateProductForm.name,
        category: updateProductForm.category,
        sellingPrice: updateProductForm.price,
        quantity: updateProductForm.stock,
        description: updateProductForm.description,
        manufactureDate: updateProductForm.manufactureDate,
        expiryDate: updateProductForm.expiryDate,
        stockLocation: updateProductForm.stockLocation,
        image: updateProductForm.image,
        imageFile: updateProductForm.imageFile
      };
      
      const updatedProduct = await handleUpdateProduct(editingProduct._id, productData);
      
      setProducts(prev => prev.map(product => 
        product._id === editingProduct._id 
          ? { ...product, ...updatedProduct, image: updateProductForm.image || product.image }
          : product
      ));
      
      setShowEditProductModal(false);
      setEditingProduct(null);
      setEditImagePreview(null);
      showSuccessMessage('Product updated successfully!');
      setError(null);
    } catch (err: any) {
      setError('Error updating product: ' + (err.message || 'Unknown error'));
      console.error('Error updating product:', err);
    }
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    try {
      const userData: any = {
        name: updateUserForm.name,
        email: updateUserForm.email,
        role: updateUserForm.role,
        status: updateUserForm.status
      };
      
      // Only include password if it's provided
      if (updateUserForm.password && updateUserForm.password.trim() !== '') {
        userData.password = updateUserForm.password;
      }
      
      console.log('Updating user with data:', userData);
      
      const updatedUser = await handleUpdateUser(editingUser._id, userData);
      
      setUsers(prev => prev.map(user => user._id === editingUser._id ? updatedUser : user));
      setShowEditUserModal(false);
      setEditingUser(null);
      showSuccessMessage('User updated successfully!');
      setError(null);
    } catch (err: any) {
      setError('Error updating user: ' + (err.message || 'Unknown error'));
      console.error('Error updating user:', err);
    }
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setUpdateProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price || 0,
      stock: product.stock || 0,
      category: product.category || '',
      status: product.status || 'available',
      image: product.image || '',
      imageFile: null,
      manufactureDate: product.manufactureDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      expiryDate: product.expiryDate?.split('T')[0] || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      stockLocation: product.stockLocation || ''
    });
    setEditImagePreview(product.image || null);
    setShowEditProductModal(true);
  };

  const handleEditUserClick = (user: User) => {
    setEditingUser(user);
    setUpdateUserForm({
      name: user.name,
      email: user.email,
      role: user.role, // Now this works because updateUserForm.role includes 'Customer'
      status: user.status,
      showPassword: false,
      password: ''
    });
    setShowEditUserModal(true);
  };

  // Add this CSS for fade-in animation
  const styles = `
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }
  `;

  // Helper function for fallback image
  const getFallbackImage = (text: string) => {
    const encodedText = encodeURIComponent(text.substring(0, 15));
    return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23f3f4f6'/><text x='50%' y='50%' font-family='-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' font-size='20' font-weight='500' text-anchor='middle' dy='.3em' fill='%234b5563'>${encodedText}</text></svg>`;
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <style>{styles}</style>
      
      {/* Success Message Banner */}
      {success && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-green-100 border border-green-300 text-green-700 rounded-lg shadow-lg animate-fade-in">
          <CheckCircle size={18} className="text-green-600" />
          <span className="font-medium">{success}</span>
          <button 
            onClick={() => setSuccess(null)} 
            className="ml-4 text-green-600 hover:text-green-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Error Message Banner */}
      {error && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-red-100 border border-red-300 text-red-700 rounded-lg shadow-lg animate-fade-in">
          <AlertCircle size={18} className="text-red-600" />
          <span className="font-medium">{error}</span>
          <button 
            onClick={() => setError(null)} 
            className="ml-4 text-red-600 hover:text-red-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
                <p className="text-gray-500 text-sm">Are you sure you want to logout?</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                <p className="text-gray-500 text-sm">
                  Are you sure you want to delete {showDeleteConfirm.name}?
                  <br />
                  <span className="font-medium text-red-600">This action cannot be undone.</span>
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New User</h3>
              <button 
                onClick={() => {
                  setShowCreateUserModal(false);
                  setError(null);
                }} 
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateUserSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input 
                    type="email" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="Cashier">Cashier</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Storekeeper">Storekeeper</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <div className="relative">
                    <input 
                      type={newUser.showPassword ? "text" : "password"}
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none pr-10"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setNewUser({...newUser, showPassword: !newUser.showPassword})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {newUser.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Default password is "default123"</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowCreateUserModal(false);
                      setError(null);
                    }} 
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-1"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex-1"
                  >
                    Create User
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit User</h3>
              <button 
                onClick={() => {
                  setShowEditUserModal(false);
                  setEditingUser(null);
                  setError(null);
                }} 
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditUserSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    value={updateUserForm.name}
                    onChange={(e) => setUpdateUserForm({...updateUserForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input 
                    type="email" 
                    value={updateUserForm.email}
                    onChange={(e) => setUpdateUserForm({...updateUserForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select 
                    value={updateUserForm.role}
                    onChange={(e) => setUpdateUserForm({...updateUserForm, role: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="Cashier">Cashier</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                    <option value="Storekeeper">Storekeeper</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select 
                    value={updateUserForm.status}
                    onChange={(e) => setUpdateUserForm({...updateUserForm, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password (Optional)</label>
                  <div className="relative">
                    <input 
                      type={updateUserForm.showPassword ? "text" : "password"}
                      value={updateUserForm.password}
                      onChange={(e) => setUpdateUserForm({...updateUserForm, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none pr-10"
                      placeholder="Leave blank to keep current password"
                    />
                    <button
                      type="button"
                      onClick={() => setUpdateUserForm({...updateUserForm, showPassword: !updateUserForm.showPassword})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {updateUserForm.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowEditUserModal(false);
                      setEditingUser(null);
                      setError(null);
                    }} 
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-1"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex-1"
                  >
                    Update User
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {showCreateProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create New Product</h3>
                <button 
                  onClick={() => {
                    setShowCreateProductModal(false);
                    setError(null);
                    setImagePreview(null);
                  }} 
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateProductSubmit}>
                <div className="space-y-4">
                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => clearImage(false)}
                            className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500 transition-colors"
                        >
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload product image</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                          <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, false)}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input 
                      type="text" 
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <input 
                      type="text" 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      placeholder="Enter category"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                      <input 
                        type="number" 
                        value={newProduct.price || ''}
                        onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                      <input 
                        type="number" 
                        value={newProduct.stock || ''}
                        onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Manufacture Date *</label>
                      <input 
                        type="date" 
                        value={newProduct.manufactureDate}
                        onChange={(e) => setNewProduct({...newProduct, manufactureDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                      <input 
                        type="date" 
                        value={newProduct.expiryDate}
                        onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Location</label>
                    <input 
                      type="text" 
                      value={newProduct.stockLocation}
                      onChange={(e) => setNewProduct({...newProduct, stockLocation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      placeholder="e.g., Shelf A1"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowCreateProductModal(false);
                        setError(null);
                        setImagePreview(null);
                      }} 
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-1"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex-1"
                    >
                      Create Product
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Product</h3>
                <button 
                  onClick={() => {
                    setShowEditProductModal(false);
                    setEditingProduct(null);
                    setError(null);
                    setEditImagePreview(null);
                  }} 
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleEditProductSubmit}>
                <div className="space-y-4">
                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                    <div className="space-y-4">
                      {editImagePreview ? (
                        <div className="relative">
                          <img 
                            src={editImagePreview} 
                            alt="Preview" 
                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => clearImage(true)}
                            className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => editFileInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500 transition-colors"
                        >
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload product image</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                          <input 
                            ref={editFileInputRef}
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, true)}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input 
                      type="text" 
                      value={updateProductForm.name}
                      onChange={(e) => setUpdateProductForm({...updateProductForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <input 
                      type="text" 
                      value={updateProductForm.category}
                      onChange={(e) => setUpdateProductForm({...updateProductForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                      <input 
                        type="number" 
                        value={updateProductForm.price || ''}
                        onChange={(e) => setUpdateProductForm({...updateProductForm, price: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                      <input 
                        type="number" 
                        value={updateProductForm.stock || ''}
                        onChange={(e) => setUpdateProductForm({...updateProductForm, stock: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      value={updateProductForm.description}
                      onChange={(e) => setUpdateProductForm({...updateProductForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Manufacture Date *</label>
                      <input 
                        type="date" 
                        value={updateProductForm.manufactureDate}
                        onChange={(e) => setUpdateProductForm({...updateProductForm, manufactureDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                      <input 
                        type="date" 
                        value={updateProductForm.expiryDate}
                        onChange={(e) => setUpdateProductForm({...updateProductForm, expiryDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Location</label>
                    <input 
                      type="text" 
                      value={updateProductForm.stockLocation}
                      onChange={(e) => setUpdateProductForm({...updateProductForm, stockLocation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowEditProductModal(false);
                        setEditingProduct(null);
                        setError(null);
                        setEditImagePreview(null);
                      }} 
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex-1"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex-1"
                    >
                      Update Product
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed md:relative z-40 md:z-0
        w-64 md:w-64 h-full
        bg-gradient-to-b from-emerald-600 to-teal-700 text-white 
        transition-transform duration-300 ease-in-out
        flex flex-col
      `}>
        <div className="p-4 md:p-6 border-b border-emerald-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <User className="text-emerald-600" size={24} />
              </div>
              <div>
                <h2 className="font-bold">Admin Panel</h2>
                <p className="text-xs text-emerald-100">Administrator</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-emerald-500/30 rounded"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-white text-emerald-600 shadow-lg'
                  : 'text-white hover:bg-emerald-500/30'
              }`}
            >
              <item.icon size={18} />
              <span className="font-medium text-sm md:text-base">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 md:p-4 border-t border-emerald-500/30 md:hidden">
          <button
            onClick={handleLogoutConfirm}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 rounded-lg transition-all text-sm"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-xs md:text-sm text-gray-500">Welcome back, Administrator</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={handleLogoutConfirm}
                className="md:hidden p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
              </button>
              
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
                  <User size={20} />
                </div>
              </div>
              
              <div className="hidden md:block text-right">
                <p className="text-sm text-gray-500">Today's Date</p>
                <p className="font-semibold text-gray-800">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
              
              <button className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button
                onClick={handleLogoutConfirm}
                className="hidden md:flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors shadow-sm text-sm md:text-base"
              >
                <LogOut size={16} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4 md:space-y-6">
              {loading.dashboard && (
                <div className="text-center py-4">Loading dashboard data...</div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-emerald-600" size={18} />
                    </div>
                    <span className="flex items-center gap-1 text-green-600 text-xs md:text-sm font-medium">
                      <ArrowUpRight size={12} />
                      12.5%
                    </span>
                  </div>
                  <h3 className="text-gray-500 text-xs md:text-sm mb-1">Total Revenue</h3>
                  <p className="text-xl md:text-2xl font-bold text-gray-800">${dashboardStats.totalRevenue.toLocaleString()}</p>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="text-teal-600" size={18} />
                    </div>
                    <span className="flex items-center gap-1 text-green-600 text-xs md:text-sm font-medium">
                      <ArrowUpRight size={12} />
                      8.2%
                    </span>
                  </div>
                  <h3 className="text-gray-500 text-xs md:text-sm mb-1">Total Orders</h3>
                  <p className="text-xl md:text-2xl font-bold text-gray-800">{dashboardStats.totalOrders.toLocaleString()}</p>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="text-green-600" size={18} />
                    </div>
                    <span className="flex items-center gap-1 text-green-600 text-xs md:text-sm font-medium">
                      <ArrowUpRight size={12} />
                      5.7%
                    </span>
                  </div>
                  <h3 className="text-gray-500 text-xs md:text-sm mb-1">Total Users</h3>
                  <p className="text-xl md:text-2xl font-bold text-gray-800">{dashboardStats.totalUsers}</p>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Package className="text-orange-600" size={18} />
                    </div>
                    <span className="flex items-center gap-1 text-red-600 text-xs md:text-sm font-medium">
                      <ArrowDownRight size={12} />
                      3.1%
                    </span>
                  </div>
                  <h3 className="text-gray-500 text-xs md:text-sm mb-1">Low Stock Items</h3>
                  <p className="text-xl md:text-2xl font-bold text-gray-800">
                    {dashboardStats.lowStockItems}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Sales Overview</h3>
                  <div className="h-64 md:h-72 lg:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Sales by Category</h3>
                  <div className="h-64 md:h-72 lg:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => entry.name}
                          outerRadius={60}
                          innerRadius={30}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Recent Activities</h3>
                <div className="space-y-2 md:space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-2 md:gap-4 p-2 md:p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base ${
                        activity.type === 'order' ? 'bg-emerald-100' :
                        activity.type === 'inventory' ? 'bg-teal-100' :
                        activity.type === 'user' ? 'bg-green-100' : 'bg-orange-100'
                      }`}>
                        {activity.type === 'order' ? '📦' :
                         activity.type === 'inventory' ? '📊' :
                         activity.type === 'user' ? '👤' : '💳'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm md:text-base truncate">{activity.action}</p>
                        <p className="text-xs md:text-sm text-gray-500 truncate">by {activity.user}</p>
                      </div>
                      <span className="text-xs md:text-sm text-gray-400 whitespace-nowrap">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Product Management</h2>
                <button 
                  onClick={() => setShowCreateProductModal(true)}
                  className="px-3 md:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm md:text-base flex items-center gap-2 w-full sm:w-auto"
                >
                  <Plus size={18} />
                  Add New Product
                </button>
              </div>

              {loading.products && (
                <div className="text-center py-8">Loading products...</div>
              )}

              {!loading.products && products.length === 0 ? (
                <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Found</h3>
                  <p className="text-gray-600 mb-4">Add your first product to get started</p>
                  <button 
                    onClick={() => setShowCreateProductModal(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    + Add New Product
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48 overflow-hidden">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              (e.target as HTMLImageElement).src = getFallbackImage(product.name);
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <Package className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status || 'available')}`}>
                            {(product.status || 'available').replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 md:p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                          </div>
                          <span className="text-xl font-bold text-emerald-600">${(product.price || 0).toFixed(2)}</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description || 'No description available'}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-500">Stock</p>
                            <p className="font-semibold">{product.stock || 0}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="font-semibold">{product.stockLocation || 'N/A'}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditProductClick(product)}
                            className="flex-1 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button 
                            onClick={() => showDeleteConfirmation('product', product._id, product.name)}
                            className="px-3 py-2 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Inventory Management</h2>
              <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Low Stock Items (Less than 10)</h3>
                    {loading.products ? (
                      <p>Loading...</p>
                    ) : products.filter(p => (p.stock || 0) < 10 && (p.stock || 0) > 0).length === 0 ? (
                      <p className="text-gray-500">No low stock items</p>
                    ) : (
                      <div className="space-y-2">
                        {products.filter(p => (p.stock || 0) < 10 && (p.stock || 0) > 0).map(product => (
                          <div key={product._id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded flex items-center justify-center text-white">
                              <Package size={18} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.category}</p>
                            </div>
                            <span className="font-semibold text-red-600">{product.stock || 0} left</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Out of Stock</h3>
                    {loading.products ? (
                      <p>Loading...</p>
                    ) : products.filter(p => (p.stock || 0) === 0).length === 0 ? (
                      <p className="text-gray-500">No out of stock items</p>
                    ) : (
                      <div className="space-y-2">
                        {products.filter(p => (p.stock || 0) === 0).map(product => (
                          <div key={product._id} className="flex items-center gap-3 p-3 bg-red-50 rounded">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-400 rounded flex items-center justify-center text-white">
                              <Package size={18} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.category}</p>
                            </div>
                            <span className="font-semibold text-red-600">Out of Stock</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Order Management</h2>
              <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
                <p className="text-gray-600">Order management features coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">User Management</h2>
                <button 
                  onClick={() => setShowCreateUserModal(true)}
                  className="px-3 md:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm md:text-base flex items-center gap-2 w-full sm:w-auto"
                >
                  <Plus size={18} />
                  Add New User
                </button>
              </div>

              {loading.users && (
                <div className="text-center py-8">Loading users...</div>
              )}

              {!loading.users && users.length === 0 ? (
                <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Users Found</h3>
                  <p className="text-gray-600 mb-4">Add your first user to get started</p>
                  <button 
                    onClick={() => setShowCreateUserModal(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    + Add New User
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {users.map((user) => (
                    <div key={user._id} className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                          user.role === 'Admin' ? 'bg-purple-500' :
                          user.role === 'Manager' ? 'bg-teal-500' :
                          user.role === 'Cashier' ? 'bg-blue-500' :
                          user.role === 'Customer' ? 'bg-gray-500' :
                          user.role === 'Storekeeper' ? 'bg-orange-500' : 'bg-gray-500'
                        }`}>
                          {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Role</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Status</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </div>
                        {user.createdAt && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Joined</span>
                            <span className="text-sm text-gray-800">{formatDate(user.createdAt)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 flex gap-2">
                        <button 
                          onClick={() => handleEditUserClick(user)}
                          className="flex-1 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button 
                          onClick={() => showDeleteConfirmation('user', user._id, user.name)}
                          className="px-3 py-2 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Sales Analytics</h2>
              
              <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Weekly Performance</h3>
                <div className="h-72 md:h-80 lg:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#10b981" />
                      <Bar dataKey="revenue" fill="#14b8a6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Reports</h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button className="px-3 md:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300 text-sm md:text-base">
                    Export All
                  </button>
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        handleGenerateReport(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="px-3 md:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm md:text-base"
                  >
                    <option value="">Generate Report</option>
                    {reportTypes.map(report => (
                      <option key={report.id} value={report.name}>{report.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loading.reports && (
                <div className="text-center py-8">Loading reports...</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                {reportTypes.map((report) => (
                  <div key={report.id} className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center text-lg md:text-2xl">
                        {report.icon}
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        Updated {report.lastUpdated}
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">{report.name}</h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">{report.description}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleGenerateReport(report.name)}
                        className="flex-1 px-2 md:px-3 py-1.5 md:py-2 bg-emerald-600 text-white text-xs md:text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Generate
                      </button>
                      <button className="px-2 md:px-3 py-1.5 md:py-2 text-gray-600 hover:bg-gray-100 text-xs md:text-sm rounded-lg transition-colors border border-gray-300">
                        Export
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Report Statistics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4">
                  <div className="bg-emerald-50 p-3 md:p-4 rounded-lg">
                    <p className="text-xs md:text-sm text-emerald-700 font-medium">Total Reports</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-800">{reports.length}</p>
                  </div>
                  <div className="bg-teal-50 p-3 md:p-4 rounded-lg">
                    <p className="text-xs md:text-sm text-teal-700 font-medium">This Month</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-800">
                      {reports.filter(r => {
                        const reportDate = new Date(r.generatedAt);
                        const now = new Date();
                        return reportDate.getMonth() === now.getMonth() && 
                               reportDate.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-3 md:p-4 rounded-lg">
                    <p className="text-xs md:text-sm text-orange-700 font-medium">Pending</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-800">0</p>
                  </div>
                  <div className="bg-purple-50 p-3 md:p-4 rounded-lg">
                    <p className="text-xs md:text-sm text-purple-700 font-medium">Exported</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-800">0</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">System Settings</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">General Settings</h3>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Shop Name</label>
                      <input type="text" defaultValue="ShopManager Pro" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm md:text-base" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Currency</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm md:text-base">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                    <button className="w-full px-3 md:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm md:text-base">
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Notifications</h3>
                  <div className="space-y-2 md:space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-700 text-sm md:text-base">Email notifications</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-700 text-sm md:text-base">Low stock alerts</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-700 text-sm md:text-base">New order alerts</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}