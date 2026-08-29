# Gallery Public Page Design

**Goal:** Add public `/gallery` that shows `showInGallery=true` pictures in an adaptive-height masonry, click opens original with download/share.

**Architecture:** Reuse existing `GET /api/pictures` ( `PictureController` → `findGalleryPictures` ), add `public` route + 4 small components (Page/Masonry/Card/Lightbox) using pure CSS columns; no new backend.

**Tech Stack:** React 19, Vite 7, Tailwind 4, TanStack Query, React Router, Axios, lucide-react. Backend: Spring Boot 4, S3/MinIO `PictureVo`.

**Spec:** This file.

## Global Constraints
- Public gallery: only `showInGallery=true`
- Images keep original aspect ratio, no square crop
- List uses `thumbnailUrl`, lightbox uses `url`
- No new backend endpoint
- Follow home style: black `bg-black`, white type, blue `#0047FF` dot, `0.5px` hairline

---

## 1. Routes & Data

- `GET /gallery` and `/gallery?id=123` (lightbox deep-link)
- Header: add `GALLERY` link.
- `public/src/api/gallery.ts#1`
  ```ts
  export const fetchGallery = (page=0,size=24) => get<PageResponse<PictureVo>>(`/api/pictures?page=${page}&size=${size}&sort=createdAt,desc`)
  ```
- `hooks/useGallery.ts#1` → `useQuery(['gallery',page], ()=>fetchGallery(page))` stale 5m
- `PageResponse<PictureVo>` shape: `{content,total,page,size,totalPages,last}` (mirrors `types/common.ts:34`)

## 2. Components

- `features/gallery/GalleryPage.tsx` — container, pagination state, `useGallery(page)`, empty/loading, renders `GalleryMasonry`, holds `selectedPicture`, syncs `?id=` via `replaceState`, renders `GalleryLightbox` when selected.
- `GalleryMasonry.tsx` — `<div class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 space-y-3">` mapping `pictures` → `GalleryCard`
- `GalleryCard.tsx` — `props {picture,onSelect}`; wrapper `break-inside-avoid mb-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] group`; `img w-full h-auto loading=lazy decoding=async src=thumbnailUrl`; hover overlay `absolute inset-0 bg-black/0 group-hover:bg-black/40 backdrop-blur transition flex center gap-1.5 opacity-0 group-hover:opacity-100` with Copy/Expand buttons; caption `originalFilename` mono `10px` + alt `12px`.
- `GalleryLightbox.tsx` — `fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex center p-4`; image `max-w-[92vw] max-h-[86vh] object-contain`; top bar `Gallery 1/total X`; bottom meta alt/tags/date; actions: Download (`<a download href=url>`), Copy link (`clipboard.writeText(location.href)`), Share (`navigator.share` fallback copy). Keyboard: Esc close, ←/→ nav.

## 3. UI & Tailwind Showcase

- Reuse home tokens: `text-[22px] font-semibold tracking-tight`, `text-[13px] text-white/60`, mono `font-mono`.
- Showcase Tailwind 4: `columns-*`, `break-inside-avoid`, `space-y-3`, `backdrop-blur-xl`, `group-hover`, `rounded-2xl`, `border-white/10`.
- No custom CSS.

## 4. Interaction

- Click card → `setSelected(p)` + `history.replaceState(null,'',\`/gallery?id=${p.id}\`)`
- Deep-link: on mount if `?id=` exists, `fetchPicture(id)` or find in page and open.
- Lightbox nav preloads adjacent `url`.
- Share page: copy `location.origin + /gallery?id=...`

## 5. States & Quality

- Loading: `admin-card` skeleton.
- Empty: centered `ImageIcon` + “No frames yet.”
- Error: react-query retry 1, toast `alert`.
- A11y: `alt` required, buttons `aria-label`, keyboard traps.
- Performance: thumbnails only in grid, originals lazy in lightbox.
- Test: add `test/http/pictures/get_gallery.http` → `GET {{baseUrl}}/api/pictures?page=0&size=24`
