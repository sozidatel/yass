import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const metadata = JSON.parse(await readFile(path.join(projectDirectory, 'package.json'), 'utf8'));

test('package is a public, dependency-free Yass 0.1.1 release', () => {
    assert.equal(metadata.name, '@sozidatel/yass');
    assert.equal(metadata.version, '0.1.1');
    assert.equal(metadata.private, undefined);
    assert.equal(metadata.license, 'MIT');
    assert.equal(metadata.repository.url, 'git+https://github.com/sozidatel/yass.git');
    assert.equal(metadata.homepage, 'https://sozidatel.github.io/yass/');
    assert.equal(metadata.bugs.url, 'https://github.com/sozidatel/yass/issues');
    assert.equal(metadata.publishConfig.access, 'public');
    assert.equal(metadata.publishConfig.registry, 'https://registry.npmjs.org/');
    assert.equal(metadata.engines, undefined);
    assert.equal(metadata.sideEffects, true);
    assert.ok(metadata.files.includes('docs'));
    assert.deepEqual(metadata.dependencies, undefined);
});

test('build creates every documented distribution artifact', async () => {
    const files = [
        'dist/yass.js',
        'dist/yass.min.js',
        'dist/yass.mjs',
        'dist/yass.css',
        'dist/yass.d.ts',
        'dist/style.d.ts',
    ];

    for (const file of files) {
        const details = await stat(path.join(projectDirectory, file));
        assert.ok(details.size > 0, `${file} is not empty`);
    }

    const browserBundle = await readFile(path.join(projectDirectory, 'dist/yass.js'), 'utf8');
    assert.match(browserBundle, /data-yass-styles/u);
    assert.match(browserBundle, /\.yass/u);
    assert.equal(metadata.types, './dist/yass.d.ts');
});

test('ES module exposes only the supported lifecycle surface', async () => {
    const library = await import('../../dist/yass.mjs');

    for (const name of ['enhance', 'enhanceAll', 'get', 'configure', 'injectStyles']) {
        assert.equal(typeof library[name], 'function', `${name} is exported`);
    }
    assert.equal(library.version, metadata.version);
    assert.equal(typeof library.default, 'object');
});
