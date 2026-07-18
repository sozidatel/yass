import assert from 'node:assert/strict';
import test from 'node:test';

import { __test } from '../../dist/yass.mjs';

const {
    normalizeSearchText,
    keyboardLayoutVariants,
    matchesSearch,
    filterEntries,
} = __test;

test('normalizes case, compatible Unicode, non-breaking spaces, and repeated whitespace', () => {
    assert.equal(normalizeSearchText('  ＷＩＮＥ\u00a0  Bank  '), 'wine bank');
});

test('finds an English label typed with the Russian keyboard layout', () => {
    assert.ok(keyboardLayoutVariants('цшту').includes('wine'));
    assert.equal(matchesSearch('Natural Wine', 'ЦШТУ'), true);
    assert.equal(matchesSearch('Natural Wine', 'цшту', false), false);
});

test('substring search returns only direct matches as navigable and keeps ancestors as context', () => {
    const entries = [
        {
            label: 'Expenses',
            selectable: true,
            kind: 'option',
            ancestors: [],
            normalizedSearchText: 'expenses',
        },
        {
            label: 'Wine',
            selectable: true,
            kind: 'option',
            ancestors: [0],
            normalizedSearchText: 'expenses wine',
        },
        {
            label: 'Disabled heading',
            selectable: false,
            kind: 'group',
            ancestors: [],
            normalizedSearchText: 'disabled heading',
        },
    ];

    assert.deepEqual(filterEntries(entries, 'wine'), {
        visibleIndexes: [0, 1],
        matchingIndexes: [1],
    });
});

test('empty search shows structure while keeping disabled rows out of keyboard navigation', () => {
    const entries = [
        { selectable: false, kind: 'group' },
        { selectable: true, kind: 'option' },
        { selectable: false, kind: 'separator' },
    ];

    assert.deepEqual(filterEntries(entries, ''), {
        visibleIndexes: [0, 1, 2],
        matchingIndexes: [1],
    });
});
