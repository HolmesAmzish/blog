import { useEffect } from 'react';
import { X, Download, Copy, Share2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { PictureVo } from '@/types/picture';
import { useState } from 'react';

export function GalleryLightbox({
  picture,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  picture: PictureVo | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  useEffect(() => {
    if (picture) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [picture]);

  if (!picture) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(picture.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: picture.alt || picture.originalFilename, url });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur"
      >
        <X size={18} />
      </button>

      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Previous"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white hidden sm:flex items-center justify-center"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Next"
          className="absolute right-4 sm:right-16 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white hidden sm:flex items-center justify-center"
        >
          <ChevronRight size={18} />
        </button>
      )}

      <div className="relative max-w-[92vw] max-h-[86vh] flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <img
          src={picture.url}
          alt={picture.alt || picture.originalFilename}
          className="max-w-[92vw] max-h-[78vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
          decoding="async"
        />
        <div className="w-full max-w-[720px] bg-white dark:bg-zinc-900 rounded-2xl p-4 flex flex-col gap-3">
          {picture.alt && <p className="text-[13px] leading-snug text-black dark:text-white">{picture.alt}</p>}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {picture.tags.map((t) => (
                <span key={t.id} className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                  #{t.slug}
                </span>
              ))}
              <span className="font-mono text-[10px] text-black/40 dark:text-white/40">
                {new Date(picture.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <a
                href={picture.url}
                download={picture.originalFilename}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[12px] font-medium hover:bg-[#0047FF] dark:hover:bg-[#0047FF] dark:hover:text-white transition-colors"
              >
                <Download size={14} /> Download
              </a>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-[12px] font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />} Copy URL
              </button>
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10"
                aria-label="Share"
              >
                <Share2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
