/**
 * Browser Session Interface Module
 *
 * Defines the interface for a managed browser session, providing a
 * webdriver-agnostic abstraction for browser lifecycle management.
 */

/**
 * The browser execution mode.
 */
export type BrowserMode = "headless" | "visual" | "grid";

/**
 * Options for starting a browser session.
 */
export interface BrowserSessionStartOptions {
    /**
     * The name of the browser to launch (e.g. `"chrome"`, `"firefox"`).
     */
    browser?: string;

    /**
     * The browser execution mode.
     */
    mode?: BrowserMode;

    /**
     * The URL of the Selenium Grid to connect to. Only applicable when
     * `mode` is `"grid"`.
     */
    gridUrl?: string;
}

/**
 * Metadata for a tracked browser tab.
 */
export interface TabMeta {
    /** Optional display name assigned when the tab was opened. */
    name?: string;

    /** The opaque WDIO window handle string returned by `getWindowHandle()`. */
    handle: string;
}

/**
 * A managed browser session.
 */
export interface BrowserSession {
    /**
     * Start the browser session.
     *
     * @param opts - Options controlling how the session is started
     */
    start(opts?: BrowserSessionStartOptions): Promise<void>;

    /**
     * End the browser session and release all associated resources.
     */
    end(): Promise<void>;

    /** All tabs currently open in this session, in the order they were opened. */
    readonly tabs: TabMeta[];

    /** The currently active tab, or `null` if the session has not been started. */
    readonly activeTab: TabMeta | null;

    /**
     * Open a new browser tab and make it active.
     *
     * @param name - Optional name to assign to the tab for later reference
     */
    openTab(name?: string): Promise<void>;

    /**
     * Close a browser tab.
     *
     * When omitted, the active tab is closed. Accepts a 0-based index or a tab
     * name. Closing the last tab terminates the browser process; the driver is
     * nulled without calling `deleteSession()`.
     *
     * @param selector - A 0-based tab index or tab name; omit to close the active tab
     */
    closeTab(selector?: number | string): Promise<void>;

    /**
     * Switch to the next tab, wrapping around to the first tab if the current
     * tab is the last one.
     */
    switchToNextTab(): Promise<void>;

    /**
     * Switch to the previous tab, wrapping around to the last tab if the
     * current tab is the first one.
     */
    switchToPreviousTab(): Promise<void>;

    /**
     * Switch to a tab by 0-based index or by name.
     *
     * @param selector - A 0-based index or a tab name
     */
    switchToTab(selector: number | string): Promise<void>;

    /**
     * Set the browser window size.
     *
     * @param width  - The desired window width in pixels
     * @param height - The desired window height in pixels
     */
    setWindowSize(width: number, height: number): Promise<void>;

    /**
     * Get the current browser window size.
     *
     * @returns The current window dimensions in pixels
     */
    getWindowSize(): Promise<{ width: number; height: number }>;

    /**
     * Navigate the active browser tab to the given URL.
     *
     * @param url - The URL to navigate to
     */
    navigateTo(url: URL): Promise<void>;

    /**
     * Return the current URL of the active browser tab.
     */
    getURL(): Promise<string>;

    /**
     * Reload the current page in the active browser tab.
     */
    refresh(): Promise<void>;

    /**
     * Navigate back to the previous page in the browser history.
     */
    back(): Promise<void>;

    /**
     * Navigate forward to the next page in the browser history.
     */
    forward(): Promise<void>;
}
