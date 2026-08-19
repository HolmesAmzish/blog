import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTagEntities, createTag, updateTag, deleteTag } from '../../api/tag';
import type { TagVo, TagUpsertRequest } from '@/types';
import { Plus, Edit, Trash2, Tag, X } from 'lucide-react';

type TagForm = { name: string; slug: string };

export function AdminTagsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagVo | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [form, setForm] = useState<TagForm>({ name: '', slug: '' });

  const { data: tags, isLoading } = useQuery({ queryKey: ['tags'], queryFn: fetchTagEntities });
  const createMutation = useMutation({ mutationFn: createTag, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tags'] }); closeModal(); } });
  const updateMutation = useMutation({ mutationFn: (data: TagUpsertRequest) => updateTag(data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tags'] }); closeModal(); } });
  const deleteMutation = useMutation({ mutationFn: deleteTag, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tags'] }); setDeleteConfirm(null); } });

  const openCreateModal = () => { setForm({ name: '', slug: '' }); setEditingTag(null); setIsModalOpen(true); };
  const openEditModal = (tag: TagVo) => { setForm({ name: tag.name, slug: tag.slug }); setEditingTag(tag); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingTag(null); setForm({ name: '', slug: '' }); };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const data: TagUpsertRequest = { id: editingTag?.id ?? null, name: form.name, slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-') };
    if (editingTag?.id) updateMutation.mutate(data); else createMutation.mutate(data);
  };
  const handleDelete = (id: number) => deleteMutation.mutate(id);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">Tags</h1>
          <p className="text-[13px] text-[#86868b] mt-1">Manage article tags.</p>
        </div>
        <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0047FF] text-white text-[13px] font-medium rounded-full hover:bg-[#0036CC] shadow-sm">
          <Plus size={14} /> New tag
        </button>
      </div>

      {isLoading ? (
        <div className="admin-card p-10 text-center text-[13px] text-[#86868b]">Loading…</div>
      ) : tags?.length === 0 ? (
        <div className="admin-card p-10 text-center">
          <Tag size={32} className="mx-auto text-[#d2d2d7] mb-3" />
          <p className="text-[13px] text-[#86868b] mb-3">No tags yet.</p>
          <button onClick={openCreateModal} className="px-4 py-2 rounded-full bg-[#0047FF] text-white text-[13px] font-medium">Create tag</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {tags?.map((tag) => (
            <div key={tag.id} className="admin-card p-4 flex items-center justify-between group hover:border-[#d2d2d7] dark:hover:border-[#3a3a3c]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] shrink-0">
                  <Tag size={14} />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-[#1d1d1f] truncate">{tag.name}</div>
                  <div className="text-[11px] text-[#86868b] font-mono truncate">/{tag.slug}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                <button onClick={() => openEditModal(tag)} className="p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#86868b] hover:text-[#0047FF]"><Edit size={12} /></button>
                <button onClick={() => setDeleteConfirm(tag.id as number)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/15 text-[#86868b] hover:text-red-600 dark:hover:text-red-400"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#e8e8ed] shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-semibold text-[#1d1d1f]">{editingTag ? 'Edit tag' : 'New tag'}</h2>
              <button onClick={closeModal} className="p-1.5 rounded-full hover:bg-[#f5f5f7]"><X size={16} className="text-[#86868b]" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium tracking-wide text-[#86868b] mb-1.5">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#e8e8ed] rounded-xl px-3 py-2.5 text-[13px] focus:outline-none" placeholder="Tag name" />
              </div>
              <div>
                <label className="block text-[11px] font-medium tracking-wide text-[#86868b] mb-1.5">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#e8e8ed] rounded-xl px-3 py-2.5 text-[13px] font-mono focus:outline-none" placeholder="tag-slug" />
                <p className="text-[11px] text-[#a1a1a6] mt-1.5">Auto-generated if empty.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-full bg-[#f5f5f7] text-[13px] font-medium">Cancel</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending || !form.name.trim()} className="flex-1 py-2.5 rounded-full bg-[#0047FF] text-white text-[13px] font-medium hover:bg-[#0036CC] disabled:opacity-40">{createMutation.isPending || updateMutation.isPending ? 'Saving…' : editingTag ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-[#e8e8ed] shadow-xl">
            <h2 className="text-[15px] font-semibold text-[#1d1d1f] mb-2">Delete tag?</h2>
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
