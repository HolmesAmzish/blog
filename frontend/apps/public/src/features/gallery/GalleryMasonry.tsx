import type { PictureVo } from '@/types/picture';
import { GalleryCard } from './GalleryCard';

export function GalleryMasonry({
  pictures,
  onSelect,
}: {
  pictures: PictureVo[];
  onSelect: (p: PictureVo) => void;
}) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">
      {pictures.map((p) => (
        <GalleryCard key={p.id} picture={p} onSelect={onSelect} />
      ))}
    </div>
  );
}
