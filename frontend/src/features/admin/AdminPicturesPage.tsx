/**
 * Admin Pictures Page
 * Picture management with upload and view functionality
 */
import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { deletePicture, updatePictureAlt } from '../../api/picture';
import { usePictures } from '../../hooks/usePictures';
import type { PictureDTO } from '../../types';
import {
  Plus,
  Trash2,
  Edit,
  X,
  Image as ImageIcon,
  Copy,
  Check,
} from 'lucide-react';

/**
 * Admin Pictures Page Component
 */
export function AdminPicturesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingAlt, setEditingAlt] = useState<{ id: number; alt: string } | null>(
    null
  );
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState('');

  // Fetch pictures
  const { data: picturesData, isLoading } = usePictures(page, 12);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deletePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pictures'] });
      setDeleteConfirm(null);
    },
  });

  // Update alt mutation
  const updateAltMutation = useMutation({
    mutationFn: ({ id, alt }: { id: number; alt: string }) =>
      updatePictureAlt(id, alt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pictures'] });
      setEditingAlt(null);
    },
  });

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle upload
  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (uploadAlt) formData.append('alt', uploadAlt);

    // Use fetch directly for multipart/form-data with auth
    const token = localStorage.getItem('auth_token');
    fetch('/api/pictures/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Upload failed');
        return res.json();
      })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['pictures'] });
        setSelectedFile(null);
        setUploadAlt('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        alert('Upload successful!');
      })
      .catch((err) => {
        alert(`Upload failed: ${err.message}`);
      });
  };

  // Copy picture URL to clipboard
  const copyToClipboard = (url: string, id: number) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Get picture URL (original or thumbnail)
  const getPictureUrl = (picture: PictureDTO, thumbnail = false) => {
    // Use thumbnail if available and requested
    if (thumbnail && picture.thumbnailUrl) {
      return picture.thumbnailUrl;
    }

    // Return original picture URL
    if (picture.url.startsWith('http')) {
      return picture.url;
    }
    return `/uploads/${picture.filename}`;
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-black font-mono tracking-tight">
              PICTURES
            </h1>
            <p className="text-gray-500 text-sm font-mono mt-1">
              Manage uploaded pictures
            </p>
          </div>

          {/* Upload Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded">
              <input
                type="text"
                placeholder="Alt text (optional)"
                value={uploadAlt}
                onChange={(e) => setUploadAlt(e.target.value)}
                className="w-32 px-2 text-sm font-mono focus:outline-none"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#0047FF] text-white text-xs font-mono uppercase tracking-wider hover:bg-blue-700 transition-colors rounded"
              >
                <Plus size={14} />
                Upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="mb-6 p-4 bg-white border border-[#0047FF] rounded flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageIcon size={24} className="text-[#0047FF]" />
              <div>
                <p className="text-sm font-mono text-black">{selectedFile.name}</p>
                <p className="text-xs font-mono text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setUploadAlt('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                title="Cancel"
              >
                <X size={16} />
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-[#0047FF] text-white text-xs font-mono uppercase tracking-wider hover:bg-blue-700 transition-colors rounded"
              >
                Confirm Upload
              </button>
            </div>
          </div>
        )}

        {/* Pictures Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500 font-mono text-sm">
            Loading pictures...
          </div>
        ) : picturesData?.content.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-mono text-sm mb-4">No pictures found</p>
            <p className="text-xs font-mono text-gray-400">
              Upload pictures to use in your articles
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {picturesData?.content.map((picture) => (
                <div
                  key={picture.id}
                  className="bg-white border border-gray-200 hover:border-[#0047FF] transition-colors group rounded-lg overflow-hidden"
                >
                  {/* Picture Preview */}
                  <div className="aspect-video bg-gray-50 relative overflow-hidden">
                    <img
                      src={getPictureUrl(picture, true)}
                      alt={picture.alt || 'Picture'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23e5e7eb" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpolyline points="21 15 16 10 5 21"/%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => copyToClipboard(getPictureUrl(picture, false), picture.id as number)}
                        className="p-2 bg-white bg-opacity-90 rounded-full text-gray-700 hover:text-[#0047FF] transition-colors"
                        title="Copy URL"
                      >
                        {copiedId === picture.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                      <button
                        onClick={() => setEditingAlt({ id: picture.id as number, alt: picture.alt || '' })}
                        className="p-2 bg-white bg-opacity-90 rounded-full text-gray-700 hover:text-[#0047FF] transition-colors"
                        title="Edit Alt"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(picture.id)}
                        className="p-2 bg-white bg-opacity-90 rounded-full text-gray-700 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Picture Info */}
                  <div className="p-3">
                    <p className="text-xs font-mono text-gray-500 truncate mb-2" title={picture.originalFilename}>
                      {picture.originalFilename}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-400">
                        {(picture.size / 1024).toFixed(0)} KB
                      </span>
                      <span className="text-[10px] font-mono text-gray-300">
                        {picture.mimeType.split('/')[1].toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {picturesData && picturesData.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-500">
                    Page {picturesData.page + 1} of {picturesData.totalPages}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {picturesData.total} pictures
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-3 py-1.5 text-xs font-mono border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(picturesData.totalPages - 1, p + 1))}
                    disabled={page >= picturesData.totalPages - 1}
                    className="px-3 py-1.5 text-xs font-mono border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Alt Text Modal */}
      {editingAlt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-full max-w-md border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-mono font-bold text-black">
                EDIT ALTERNATIVE TEXT
              </h2>
              <button
                onClick={() => setEditingAlt(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <p className="text-xs font-mono text-gray-500 mb-2">
              Enter alt text for accessibility (optional)
            </p>
            <textarea
              value={editingAlt.alt}
              onChange={(e) =>
                setEditingAlt({ ...editingAlt, alt: e.target.value })
              }
              rows={3}
              className="w-full border border-gray-200 px-3 py-2 text-sm font-mono focus:border-[#0047FF] focus:outline-none resize-none mb-4"
              placeholder="Describe this picture..."
            />

            <div className="flex gap-3">
              <button
                onClick={() => setEditingAlt(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 text-xs font-mono uppercase tracking-wider hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updateAltMutation.mutate({ id: editingAlt.id, alt: editingAlt.alt })
                }
                disabled={updateAltMutation.isPending}
                className="flex-1 px-4 py-2 bg-[#0047FF] text-white text-xs font-mono uppercase tracking-wider hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {updateAltMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-full max-w-sm border border-gray-200 rounded-lg">
            <h2 className="text-lg font-mono font-bold text-black mb-4">
              DELETE PICTURE
            </h2>
            <p className="text-sm font-mono text-gray-600 mb-6">
              Are you sure you want to delete this picture? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 text-xs font-mono uppercase tracking-wider hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-500 text-white text-xs font-mono uppercase tracking-wider hover:bg-red-600 transition-colors disabled:opacity-50"
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
