import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const metadata = JSON.parse(await readFile(path.join(projectDirectory, 'package.json'), 'utf8'));
const releaseTag = process.argv[2] || '';
const expectedTag = `v${metadata.version}`;

assert.equal(metadata.name, '@sozidatel/yass');
assert.equal(metadata.private, undefined);
assert.equal(metadata.repository?.url, 'git+https://github.com/sozidatel/yass.git');
assert.equal(metadata.publishConfig?.access, 'public');
assert.equal(metadata.publishConfig?.registry, 'https://registry.npmjs.org/');
if (releaseTag) {
    assert.equal(releaseTag, expectedTag, `release tag must be ${expectedTag}`);
}

console.log(`${metadata.name}@${metadata.version} is ready for ${expectedTag}.`);
