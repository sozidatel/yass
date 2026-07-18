import { expect, test } from '@playwright/test';

const fixtureUrl = '/tests/fixtures/basic.html';

async function openAccount(page) {
    await page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]').click();
    return page.locator('.yass__search');
}

test.beforeEach(async ({ page }) => {
    await page.goto(fixtureUrl);
    await expect(page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]')).toBeVisible();
});

test('auto-initializes marked native selects and injects baseline CSS once', async ({ page }) => {
    await expect(page.locator('select[data-yass].yass__native')).toHaveCount(3);
    await expect(page.locator('[data-yass-styles]')).toHaveCount(1);
    await expect(page.locator('#account')).toHaveValue('cash');
    await expect(page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]')).toContainText('Cash');
    await expect(page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]')).toHaveAttribute('aria-label', 'Account: Cash');
});

test('opens when keyboard focus reaches the trigger', async ({ page, browserName }) => {
    await page.locator('#before').focus();
    await expect(page.locator('#before')).toBeFocused();
    if (browserName === 'webkit') {
        // macOS WebKit inherits the system preference that may omit buttons
        // from plain-Tab navigation. Exercise the focus contract directly;
        // hands-on Safari keyboard navigation remains in the manual matrix.
        await page.locator('.yass__trigger').first().focus();
    } else {
        await page.keyboard.press('Tab');
    }
    await expect(page.locator('.yass__search')).toBeFocused();
    await expect(page.locator('.yass__panel')).toBeVisible();
});

test('corrects keyboard layout, keeps group context, and selects with Enter', async ({ page }) => {
    const search = await openAccount(page);
    await search.fill('цшту');

    await expect(page.locator('.yass__option')).toHaveCount(1);
    await expect(page.locator('.yass__option')).toContainText('Wine bank');
    await expect(page.locator('.yass__group')).toContainText('Accounts');
    await search.press('Enter');

    await expect(page.locator('#account')).toHaveValue('wine');
    await expect(page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]')).toContainText('Wine bank');
    await expect.poll(() => page.evaluate(() => window.fixtureEvents)).toEqual({ input: 1, change: 1 });
});

test('arrow keys skip disabled rows and native form submission keeps the value', async ({ page }) => {
    const search = await openAccount(page);
    await search.press('ArrowDown');
    await search.press('ArrowUp');
    await search.press('ArrowDown');
    await search.press('Enter');
    await expect(page.locator('#account')).toHaveValue('wine');

    await page.locator('#warehouse').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]').click();
    await page.locator('.yass__search').fill('bar');
    await page.locator('.yass__search').press('Enter');
    await page.locator('#submit').click();

    await expect.poll(async () => JSON.parse(await page.locator('#result').textContent())).toMatchObject({
        account: 'wine',
        warehouse: 'bar',
    });
});

test('synchronizes disabled state and closes an active popup', async ({ page }) => {
    await openAccount(page);
    await page.locator('#account').evaluate((select) => { select.disabled = true; });

    const trigger = page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]');
    await expect(trigger).toBeDisabled();
    await expect(page.locator('.yass__panel')).toBeHidden();

    await page.locator('#account').evaluate((select) => { select.disabled = false; });
    await expect(trigger).toBeEnabled();
});

test('form reset synchronizes the selected value and trigger label', async ({ page }) => {
    const search = await openAccount(page);
    await search.fill('wine');
    await search.press('Enter');
    await expect(page.locator('#account')).toHaveValue('wine');

    await page.locator('#reset').click();
    await expect(page.locator('#account')).toHaveValue('cash');
    await expect(page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]')).toContainText('Cash');
});

test('rebuilds after option mutation and supports pointer selection', async ({ page }) => {
    await page.locator('#warehouse').evaluate((select) => {
        const option = document.createElement('option');
        option.value = 'cold-room';
        option.textContent = 'Cold room';
        select.append(option);
    });

    const trigger = page.locator('#warehouse').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]');
    await trigger.click();
    await page.locator('.yass__search').fill('cold');
    await page.getByRole('option', { name: 'Cold room' }).click();

    await expect(page.locator('#warehouse')).toHaveValue('cold-room');
    await expect(trigger).toContainText('Cold room');
});

test('keeps one shared popup while the API switches active instances', async ({ page }) => {
    await openAccount(page);
    await page.locator('#warehouse').evaluate((select) => window.Yass.get(select).open());

    await expect(page.locator('.yass__panel')).toHaveCount(1);
    await expect(page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]')).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#warehouse').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.yass__search')).toHaveAttribute('aria-label', 'Warehouse: search');
});

