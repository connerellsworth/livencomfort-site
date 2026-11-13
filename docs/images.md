# Photo plan

No real photos are on the site yet. Every photo slot is a green placeholder box with an HTML comment above it naming the future file, for example `<!-- PHOTO: images/home-hero-interior.jpg -->`. Search the HTML for `PHOTO:` to find them all.

The file names below use `.jpg` to match those comments. When you export, save WebP (for example `home-hero-interior.webp`) and use that name in the `<img>` tag.

## Expected files

All files go in `public/images/`.

| File | Page | Slot size on desktop (phone) | Suggested export | Source and permission |
|---|---|---|---|---|
| home-hero-interior.jpg | Home, hero | about 552 x 520 (full width x 360) | 1600 px wide, WebP | Barbara's own photo of the shop interior |
| home-handmade.jpg | Home, "Made by hand" card | about 300 x 260 | 900 px wide, WebP | Shows Katydid Ceramics and Tea with Tae products. Barbara's photo; check the makers are happy to be shown |
| home-stationery.jpg | Home, "Stationery and linens" card | about 300 x 260 | 900 px wide, WebP | Barbara's photo of stationery and organic linens |
| home-seasonal.jpg | Home, "Seasonal treasures" card | about 300 x 260 | 900 px wide, WebP | Barbara's photo of felt mice ornaments and holiday display |
| home-barbara-corgi.jpg | Home, "The shop of my life's dream" | about 552 x 440 (full width x 360) | 1600 px wide, WebP | Barbara and Annie in the shop. Suggested alt text: "Barbara and her corgi Annie in the shop". Barbara must approve her own photo |
| insta-1.jpg to insta-4.jpg | Home, "New in the shop" | square, about 275 x 275 | 900 px square, WebP | Barbara's own Instagram posts, saved as images (no embed). Use only photos she took or has rights to |
| story-storefront.jpg | Our Story, full width | 1160 x 480 (full width x 300) | 1600 px wide, WebP | Storefront on Main Street. Barbara's photo |
| story-makers.jpg | Our Story, left of pair | about 566 x 340 | 900 px wide, WebP | Maker goods (Erin Flett bags). Barbara's photo; check the maker is happy to be shown |
| story-barbara-corgi.jpg | Our Story, right of pair | about 566 x 340 | 900 px wide, WebP | Barbara and Annie. Suggested alt text: "Barbara and her corgi Annie in the shop". Barbara must approve |
| og-image.jpg | Social share image (all pages) | 1200 x 630 | 1200 x 630 JPG, under 300 KB | Usually the storefront or hero photo, cropped. Referenced in every page's Open Graph tags but not created yet |

## How to add a photo later

1. Export as WebP, about 1600 px wide for full width slots and 900 px wide for cards and tiles, under 250 KB each.
2. Save it in `public/images/`.
3. Replace the placeholder `<div class="ph ...">` (or `<span>` for Instagram tiles) and its `PHOTO:` comment with an `<img>`. Keep the size class so the layout does not shift, for example:

```html
<img class="ph ph--card" src="/images/home-stationery.webp" width="900" height="780"
     alt="Lunar calendars and handmade cards on a wooden shelf" loading="lazy">
```

4. Always set `width` and `height` to the real pixel size of the file, and add `object-fit: cover` to `.ph` in `site.css` once the first real image goes in.
5. Write alt text that describes what is in the photo, in plain words. Do not start with "Photo of".
6. Use `loading="lazy"` on every image except the Home hero. The Home hero gets `fetchpriority="high"` and no `loading` attribute, because it is the first thing people see.
7. Remove `aria-hidden="true"`: real images should be read aloud through their alt text. Instagram tiles sit inside one link, so give those `alt=""` and keep the link's hidden text.
