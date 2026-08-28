import fs from 'node:fs';
import assert from 'node:assert/strict';
const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const html = read('index.html');
const products = JSON.parse(read('data/products.json'));
const categories = JSON.parse(read('data/categories.json'));
const guides = JSON.parse(read('data/guides.json'));
assert.match(html, /Helping You Choose with Confidence/);
assert.match(html, /AI Decision Assistant/);
assert.match(html, /Smart Picks/);
assert.ok(Array.isArray(products.products) && products.products.length >= 1);
assert.ok(Array.isArray(categories) && categories.length >= 10);
assert.ok(Array.isArray(guides) && guides.length >= 3);
for (const p of products.products) {
  assert.ok(p.product_id);
  assert.ok(p.status);
  assert.ok(Array.isArray(p.source_urls));
  assert.ok(p.affiliate);
}
console.log('RuangPilih smoke tests passed');