test('mirrors required invalid state and opens the failing control', async ({ page }) => {
    await page.locator('#warehouse').evaluate((select) => { select.required = true; });
    await page.locator('#submit').click();

    const trigger = page.locator('#warehouse').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]');
    await expect(trigger).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('.yass__search')).toBeFocused();
    await expect(page.locator('.yass__search')).toHaveAttribute('aria-label', 'Warehouse: search');
});

test('preserves implicit labels and restores their original structure', async ({ page }) => {
    await page.locator('body').evaluate((body) => {
        const container = document.createElement('div');
        container.innerHTML = '<label id="wrapped-label">Wrapped account <select id="wrapped-select"><option>One</option><option>Two</option></select></label>';
        body.append(container);
        window.Yass.enhance(document.getElementById('wrapped-select'));
    });

    const trigger = page.locator('#wrapped-select').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]');
    await expect(trigger).toHaveAttribute('aria-label', 'Wrapped account: One');
    const triggerId = await trigger.getAttribute('id');
    await expect(page.locator('#wrapped-label')).toHaveAttribute('for', triggerId);
    await page.locator('#wrapped-label').click();
    await expect(page.locator('.yass__search')).toBeFocused();
    await expect(page.locator('.yass__search')).toHaveAttribute('aria-label', 'Wrapped account: search');

    await page.locator('#wrapped-select').evaluate((select) => window.Yass.get(select).destroy());
    await expect(page.locator('#wrapped-label > #wrapped-select')).toHaveCount(1);
    await expect(page.locator('#wrapped-label')).not.toHaveAttribute('for', /.+/u);
});

test('updates the accessible name when an associated label changes', async ({ page }) => {
    const trigger = page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]');
    await page.locator('label[for^="account-trigger-"]').evaluate((label) => { label.textContent = 'Renamed account'; });
    await expect(trigger).toHaveAttribute('aria-label', 'Renamed account: Cash');
    await trigger.click();
    await expect(page.locator('.yass__search')).toHaveAttribute('aria-label', 'Renamed account: search');
});

test('uses aria-labelledby and mirrors authored error relationships to the active search', async ({ page }) => {
    await page.locator('body').evaluate((body) => {
        const name = document.createElement('span');
        name.id = 'external-name';
        name.textContent = 'External account';
        const description = document.createElement('span');
        description.id = 'external-description';
        description.textContent = 'Choose carefully';
        const error = document.createElement('span');
        error.id = 'external-error';
        error.textContent = 'Server error';
        const select = document.createElement('select');
        select.id = 'external-select';
        select.setAttribute('aria-labelledby', name.id);
        select.setAttribute('aria-label', 'Lower priority name');
        select.setAttribute('aria-describedby', description.id);
        select.setAttribute('aria-errormessage', error.id);
        select.setAttribute('aria-invalid', 'grammar');
        select.append(new Option('First', 'first'));
        body.append(name, description, error, select);
        window.Yass.enhance(select);
    });

    const trigger = page.locator('#external-select').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]');
    await expect(trigger).toHaveAttribute('aria-label', 'External account: First');
    await expect(trigger).toHaveAttribute('aria-invalid', 'grammar');
    await trigger.click();
    const search = page.locator('.yass__search');
    await expect(search).toHaveAttribute('aria-label', 'External account: search');
    await expect(search).toHaveAttribute('aria-describedby', 'external-description');
    await expect(search).toHaveAttribute('aria-errormessage', 'external-error');
    await expect(search).toHaveAttribute('aria-invalid', 'grammar');
});

test('honors effective fieldset disabled state and dynamic fieldset changes', async ({ page }) => {
    await page.locator('#warehouse').evaluate((select) => {
        window.Yass.get(select).destroy();
        const fieldset = document.createElement('fieldset');
        fieldset.id = 'warehouse-fieldset';
        select.before(fieldset);
        fieldset.append(select);
        window.Yass.enhance(select);
        fieldset.disabled = true;
    });

    const trigger = page.locator('#warehouse').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]');
    await expect(trigger).toBeDisabled();
    await page.locator('#warehouse').evaluate((select) => window.Yass.get(select).open());
    await expect(page.locator('.yass__panel')).toBeHidden();
    await page.locator('#warehouse-fieldset').evaluate((fieldset) => { fieldset.disabled = false; });
    await expect(trigger).toBeEnabled();
});

test('manual Tab skips disabled fieldset controls and respects a checked radio tab stop', async ({ page }) => {
    await page.locator('#account').evaluate((select) => {
        const root = select.closest('.yass');
        const fieldset = document.createElement('fieldset');
        fieldset.disabled = true;
        fieldset.innerHTML = '<button id="fieldset-skip" type="button">Skip</button>';
        const radioOne = document.createElement('input');
        radioOne.type = 'radio';
        radioOne.name = 'choice';
        radioOne.id = 'radio-one';
        const radioTwo = document.createElement('input');
        radioTwo.type = 'radio';
        radioTwo.name = 'choice';
        radioTwo.id = 'radio-two';
        radioTwo.checked = true;
        root.after(fieldset, radioOne, radioTwo);
    });

    const search = await openAccount(page);
    await search.press('Tab');
    await expect(page.locator('#radio-two')).toBeFocused();
});

