import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, Layers, Tag, DollarSign } from 'lucide-react';

export default function Sidebar({ className }: { className?: string }) {
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/collections', label: 'Collections', icon: Layers },
    { href: '/admin/discounts', label: 'Discounts', icon: Tag },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col ${className || ''}`}>
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">RENAISSANCE</h1>
        <p className="text-xs text-gray-500">Admin Dashboard</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to Store
        </Link>
      </div>
    </aside>
  );
}