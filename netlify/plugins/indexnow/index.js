// Local Netlify build plugin: after a production deploy, send changed pages to IndexNow.
// Every export is treated by Netlify as a build event, so only the two events are exported.
// It only logs and never throws, so it cannot fail a deploy.
import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { findChangedUrls } from "./compare.mjs";

const HOST = "livencomfort.com";
const KEY = "a8bebeb877a66724486c37e4d22b33d0";
const KEY_URL = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const HANDOFF = path.join(os.tmpdir(), "lnc-indexnow-changed.json");

const log = (msg) => console.log(`[indexnow] ${msg}`);

// New files are built and the old deploy is still live: compare them.
export async function onPostBuild(args) {
  try {
    const { constants } = args;
    if (process.env.CONTEXT !== "production") {
      log(`skipped (context: ${process.env.CONTEXT || "unknown"})`);
      return;
    }
    const { changed, checked, errors } = await findChangedUrls(constants.PUBLISH_DIR);
    await writeFile(HANDOFF, JSON.stringify({ commit: process.env.COMMIT_REF, changed }));
    log(`checked ${checked} pages, ${changed.length} changed`);
    for (const url of changed) log(`changed: ${url}`);
    for (const e of errors) log(`fetch error (counted as changed): ${e}`);
  } catch (err) {
    log(`onPostBuild error, nothing saved: ${err?.message ?? err}`);
  }
}

// The new deploy is live: send the saved list once.
export async function onSuccess(args) {
  try {
    const { constants } = args;
    if (process.env.CONTEXT !== "production" || constants.IS_LOCAL) {
      log(`skipped (context: ${process.env.CONTEXT || "unknown"}, local: ${Boolean(constants.IS_LOCAL)})`);
      return;
    }

    let saved;
    try {
      saved = JSON.parse(await readFile(HANDOFF, "utf8"));
    } catch {
      saved = null;
    }
    if (!saved || saved.commit !== process.env.COMMIT_REF || !Array.isArray(saved.changed)) {
      log("no change list for this commit, nothing sent");
      return;
    }
    const changed = saved.changed;
    if (changed.length === 0) {
      log("nothing changed");
      return;
    }

    const keyRes = await fetch(KEY_URL, { signal: AbortSignal.timeout(10000) });
    const keyBody = (await keyRes.text()).trim();
    if (keyRes.status !== 200 || keyBody !== KEY) {
      log(`key file check failed (HTTP ${keyRes.status}), nothing sent`);
      return;
    }

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_URL, urlList: changed }),
      signal: AbortSignal.timeout(15000),
    });
    const body = (await res.text()).trim();
    const meaning = {
      200: "success",
      202: "success (accepted, key validation pending)",
      400: "bad request",
      403: "key not valid",
      422: "URLs do not match the host or key",
      429: "too many requests",
    }[res.status] || "unexpected status";
    log(`status ${res.status} ${meaning}${body ? `: ${body}` : ""}`);
    for (const url of changed) log(`sent: ${url}`);
  } catch (err) {
    log(`onSuccess error, ping may not have been sent: ${err?.message ?? err}`);
  }
}
