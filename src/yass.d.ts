export type YassMessage<Parameters extends object> = string | ((parameters: Parameters) => unknown);

export interface YassLabelMessageParameters {
    label: string;
}

export interface YassResultsMessageParameters {
    count: number;
}

export interface YassMessages {
    searchPlaceholder: YassMessage<YassLabelMessageParameters>;
    noResults: YassMessage<Record<string, never>>;
    results: YassMessage<YassResultsMessageParameters>;
    searchLabel: YassMessage<YassLabelMessageParameters>;
    fallbackLabel: string;
}

export interface YassOptions {
    messages?: Partial<YassMessages>;
    openOnFocus?: boolean;
    keyboardLayout?: boolean;
    injectStyles?: boolean;
    nonce?: string | null;
}

export interface ResolvedYassOptions {
    messages: YassMessages;
    openOnFocus: boolean;
    keyboardLayout: boolean;
    injectStyles: boolean;
    nonce: string | null;
}

export interface YassInstance {
    readonly select: HTMLSelectElement;
    open(): this;
    close(returnFocus?: boolean): this;
    refresh(): this;
    sync(): this;
    destroy(): null;
}

export const version: string;

export function enhance(select: HTMLSelectElement, options?: YassOptions): YassInstance | null;

export function enhanceAll(
    scope?: Document | Element | DocumentFragment,
    options?: YassOptions,
): YassInstance[];

export function get(select: HTMLSelectElement): YassInstance | null;

export function configure(options?: YassOptions): ResolvedYassOptions;

export function injectStyles(options?: Pick<YassOptions, 'nonce'>): HTMLStyleElement | null;

export interface YassApi {
    version: typeof version;
    enhance: typeof enhance;
    enhanceAll: typeof enhanceAll;
    get: typeof get;
    configure: typeof configure;
    injectStyles: typeof injectStyles;
}

declare const Yass: YassApi;

declare global {
    interface Window {
        Yass: YassApi;
        YassConfig?: YassOptions;
    }
}

export default Yass;