test('synchronizes external form-associated controls on reset', async ({ page }) => {
    await page.locator('body').evaluate((body) => {
        const form = document.createElement('form');
        form.id = 'external-form';
        form.innerHTML = '<button id="external-reset" type="reset">External reset</button>';
        const select = document.createElement('select');
        select.id = 'external-form-select';
        select.name = 'external';
        select.setAttribute('form', form.id);
        select.append(new Option('Default', 'default', true, true), new Option('Changed', 'changed'));
        body.append(form, select);
        window.Yass.enhance(select);
        select.value = 'changed';
        select.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const trigger = page.locator('#external-form-select').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]');
    await expect(trigger).toContainText('Changed');
    await page.locator('#external-reset').click();
    await expect(page.locator('#external-form-select')).toHaveValue('default');
    await expect(trigger).toContainText('Default');
});

test('mirrors hidden state and closes when an active select becomes hidden', async ({ page }) => {
    await openAccount(page);
    await page.locator('#account').evaluate((select) => { select.hidden = true; });

    await expect(page.locator('#account').locator('xpath=ancestor::*[contains(@class, "yass")]')).toBeHidden();
    await expect(page.locator('.yass__panel')).toBeHidden();
    await page.locator('#account').evaluate((select) => { select.hidden = false; });
    await expect(page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]')).toBeVisible();
});

test('closes the shared popup when its active control is detached', async ({ page }) => {
    await openAccount(page);
    await page.locator('#account').evaluate((select) => select.closest('.yass').remove());
    await expect(page.locator('.yass__panel')).toBeHidden();
});

test('uses the native option label attribute for display and search', async ({ page }) => {
    await page.locator('#warehouse').evaluate((select) => {
        const option = document.createElement('option');
        option.value = 'short';
        option.label = 'Short label';
        option.textContent = 'Long fallback text';
        select.append(option);
    });
    const trigger = page.locator('#warehouse').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]');
    await trigger.click();
    await page.locator('.yass__search').fill('short');
    await expect(page.getByRole('option', { name: 'Short label' })).toHaveCount(1);
    await page.getByRole('option', { name: 'Short label' }).click();
    await expect(trigger).toContainText('Short label');
});

test('destroy restores the original select and its label', async ({ page }) => {
    await page.locator('#account').evaluate((select) => window.Yass.get(select).destroy());

    await expect(page.locator('#account')).not.toHaveClass(/yass__native/u);
    await expect(page.locator('label[for="account"]')).toHaveCount(1);
    await expect(page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]')).toHaveCount(0);
    await expect(page.locator('#account')).toBeVisible();
});

test('preserves an explicit native tabindex on the generated trigger', async ({ page }) => {
    await page.locator('#account').evaluate((select) => {
        window.Yass.get(select).destroy();
        select.tabIndex = -1;
        window.Yass.enhance(select);
    });

    const trigger = page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]');
    await expect(trigger).toHaveAttribute('tabindex', '-1');
    await page.locator('#account').evaluate((select) => window.Yass.get(select).destroy());
    await expect(page.locator('#account')).toHaveAttribute('tabindex', '-1');
});

test('repeated style installation does not duplicate embedded styles', async ({ page }) => {
    await page.evaluate(() => {
        window.Yass.injectStyles();
        window.Yass.injectStyles();
    });

    await expect(page.locator('[data-yass-styles]')).toHaveCount(1);
});

test('loading the browser bundle twice keeps the original instances reachable', async ({ page }) => {
    await page.evaluate(() => new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `/dist/yass.js?second=${Date.now()}`;
        script.onload = resolve;
        script.onerror = reject;
        document.head.append(script);
    }));

    await expect.poll(() => page.locator('#account').evaluate((select) => Boolean(window.Yass.get(select)))).toBe(true);
    await expect(page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]')).toHaveCount(1);
    await expect(page.locator('[data-yass-styles]')).toHaveCount(1);
});

