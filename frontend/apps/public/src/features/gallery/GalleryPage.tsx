import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Image as ImageIcon } from 'lucide-react';
import { useGallery } from '../../hooks/useGallery';
import { GalleryMasonry } from './GalleryMasonry';
import { GalleryLightbox } from './GalleryLightbox';
import type { PictureVo } from '@/types/picture';

export function GalleryPage() {
  const [page, setPage] = useState(0);
  const size = 24;
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<PictureVo | null>(null);

  const { data, isLoading, error } = useGallery(page, size);
  const pictures = data?.content ?? [];

  // deep-link ?id=
  useEffect(() => {
    const id = searchParams.get('id');
    if (!id || pictures.length === 0) return;
    const found = pictures.find((p) => String(p.id) === id);
    if (found) setSelected(found);
  }, [searchParams, pictures]);

  const handleSelect = (p: PictureVo) => {
    setSelected(p);
    setSearchParams({ id: String(p.id) }, { replace: true });
  };

  const handleClose = () => {
    setSelected(null);
    const params = new URLSearchParams(searchParams);
    params.delete('id');
    setSearchParams(params, { replace: true });
  };

  const currentIndex = useMemo(
    () => (selected ? pictures.findIndex((p) => p.id === selected.id) : -1),
    [selected, pictures]
  );

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = pictures[currentIndex - 1];
      setSelected(prev);
      setSearchParams({ id: String(prev.id) }, { replace: true });
    }
  };
  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < pictures.length - 1) {
      const next = pictures[currentIndex + 1];
      setSelected(next);
      setSearchParams({ id: String(next.id) }, { replace: true });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b-[0.5px] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-black dark:border-white">
        <div className="mx-auto py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black dark:text-white leading-[0.9]">
            GALLERY<span className="text-[#0047FF]">.</span>
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {data ? (
              <span className="text-[11px] font-mono uppercase tracking-wider text-black dark:text-white">
                {data.total} <span className="text-gray-500 dark:text-gray-400">frames</span>
              </span>
            ) : (
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">Curated frames — showInGallery only</span>
            )}
          </div>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            Adaptive masonry — each frame keeps its original ratio. Click any frame for original, download or share.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="break-inside-avoid mb-3 h-48 rounded-2xl bg-gray-100 dark:bg-white/[0.04] border border-black/5 dark:border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="border-[0.5px] border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 p-6 text-center">
              <p className="text-sm text-red-600 dark:text-red-400 font-mono">ERROR: {(error as Error).message}</p>
            </div>
          ) : pictures.length === 0 ? (
            <div className="border-[0.5px] border-black/10 dark:border-white/10 rounded-2xl p-12 text-center">
              <ImageIcon size={32} className="mx-auto text-black/20 dark:text-white/20 mb-3" />
              <p className="text-sm font-mono text-gray-600 dark:text-gray-400">No frames yet.</p>
              <p className="text-xs font-mono text-gray-400 mt-1">Mark pictures as “Show in gallery” in admin.</p>
            </div>
          ) : (
            <>
              <GalleryMasonry pictures={pictures} onSelect={handleSelect} />
              {data && data.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between border-t-[0.5px] border-gray-200 dark:border-gray-800 pt-6">
                  <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400">
                    {data.page + 1} / {data.totalPages} · {data.total} images
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="px-4 py-1.5 rounded-full border-[0.5px] border-black dark:border-white text-black dark:text-white text-[11px] font-mono uppercase tracking-wider disabled:opacity-30 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
                      disabled={page >= data.totalPages - 1}
                      className="px-4 py-1.5 rounded-full border-[0.5px] border-black dark:border-white text-black dark:text-white text-[11px] font-mono uppercase tracking-wider disabled:opacity-30 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <GalleryLightbox
        picture={selected}
        onClose={handleClose}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex >= 0 && currentIndex < pictures.length - 1}
      />
    </div>
  );
}
