import { useState, useRef } from 'react';
import { usePictures, useUploadPicture, useDeletePicture, useUpdatePictureMetadata } from '../../hooks/usePictures';
import { useTags } from '../../hooks/useTags';
import type { PictureDTO } from '@/types';
import { Plus, Trash2, Edit, X, Image as ImageIcon, Copy, Check } from 'lucide-react';

export function AdminPicturesPage() {
  const [page, setPage] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editing, setEditing] = useState<{ id: number; alt: string; tagIds: number[]; showInGallery: boolean } | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadTagIds, setUploadTagIds] = useState<number[]>([]);
  const [uploadShowInGallery, setUploadShowInGallery] = useState(false);

  const { data: picturesData, isLoading } = usePictures(page, 12);
  const { data: tags = [] } = useTags();
  const uploadMutation = useUploadPicture();
  const deleteMutation = useDeletePicture();
  const updateMutation = useUpdatePictureMetadata();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 16 * 1024 * 1024) {
      alert('File must be < 16MB.');
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate(
      { file: selectedFile, alt: uploadAlt || undefined, tagIds: uploadTagIds, showInGallery: uploadShowInGallery },
      {
        onSuccess: () => {
          setSelectedFile(null);
          setUploadAlt('');
          setUploadTagIds([]);
          setUploadShowInGallery(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
        onError: (err: any) => alert(err?.response?.data || err.message || 'Upload failed'),
      }
    );
  };

  const copyToClipboard = (url: string, id: number) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const getUrl = (p: PictureDTO, thumb = false) => {
    if (thumb && p.thumbnailUrl) return p.thumbnailUrl;
    return p.url;
  };

  const toggleUploadTag = (id: number) => {
    setUploadTagIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleEditTag = (id: number) => {
    if (!editing) return;
    setEditing({
      ...editing,
      tagIds: editing.tagIds.includes(id) ? editing.tagIds.filter((x) => x !== id) : [...editing.tagIds, id],
    });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Pictures</h1>
          <p className="text-[13px] text-muted-foreground mt-1">Upload and manage images for your articles.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-[13px] font-medium rounded-full hover:bg-primary shadow-sm"
          >
            <Plus size={14} /> Upload
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>
      </div>

      {selectedFile && (
        <div className="admin-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ImageIcon size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-foreground truncate">{selectedFile.name}</div>
                <div className="text-[12px] text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB · {uploadAlt || 'No alt text'}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                setUploadAlt('');
                setUploadTagIds([]);
                setUploadShowInGallery(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground"
            >
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Alt text (optional)"
              value={uploadAlt}
              onChange={(e) => setUploadAlt(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-card border border-border text-[13px] focus:outline-none focus:border-primary/40"
            />
            <label className="flex items-center gap-2 text-[13px] text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={uploadShowInGallery}
                onChange={(e) => setUploadShowInGallery(e.target.checked)}
                className="rounded"
              />
              Show in gallery
            </label>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggleUploadTag(t.id!)}
                  className={`px-2.5 py-1 rounded-full text-[12px] border ${
                    uploadTagIds.includes(t.id!)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-card border-border text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={uploadMutation.isPending}
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 disabled:opacity-40"
            >
              {uploadMutation.isPending ? 'Uploading…' : 'Confirm'}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="admin-card p-10 text-center text-[13px] text-muted-foreground">Loading…</div>
      ) : picturesData?.content.length === 0 ? (
        <div className="admin-card p-10 text-center">
          <ImageIcon size={32} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-[13px] text-muted-foreground">No pictures yet.</p>
          <p className="text-[12px] text-muted-foreground mt-1">Upload to use in articles.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(picturesData?.content as PictureDTO[]).map((p) => (
              <div key={p.id} className="admin-card overflow-hidden group">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <img
                    src={getUrl(p, true)}
                    alt={p.alt || 'Picture'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23d2d2d7" stroke-width="1.5"%3E%3Crect x="3" y="3" width="18" height="18" rx="4"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpath d="M21 15l-5-5-7 7"/%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => copyToClipboard(getUrl(p, false), p.id)}
                      className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-foreground hover:text-primary shadow-sm"
                    >
                      {copiedId === p.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={() =>
                        setEditing({ id: p.id, alt: p.alt || '', tagIds: p.tags.map((t) => t.id!), showInGallery: p.showInGallery })
                      }
                      className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-foreground hover:text-primary shadow-sm"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(p.id)}
                      className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-foreground hover:text-red-600 shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {p.showInGallery && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-medium">Gallery</span>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-[12px] font-medium text-foreground truncate" title={p.originalFilename}>
                    {p.originalFilename}
                  </div>
                  {p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {p.tags.map((t) => (
                        <span key={t.id} className="px-1.5 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground">
                          {t.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-1.5 text-[11px] text-muted-foreground">
                    <span>{(p.size / 1024).toFixed(0)} KB</span>
                    <span className="font-mono">{p.mimeType?.split('/')[1]?.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {picturesData && picturesData.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-muted-foreground">
                {picturesData.page + 1} / {picturesData.totalPages} · {picturesData.total} images
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 rounded-full bg-card border border-border text-[12px] font-medium disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(picturesData.totalPages - 1, p + 1))}
                  disabled={page >= picturesData.totalPages - 1}
                  className="px-3 py-1.5 rounded-full bg-card border border-border text-[12px] font-medium disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-semibold text-foreground">Edit picture</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-full hover:bg-muted">
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-medium text-foreground">Alt text</label>
                <textarea
                  value={editing.alt}
                  onChange={(e) => setEditing({ ...editing, alt: e.target.value })}
                  rows={3}
                  className="mt-1 w-full bg-muted border border-transparent focus:bg-card focus:border-border rounded-xl px-3 py-2.5 text-[13px] focus:outline-none resize-none"
                  placeholder="Describe image for accessibility…"
                />
              </div>
              <label className="flex items-center gap-2 text-[13px] text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.showInGallery}
                  onChange={(e) => setEditing({ ...editing, showInGallery: e.target.checked })}
                  className="rounded"
                />
                Show in gallery
              </label>
              {tags.length > 0 && (
                <div>
                  <label className="text-[12px] font-medium text-foreground">Tags</label>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {tags.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => toggleEditTag(t.id!)}
                        className={`px-2.5 py-1 rounded-full text-[12px] border ${
                          editing.tagIds.includes(t.id!)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-card border-border text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-full bg-muted text-[13px] font-medium">
                Cancel
              </button>
              <button
                onClick={() =>
                  updateMutation.mutate(
                    { id: editing.id, data: { alt: editing.alt, tagIds: editing.tagIds, showInGallery: editing.showInGallery } },
                    { onSuccess: () => setEditing(null) }
                  )
                }
                disabled={updateMutation.isPending}
                className="flex-1 py-2.5 rounded-full bg-primary text-white text-[13px] font-medium hover:bg-primary disabled:opacity-40"
              >
                {updateMutation.isPending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border shadow-xl">
            <h2 className="text-[15px] font-semibold text-foreground mb-2">Delete picture?</h2>
            <p className="text-[13px] text-muted-foreground mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-full bg-muted text-[13px] font-medium">
                Cancel
              </button>
              <button
                onClick={() =>
                  deleteMutation.mutate(deleteConfirm, { onSuccess: () => setDeleteConfirm(null) })
                }
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-full bg-red-600 text-white text-[13px] font-medium hover:bg-red-700 disabled:opacity-40"
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
