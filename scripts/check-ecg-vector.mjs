#!/usr/bin/env node
// Dependency-free checks for the bilingual ECG Vector 1.3 update preview.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://nakano-lab.github.io';
const store = 'https://apps.apple.com/app/ecg-vector/id6798066790';
const read = file => fs.readFile(path.join(root, file), 'utf8');
const fileFor = pathname => pathname.slice(1) + (pathname.endsWith('/') ? 'index.html' : '');
let references = 0;

for (const language of ['ja', 'en']) {
  const base = '/' + language + '/apps/ecg-vector/';
  const home = await read(language + '/index.html');
  assert(home.includes('href="' + base + '"') && home.includes('1.3'), 'Home introduction missing');
  for (const suffix of ['', 'support/', 'privacy/']) {
    const url = base + suffix;
    const file = fileFor(url);
    const html = await read(file);
    assert(html.includes('<html lang="' + language + '">'), 'Wrong language: ' + file);
    assert(html.includes('rel="canonical" href="' + origin + url + '"'), 'Wrong canonical: ' + file);
    for (const lang of ['ja', 'en']) {
      assert(html.includes('hreflang="' + lang + '" href="' + origin + '/' + lang + '/apps/ecg-vector/' + suffix + '"'), 'Wrong hreflang: ' + file);
    }
    assert(html.includes("gtag('config', 'G-WGG0H4V0H0')"), 'Analytics tag missing: ' + file);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, 'Expected one h1: ' + file);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, 'Duplicate anchor: ' + file);
    for (const [, attribute, raw] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
      const target = new URL(raw.replaceAll('&amp;', '&'), origin + url);
      if (target.hostname === 'apps.apple.com') {
        assert.equal(target.href, store, 'Unexpected App Store link: ' + file);
      }
      if (target.origin !== origin) continue;
      const destination = fileFor(target.pathname);
      await fs.access(path.join(root, destination));
      if (attribute === 'href' && target.hash && destination.endsWith('.html')) {
        const page = destination === file ? html : await read(destination);
        assert(page.includes('id="' + decodeURIComponent(target.hash.slice(1)) + '"'), 'Missing anchor: ' + raw);
      }
      references++;
    }
    for (const [, attributes] of html.matchAll(/<img\b([^>]+)>/g)) {
      assert(/\balt="[^"]*"/.test(attributes), 'Missing image alt: ' + file);
      assert(/\bwidth="\d+"/.test(attributes) && /\bheight="\d+"/.test(attributes), 'Missing image dimensions: ' + file);
    }
    if (!suffix) {
      assert.equal((html.match(/class="feature reveal"/g) ?? []).length, 6, 'Expected six workspaces');
      assert.equal((html.match(/<figure\b/g) ?? []).length, 6, 'Expected six real screenshots');
      assert(html.includes('Six workspaces') && html.includes('2D') && html.includes('Luo–Rudy I'), 'Missing updated content');
      assert(html.includes(language === 'ja' ? '次回アップデート1.3' : 'upcoming 1.3'), 'Release preview notice missing');
      assert(!html.includes('Four workspaces') && !html.includes('Education &amp; privacy'), 'Outdated section remains');
      const expectedScreens = ['mac-simulation', 'mac-action-potential', 'ipad-breakdown', 'ipad-ion-ecg', 'iphone-twelve-leads', 'iphone-cardiac-rhythm'];
      for (const screen of expectedScreens) assert(html.includes('/assets/images/ecg-vector/' + language + '/' + screen + '.jpg'), 'Missing screen: ' + screen);
    } else if (suffix === 'support/') {
      for (const id of ['cell', 'rhythm', 'reading', 'display', 'pro']) assert(ids.includes(id), 'Missing support topic: ' + id);
      assert(html.includes('8%') && html.includes('2D') && html.includes('1.3'), 'Support does not match current UI');
      assert(!/Each local arrow|微小双極子と心起電力|slight twisting|小さなねじれ|sinus tachycardia, and the higher|発熱例は洞性頻脈/.test(html), 'Outdated explanation remains');
      assert(html.includes('mailto:nakano.prog@gmail.com'), 'Support email missing');
    }
  }
}

const sitemap = await read('sitemap.xml');
for (const language of ['ja', 'en']) for (const suffix of ['', 'support/', 'privacy/']) {
  const target = origin + '/' + language + '/apps/ecg-vector/' + suffix;
  assert(sitemap.includes('<loc>' + target + '</loc>'), 'Missing sitemap URL');
  if (suffix !== 'privacy/') assert(sitemap.includes('<loc>' + target + '</loc><lastmod>2026-10-09</lastmod>'), 'Stale sitemap date');
}
console.log('PASS: bilingual six-workspace preview, six screenshots per language, support/privacy, App Store links, sitemap, and ' + references + ' internal references.');
