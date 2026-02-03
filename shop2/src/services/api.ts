// services/api.ts - Updated to use REAL backend API
const API_URL = 'http://localhost:5000/api';

// Frontend Product Interface (what your AdminDashboard expects)
export interface FrontendProduct {
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

// Backend Product Interface (what your backend returns)
interface BackendProduct {
  _id: string;
  name: string;
  category: string;
  sellingPrice: number;
  quantity: number;
  description: string;
  image?: string;
  manufactureDate: string;
  expiryDate: string;
  stockLocation?: string;
  status?: 'available' | 'out_of_stock' | 'low_stock';
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Cashier' | 'Customer' | 'Storekeeper';
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

// Helper function to compress image (reduces size dramatically)
export const compressImage = async (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper function to determine product status
const getProductStatus = (quantity: number): 'available' | 'out_of_stock' | 'low_stock' => {
  if (quantity === 0) return 'out_of_stock';
  if (quantity < 10) return 'low_stock';
  return 'available';
};

// Transform backend product to frontend format
const transformToFrontendProduct = (backendProduct: BackendProduct): FrontendProduct => {
  return {
    _id: backendProduct._id,
    name: backendProduct.name || '',
    description: backendProduct.description || '',
    price: backendProduct.sellingPrice || 0,
    stock: backendProduct.quantity || 0,
    category: backendProduct.category || '',
    status: backendProduct.status || getProductStatus(backendProduct.quantity || 0),
    image: backendProduct.image || '',
    manufactureDate: backendProduct.manufactureDate,
    expiryDate: backendProduct.expiryDate,
    stockLocation: backendProduct.stockLocation || ''
  };
};

// Transform frontend product to backend format
const transformToBackendProduct = (frontendProduct: any): any => {
  return {
    name: frontendProduct.name || '',
    category: frontendProduct.category || '',
    sellingPrice: Number(frontendProduct.price || frontendProduct.sellingPrice || 0),
    quantity: Number(frontendProduct.stock || frontendProduct.quantity || 0),
    description: frontendProduct.description || '',
    image: frontendProduct.image || '',
    manufactureDate: frontendProduct.manufactureDate || new Date().toISOString().split('T')[0],
    expiryDate: frontendProduct.expiryDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    stockLocation: frontendProduct.stockLocation || ''
  };
};

// Auth storage functions
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
};

export const getUserInfo = (): any => {
  const userStr = localStorage.getItem('userInfo');
  return userStr ? JSON.parse(userStr) : null;
};

export const setUserInfo = (userInfo: any): void => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

export const removeUserInfo = (): void => {
  localStorage.removeItem('userInfo');
};

// REAL Login function - connects to your backend
export const login = async (email: string, password: string): Promise<any> => {
  try {
    console.log('Logging in with:', email);
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    console.log('Login response:', data);
    
    return {
      token: data.token || data.accessToken,
      id: data.user?._id || data.user?.id || data._id,
      name: data.user?.name || data.name || 'User',
      role: data.user?.role || data.role || 'Customer'
    };
    
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};

// REAL Register function - connects to your backend
export const registerCustomer = async (fullName: string, email: string, password: string): Promise<any> => {
  try {
    console.log('Registering user:', fullName, email);
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name: fullName, 
        email, 
        password,
        role: 'Customer' // Default role for registration
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    const data = await response.json();
    console.log('Registration response:', data);
    
    return {
      token: data.token || data.accessToken,
      id: data.user?._id || data.user?.id || data._id,
      name: data.user?.name || data.name || fullName,
      role: data.user?.role || data.role || 'Customer'
    };
    
  } catch (error: any) {
    console.error('Registration error:', error);
    throw error;
  }
};

// REAL Get Current User function
export const getCurrentUser = async (): Promise<any> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        removeAuthToken();
        removeUserInfo();
        throw new Error('Session expired. Please login again.');
      }
      throw new Error('Failed to fetch user data');
    }
    
    const data = await response.json();
    console.log('Current user data:', data);
    
    return {
      id: data._id || data.id,
      name: data.name,
      role: data.role
    };
    
  } catch (error: any) {
    console.error('Error fetching current user:', error.message);
    throw error;
  }
};

