import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../api/category';
import type { CategoryEntity, CategoryUpsertRequest } from '@/types';
import { Language } from '@/types';
import { Plus, Edit, Trash2, FolderTree, X } from 'lucide-react';

type CategoryForm = { nameZh: string; nameEn: string; slug: string; parentId: number | null };

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryEntity | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryForm>({ nameZh: '', nameEn: '', slug: '', parentId: null });

  const { data: categories, isLoading } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const createMutation = useMutation({ mutationFn: createCategory, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); closeModal(); } });
  const deleteMutation = useMutation({ mutationFn: deleteCategory, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); setDeleteConfirm(null); } });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: number; data: CategoryUpsertRequest }) => updateCategory(id, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); closeModal(); } });

  const openCreateModal = () => { setForm({ nameZh: '', nameEn: '', slug: '', parentId: null }); setEditingCategory(null); setIsModalOpen(true); };
  const openEditModal = (c: CategoryEntity) => { setForm({ nameZh: c.names.ZH || '', nameEn: c.names.EN || '', slug: c.slug, parentId: c.parent?.id ?? null }); setEditingCategory(c); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingCategory(null); setForm({ nameZh: '', nameEn: '', slug: '', parentId: null }); };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameZh.trim() && !form.nameEn.trim()) return;
    const names: Record<Language, string> = { ZH: '', EN: '' };
    if (form.nameZh.trim()) names.ZH = form.nameZh;
    if (form.nameEn.trim()) names.EN = form.nameEn;
    const primaryName = form.nameZh.trim() || form.nameEn.trim();
    const data: CategoryUpsertRequest = { names, slug: form.slug || primaryName.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-'), parentId: form.parentId };
    if (editingCategory?.id) updateMutation.mutate({ id: editingCategory.id, data }); else createMutation.mutate(data);
  };
  const handleDelete = (id: number) => deleteMutation.mutate(id);

  const flatten = (list: CategoryEntity[], depth = 0): { category: CategoryEntity; depth: number }[] => {
    const res: { category: CategoryEntity; depth: number }[] = [];
    const roots = list.filter((c) => !c.parent?.id);
    for (const cat of roots) {
      res.push({ category: cat, depth });
      if (cat.id != null) res.push(...descendants(cat.id, list, depth + 1));
    }
    return res;
  };
  const descendants = (pid: number, list: CategoryEntity[], depth: number): { category: CategoryEntity; depth: number }[] => {
    const res: { category: CategoryEntity; depth: number }[] = [];
    const children = list.filter((c) => c.parent?.id === pid);
    for (const ch of children) { res.push({ category: ch, depth }); if (ch.id != null) res.push(...descendants(ch.id, list, depth + 1)); }
    return res;
  };
  const flat = flatten(categories || []);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">Categories</h1>
          <p className="text-[13px] text-[#86868b] mt-1">Organize your articles into structured categories.</p>
        </div>
        <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0047FF] text-white text-[13px] font-medium rounded-full hover:bg-[#0036CC] transition-colors shadow-sm">
          <Plus size={14} /> New category
        </button>
      </div>

      {isLoading ? (
        <div className="admin-card p-10 text-center text-[13px] text-[#86868b]">Loading…</div>
      ) : flat.length === 0 ? (
        <div className="admin-card p-10 text-center">
          <FolderTree size={32} className="mx-auto text-[#d2d2d7] mb-3" />
          <p className="text-[13px] text-[#86868b] mb-3">No categories yet.</p>
          <button onClick={openCreateModal} className="px-4 py-2 rounded-full bg-[#0047FF] text-white text-[13px] font-medium hover:bg-[#0036CC]">Create category</button>
        </div>
      ) : (
        <div className="space-y-2">
          {flat.map(({ category, depth }) => (
            <div key={category.id} className="admin-card px-4 py-4 flex items-center gap-3 group hover:border-[#d2d2d7] dark:hover:border-[#3a3a3c]">
              <div style={{ width: depth * 16 }} className="shrink-0" />
              <div className="w-8 h-8 rounded-lg bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] shrink-0">
                <FolderTree size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-[#1d1d1f]">{category.names.EN || category.names.ZH}</div>
                <div className="text-[12px] text-[#86868b] font-mono">/{category.slug} <span className="ml-2 text-[#a1a1a6]">{category.names.ZH && category.names.EN ? `${category.names.ZH} · ${category.names.EN}` : ''}</span></div>
              </div>
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(category)} className="p-2 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#86868b] hover:text-[#0047FF]"><Edit size={14} /></button>
                <button onClick={() => setDeleteConfirm(category.id as number)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/15 text-[#86868b] hover:text-red-600 dark:hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-[#e8e8ed]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-semibold text-[#1d1d1f]">{editingCategory ? 'Edit category' : 'New category'}</h2>
              <button onClick={closeModal} className="p-1.5 rounded-full hover:bg-[#f5f5f7]"><X size={16} className="text-[#86868b]" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium tracking-wide text-[#86868b] mb-1.5">English name</label>
                <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} className="w-full bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#e8e8ed] rounded-xl px-3 py-2.5 text-[13px] focus:outline-none" placeholder="e.g. Technology" />
              </div>
              <div>
                <label className="block text-[11px] font-medium tracking-wide text-[#86868b] mb-1.5">Chinese name (optional)</label>
                <input value={form.nameZh} onChange={(e) => setForm({ ...form, nameZh: e.target.value })} className="w-full bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#e8e8ed] rounded-xl px-3 py-2.5 text-[13px] focus:outline-none" placeholder="中文名称" />
              </div>
              <div>
                <label className="block text-[11px] font-medium tracking-wide text-[#86868b] mb-1.5">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#e8e8ed] rounded-xl px-3 py-2.5 text-[13px] font-mono focus:outline-none" placeholder="category-slug" />
              </div>
              <div>
                <label className="block text-[11px] font-medium tracking-wide text-[#86868b] mb-1.5">Parent</label>
                <select value={form.parentId || ''} onChange={(e) => setForm({ ...form, parentId: e.target.value ? Number(e.target.value) : null })} className="w-full bg-[#f5f5f7] border border-transparent rounded-xl px-3 py-2.5 text-[13px] focus:outline-none">
                  <option value="">None (top level)</option>
                  {categories?.filter((c) => c.id !== editingCategory?.id).map((c) => <option key={c.id} value={String(c.id)}>{c.names.EN || c.names.ZH}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] text-[13px] font-medium hover:bg-[#e8e8ed]">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending || (!form.nameZh.trim() && !form.nameEn.trim())} className="flex-1 py-2.5 rounded-full bg-[#0047FF] text-white text-[13px] font-medium hover:bg-[#0036CC] disabled:opacity-40"> {createMutation.isPending || updateMutation.isPending ? 'Saving…' : editingCategory ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-[#e8e8ed] shadow-xl">
            <h2 className="text-[15px] font-semibold text-[#1d1d1f] mb-2">Delete category?</h2>
            <p className="text-[13px] text-[#6e6e73] mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-full bg-[#f5f5f7] text-[13px] font-medium">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={deleteMutation.isPending} className="flex-1 py-2.5 rounded-full bg-red-600 text-white text-[13px] font-medium hover:bg-red-700 disabled:opacity-40">{deleteMutation.isPending ? 'Deleting…' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
