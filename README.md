# Live-n-Comfort

Live-n-Comfort website (livencomfort.com). Static HTML/CSS site for Barbara's gift shop at 143 Main Street, Jeffersonville, VT. Hosting: Netlify (not connected yet). Built by Green Mountain Peaks.

All site content, text and images are copyright Live-n-Comfort and their photographers. All rights reserved; not licensed for reuse.

## How the site is built

- Plain HTML, one stylesheet (`public/css/site.css`) and one small script (`public/js/site.js`). No framework, no build step, no package.json.
- Only the `public` folder is published. README, CLAUDE.md and `docs/` never go live.
- Fonts are self-hosted in `public/fonts/` under the SIL Open Font License (`public/fonts/OFL.txt`). Nothing loads from Google Fonts.
  - Cormorant Garamond (500, 600 and 500 italic): headings, the logo, the footer wordmark and the Our Story quote. Never below weight 500 or 22px. The 500 file is preloaded on every page.
  - Dancing Script (500): the two signature lines only ("Thank you kindly, Barbara" on Home and the closing line on Our Story). Do not use it anywhere else.
  - Work Sans (400, 500, 600): body text, labels, nav and buttons.
- `netlify.toml` holds the publish folder, security headers and cache rules. Nothing is connected to Netlify yet.
- `docs/images.md` is the photo plan. `docs/screenshots/` has screenshots of every page at 375, 768 and 1280 px wide.

## Accessibility

- `public/accessibility/index.html` is the Accessibility page (linked in the footer next to Privacy and listed in the sitemap). Update its "Last updated" line when it changes.
- The site targets WCAG 2.2 AA. Checks run in November 2026: axe (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa) with 0 violations on every page, text spacing override, 200% and 400% zoom, 320 px width, and a keyboard-only tab-through of every page. Lighthouse mobile scored 100 for accessibility and SEO on Home, Our Story and Visit.
- Keyboard focus inside the Google Map can't be styled from this site, so `public/js/site.js` adds a `has-focus` class to the map wrapper to keep a visible focus ring.
- When adding photos, follow the alt text notes in `docs/images.md` and recheck contrast for any text placed over a photo.

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
- Cookie notice and consent: see below.

## Cookie notice and consent

Set up in `public/js/site.js` (no inline script). Analytics are on by default (opt out), except for visitors in the EEA, the UK and Switzerland, where Google Consent Mode keeps analytics cookies off until they choose Accept.

- The visitor's choice is stored in `localStorage` under the key `lnc-analytics`: `accepted`, `declined`, or missing (not chosen yet).
- A Global Privacy Control signal (`navigator.globalPrivacyControl === true`) counts as `declined`, and the notice does not show.
- `declined`: neither Google Analytics nor Clarity loads. Choosing Decline on a page where they already loaded tells both to stop right away.
- Consent Mode defaults run before the gtag `js` and `config` lines: everything denied for the EEA, UK and Switzerland, and analytics granted (ads always denied) everywhere else.
- The notice is a fixed bar at the bottom of the page. It shows on any host when no choice is stored, so it can be tested on livencomfort.netlify.app, but analytics still load only on the production hostnames.
- Every page has a "Cookie settings" button in the footer that reopens the notice.
- If storage is blocked, the choice applies to the current page only.

To reset for testing, run this in the browser console (or clear site data in DevTools under Application, Storage), then reload:

```js
localStorage.removeItem("lnc-analytics")
```

When `site.js` or `site.css` changes, bump the `?v=` number on both links in all 7 pages so browsers fetch the new file (the files are cached for a week).

## IndexNow

IndexNow lets the site tell search engines right away when pages change. Bing and the other IndexNow engines (such as Yandex, Seznam and Naver) use it. Google does not use IndexNow, so keep using the sitemap and Search Console for Google.

- Key: `a8bebeb877a66724486c37e4d22b33d0`
- Key file: `public/a8bebeb877a66724486c37e4d22b33d0.txt`, live at https://livencomfort.com/a8bebeb877a66724486c37e4d22b33d0.txt
- The key file contains only the key (32 characters, no trailing newline). Don't edit it, rename it or add it to the sitemap.
- Pings are sent automatically after each production deploy, for changed pages only, by the local build plugin in `netlify/plugins/indexnow` (registered in `netlify.toml`). Before the new deploy goes live, each built page in the sitemap is compared with the live page, ignoring `?v=` version bumps on CSS and JS links. A page whose live fetch fails counts as changed.
- Local builds, deploy previews and branch deploys skip the ping. The plugin only logs and never fails a deploy.
- Results are in the Netlify deploy log (lines starting with `[indexnow]`) and in Bing Webmaster Tools, IndexNow report.

## Where the hours appear

Update every one of these when the hours change:

1. `public/index.html`, Hours column near the bottom of the page (the `<dl class="hours">` list)
2. `public/index.html`, JSON-LD in the `<head>` (`openingHoursSpecification`, 24 hour times)
3. `public/visit/index.html`, Hours card (the `<dl class="hours">` list; the line below it about holiday and seasonal hours on Instagram and Facebook stays)

4. `public/llms.txt`, Visit section

`public/llms.txt` is a short plain-language summary of the shop for AI assistants and answer engines (live at https://livencomfort.com/llms.txt). It uses only facts already on the site; keep it in step with the hours and address.

Current hours (confirmed by Barbara): Wednesday to Saturday 11 am to 4 pm; Sunday 10 am to 3 pm; Monday and Tuesday closed.

## Placeholders to replace

There are no text placeholders on the live pages right now. New ones go in a `<span class="confirm">` so they are highlighted on the page.

The Easy Eco Tips quote on Our Story was removed pending permission to quote it. It can be restored from commit ca47fc8 (`public/our-story/index.html`, the `<figure class="quote-card">` block).

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

- `public/images/og-image.jpg` (1200 x 630) is an interim text card, built from `docs/og-card/og-card.html` with headless Chrome and sips. Replace it with a storefront photo using the same file name, so no page needs to change.
- `image` in the Store JSON-LD on the Home page: add it only with that real storefront photo, not the text card.
- `telephone` in the Store JSON-LD on the Home page, once there is a confirmed phone number.
- An apple touch icon (`apple-touch-icon.png`, 180 x 180) once there is a logo.