// Product API calls
export const getProducts = async (): Promise<FrontendProduct[]> => {
  try {
    const token = getAuthToken();
    
    console.log('Fetching products from:', `${API_URL}/products`);
    const response = await fetch(`${API_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching products:', errorText);
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    const data: BackendProduct[] = await response.json();
    console.log('Products fetched successfully:', data.length);
    
    // Transform backend data to frontend format
    return data.map(transformToFrontendProduct);
    
  } catch (error: any) {
    console.error('Error fetching products:', error.message);
    throw error;
  }
};

// Get products for customer (uses customer/products endpoint)
export const getCustomerProducts = async (): Promise<FrontendProduct[]> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    console.log('Fetching customer products from:', `${API_URL}/customer/products`);
    const response = await fetch(`${API_URL}/customer/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching customer products:', errorText);
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    const data: BackendProduct[] = await response.json();
    console.log('Customer products fetched successfully:', data.length);
    
    // Transform backend data to frontend format
    return data.map(transformToFrontendProduct);
    
  } catch (error: any) {
    console.error('Error fetching customer products:', error.message);
    throw error;
  }
};

export const createProduct = async (productData: any): Promise<FrontendProduct> => {
  try {
    const token = getAuthToken();
    
    // Transform frontend data to backend format
    const backendData = transformToBackendProduct(productData);
    
    // Validate required fields
    if (!backendData.name || !backendData.category || backendData.sellingPrice <= 0) {
      throw new Error('Name, category, and price are required');
    }
    
    console.log('Creating product with data:', {
      ...backendData,
      imageLength: backendData.image?.length || 0
    });
    
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(backendData)
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      throw new Error(`Failed to create product: ${response.status} - ${errorText}`);
    }
    
    const data: BackendProduct = await response.json();
    console.log('Product created successfully:', data._id);
    
    // Transform backend response to frontend format
    return transformToFrontendProduct(data);
    
  } catch (error: any) {
    console.error('Error creating product:', error.message);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: any): Promise<FrontendProduct> => {
  try {
    const token = getAuthToken();
    
    // Transform frontend data to backend format
    const backendData = transformToBackendProduct(productData);
    
    // Validate required fields
    if (!backendData.name || !backendData.category || backendData.sellingPrice <= 0) {
      throw new Error('Name, category, and price are required');
    }
    
    console.log('Updating product with data:', {
      ...backendData,
      imageLength: backendData.image?.length || 0
    });
    
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(backendData)
    });
    
    console.log('Update response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend update error:', errorText);
      throw new Error(`Failed to update product: ${response.status} - ${errorText}`);
    }
    
    const data: BackendProduct = await response.json();
    console.log('Product updated successfully:', data._id);
    
    // Transform backend response to frontend format
    return transformToFrontendProduct(data);
    
  } catch (error: any) {
    console.error('Error updating product:', error.message);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const token = getAuthToken();
    
    console.log('Deleting product:', id);
    
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Delete response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend delete error:', errorText);
      throw new Error(`Failed to delete product: ${response.status} - ${errorText}`);
    }
    
    console.log('Product deleted successfully');
  } catch (error: any) {
    console.error('Error deleting product:', error.message);
    throw error;
  }
};

// User API calls
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const token = getAuthToken();
    
    console.log('Fetching users from:', `${API_URL}/users`);
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching users:', errorText);
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    
    const data: User[] = await response.json();
    console.log('Users fetched successfully:', data.length);
    return data;
    
  } catch (error: any) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
};

export const createStaffUser = async (userData: any): Promise<User> => {
  try {
    const token = getAuthToken();
    
    // Prepare data for backend
    const userDataToSend = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      password: userData.password || 'default123',
      status: userData.status || 'Active'
    };
    
    console.log('Creating user with data:', userDataToSend);
    
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userDataToSend)
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      throw new Error(`Failed to create user: ${response.status} - ${errorText}`);
    }
    
    const data: User = await response.json();
    console.log('User created successfully:', data._id);
    return data;
    
  } catch (error: any) {
    console.error('Error creating user:', error.message);
    throw error;
  }
};

