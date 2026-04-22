/**
 * Admin Images Page
 * Image management with upload and view functionality
 */
import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { fetchImages, deleteImage, updateImageAlt } from '../../api/image';
import { useImages } from '../../hooks/useImages';
import type { ImageDTO } from '../../types';
import {
  Plus,
  Trash2,
  Edit,
  X,
  Image as ImageIcon,
  Copy,
  Check,
  Download,
} from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';

/**
 * Admin Images Page Component
 */
export function AdminImagesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingAlt, setEditingAlt] = useState<{ id: number; alt: string } | null>(
    null
  );
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState('');

  // Fetch images
  const { data: imagesData, isLoading } = useImages(page, size);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      setDeleteConfirm(null);
    },
  });

  // Update alt mutation
  const updateAltMutation = useMutation({
    mutationFn: ({ id, alt }: { id: number; alt: string }) =>
      updateImageAlt(id, alt),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
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
    fetch('/api/images/upload', {
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
        queryClient.invalidateQueries({ queryKey: ['images'] });
        setSelectedFile(null);
        setUploadAlt('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        alert('Upload successful!');
      })
      .catch((err) => {
        alert(`Upload failed: ${err.message}`);
      });
  };

  // Copy image URL to clipboard
  const copyToClipboard = (url: string, id: number) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Get full image URL
  const getImageUrl = (image: ImageDTO) => {
    // Check if url is already a full path or just a filename
    if (image.url.startsWith('http')) {
      return image.url;
    }
    // Try /uploads first, then /api/images/files
    return `/uploads/${image.filename}`;
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-black font-mono tracking-tight">
              IMAGES
            </h1>
            <p className="text-gray-500 text-sm font-mono mt-1">
              Manage uploaded images
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

        {/* Images Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500 font-mono text-sm">
            Loading images...
          </div>
        ) : imagesData?.content.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-mono text-sm mb-4">No images found</p>
            <p className="text-xs font-mono text-gray-400">
              Upload images to use in your articles
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {imagesData?.content.map((image) => (
                <div
                  key={image.id}
                  className="bg-white border border-gray-200 hover:border-[#0047FF] transition-colors group rounded-lg overflow-hidden"
                >
                  {/* Image Preview */}
                  <div className="aspect-video bg-gray-50 relative overflow-hidden">
                    <img
                      src={getImageUrl(image)}
                      alt={image.alt || 'Image'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23e5e7eb" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpolyline points="21 15 16 10 5 21"/%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => copyToClipboard(getImageUrl(image), image.id as number)}
                        className="p-2 bg-white bg-opacity-90 rounded-full text-gray-700 hover:text-[#0047FF] transition-colors"
                        title="Copy URL"
                      >
                        {copiedId === image.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                      <button
                        onClick={() => setEditingAlt({ id: image.id as number, alt: image.alt || '' })}
                        className="p-2 bg-white bg-opacity-90 rounded-full text-gray-700 hover:text-[#0047FF] transition-colors"
                        title="Edit Alt"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(image.id)}
                        className="p-2 bg-white bg-opacity-90 rounded-full text-gray-700 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="p-3">
                    <p className="text-xs font-mono text-gray-500 truncate mb-2" title={image.originalFilename}>
                      {image.originalFilename}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-400">
                        {(image.size / 1024).toFixed(0)} KB
                      </span>
                      <span className="text-[10px] font-mono text-gray-300">
                        {image.mimeType.split('/')[1].toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {imagesData && imagesData.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-500">
                    Page {imagesData.page + 1} of {imagesData.totalPages}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {imagesData.total} images
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
                    onClick={() => setPage((p) => Math.min(imagesData.totalPages - 1, p + 1))}
                    disabled={page >= imagesData.totalPages - 1}
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
              placeholder="Describe this image..."
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
              DELETE IMAGE
            </h2>
            <p className="text-sm font-mono text-gray-600 mb-6">
              Are you sure you want to delete this image? This action cannot be
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
