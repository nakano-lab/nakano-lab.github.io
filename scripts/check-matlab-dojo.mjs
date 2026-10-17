#!/usr/bin/env node
// Dependency-free checks for the six MATLAB Dojo pages and publication assets.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://nakano-lab.github.io';
const base = '/ja/apps/MATLABdojo/';
const bases = [base, '/en/apps/MATLABdojo/'];
const read = file => fs.readFile(path.join(root, file), 'utf8');
const fileFor = pathname => pathname.slice(1) + (pathname.endsWith('/') ? 'index.html' : '');
let references = 0;

for (const languageBase of bases) {
for (const suffix of ['', 'support/', 'privacy/']) {
  const url = languageBase + suffix;
  const language = languageBase === base ? 'ja' : 'en';
  const file = fileFor(url);
  const html = await read(file);
  assert(html.includes(`<html lang="${language}">`), `Wrong document language: ${file}`);
  assert(html.includes('<meta name="robots" content="noindex, follow">'), `Review page must remain unindexed: ${file}`);
  assert(html.includes(`rel="canonical" href="${origin}${url}"`), `Wrong canonical: ${file}`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `Expected one h1: ${file}`);
  for (const alternate of ['ja', 'en']) {
    const alternateURL = `/${alternate}/apps/MATLABdojo/${suffix}`;
    assert(html.includes(`hreflang="${alternate}" href="${origin}${alternateURL}"`), `Missing language alternate: ${file}`);
    if (alternate !== language) assert(html.includes(`class="language-link" href="${alternateURL}"`), `Missing language switch: ${file}`);
  }
  assert(!/\{\{|\}\}|TODO|TBD/.test(html), `Placeholder: ${file}`);
  assert(!/googletagmanager|gtag\(|<iframe\b/.test(html), `Unexpected third-party embed: ${file}`);
  assert(!/https:\/\/apps\.apple\.com\//.test(html), `Unverified App Store link: ${file}`);
  assert(html.includes('公開準備中') || html.includes('in preparation'), `Release status missing: ${file}`);
  assert(html.includes(language === 'ja' ? 'プログラミング道場 for MATLAB®' : 'Programming Dojo for MATLAB®'), `App name missing: ${file}`);
  assert(html.includes('MATLAB and Simulink are registered trademarks of The MathWorks, Inc. See mathworks.com/trademarks for a list of additional trademarks.'), `Trademark notice missing: ${file}`);
  assert(html.includes('MATLAB® Mobile™') && html.includes('MATLAB® Online™'), `Execution environments missing: ${file}`);
  assert(html.includes(language === 'ja' ? '有効なMATLABライセンス' : 'valid MATLAB license'), `License notice missing: ${file}`);
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
}

const product = await read(fileFor(base));
assert.equal((product.match(/<figure\b/g) ?? []).length, 6, 'Expected six real screenshots');
assert(product.includes('本編は36修行') && product.includes('111問'), 'Curriculum mismatch');
assert(product.includes('プログラミング道場 for MATLAB®内で実行する機能ではありません'), 'Missing external execution limitation');
assert(product.includes('自動採点する機能はありません'), 'Missing self-assessment limitation');
assert(product.includes('iPadOS 17'), 'Wrong OS requirement');
const englishProduct = await read(fileFor(bases[1]));
assert.equal((englishProduct.match(/<figure\b/g) ?? []).length, 6, 'Expected six screenshots on the English page');
for (const term of ['36 core lessons', '111 questions', 'Japanese interface', 'does not automatically grade', 'iPadOS 17'])
  assert(englishProduct.includes(term), `English product disclosure missing: ${term}`);
for (const suffix of ['support/', 'privacy/']) {
  const englishDocument = await read(fileFor(bases[1] + suffix));
  assert(englishDocument.includes('mailto:nakano.prog@gmail.com'), `Missing English contact: ${suffix}`);
}
const englishPrivacy = await read(fileFor(bases[1] + 'privacy/'));
for (const term of ['AdMob', 'UMP', 'IP addresses', 'non-personalized', 'localStorage', 'Google', 'Retention and deletion'])
  assert(englishPrivacy.includes(term), `English privacy disclosure missing: ${term}`);

const support = await read(fileFor(base + 'support/'));
const privacy = await read(fileFor(base + 'privacy/'));
for (const html of [support, privacy]) assert(html.includes('mailto:nakano.prog@gmail.com'), 'Missing real support email');
for (const term of ['AdMob', 'UMP', 'IPアドレス', '非パーソナライズ', 'リセット', 'localStorage', 'Google'])
  assert(privacy.includes(term), `Privacy disclosure missing: ${term}`);
assert(!privacy.includes('データ収集を行いません'), 'Misleading blanket no-collection statement');

for (const homepage of ['index.html', 'ja/index.html', 'en/index.html']) {
  const home = await read(homepage);
  assert(!home.includes('MATLABdojo') && !home.includes('MATLAB道場'), `Review app must not appear on ${homepage}`);
}
const sitemap = await read('sitemap.xml');
for (const languageBase of bases) assert(!sitemap.includes(languageBase), 'Review pages must not appear in the sitemap');
// Inspect every public HTML page, including the English home page and legacy redirects.
async function htmlFiles(directory = '') {
  const files = [];
  for (const entry of await fs.readdir(path.join(root, directory), { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const relative = path.posix.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(relative));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(relative);
  }
  return files;
}
let unlinkedPages = 0;
for (const file of await htmlFiles()) {
  if (bases.some(languageBase => file.startsWith(languageBase.slice(1)))) continue;
  const html = await read(file);
  for (const [, raw] of html.matchAll(/\b(?:href|src|content)="([^"]+)"/g)) {
    const target = new URL(raw.replaceAll('&amp;', '&'), origin + '/' + file);
    assert(target.origin !== origin || !bases.some(languageBase => target.pathname.startsWith(languageBase)), `Public page links to review app: ${file} → ${raw}`);
  }
  unlinkedPages++;
}
const ads = await read('app-ads.txt');
assert(ads.split(/\r?\n/).some(line => /^google\.com,\s*pub-7752394877381464,\s*DIRECT(?:,|$)/.test(line)), 'Wrong app-ads.txt publisher');
console.log(`PASS: six Japanese/English review pages with noindex, reciprocal language links, six screenshots per product page, contact details, no inbound links from ${unlinkedPages} public HTML pages, no home/sitemap listings, app-ads.txt and ${references} internal references.`);
