# Releasing

Yass consumers should receive ready `dist/` files. The build toolchain belongs to this repository; it is not a consumer requirement.

## Local release check

From the repository root:

```sh
npm ci
npx playwright install chromium firefox webkit
npm test
npm run verify:release
npm pack --dry-run
git diff --exit-code -- dist
```

`npm test` rebuilds all artifacts before running unit tests and the browser suite in Chromium, Firefox, and WebKit. A second `npm run build` should leave the tracked `dist/` directory unchanged.

Before tagging, also verify:

- `package.json`, generated banners, README, and changelog name the same version;
- the changelog has a date and describes only behavior that is present and tested;
- the package dry-run contains `dist/`, the documentation, license, README, changelog, and package metadata—never `src/`, tests, reports, or `node_modules/`;
- the static demo works from the generated browser bundle in light, dark, and narrow viewports;
- the public API and known limitations in the documentation still match the source.

## Tagging

Create the release commit first, then an annotated tag:

```sh
git tag -a v0.1.0 -m "Yass 0.1.0"
```

Push the release commit and tag only after the checks pass. Publish a GitHub Release from the tag; `.github/workflows/release.yml` repeats the full suite, attaches build-free artifacts and `SHA256SUMS`, and publishes the matching package version to npm when it is not already present.

## npm ownership and trusted publishing

The first npm publication establishes ownership of `@sozidatel/yass` and therefore requires an authenticated npm account:

```sh
npm adduser
npm test
npm pack --dry-run
npm publish
```

After the package exists, configure its npm trusted publisher with these exact values:

- provider: GitHub Actions;
- owner: `sozidatel`;
- repository: `yass-select`;
- workflow: `release.yml`;
- allowed action: `npm publish`;
- environment: none.

The release workflow uses GitHub OIDC on a hosted Node 24 runner, so it needs no long-lived npm token. npm generates provenance automatically for the public package and repository. Once a trusted publication succeeds, disable token-based package publishing in npm settings.

## Consuming without a build

Copy either:

- `dist/yass.js` (or `.min.js`) for a single browser file with embedded functional CSS; or
- the browser JS plus `dist/yass.css`, with pre-load `YassConfig.injectStyles = false`, for externally managed CSS/CSP.

Pin the copied files to a release/tag in the consuming repository. Do not add an unversioned runtime CDN dependency merely to avoid copying a small static artifact.