test('renders option metadata as text instead of executable HTML', async ({ page }) => {
    await page.locator('#account').evaluate((select) => {
        const option = document.createElement('option');
        option.value = 'unsafe-looking';
        option.textContent = '<img src=x onerror="window.optionMarkupExecuted=true">';
        option.dataset.yassIcon = '<svg onload="window.optionMarkupExecuted=true">';
        option.dataset.yassSearch = 'unsafe-looking';
        select.append(option);
        window.Yass.get(select).refresh();
    });

    const search = await openAccount(page);
    await search.fill('unsafe-looking');

    await expect(page.locator('.yass__option')).toContainText('<img src=x');
    await expect(page.locator('.yass__option img, .yass__option svg')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => window.optionMarkupExecuted ?? false)).toBe(false);
});

test('supports external CSS mode and a CSP nonce', async ({ page }) => {
    await page.goto(`${fixtureUrl}?no-styles`);
    await expect(page.locator('[data-yass-styles]')).toHaveCount(0);
    await expect(page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]')).toHaveCount(1);

    await page.goto(`${fixtureUrl}?nonce`);
    await expect.poll(() => page.locator('[data-yass-styles]').evaluate((style) => style.nonce)).toBe('fixture-nonce');
});

for (const colorScheme of ['light', 'dark']) {
    test(`is usable with the ${colorScheme} color scheme`, async ({ page }) => {
        await page.emulateMedia({ colorScheme });
        await page.reload();
        await openAccount(page);

        const styles = await page.locator('.yass__panel').evaluate((panel) => {
            const computed = getComputedStyle(panel);
            return { background: computed.backgroundColor, color: computed.color };
        });
        expect(styles.background).not.toBe('rgba(0, 0, 0, 0)');
        expect(styles.color).not.toBe(styles.background);
        await expect(page.locator('.yass__search')).toBeFocused();
    });
}

test('keeps the search field and results inside a tiny viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 240 });
    await page.reload();
    await openAccount(page);

    const geometry = await page.locator('.yass__panel').evaluate((panel) => {
        const panelRect = panel.getBoundingClientRect();
        const searchRect = panel.querySelector('.yass__search').getBoundingClientRect();
        const listRect = panel.querySelector('.yass__list').getBoundingClientRect();
        return {
            panel: { left: panelRect.left, top: panelRect.top, right: panelRect.right, bottom: panelRect.bottom },
            searchHeight: searchRect.height,
            listHeight: listRect.height,
            viewport: { width: innerWidth, height: innerHeight },
        };
    });

    expect(geometry.panel.left).toBeGreaterThanOrEqual(0);
    expect(geometry.panel.top).toBeGreaterThanOrEqual(0);
    expect(geometry.panel.right).toBeLessThanOrEqual(geometry.viewport.width);
    expect(geometry.panel.bottom).toBeLessThanOrEqual(geometry.viewport.height);
    expect(geometry.searchHeight).toBeGreaterThan(0);
    expect(geometry.listHeight).toBeGreaterThan(0);
});

test('repositions the open panel after scrolling and resizing', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 700 });
    await page.locator('#account').evaluate((select) => {
        const spacer = document.createElement('div');
        spacer.style.height = '700px';
        select.closest('form').before(spacer);
        document.body.style.paddingBottom = '700px';
    });

    const trigger = page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]');
    await trigger.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    await trigger.click();
    const panel = page.locator('.yass__panel');
    const before = await page.evaluate(() => ({
        triggerTop: document.querySelector('.yass__trigger').getBoundingClientRect().top,
        panelTop: document.querySelector('.yass__panel').getBoundingClientRect().top,
    }));

    await page.evaluate(() => window.scrollBy(0, 50));
    await expect.poll(() => page.evaluate((initial) => {
        const triggerTop = document.querySelector('.yass__trigger').getBoundingClientRect().top;
        const panelTop = document.querySelector('.yass__panel').getBoundingClientRect().top;
        return (panelTop - initial.panelTop) - (triggerTop - initial.triggerTop);
    }, before)).toBeCloseTo(0, 0);

    await page.setViewportSize({ width: 420, height: 300 });
    await expect.poll(() => panel.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left >= 0
            && rect.top >= 0
            && rect.right <= innerWidth
            && rect.bottom <= innerHeight;
    })).toBe(true);
});

test('ships a runnable light/dark demo', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto('/demo/');

    await expect(page.getByRole('heading', { name: 'Yass' })).toBeVisible();
    await expect(page.locator('.yass__trigger')).toHaveCount(2);
    await page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]').click();
    const lightBackground = await page.locator('.yass__panel').evaluate((element) => getComputedStyle(element).backgroundColor);
    await page.keyboard.press('Escape');
    await page.locator('#theme').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const trigger = page.locator('#account').locator('xpath=following-sibling::*[contains(@class, "yass__trigger")]');
    await expect(trigger).toBeVisible();
    await trigger.click();
    const darkBackground = await page.locator('.yass__panel').evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(darkBackground).not.toBe(lightBackground);
    expect(pageErrors).toEqual([]);
});
