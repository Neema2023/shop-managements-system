import React, { useState } from 'react';
import { Bell, Mail, Shield, CreditCard } from 'lucide-react';

export function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    orderUpdates: true,
    promotions: false,
    securityAlerts: true,
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    currency: 'USD',
    language: 'en',
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', { notifications, preferences });
    // Add API call to save settings here
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Notifications Settings */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              <p className="text-sm text-gray-500">Manage your notification preferences</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-500" />
                <div>
                  <p className="font-medium text-gray-800">Email notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-500" />
                <div>
                  <p className="font-medium text-gray-800">Order updates</p>
                  <p className="text-sm text-gray-500">Order status and tracking</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={notifications.orderUpdates}
                onChange={() => handleNotificationChange('orderUpdates')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <CreditCard size={18} className="text-gray-500" />
                <div>
                  <p className="font-medium text-gray-800">Promotional offers</p>
                  <p className="text-sm text-gray-500">Discounts and special deals</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={notifications.promotions}
                onChange={() => handleNotificationChange('promotions')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-500" />
                <div>
                  <p className="font-medium text-gray-800">Security alerts</p>
                  <p className="text-sm text-gray-500">Account security notifications</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={notifications.securityAlerts}
                onChange={() => handleNotificationChange('securityAlerts')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Preferences Settings */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Preferences</h3>
              <p className="text-sm text-gray-500">Customize your experience</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePreferenceChange('theme', 'light')}
                  className={`px-4 py-3 rounded-lg border transition-colors ${preferences.theme === 'light' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`}
                >
                  Light Mode
                </button>
                <button
                  onClick={() => handlePreferenceChange('theme', 'dark')}
                  className={`px-4 py-3 rounded-lg border transition-colors ${preferences.theme === 'dark' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`}
                >
                  Dark Mode
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={preferences.currency}
                onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}