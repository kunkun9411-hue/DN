import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const routes = ['app/page.tsx', 'app/metin2/page.tsx', 'app/palworld/page.tsx', 'app/minecraft/page.tsx', 'app/tools/page.tsx', 'app/shop/page.tsx', 'app/calculator/page.tsx', 'app/datenschutz/page.tsx'];

test('core routes exist', () => routes.forEach((route) => assert.equal(existsSync(join(root, route)), true, route)));
test('translations are valid JSON', () => ['de', 'en'].forEach((locale) => assert.doesNotThrow(() => JSON.parse(readFileSync(join(root, `i18n/${locale}.json`), 'utf8')))));
test('static export and metadata are configured', () => {
  assert.match(readFileSync(join(root, 'next.config.mjs'), 'utf8'), /output:\s*['"]export['"]/);
  assert.match(readFileSync(join(root, 'app/layout.tsx'), 'utf8'), /duonerds\.online/);
});
