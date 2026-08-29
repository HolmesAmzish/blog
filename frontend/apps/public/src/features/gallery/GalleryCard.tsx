import type { PictureVo } from '@/types/picture';

export function GalleryCard({ picture, onSelect }: { picture: PictureVo; onSelect: (p: PictureVo) => void }) {
  return (
    <div
      onClick={() => onSelect(picture)}
      className="break-inside-avoid mb-3 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.02] group cursor-pointer hover:border-black/20 dark:hover:border-white/20 transition-colors"
    >
      <div className="relative overflow-hidden">
        <img
          src={picture.thumbnailUrl || picture.url}
          alt={picture.alt || picture.originalFilename}
          loading="lazy"
          decoding="async"
          className="w-full h-auto block transition-transform duration-300 group-hover:scale-[1.02]"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23d2d2d7" stroke-width="1.5"%3E%3Crect x="3" y="3" width="18" height="18" rx="4"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpath d="M21 15l-5-5-7 7"/%3E%3C/svg%3E';
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>
      {(picture.alt || picture.tags.length > 0) && (
        <div className="p-2.5">
          {picture.alt && <p className="text-[12px] leading-snug text-black dark:text-white line-clamp-2">{picture.alt}</p>}
          {picture.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {picture.tags.map((t) => (
                <span
                  key={t.id}
                  className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60"
                >
                  #{t.slug}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
