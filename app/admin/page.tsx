'use client';

import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDashboardStats, Order } from '@/lib/local-db';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-6', className)}>
      {children}
    </div>
  );
}

function StatCard({ title, value, change, trend, icon: Icon, delay = 0 }: { title: string; value: string | number; change?: string; trend?: 'up' | 'down'; icon: React.ElementType; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className={cn('text-sm mt-2 flex items-center gap-1', trend === 'up' ? 'text-green-600' : 'text-red-600')}>
                <TrendingUp className={cn('size-4', trend === 'down' && 'rotate-180')} />
                {change}
              </p>
            )}
          </div>
          <div className="p-3 bg-gray-100 rounded-lg">
            <Icon className="size-6 text-gray-700" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-blue-100 text-blue-700',
      processing: 'bg-purple-100 text-purple-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
        </div>
        <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={stats.products.total} change="+12%" trend="up" icon={Package} delay={0} />
        <StatCard title="Total Orders" value={stats.orders.total} change="+8%" trend="up" icon={ShoppingCart} delay={0.1} />
        <StatCard title="Total Customers" value={stats.customers.total} change="+15%" trend="up" icon={Users} delay={0.2} />
        <StatCard title="Revenue (Month)" value={formatCurrency(stats.revenue.thisMonth)} change="+23%" trend="up" icon={DollarSign} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-black hover:underline flex items-center gap-1">
                View all <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentOrders.map((order: Order, index: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(order.total)}</p>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="size-5 text-amber-500" />
                Stock Alerts
              </h2>
              <Link href="/admin/products" className="text-sm text-black hover:underline flex items-center gap-1">
                Manage products <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {stats.products.outOfStock > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-4 bg-red-50 rounded-lg border border-red-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Out of Stock</p>
                      <p className="text-sm text-red-600">{stats.products.outOfStock} products need restocking</p>
                    </div>
                    <span className="text-2xl font-bold text-red-600">{stats.products.outOfStock}</span>
                  </div>
                </motion.div>
              )}
              {stats.products.lowStock > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="p-4 bg-amber-50 rounded-lg border border-amber-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Low Stock</p>
                      <p className="text-sm text-amber-600">{stats.products.lowStock} products running low</p>
                    </div>
                    <span className="text-2xl font-bold text-amber-600">{stats.products.lowStock}</span>
                  </div>
                </motion.div>
              )}
              {stats.products.outOfStock === 0 && stats.products.lowStock === 0 && (
                <div className="p-8 text-center">
                  <Package className="size-12 text-green-300 mx-auto mb-4" />
                  <p className="text-gray-500">All products are well stocked!</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Add Product', href: '/admin/products', icon: Package },
              { label: 'View Orders', href: '/admin/orders', icon: ShoppingCart },
              { label: 'Customers', href: '/admin/customers', icon: Users },
              { label: 'Analytics', href: '/admin/analytics', icon: DollarSign },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Icon className="size-6 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}