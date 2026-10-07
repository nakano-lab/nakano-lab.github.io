#!/usr/bin/env node
// Static checks for the NeuroPhysMatrix migration; no external dependencies.
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://nakano-lab.github.io';
const read = file => fs.readFile(path.join(root, file), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const indexFor = pathname => pathname.endsWith('/') ? pathname.slice(1) + 'index.html' : pathname.slice(1);
let internalLinks = 0;
for (const lang of ['ja', 'en']) {
  const home = await read(lang + '/index.html');
  assert(home.includes('href="/' + lang + '/apps/NeuroPhysMatrix/"'), 'Home link missing: ' + lang);
  assert(!home.includes('/apps/action-potential-dynamics/'), 'Legacy home link remains');
  for (const suffix of ['', 'support/', 'privacy/']) {
    const target = '/' + lang + '/apps/NeuroPhysMatrix/' + suffix;
    const file = indexFor(target);
    const html = await read(file);
    assert(html.includes('<html lang="' + lang + '">'), 'Wrong language: ' + file);
    assert(html.includes('rel="canonical" href="' + origin + target + '"'), 'Wrong canonical: ' + file);
    assert(html.includes("gtag('config', 'G-WGG0H4V0H0')"), 'Analytics tag missing: ' + file);
    assert(!/心臓リズム|心室筋|Cardiac Rhythm|ventricular|13種|13 channel/.test(html), 'Outdated content: ' + file);
    assert(!html.includes('/apps/action-potential-dynamics/'), 'Legacy internal link: ' + file);
    assert((html.match(/<h1\b/g) ?? []).length === 1, 'Expected one h1: ' + file);
    for (const [, attribute, value] of html.matchAll(/(href|src)="([^"]+)"/g)) {
      const url = new URL(value, origin + target);
      if (url.origin !== origin) continue;
      const destination = indexFor(url.pathname);
      await fs.access(path.join(root, destination));
      if (attribute === 'href' && url.hash && destination.endsWith('.html')) {
        const page = destination === file ? html : await read(destination);
        assert(page.includes('id="' + decodeURIComponent(url.hash.slice(1)) + '"'), 'Missing anchor: ' + value);
      }
      internalLinks++;
    }
    if (!suffix) {
      assert((html.match(/<figure\b/g) ?? []).length === 8, 'Expected six simulations and two Pro screenshots');
      assert(html.includes('14') && html.includes('SK') && html.includes('7.99'), 'Missing current feature information');
    }
    const legacy = await read(lang + '/apps/action-potential-dynamics/' + suffix + 'index.html');
    assert(legacy.includes('content="0;url=' + target + '"'), 'No-JS redirect missing');
    assert(legacy.includes('rel="canonical" href="' + origin + target + '"'), 'Redirect canonical mismatch');
    assert(legacy.includes('noindex,follow'), 'Legacy URL should not be separately indexed');
    const script = legacy.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    assert(script, 'Redirect script missing');
    let redirected;
    vm.runInNewContext(script, { location: { search: '?from=appstore', hash: '#contact', replace: value => { redirected = value; } } });
    assert(redirected === target + '?from=appstore#contact', 'Query or hash lost in redirect');
  }
}
const sitemap = await read('sitemap.xml');
assert(!sitemap.includes('/apps/action-potential-dynamics/'), 'Legacy sitemap entries remain');
for (const lang of ['ja', 'en']) for (const suffix of ['', 'support/', 'privacy/'])
  assert(sitemap.includes('<loc>' + origin + '/' + lang + '/apps/NeuroPhysMatrix/' + suffix + '</loc>'), 'Missing sitemap URL');
console.log('PASS: six new pages, six corresponding redirects, both home links, eight screenshots per language, canonical/hreflang assets and ' + internalLinks + ' internal references.');
