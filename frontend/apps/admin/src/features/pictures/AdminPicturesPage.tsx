import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePicture, updatePictureAlt } from '../../api/picture';
import { usePictures } from '../../hooks/usePictures';
import type { PictureDTO } from '@/types';
import { Plus, Trash2, Edit, X, Image as ImageIcon, Copy, Check } from 'lucide-react';

export function AdminPicturesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingAlt, setEditingAlt] = useState<{ id: number; alt: string } | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState('');

  const { data: picturesData, isLoading } = usePictures(page, 12);
  const deleteMutation = useMutation({ mutationFn: deletePicture, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['pictures'] }); setDeleteConfirm(null); } });
  const updateAltMutation = useMutation({ mutationFn: ({ id, alt }: { id: number; alt: string }) => updatePictureAlt(id, alt), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['pictures'] }); setEditingAlt(null); } });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('File must be < 10MB.'); return; }
    setSelectedFile(file);
  };
  const handleUpload = () => {
    if (!selectedFile) return;
    const fd = new FormData();
    fd.append('file', selectedFile);
    if (uploadAlt) fd.append('alt', uploadAlt);
    const token = localStorage.getItem('auth_token');
    fetch('/api/pictures/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
      .then((r) => { if (!r.ok) throw new Error('Upload failed'); return r.json(); })
      .then(() => { queryClient.invalidateQueries({ queryKey: ['pictures'] }); setSelectedFile(null); setUploadAlt(''); if (fileInputRef.current) fileInputRef.current.value = ''; })
      .catch((err) => alert(err.message));
  };
  const copyToClipboard = (url: string, id: number) => { navigator.clipboard.writeText(url).then(() => { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }); };
  const getUrl = (p: PictureDTO, thumb = false) => {
    if (thumb && p.thumbnailUrl) return p.thumbnailUrl;
    if (p.url.startsWith('http')) return p.url;
    return `/uploads/${p.filename}`;
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">Pictures</h1>
          <p className="text-[13px] text-[#86868b] mt-1">Upload and manage images for your articles.</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="text" placeholder="Alt text (optional)" value={uploadAlt} onChange={(e) => setUploadAlt(e.target.value)} className="hidden sm:block w-40 px-3 py-2.5 rounded-xl bg-white border border-[#e8e8ed] text-[13px] focus:outline-none focus:border-[#0047FF]/40" />
          <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0047FF] text-white text-[13px] font-medium rounded-full hover:bg-[#0036CC] shadow-sm">
            <Plus size={14} /> Upload
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>
      </div>

      {selectedFile && (
        <div className="admin-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#0047FF]/10 flex items-center justify-center text-[#0047FF]"><ImageIcon size={16} /></div>
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-[#1d1d1f] truncate">{selectedFile.name}</div>
              <div className="text-[12px] text-[#86868b]">{(selectedFile.size / 1024).toFixed(1)} KB · {uploadAlt || 'No alt text'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setSelectedFile(null); setUploadAlt(''); if (fileInputRef.current) fileInputRef.current.value=''; }} className="p-2 rounded-full hover:bg-[#f5f5f7] text-[#86868b]"><X size={14} /></button>
            <button onClick={handleUpload} className="px-4 py-2 rounded-full bg-[#0a0a0a] text-white text-[13px] font-medium hover:bg-black">Confirm</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="admin-card p-10 text-center text-[13px] text-[#86868b]">Loading…</div>
      ) : picturesData?.content.length === 0 ? (
        <div className="admin-card p-10 text-center">
          <ImageIcon size={32} className="mx-auto text-[#d2d2d7] mb-3" />
          <p className="text-[13px] text-[#86868b]">No pictures yet.</p>
          <p className="text-[12px] text-[#a1a1a6] mt-1">Upload to use in articles.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(picturesData?.content as any[]).map((p: any) => (
              <div key={p.id} className="admin-card overflow-hidden group">
                <div className="aspect-[4/3] bg-[#f5f5f7] relative overflow-hidden">
                  <img src={getUrl(p, true)} alt={p.alt || 'Picture'} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23d2d2d7" stroke-width="1.5"%3E%3Crect x="3" y="3" width="18" height="18" rx="4"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpath d="M21 15l-5-5-7 7"/%3E%3C/svg%3E'; }} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                    <button onClick={() => copyToClipboard(getUrl(p,false), p.id)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1d1d1f] hover:text-[#0047FF] shadow-sm">{copiedId===p.id? <Check size={14} className="text-green-600"/>:<Copy size={14}/>}</button>
                    <button onClick={() => setEditingAlt({ id: p.id, alt: p.alt||'' })} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1d1d1f] hover:text-[#0047FF] shadow-sm"><Edit size={14}/></button>
                    <button onClick={() => setDeleteConfirm(p.id)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1d1d1f] hover:text-red-600 shadow-sm"><Trash2 size={14}/></button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-[12px] font-medium text-[#1d1d1f] truncate" title={p.originalFilename}>{p.originalFilename}</div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-[#86868b]"><span>{(p.size/1024).toFixed(0)} KB</span><span className="font-mono">{p.mimeType?.split('/')[1]?.toUpperCase()}</span></div>
                </div>
              </div>
            ))}
          </div>
          {picturesData && picturesData.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#86868b]">{picturesData.page+1} / {picturesData.totalPages} · {picturesData.total} images</span>
              <div className="flex gap-2">
                <button onClick={() => setPage((p)=>Math.max(0,p-1))} disabled={page===0} className="px-3 py-1.5 rounded-full bg-white border border-[#e8e8ed] text-[12px] font-medium disabled:opacity-40">Prev</button>
                <button onClick={() => setPage((p)=>Math.min(picturesData.totalPages-1,p+1))} disabled={page>=picturesData.totalPages-1} className="px-3 py-1.5 rounded-full bg-white border border-[#e8e8ed] text-[12px] font-medium disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </>
      )}

      {editingAlt && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#e8e8ed] shadow-xl">
            <div className="flex items-center justify-between mb-4"><h2 className="text-[15px] font-semibold text-[#1d1d1f]">Edit alt text</h2><button onClick={()=>setEditingAlt(null)} className="p-1.5 rounded-full hover:bg-[#f5f5f7]"><X size={16} className="text-[#86868b]"/></button></div>
            <textarea value={editingAlt.alt} onChange={(e)=>setEditingAlt({...editingAlt, alt:e.target.value})} rows={3} className="w-full bg-[#f5f5f7] border border-transparent focus:bg-white focus:border-[#e8e8ed] rounded-xl px-3 py-2.5 text-[13px] focus:outline-none resize-none" placeholder="Describe image for accessibility…" />
            <div className="flex gap-3 mt-4"><button onClick={()=>setEditingAlt(null)} className="flex-1 py-2.5 rounded-full bg-[#f5f5f7] text-[13px] font-medium">Cancel</button><button onClick={()=>updateAltMutation.mutate({ id: editingAlt.id, alt: editingAlt.alt })} disabled={updateAltMutation.isPending} className="flex-1 py-2.5 rounded-full bg-[#0047FF] text-white text-[13px] font-medium hover:bg-[#0036CC] disabled:opacity-40">{updateAltMutation.isPending?'Saving…':'Save'}</button></div>
          </div>
        </div>
      )}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-[#e8e8ed] shadow-xl">
            <h2 className="text-[15px] font-semibold text-[#1d1d1f] mb-2">Delete picture?</h2>
            <p className="text-[13px] text-[#6e6e73] mb-5">This cannot be undone.</p>
            <div className="flex gap-3"><button onClick={()=>setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-full bg-[#f5f5f7] text-[13px] font-medium">Cancel</button><button onClick={()=>deleteMutation.mutate(deleteConfirm)} disabled={deleteMutation.isPending} className="flex-1 py-2.5 rounded-full bg-red-600 text-white text-[13px] font-medium hover:bg-red-700 disabled:opacity-40">{deleteMutation.isPending?'Deleting…':'Delete'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
