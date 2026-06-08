'use client';

import { useState, useEffect, useRef } from 'react';
import { Package, Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, Copy, Archive, X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductStatus, getProducts, createProduct, updateProduct, deleteProduct, duplicateProduct } from '@/lib/local-db';
import { cn } from '@/lib/utils';

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200', className)}>
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
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-50"
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

function ProductForm({ product, onSave, onCancel }: { product?: Product | null; onSave: (data: Partial<Product>) => void; onCancel: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    price: number;
    salePrice: number | null;
    sku: string;
    stockQuantity: number;
    category: string;
    collection: string;
    tags: string;
    status: ProductStatus;
    images: string[];
  }>({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    price: product?.price || 0,
    salePrice: product?.salePrice || null,
    sku: product?.sku || '',
    stockQuantity: product?.stockQuantity || 0,
    category: product?.category || '',
    collection: product?.collection || '',
    tags: product?.tags?.join(', ') || '',
    status: product?.status || ('draft' as ProductStatus),
    images: product?.images || [],
  });

  useEffect(() => {
    if (!product) {
      setFormData({
        name: '',
        slug: '',
        description: '',
        shortDescription: '',
        price: 0,
        salePrice: null,
        sku: '',
        stockQuantity: 0,
        category: '',
        collection: '',
        tags: '',
        status: 'draft' as ProductStatus,
        images: [],
      });
    }
  }, [product]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: product ? formData.slug : generateSlug(name),
    });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, dataUrl],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const images = formData.images.length > 0 ? formData.images : [];
    onSave({
      ...formData,
      tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      images,
      thumbnail: images[0] || null,
    });
  };

  const categories = ['Outerwear', 'Bottoms', 'Tops', 'Dresses', 'Footwear', 'Accessories'];
  const collections = ['Cyber Atelier', 'Mirror Drop', 'Y2K Essentials', 'Limited Drops', 'Summer Collection'];
  const statuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'archived', label: 'Archived' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter product name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="product-slug"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
        <input
          type="text"
          value={formData.shortDescription}
          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="Brief product description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
          placeholder="Full product description"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price (R)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            min="0"
            step="0.01"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price (R)</label>
          <input
            type="number"
            value={formData.salePrice || ''}
            onChange={(e) => setFormData({ ...formData, salePrice: e.target.value ? parseFloat(e.target.value) : null })}
            min="0"
            step="0.01"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="SKU-001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
          <input
            type="number"
            value={formData.stockQuantity}
            onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
            min="0"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Collection</label>
          <select
            value={formData.collection}
            onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="">Select collection</option>
            {collections.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            {statuses.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="tag1, tag2, tag3"
        />
        <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Upload drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
        >
          <Upload className="size-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 5MB each</p>
        </div>

        {/* Add image by URL */}
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Or paste an image URL..."
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            disabled={!imageUrl.trim()}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Add URL
          </button>
        </div>

        {/* Image previews */}
        {formData.images.length > 0 && (
          <div className="mt-4 flex gap-3 flex-wrap">
            {formData.images.map((img: string, i: number) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                <img
                  src={img}
                  alt={`Product image ${i + 1}`}
                  className="size-full object-cover"
                />
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5 uppercase tracking-wider">
                    Thumbnail
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, images: formData.images.filter((_: string, idx: number) => idx !== i) })}
                  className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          Cancel
        </button>
        <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors">
          <Save className="size-4" />
          {product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStatus = !filterStatus || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSave = (data: Partial<Product>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      createProduct(data as any);
    }
    setProducts(getProducts());
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      setProducts(getProducts());
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateProduct(id);
    setProducts(getProducts());
  };

  const handleStatusChange = (id: string, status: string) => {
    updateProduct(id, { status: status as any });
    setProducts(getProducts());
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const statuses = [...new Set(products.map(p => p.status))];

  const getStockStatus = (product: Product) => {
    if (product.stockQuantity === 0) return { label: 'Out of Stock', class: 'bg-red-100 text-red-700' };
    if (product.stockQuantity <= 5) return { label: 'Low Stock', class: 'bg-amber-100 text-amber-700' };
    return { label: 'In Stock', class: 'bg-green-100 text-green-700' };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return { label: 'Published', class: 'bg-green-100 text-green-700' };
      case 'draft':
        return { label: 'Draft', class: 'bg-gray-100 text-gray-700' };
      case 'scheduled':
        return { label: 'Scheduled', class: 'bg-blue-100 text-blue-700' };
      case 'archived':
        return { label: 'Archived', class: 'bg-red-100 text-red-700' };
      default:
        return { label: status, class: 'bg-gray-100 text-gray-700' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          <Plus className="size-4" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="text-xl font-bold text-gray-900">{products.filter(p => p.status === 'published').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Package className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-xl font-bold text-gray-900">{products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Archive className="size-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-xl font-bold text-gray-900">{products.filter(p => p.stockQuantity === 0).length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All Statuses</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product, index) => {
                const stockStatus = getStockStatus(product);
                const statusBadge = getStatusBadge(product.status);
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="size-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.collection || 'No collection'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category || '—'}</td>
                    <td className="px-6 py-4">
                      <div>
                        {product.salePrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">R{product.salePrice}</span>
                            <span className="text-xs text-gray-400 line-through">R{product.price}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-gray-900">R{product.price}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${stockStatus.class}`}>
                        {product.stockQuantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(product.id)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <Package className="size-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
            <button onClick={handleCreate} className="mt-4 text-sm text-black hover:underline">
              Create your first product
            </button>
          </div>
        )}

        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {filteredProducts.length} of {products.length} products</p>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
        title={editingProduct ? 'Edit Product' : 'Create Product'}
      >
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => { setIsModalOpen(false); setEditingProduct(null); }}
        />
      </Modal>

      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title="Product Details"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="size-16 text-gray-400" />
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h3>
                <p className="text-sm text-gray-500">{selectedProduct.description || 'No description'}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">SKU</p>
                <p className="text-sm font-medium">{selectedProduct.sku}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium">{selectedProduct.category || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Collection</p>
                <p className="text-sm font-medium">{selectedProduct.collection || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Stock</p>
                <p className="text-sm font-medium">{selectedProduct.stockQuantity} units</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Price</p>
                <p className="text-sm font-medium">R{selectedProduct.price}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Sale Price</p>
                <p className="text-sm font-medium">{selectedProduct.salePrice ? `R${selectedProduct.salePrice}` : '—'}</p>
              </div>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <select
                value={selectedProduct.status}
                onChange={(e) => {
                  handleStatusChange(selectedProduct.id, e.target.value);
                  setSelectedProduct({ ...selectedProduct, status: e.target.value as any });
                }}
                className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
              <div className="flex gap-2">
                <button onClick={() => { handleEdit(selectedProduct); setSelectedProduct(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                  Edit
                </button>
                <button onClick={() => setSelectedProduct(null)} className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}