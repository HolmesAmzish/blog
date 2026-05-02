/**
 * Admin Tags Page
 * Tag management with create, edit, delete functionality
 */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { fetchTagEntities, createTag, updateTag, deleteTag } from '../../api/tag';
import type { TagVo, TagUpsertRequest } from '../../types';
import { Plus, Edit, Trash2, Tag, X } from 'lucide-react';

type TagForm = {
  name: string;
  slug: string;
};

/**
 * Admin Tags Page Component
 */
export function AdminTagsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagVo | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const [form, setForm] = useState<TagForm>({
    name: '',
    slug: '',
  });

  // Fetch tags
  const { data: tags, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTagEntities,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      closeModal();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: TagUpsertRequest) => updateTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      closeModal();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setDeleteConfirm(null);
    },
  });

  const openCreateModal = () => {
    setForm({ name: '', slug: '' });
    setEditingTag(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tag: TagVo) => {
    setForm({
      name: tag.name,
      slug: tag.slug,
    });
    setEditingTag(tag);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
    setForm({ name: '', slug: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const data: TagUpsertRequest = {
      id: editingTag?.id ?? null,
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9一-龥]+/g, '-'),
    };

    if (editingTag?.id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-black font-mono tracking-tight">
              TAGS
            </h1>
            <p className="text-gray-500 text-sm font-mono mt-1">
              Manage article tags
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#0047FF] text-white text-sm font-mono uppercase tracking-wider hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            New Tag
          </button>
        </div>

        {/* Tags Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500 font-mono text-sm">
            Loading tags...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tags?.map((tag) => (
              <div
                key={tag.id}
                className="bg-white border border-gray-200 hover:border-[#0047FF] transition-colors group"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100">
                        <Tag size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-mono font-bold text-black">
                          {tag.name}
                        </h3>
                        <p className="text-xs font-mono text-gray-500">
                          {tag.slug}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(tag)}
                        className="p-1 text-gray-400 hover:text-[#0047FF] transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(tag.id as number)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100"></div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && tags?.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200">
            <Tag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-mono text-sm mb-4">No tags found</p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-[#0047FF] text-white text-sm font-mono uppercase tracking-wider hover:bg-blue-700 transition-colors"
            >
              Create First Tag
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-full max-w-md border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-mono font-bold text-black">
                {editingTag ? 'EDIT TAG' : 'NEW TAG'}
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
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm font-mono focus:border-[#0047FF] focus:outline-none"
                  placeholder="Tag name"
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
                  placeholder="tag-slug"
                />
                <p className="text-xs text-gray-400 mt-1 font-mono">Auto-generated if empty</p>
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
                  disabled={createMutation.isPending || updateMutation.isPending || !form.name.trim()}
                  className="flex-1 px-4 py-2 bg-[#0047FF] text-white text-sm font-mono uppercase tracking-wider hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingTag
                    ? 'Update'
                    : 'Create'}
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
            <h2 className="text-lg font-mono font-bold text-black mb-4">DELETE TAG</h2>
            <p className="text-sm font-mono text-gray-600 mb-6">
              Are you sure you want to delete this tag? This action cannot be undone.
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
