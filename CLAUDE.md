# Standing rules for this project

- This is a static HTML/CSS site (no framework) for Live-n-Comfort, a gift shop in Jeffersonville, VT owned by Barbara.
- Never deploy, publish, or connect this repo to Netlify unless Conner explicitly says to deploy in that session. Pushing to GitHub is allowed only when Conner asks.
- This repo is PUBLIC: never commit secrets, passwords, verification codes, API keys, private email addresses or customer data.
- Never use em dashes or en dashes in site copy, code comments or commit messages.
- Site copy follows Barbara's warm, personal voice. Do not invent facts about the shop; leave clearly marked placeholders for anything unconfirmed.
- Run all terminal commands yourself; never ask Conner to type commands.
- Do not add a LICENSE file.

## Consent (do not break)

- The visitor's analytics choice lives in `localStorage` under the key `lnc-analytics` ("accepted" or "declined"). Global Privacy Control counts as "declined".
- In `public/js/site.js` the two `gtag('consent','default',...)` calls must run before `gtag('js')` and `gtag('config')`.
- Keep the production hostname gate: analytics load only on livencomfort.com and www.livencomfort.com.
- Keep the event names `get_directions` and `email_click` and their `link_location` parameter.
- Bump the `?v=` query on the `site.js` and `site.css` links in all 7 pages whenever either file changes.
