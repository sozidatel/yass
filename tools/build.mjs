import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { build, transform } from 'esbuild';

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceFile = path.join(projectDirectory, 'src/yass.js');
const sourceStylesheet = path.join(projectDirectory, 'src/yass.css');
const sourceTypes = path.join(projectDirectory, 'src/yass.d.ts');
const sourceStyleTypes = path.join(projectDirectory, 'src/style.d.ts');
const distributionDirectory = path.join(projectDirectory, 'dist');
const packageMetadata = JSON.parse(await readFile(path.join(projectDirectory, 'package.json'), 'utf8'));

const normalizeTextFile = (contents) => contents.replace(/\r\n?/gu, '\n').replace(/\s*$/u, '') + '\n';
const sourceCss = normalizeTextFile(await readFile(sourceStylesheet, 'utf8'));
const minifiedCss = (await transform(sourceCss, { loader: 'css', minify: true })).code.trim();
const versionBanner = `/*! Yass v${packageMetadata.version} */`;

await rm(distributionDirectory, { recursive: true, force: true });
await mkdir(distributionDirectory, { recursive: true });
await writeFile(path.join(distributionDirectory, 'yass.css'), sourceCss, 'utf8');
await copyFile(sourceTypes, path.join(distributionDirectory, 'yass.d.ts'));
await copyFile(sourceStyleTypes, path.join(distributionDirectory, 'style.d.ts'));

const sharedOptions = {
    entryPoints: [sourceFile],
    bundle: true,
    platform: 'browser',
    target: ['es2020'],
    charset: 'utf8',
    legalComments: 'inline',
    logLevel: 'info',
    define: {
        __YASS_VERSION__: JSON.stringify(packageMetadata.version),
        __YASS_BASE_CSS__: JSON.stringify(sourceCss),
    },
};

await build({
    ...sharedOptions,
    outfile: path.join(distributionDirectory, 'yass.js'),
    format: 'iife',
    globalName: 'Yass',
    banner: { js: versionBanner },
});

await build({
    ...sharedOptions,
    outfile: path.join(distributionDirectory, 'yass.min.js'),
    format: 'iife',
    globalName: 'Yass',
    minify: true,
    banner: { js: versionBanner },
    define: {
        ...sharedOptions.define,
        __YASS_BASE_CSS__: JSON.stringify(minifiedCss),
    },
});

await build({
    ...sharedOptions,
    outfile: path.join(distributionDirectory, 'yass.mjs'),
    format: 'esm',
    banner: { js: versionBanner },
});

console.error(`Built Yass v${packageMetadata.version} in ${path.relative(process.cwd(), distributionDirectory) || 'dist'}.`);
