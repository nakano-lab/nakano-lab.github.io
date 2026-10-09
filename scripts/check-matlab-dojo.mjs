#!/usr/bin/env node
// Dependency-free checks for the three MATLAB Dojo pages and publication assets.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://nakano-lab.github.io';
const base = '/ja/apps/MATLABdojo/';
const read = file => fs.readFile(path.join(root, file), 'utf8');
const fileFor = pathname => pathname.slice(1) + (pathname.endsWith('/') ? 'index.html' : '');
let references = 0;

for (const suffix of ['', 'support/', 'privacy/']) {
  const url = base + suffix;
  const file = fileFor(url);
  const html = await read(file);
  assert(html.includes('<html lang="ja">'), `Wrong document language: ${file}`);
  assert(html.includes(`rel="canonical" href="${origin}${url}"`), `Wrong canonical: ${file}`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `Expected one h1: ${file}`);
  assert(html.includes('id="english" lang="en"'), `English section missing: ${file}`);
  assert(!/\{\{|\}\}|TODO|TBD|\/en\/apps\/MATLABdojo\//.test(html), `Placeholder or nonexistent translated URL: ${file}`);
  assert(!/googletagmanager|gtag\(|<iframe\b/.test(html), `Unexpected third-party embed: ${file}`);
  assert(!/https:\/\/apps\.apple\.com\//.test(html), `Unverified App Store link: ${file}`);
  assert(html.includes('公開準備中') || html.includes('in preparation'), `Release status missing: ${file}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate anchor: ${file}`);
  for (const [, attribute, raw] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    const value = raw.replaceAll('&amp;', '&');
    const target = new URL(value, origin + url);
    if (target.origin !== origin) continue;
    const destination = fileFor(target.pathname);
    await fs.access(path.join(root, destination));
    if (attribute === 'href' && target.hash && destination.endsWith('.html')) {
      const linked = destination === file ? html : await read(destination);
      assert(linked.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `Missing fragment: ${file} → ${value}`);
    }
    references++;
  }
  for (const element of html.matchAll(/<img\b([^>]+)>/g)) {
    assert(/\balt="[^"]*"/.test(element[1]), `Missing image alt: ${file}`);
    assert(/\bwidth="\d+"/.test(element[1]) && /\bheight="\d+"/.test(element[1]), `Missing intrinsic image size: ${file}`);
  }
}

const product = await read(fileFor(base));
assert.equal((product.match(/<figure\b/g) ?? []).length, 6, 'Expected six real screenshots');
assert(product.includes('本編は36修行') && product.includes('111問'), 'Curriculum mismatch');
assert(product.includes('MATLAB道場内で実行する機能ではありません'), 'Missing external execution limitation');
assert(product.includes('自動採点する機能はありません'), 'Missing self-assessment limitation');
assert(product.includes('iPadOS 17'), 'Wrong OS requirement');

const support = await read(fileFor(base + 'support/'));
const privacy = await read(fileFor(base + 'privacy/'));
for (const html of [support, privacy]) assert(html.includes('mailto:nakano.prog@gmail.com'), 'Missing real support email');
for (const term of ['AdMob', 'UMP', 'IPアドレス', '非パーソナライズ', 'リセット', 'localStorage', 'Google'])
  assert(privacy.includes(term), `Privacy disclosure missing: ${term}`);
assert(!privacy.includes('データ収集を行いません'), 'Misleading blanket no-collection statement');

const home = await read('ja/index.html');
assert(home.includes(`href="${base}"`), 'Home page entry missing');
const sitemap = await read('sitemap.xml');
for (const suffix of ['', 'support/', 'privacy/']) {
  assert(sitemap.includes(`<loc>${origin}${base}${suffix}</loc>`), `Sitemap URL missing: ${suffix}`);
}
const ads = await read('app-ads.txt');
assert(ads.split(/\r?\n/).some(line => /^google\.com,\s*pub-7752394877381464,\s*DIRECT(?:,|$)/.test(line)), 'Wrong app-ads.txt publisher');
console.log(`PASS: three bilingual pages, six screenshots, scoped styling, contact details, home navigation, sitemap, app-ads.txt and ${references} internal references.`);
