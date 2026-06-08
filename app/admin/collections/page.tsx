'use client';

import { useState, useEffect } from 'react';
import { Layers, Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, Image as ImageIcon, X, Save, Star, StarOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collection, getCollections, createCollection, updateCollection, deleteCollection } from '@/lib/local-db';
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

function CollectionForm({ collection, onSave, onCancel }: { collection?: Collection | null; onSave: (data: Partial<Collection>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: collection?.name || '',
    slug: collection?.slug || '',
    description: collection?.description || '',
    bannerImage: collection?.bannerImage || '',
    featured: collection?.featured || false,
    status: collection?.status || 'draft',
  });

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: collection ? formData.slug : generateSlug(name),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Collection Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="Enter collection name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="collection-slug"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
          placeholder="Collection description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, featured: !formData.featured })}
            className={cn('w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2', formData.featured ? 'bg-amber-100 text-amber-700' : 'bg-gray-50 text-gray-600')}
          >
            {formData.featured ? <Star className="size-4 fill-current" /> : <StarOff className="size-4" />}
            {formData.featured ? 'Featured' : 'Not Featured'}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors cursor-pointer">
          <ImageIcon className="size-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Click to upload banner image</p>
          <p className="text-xs text-gray-400 mt-1">Recommended: 1920x600px</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          Cancel
        </button>
        <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors">
          <Save className="size-4" />
          {collection ? 'Update Collection' : 'Create Collection'}
        </button>
      </div>
    </form>
  );
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  useEffect(() => {
    getCollections().then(setCollections);
  }, []);

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingCollection(null);
    setIsModalOpen(true);
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<Collection>) => {
    if (editingCollection) {
      await updateCollection(editingCollection.id, data);
    } else {
      await createCollection(data as any);
    }
    setCollections(await getCollections());
    setIsModalOpen(false);
    setEditingCollection(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this collection?')) {
      await deleteCollection(id);
      setCollections(await getCollections());
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    await updateCollection(id, { featured: !featured });
    setCollections(await getCollections());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
          <p className="text-gray-500">Organize products into collections</p>
        </div>
        <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          <Plus className="size-4" />
          Create Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Layers className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Collections</p>
              <p className="text-xl font-bold text-gray-900">{collections.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Layers className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Collections</p>
              <p className="text-xl font-bold text-gray-900">{collections.filter(c => c.status === 'active').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Star className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Featured Collections</p>
              <p className="text-xl font-bold text-gray-900">{collections.filter(c => c.featured).length}</p>
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
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredCollections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                {collection.bannerImage ? (
                  <img src={collection.bannerImage} alt={collection.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="size-12 text-gray-300" />
                )}
                {collection.featured && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Star className="size-3 fill-current" /> Featured
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{collection.name}</h3>
                  <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', collection.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700')}>
                    {collection.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{collection.description || 'No description'}</p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleToggleFeatured(collection.id, collection.featured)}
                    className={cn('p-2 rounded-lg transition-colors', collection.featured ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-400 hover:bg-gray-100')}
                  >
                    <Star className={cn('size-4', collection.featured && 'fill-current')} />
                  </button>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(collection)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="size-4" />
                    </button>
                    <button onClick={() => handleDelete(collection.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCollections.length === 0 && (
          <div className="p-12 text-center">
            <Layers className="size-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No collections found</p>
            <button onClick={handleCreate} className="mt-4 text-sm text-black hover:underline">
              Create your first collection
            </button>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCollection(null); }}
        title={editingCollection ? 'Edit Collection' : 'Create Collection'}
      >
        <CollectionForm
          collection={editingCollection}
          onSave={handleSave}
          onCancel={() => { setIsModalOpen(false); setEditingCollection(null); }}
        />
      </Modal>
    </div>
  );
}