import React from 'react';
import { Settings, User, Bell, Shield, Store, CreditCard } from 'lucide-react';

export function SettingsPage() {
  const settingsSections = [
    {
      title: 'Store Settings',
      icon: Store,
      items: ['Store Information', 'Business Hours', 'Tax Settings', 'Currency']
    },
    {
      title: 'Account Settings',
      icon: User,
      items: ['Profile Information', 'Change Password', 'Two-Factor Auth', 'Login History']
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: ['Email Notifications', 'SMS Alerts', 'Push Notifications', 'Alert Preferences']
    },
    {
      title: 'Security',
      icon: Shield,
      items: ['User Permissions', 'Access Logs', 'Data Backup', 'Privacy Settings']
    },
    {
      title: 'Billing',
      icon: CreditCard,
      items: ['Subscription Plan', 'Payment Methods', 'Billing History', 'Invoices']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsSections.map((section, index) => (
            <div key={index} className="border rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <section.icon className="text-blue-600" size={20} />
                </div>
                <h3 className="font-semibold text-lg">{section.title}</h3>
              </div>
              
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-700">{item}</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Configure
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Settings */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-6">Quick Settings</h3>
        
        <div className="space-y-4">
          {/* Store Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Store Status</p>
              <p className="text-sm text-gray-500">Set your store as open or closed</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Low Stock Alert */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Low Stock Alerts</p>
              <p className="text-sm text-gray-500">Receive notifications for low stock items</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Sales Report Auto-generation */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Daily Sales Report</p>
              <p className="text-sm text-gray-500">Automatically generate daily reports</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}