/**
 * Admin Categories Page
 * Category management with create functionality
 */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { fetchCategoryEntities, createCategory, updateCategory, deleteCategory } from '../../api/category';
import type { CategoryEntity, CategoryUpsertRequest } from '../../types';
import { Language } from '../../types';
import { Plus, Edit, Trash2, FolderTree, X } from 'lucide-react';
import { getLocalizedName } from '../../utils/i18n';
import { useLanguage } from '../../context/LanguageContext';

type CategoryForm = {
  nameZh: string;
  nameEn: string;
  slug: string;
  parentId: number | null;
};

/**
 * Admin Categories Page Component
 */
export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryEntity | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const [form, setForm] = useState<CategoryForm>({
    nameZh: '',
    nameEn: '',
    slug: '',
    parentId: null,
  });

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategoryEntities,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeleteConfirm(null);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: CategoryUpsertRequest) => updateCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
    },
  });

  const openCreateModal = () => {
    setForm({ nameZh: '', nameEn: '', slug: '', parentId: null });
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: CategoryEntity) => {
    setForm({
      nameZh: category.names.ZH || '',
      nameEn: category.names.EN || '',
      slug: category.slug,
      parentId: category.parent?.id ?? null,
    });
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setForm({ nameZh: '', nameEn: '', slug: '', parentId: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameZh.trim() && !form.nameEn.trim()) return;

    const names: Record<Language, string> = { ZH: '', EN: '' };
    if (form.nameZh.trim()) names.ZH = form.nameZh;
    if (form.nameEn.trim()) names.EN = form.nameEn;

    const primaryName = form.nameZh.trim() || form.nameEn.trim();
    const data: CategoryUpsertRequest = {
      id: editingCategory?.id ?? null,
      names,
      slug: form.slug || primaryName.toLowerCase().replace(/[^a-z0-9一-龥]+/g, '-'),
      parentId: form.parentId,
    };

    if (editingCategory?.id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // Build hierarchical categories for display
  const flattenCategories = (
    categoryList: CategoryEntity[],
    depth: number = 0
  ): { category: CategoryEntity; depth: number }[] => {
    const result: { category: CategoryEntity; depth: number }[] = [];

    // Get root categories (no parent)
    const rootCategories = categoryList.filter((c) => !c.parent?.id);
    for (const category of rootCategories) {
      result.push({ category, depth });
      // Recursively get all descendants by passing full list each time
      const descendants = getDescendants(category.id, categoryList, depth + 1);
      result.push(...descendants);
    }

    return result;
  };

  const getDescendants = (
    parentId: number,
    categoryList: CategoryEntity[],
    depth: number
  ): { category: CategoryEntity; depth: number }[] => {
    const result: { category: CategoryEntity; depth: number }[] = [];
    const children = categoryList.filter((c) => c.parent?.id === parentId);
    for (const child of children) {
      result.push({ category: child, depth });
      // Pass full list to find grandchildren
      result.push(...getDescendants(child.id, categoryList, depth + 1));
    }
    return result;
  };

  const allCategoriesFlat = flattenCategories(categories || []);

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-black font-mono tracking-tight">
              CATEGORIES
            </h1>
            <p className="text-gray-500 text-sm font-mono mt-1">
              Manage article categories
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#0047FF] text-white text-sm font-mono uppercase tracking-wider hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            New Category
          </button>
        </div>

        {/* Categories List View */}
            {isLoading ? (
          <div className="text-center py-12 text-gray-500 font-mono text-sm">
            Loading categories...
          </div>
        ) : (
          <div className="space-y-3">
            {allCategoriesFlat.length === 0 ? (
              <div className="text-center py-12 bg-white border border-gray-200">
                <FolderTree size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-mono text-sm mb-4">No categories found</p>
                <button
                  onClick={openCreateModal}
                  className="px-4 py-2 bg-[#0047FF] text-white text-sm font-mono uppercase tracking-wider hover:bg-blue-700 transition-colors"
                >
                  Create First Category
                </button>
              </div>
            ) : (
              allCategoriesFlat.map(({ category, depth }) => (
                <div
                  key={category.id}
                  className="bg-white border border-gray-200 hover:border-[#0047FF] transition-colors flex items-center group"
                >
                  {/* Indentation for hierarchy */}
                  <div className="w-8" style={{ width: `${depth * 24 + 8}px` }} />

                  <div className="p-4 flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FolderTree size={18} className="text-gray-600" />
                      <div>
                        <h3 className="text-sm font-mono font-bold text-black">
                          {getLocalizedName(category.names, language)}
                        </h3>
                        <p className="text-xs font-mono text-gray-500">
                          {category.slug}
                        </p>
                        <p className="text-xs font-mono text-gray-400 mt-1">
                          ZH: {category.names.ZH || '-'} | EN: {category.names.EN || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-2 text-gray-400 hover:text-[#0047FF] transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(category.id as number)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-full max-w-md border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-mono font-bold text-black">
                {editingCategory ? 'EDIT CATEGORY' : 'NEW CATEGORY'}
              </h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Chinese Name (中文)
                </label>
                <input
                  type="text"
                  value={form.nameZh}
                  onChange={(e) => setForm({ ...form, nameZh: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm font-mono focus:border-[#0047FF] focus:outline-none"
                  placeholder="中文名称"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  English Name (English)
                </label>
                <input
                  type="text"
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm font-mono focus:border-[#0047FF] focus:outline-none"
                  placeholder="English name"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm font-mono focus:border-[#0047FF] focus:outline-none"
                  placeholder="category-slug"
                />
                <p className="text-xs text-gray-400 mt-1 font-mono">Auto-generated if empty</p>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                  Parent Category
                </label>
                <select
                  value={form.parentId || ''}
                  onChange={(e) => setForm({ ...form, parentId: e.target.value ? Number(e.target.value) : null })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm font-mono focus:border-[#0047FF] focus:outline-none"
                >
                  <option value="">None (Top Level)</option>
                  {categories?.filter((cat) => cat.id !== editingCategory?.id).map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {getLocalizedName(cat.names, language)}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  Leave empty for top-level category
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 text-sm font-mono uppercase tracking-wider hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending || (!form.nameZh.trim() && !form.nameEn.trim())}
                  className="flex-1 px-4 py-2 bg-[#0047FF] text-white text-sm font-mono uppercase tracking-wider hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-full max-w-sm border border-gray-200">
            <h2 className="text-lg font-mono font-bold text-black mb-4">DELETE CATEGORY</h2>
            <p className="text-sm font-mono text-gray-600 mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 text-sm font-mono uppercase tracking-wider hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-500 text-white text-sm font-mono uppercase tracking-wider hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
