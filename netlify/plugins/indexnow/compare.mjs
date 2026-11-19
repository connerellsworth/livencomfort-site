// Helpers for the IndexNow plugin: find which sitemap pages differ from the live site.
import { readFile } from "node:fs/promises";
import path from "node:path";

export async function readSitemapUrls(publishDir) {
  const xml = await readFile(path.join(publishDir, "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

export function builtFileFor(publishDir, url) {
  const pathname = new URL(url).pathname;
  return path.join(publishDir, pathname.replace(/^\//, ""), "index.html");
}

// Ignore cache busting version bumps on CSS and JS links, so they never count as a change.
export function normalize(html) {
  return html.replace(/(\.(?:css|js))\?v=\d+/g, "$1").trim();
}

export async function findChangedUrls(publishDir) {
  const urls = await readSitemapUrls(publishDir);
  const changed = [];
  const errors = [];
  for (const url of urls) {
    try {
      const built = await readFile(builtFileFor(publishDir, url), "utf8");
      const res = await fetch(`${url}?indexnow=${Date.now()}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (res.status !== 200) {
        errors.push(`${url}: HTTP ${res.status}`);
        changed.push(url);
        continue;
      }
      const live = await res.text();
      if (normalize(live) !== normalize(built)) changed.push(url);
    } catch (err) {
      // A failed read or fetch counts as changed, so the page is still sent.
      errors.push(`${url}: ${err.message}`);
      changed.push(url);
    }
  }
  return { changed, checked: urls.length, errors };
}