export const updateUser = async (id: string, userData: any): Promise<User> => {
  try {
    const token = getAuthToken();
    
    console.log('Updating user with data:', userData);
    
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    
    console.log('Update response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend update error:', errorText);
      throw new Error(`Failed to update user: ${response.status} - ${errorText}`);
    }
    
    const data: User = await response.json();
    console.log('User updated successfully:', data._id);
    return data;
    
  } catch (error: any) {
    console.error('Error updating user:', error.message);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const token = getAuthToken();
    
    console.log('Deleting user:', id);
    
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Delete response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend delete error:', errorText);
      throw new Error(`Failed to delete user: ${response.status} - ${errorText}`);
    }
    
    console.log('User deleted successfully');
  } catch (error: any) {
    console.error('Error deleting user:', error.message);
    throw error;
  }
};

// Sales API calls (for Customer Dashboard)
export const createSale = async (saleData: any): Promise<any> => {
  try {
    const token = getAuthToken();
    
    console.log('Creating sale:', saleData);
    
    const response = await fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(saleData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      throw new Error(`Failed to create sale: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Sale created successfully:', data);
    return data;
    
  } catch (error: any) {
    console.error('Error creating sale:', error.message);
    throw error;
  }
};

// Customer API calls
export const getCustomerOrders = async (): Promise<any[]> => {
  try {
    const token = getAuthToken();
    
    console.log('Fetching customer orders from:', `${API_URL}/customer/history`);
    
    const response = await fetch(`${API_URL}/customer/history`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching orders:', errorText);
      throw new Error(`Failed to fetch orders: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Customer orders fetched successfully:', data.length);
    return data;
    
  } catch (error: any) {
    console.error('Error fetching customer orders:', error.message);
    throw error;
  }
};

// Payment API call
export const makePayment = async (paymentData: any): Promise<any> => {
  try {
    const token = getAuthToken();
    
    console.log('Making payment with data:', paymentData);
    
    const response = await fetch(`${API_URL}/customer/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend payment error:', errorText);
      throw new Error(`Payment failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Payment successful:', data);
    return data;
    
  } catch (error: any) {
    console.error('Error making payment:', error.message);
    throw error;
  }
};

// Customer profile update
export const updateCustomerProfile = async (profileData: any): Promise<any> => {
  try {
    const token = getAuthToken();
    const userInfo = getUserInfo();
    
    if (!userInfo || !userInfo.id) {
      throw new Error('User information not found');
    }
    
    console.log('Updating customer profile:', profileData);
    
    const response = await fetch(`${API_URL}/users/${userInfo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend profile update error:', errorText);
      throw new Error(`Failed to update profile: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Profile updated successfully:', data);
    
    // Update localStorage with new user info
    if (data.name || data.email) {
      const updatedUserInfo = {
        ...userInfo,
        name: data.name || userInfo.name,
        email: data.email || userInfo.email
      };
      setUserInfo(updatedUserInfo);
    }
    
    return data;
    
  } catch (error: any) {
    console.error('Error updating customer profile:', error.message);
    throw error;
  }
};

// Customer password change
export const changeCustomerPassword = async (passwordData: { currentPassword: string; newPassword: string }): Promise<any> => {
  try {
    const token = getAuthToken();
    const userInfo = getUserInfo();
    
    if (!userInfo || !userInfo.id) {
      throw new Error('User information not found');
    }
    
    console.log('Changing customer password');
    
    const response = await fetch(`${API_URL}/users/${userInfo.id}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend password change error:', errorText);
      throw new Error(`Failed to change password: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Password changed successfully');
    return data;
    
  } catch (error: any) {
    console.error('Error changing password:', error.message);
    throw error;
  }
};

// Helper function for image upload
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Compress image first
    const compressedImage = await compressImage(file);
    
    // If you have a separate image upload endpoint, use it here
    // For now, we'll return the base64 string
    return compressedImage;
    
  } catch (error: any) {
    console.error('Error uploading image:', error.message);
    throw error;
  }
};

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
  if (error.message.includes('401') || error.message.includes('Session expired')) {
    // Clear auth data and redirect to login
    removeAuthToken();
    removeUserInfo();
    return 'Session expired. Please login again.';
  }
  
  if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
    return 'Network error. Please check your internet connection.';
  }
  
  return error.message || 'An unexpected error occurred';
};