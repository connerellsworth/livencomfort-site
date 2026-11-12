# Live-n-Comfort

Live-n-Comfort website (livencomfort.com). Static HTML/CSS site for Barbara's gift shop at 143 Main Street, Jeffersonville, VT. Hosting: Netlify (not connected yet). Built by Green Mountain Peaks.

All site content, text and images are copyright Live-n-Comfort and their photographers. All rights reserved; not licensed for reuse.

## How the site is built

- Plain HTML, one stylesheet (`public/css/site.css`) and one small script (`public/js/site.js`). No framework, no build step, no package.json.
- Only the `public` folder is published. README, CLAUDE.md and `docs/` never go live.
- Fonts (Fraunces and Work Sans) are self-hosted in `public/fonts/` under the SIL Open Font License (`public/fonts/OFL.txt`). Nothing loads from Google Fonts.
- `netlify.toml` holds the publish folder, security headers and cache rules. Nothing is connected to Netlify yet.
- `docs/images.md` is the photo plan. `docs/screenshots/` has screenshots of every page at 375, 768 and 1280 px wide.

## Preview locally

Ask Claude Code to "start a local preview of /public". It runs a small local web server from the `public` folder (for example `python3 -m http.server 8080` inside `public`) and gives you a link like http://127.0.0.1:8080/. Pages need to be served this way, not opened as files, because links and fonts use paths that start with `/`.

## Shop switch

The Shop link is in the nav of every page but hidden in v1. To turn it on site-wide, change one line at the very top of `public/css/site.css`:

```css
:root { --shop-display: none; }
```

Change `none` to `inline-flex`. The Shop page itself is at `public/shop/index.html`. It has `noindex` and is left out of the sitemap; remove the `noindex` line and add `/shop/` to `public/sitemap.xml` when it goes live.

## Analytics

Set up in `public/js/site.js`. Trackers load only when the hostname is exactly `livencomfort.com` or `www.livencomfort.com`, so local previews and Netlify preview links send nothing.

- Google Analytics 4: measurement ID `G-F05MV209RF`
- Microsoft Clarity: project ID `zcq5c0q2ff`. Set masking to Strict or Balanced in the Clarity dashboard, because the Privacy page says sensitive text is masked.
- Custom GA4 events (one delegated click listener, sent only if gtag has loaded):
  - `get_directions`: clicks on any element with `data-track="get_directions"` (the Get directions link on Visit)
  - `email_click`: clicks on any `mailto:` link
  - Both send `link_location` set to the page path.
- No cookie banner in v1.

## Where the hours appear

Update every one of these when the hours change:

1. `public/index.html`, Hours column near the bottom of the page (the `<dl class="hours">` list and the confirm note below it)
2. `public/index.html`, JSON-LD in the `<head>` (`openingHoursSpecification`, 24 hour times)
3. `public/visit/index.html`, Hours card (the `<dl class="hours">` list and the confirm note below it)

Current hours: Wednesday to Friday 11 am to 4 pm; Saturday 10 am to 4 pm; Sunday 11 am to 3 pm; Monday and Tuesday closed.

## Placeholders to replace

Text waiting for Barbara (highlighted on the page, `<span class="confirm">`):

| Page | File | Placeholder |
|---|---|---|
| Home | `public/index.html` | [Confirm current and winter hours] |
| Visit | `public/visit/index.html` | [Confirm current and winter hours] |
| Our Story | `public/our-story/index.html` | [Add one or two sentences on what led Barbara to open the shop and where the name came from.] |
| Our Story | `public/our-story/index.html` | [corgi's name] (caption under the second photo) |
| Our Story | `public/our-story/index.html` | [ask permission to quote] (Easy Eco Tips quote) |
| Privacy | `public/privacy/index.html` | [Barbara to review] |

Photo slots (green boxes, each marked with a `<!-- PHOTO: ... -->` comment). Sizes, export settings and how to add them are in `docs/images.md`.

| Page | File | Photo |
|---|---|---|
| Home | `public/index.html` | images/home-hero-interior.jpg |
| Home | `public/index.html` | images/home-handmade.jpg |
| Home | `public/index.html` | images/home-stationery.jpg |
| Home | `public/index.html` | images/home-seasonal.jpg |
| Home | `public/index.html` | images/home-barbara-corgi.jpg |
| Home | `public/index.html` | images/insta-1.jpg to insta-4.jpg |
| Our Story | `public/our-story/index.html` | images/story-storefront.jpg |
| Our Story | `public/our-story/index.html` | images/story-makers.jpg |
| Our Story | `public/our-story/index.html` | images/story-barbara-corgi.jpg |

## Still to add

- `public/images/og-image.jpg` (1200 x 630). Every page already points to it for social sharing, so links shared before it exists will show no image.
- `image` and `telephone` in the Store JSON-LD on the Home page, once there is a shop photo and a confirmed phone number.
- An apple touch icon (`apple-touch-icon.png`, 180 x 180) once there is a logo.
