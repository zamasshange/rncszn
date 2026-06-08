'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Search, Edit, Trash2, X, Save, Calendar, Percent, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Discount, getDiscounts, createDiscount, updateDiscount, deleteDiscount, DiscountType } from '@/lib/local-db';
import { cn } from '@/lib/utils';

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-6', className)}>
      {children}
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg overflow-y-auto bg-white rounded-2xl shadow-2xl z-50"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DiscountForm({ discount, onSave, onCancel }: { discount?: Discount | null; onSave: (data: Partial<Discount>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    code: discount?.code || '',
    description: discount?.description || '',
    type: discount?.type || 'percentage' as DiscountType,
    value: discount?.value || 0,
    minOrderAmount: discount?.minOrderAmount || null,
    maxUses: discount?.maxUses || null,
    startsAt: discount?.startsAt ? discount.startsAt.split('T')[0] : new Date().toISOString().split('T')[0],
    expiresAt: discount?.expiresAt ? discount.expiresAt.split('T')[0] : '',
    active: discount?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      minOrderAmount: formData.minOrderAmount ? parseFloat(String(formData.minOrderAmount)) : null,
      maxUses: formData.maxUses ? parseInt(String(formData.maxUses)) : null,
      startsAt: new Date(formData.startsAt).toISOString(),
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Discount Code *</label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          required
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="e.g., SUMMER20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="e.g., 20% off summer collection"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as DiscountType })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (R)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Value *</label>
          <input
            type="number"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
            min="0"
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Min Order Amount (R)</label>
          <input
            type="number"
            value={formData.minOrderAmount || ''}
            onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value ? parseFloat(e.target.value) : null })}
            min="0"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Uses</label>
          <input
            type="number"
            value={formData.maxUses || ''}
            onChange={(e) => setFormData({ ...formData, maxUses: e.target.value ? parseInt(e.target.value) : null })}
            min="0"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Unlimited"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={formData.startsAt}
            onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            value={formData.expiresAt}
            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium text-gray-700">Active</p>
          <p className="text-sm text-gray-500">Customers can use this discount</p>
        </div>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, active: !formData.active })}
          className={formData.active ? 'text-green-600' : 'text-gray-400'}
        >
          {formData.active ? <ToggleRight className="size-8" /> : <ToggleLeft className="size-8" />}
        </button>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          Cancel
        </button>
        <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors">
          <Save className="size-4" />
          {discount ? 'Update Discount' : 'Create Discount'}
        </button>
      </div>
    </form>
  );
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  useEffect(() => {
    setDiscounts(getDiscounts());
  }, []);

  const filteredDiscounts = discounts.filter(discount =>
    discount.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discount.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingDiscount(null);
    setIsModalOpen(true);
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setIsModalOpen(true);
  };

  const handleSave = (data: Partial<Discount>) => {
    if (editingDiscount) {
      updateDiscount(editingDiscount.id, data);
    } else {
      createDiscount(data as any);
    }
    setDiscounts(getDiscounts());
    setIsModalOpen(false);
    setEditingDiscount(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this discount?')) {
      deleteDiscount(id);
      setDiscounts(getDiscounts());
    }
  };

  const handleToggleActive = (id: string, currentActive: boolean) => {
    updateDiscount(id, { active: !currentActive });
    setDiscounts(getDiscounts());
  };

  const formatValue = (discount: Discount) => {
    return discount.type === 'percentage' ? `${discount.value}%` : `R${discount.value}`;
  };

  const isExpired = (discount: Discount) => {
    if (!discount.expiresAt) return false;
    return new Date(discount.expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discounts</h1>
          <p className="text-gray-500">Manage promotional codes and discounts</p>
        </div>
        <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          <Plus className="size-4" />
          Create Discount
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Tag className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Discounts</p>
              <p className="text-xl font-bold text-gray-900">{discounts.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Tag className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-xl font-bold text-gray-900">{discounts.filter(d => d.active && !isExpired(d)).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Percent className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Uses</p>
              <p className="text-xl font-bold text-gray-900">{discounts.reduce((sum, d) => sum + d.usedCount, 0)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Calendar className="size-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Expired</p>
              <p className="text-xl font-bold text-gray-900">{discounts.filter(d => isExpired(d)).length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search discounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDiscounts.map((discount, index) => (
                <motion.tr
                  key={discount.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">{discount.code}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{discount.description || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-900">
                      {discount.type === 'percentage' ? <Percent className="size-4" /> : <DollarSign className="size-4" />}
                      {formatValue(discount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {discount.usedCount}{discount.maxUses ? ` / ${discount.maxUses}` : ''}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {discount.expiresAt ? new Date(discount.expiresAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No expiry'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {isExpired(discount) ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Expired</span>
                      ) : discount.active ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Active</span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">Inactive</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleToggleActive(discount.id, discount.active)}
                        className={cn('p-2 rounded-lg transition-colors', discount.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100')}
                        title={discount.active ? 'Deactivate' : 'Activate'}
                      >
                        {discount.active ? <ToggleRight className="size-4" /> : <ToggleLeft className="size-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(discount)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(discount.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDiscounts.length === 0 && (
          <div className="p-12 text-center">
            <Tag className="size-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No discounts found</p>
            <button onClick={handleCreate} className="mt-4 text-sm text-black hover:underline">
              Create your first discount
            </button>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingDiscount(null); }}
        title={editingDiscount ? 'Edit Discount' : 'Create Discount'}
      >
        <DiscountForm
          discount={editingDiscount}
          onSave={handleSave}
          onCancel={() => { setIsModalOpen(false); setEditingDiscount(null); }}
        />
      </Modal>
    </div>
  );
}