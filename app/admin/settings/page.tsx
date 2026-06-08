import { Settings, User, Mail, Bell, Lock, CreditCard, Globe, Palette, Save } from 'lucide-react';

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your store settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-0">
            <nav className="p-2">
              {[
                { icon: User, label: 'Profile', active: false },
                { icon: Mail, label: 'Email Settings', active: false },
                { icon: Bell, label: 'Notifications', active: false },
                { icon: Lock, label: 'Security', active: false },
                { icon: CreditCard, label: 'Payment', active: false },
                { icon: Globe, label: 'Shipping', active: false },
                { icon: Palette, label: 'Appearance', active: false },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      index === 0
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <User className="size-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue="Admin"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue="User"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue="admin@renaissance.co.za"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                <input
                  type="text"
                  defaultValue="RENAISSANCE"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Bell className="size-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'New order notifications', description: 'Get notified when a new order is placed', enabled: true },
                { label: 'Low stock alerts', description: 'Receive alerts when products are running low', enabled: true },
                { label: 'Customer registrations', description: 'Get notified when new customers sign up', enabled: false },
                { label: 'Weekly reports', description: 'Receive weekly analytics summaries', enabled: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <button
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      item.enabled ? 'bg-black' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        item.enabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6">
              <Globe className="size-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Store Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store URL</label>
                <input
                  type="text"
                  defaultValue="rncszn.co.za"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
                  <option>ZAR - South African Rand</option>
                  <option>USD - US Dollar</option>
                  <option>EUR - Euro</option>
                  <option>GBP - British Pound</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
                  <option>Africa/Johannesburg (GMT+2)</option>
                  <option>America/New_York (GMT-5)</option>
                  <option>Europe/London (GMT+0)</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Save className="size-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}