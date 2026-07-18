import Yass, { configure, enhance, type YassOptions } from '@sozidatel/yass';
import '@sozidatel/yass/style.css';

const options: YassOptions = {
    messages: {
        searchPlaceholder: ({ label }) => `Search ${label}`,
        noResults: () => 'No matches',
        results: ({ count }) => `${count} matches`,
        searchLabel: ({ label }) => `${label}: filter`,
        fallbackLabel: 'Choose',
    },
    keyboardLayout: false,
};

window.YassConfig = { injectStyles: false };
const select = document.querySelector<HTMLSelectElement>('#account');
if (select) {
    const instance = enhance(select, options);
    instance?.open().close(true).refresh().sync();
    instance?.destroy();
    Yass.get(select);
}

configure(options);
Yass.enhanceAll(document, options);
