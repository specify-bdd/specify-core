/**
 * WDIO Browser Session Module
 *
 * A WebdriverIO-backed implementation of the BrowserSession interface,
 * using WDIO's standalone mode to manage browser lifecycle.
 */

import assert, { AssertionError } from "node:assert/strict";

import { remote            } from "webdriverio";
import type { Capabilities } from "@wdio/types";

import type { BrowserSession, BrowserSessionStartOptions, TabMeta } from "@/lib/BrowserSession";

/**
 * A browser session managed via WebdriverIO in standalone mode.
 */
export class WDIOBrowserSession implements BrowserSession {
    /**
     * The underlying WebdriverIO browser instance, or null if the session
     * has not been started (or has already been ended).
     */
    #driver: WebdriverIO.Browser | null = null;

    /** Tabs open in this session. */
    #tabs: TabMeta[] = [];

    /** The currently active tab. */
    #activeTab: TabMeta | null = null;

    /**
     * The underlying WebdriverIO browser instance.
     *
     * @returns The browser instance, or `null` if not active.
     */
    get driver(): WebdriverIO.Browser | null {
        return this.#driver;
    }

    /** All tabs currently open in this session. */
    get tabs(): TabMeta[] {
        return this.#tabs;
    }

    /** The currently active tab, or `null` if the session has not started. */
    get activeTab(): TabMeta | null {
        return this.#activeTab;
    }

    /**
     * Start the browser session and capture the initial tab.
     *
     * @param opts - Options controlling how the session is started
     */
    async start(opts: BrowserSessionStartOptions = {}): Promise<void> {
        this.#driver = await remote(this.#buildOptions(opts));

        const handle     = await this.#driver.getWindowHandle();
        const initialTab = { handle };

        this.#tabs = [initialTab];
        this.#activeTab = initialTab;
    }

    /**
     * End the browser session and release all associated resources.
     */
    async end(): Promise<void> {
        try {
            await this.#driver?.deleteSession();
        } finally {
            this.#driver = null;
            this.#tabs = [];
            this.#activeTab = null;
        }
    }

    /**
     * Open a new browser tab and make it active.
     *
     * @param name - Optional name to assign to the tab for later reference
     */
    async openTab(name?: string): Promise<void> {
        await this.#driver.newWindow("about:blank", { "type": "tab" });

        const handle       = await this.#driver.getWindowHandle();
        const tab: TabMeta = name ? { name, handle } : { handle };

        this.#tabs.push(tab);
        this.#activeTab = tab;
    }

    /**
     * Close a browser tab.
     *
     * When `selector` is omitted, the active tab is closed. Accepts a 0-based
     * index or a tab name. Closing the last tab in the session causes the
     * browser process to terminate; the driver is set to `null` without
     * calling `deleteSession()`.
     *
     * @param selector - A 0-based tab index or tab name; omit to close the active tab
     */
    async closeTab(selector?: number | string): Promise<void> {
        const targetTab = selector === undefined ? this.#activeTab : this.#findTab(selector);

        assert.ok(targetTab, new AssertionError({ "message": "No active tab to close." }));

        const isActive    = targetTab === this.#activeTab;
        const isOnlyTab   = this.#tabs.length === 1;
        const closedIndex = this.#tabs.indexOf(targetTab);

        if (!isActive) {
            // switch to target, close it, then switch back to the active tab
            await this.#driver.switchToWindow(targetTab.handle);
            await this.#driver.closeWindow();
            await this.#driver.switchToWindow(this.#activeTab!.handle);
        } else if (isOnlyTab) {
            try {
                await this.#driver.closeWindow();
            } catch {
                // WDIO terminates the session when the last window is closed and
                // throws as a side-effect; the cleanup below handles driver state
            }
        } else {
            await this.#driver.closeWindow();
        }

        this.#tabs.splice(closedIndex, 1);

        if (isActive) {
            // prefer the tab just before the closed one; wrap to the last tab
            // if the closed tab was at index 0, or null if none remain
            this.#activeTab =
                this.#tabs[closedIndex - 1] ?? this.#tabs[this.#tabs.length - 1] ?? null;

            if (this.#activeTab) {
                await this.#driver.switchToWindow(this.#activeTab.handle);
            }
        }

        if (this.#tabs.length === 0) {
            // the browser process terminated when the last tab was closed
            this.#driver = null;
        }
    }

    /**
     * Switch to the next tab, wrapping around to the first tab if the current
     * tab is the last.
     */
    async switchToNextTab(): Promise<void> {
        assert.ok(this.#activeTab, new AssertionError({ "message": "No active tab." }));

        const currentIndex = this.#tabs.indexOf(this.#activeTab);
        const nextTab      = this.#tabs[(currentIndex + 1) % this.#tabs.length];

        await this.#driver!.switchToWindow(nextTab.handle);
        this.#activeTab = nextTab;
    }

    /**
     * Switch to the previous tab, wrapping around to the last tab if the
     * current tab is the first.
     */
    async switchToPreviousTab(): Promise<void> {
        assert.ok(this.#activeTab, new AssertionError({ "message": "No active tab." }));

        const currentIndex = this.#tabs.indexOf(this.#activeTab);
        const prevTab      = this.#tabs[(currentIndex - 1 + this.#tabs.length) % this.#tabs.length];

        await this.#driver!.switchToWindow(prevTab.handle);
        this.#activeTab = prevTab;
    }

    /**
     * Switch to a tab by 0-based index or by name.
     *
     * @param selector - A 0-based index or a tab name
     *
     * @throws AssertionError If no tab matches the selector
     */
    async switchToTab(selector: number | string): Promise<void> {
        const tab = this.#findTab(selector);

        await this.#driver!.switchToWindow(tab.handle);
        this.#activeTab = tab;
    }

    /**
     * Set the browser window size.
     *
     * @param width  - The desired window width in pixels
     * @param height - The desired window height in pixels
     *
     * @throws AssertionError If `width` or `height` is not a positive number.
     */
    async setWindowSize(width: number, height: number): Promise<void> {
        assert.ok(width > 0, new AssertionError({ "message": "Width must be a positive number." }));
        assert.ok(
            height > 0,
            new AssertionError({ "message": "Height must be a positive number." }),
        );

        await this.#driver!.setWindowSize(width, height);
    }

    /**
     * Get the current browser window size.
     *
     * @returns The current window dimensions in pixels
     */
    async getWindowSize(): Promise<{ width: number; height: number }> {
        return this.#driver!.getWindowSize();
    }

    /**
     * Navigate the active browser tab to the given URL.
     *
     * @param url - The URL to navigate to
     */
    async navigateTo(url: URL): Promise<void> {
        await this.#driver!.url(url.href);
    }

    /**
     * Return the current URL of the active browser tab.
     */
    async getURL(): Promise<string> {
        return this.#driver!.getUrl();
    }

    /**
     * Reload the current page in the active browser tab.
     */
    async refresh(): Promise<void> {
        await this.#driver!.refresh();
    }

    /**
     * Find a tab by 0-based index or by name.
     *
     * @param selector - A 0-based index or a tab name
     *
     * @throws AssertionError If no tab matches the selector
     */
    #findTab(selector: number | string): TabMeta {
        let message: string;
        let tab: TabMeta | undefined;

        if (typeof selector === "number") {
            tab = this.#tabs[selector];
            message = `No tab at index ${selector}.`;
        } else {
            tab = this.#tabs.find((t) => t.name === selector);
            message = `No tab named "${selector}".`;
        }

        assert.ok(tab, new AssertionError({ message }));

        return tab;
    }

    /**
     * Build a WDIO RemoteOptions object from the given session start options.
     *
     * @param opts - The session start options
     *
     * @returns The WDIO RemoteOptions
     */
    #buildOptions({
        browser = "chrome",
        mode = "headless",
        gridUrl,
    }: BrowserSessionStartOptions): Capabilities.WebdriverIOConfig {
        const capabilities: WebdriverIO.Capabilities = { "browserName": browser };

        switch (browser) {
            case "chrome":
                this.#buildChromeCapabilities(capabilities, mode);
                break;

            case "firefox":
            case "edge":
            case "safari":
                throw new Error(`Browser "${browser}" is not yet supported.`);
        }

        const opts: Capabilities.WebdriverIOConfig = { capabilities, "logLevel": "error" };

        if (mode === "grid") {
            assert.ok(gridUrl, 'gridUrl is required when mode is "grid".');

            const url = new URL(gridUrl);
            opts.hostname = url.hostname;
            opts.port = parseInt(url.port, 10) || (url.protocol === "https:" ? 443 : 80);
            opts.path = url.pathname;
        }

        return opts;
    }

    /**
     * Populate Chrome-specific capability keys on the given capabilities object.
     *
     * Sets `wdio:chromedriverOptions.binary` when `CHROMEDRIVER_PATH` is set,
     * and builds `goog:chromeOptions` (args for headless mode, binary for
     * `CHROME_PATH`) when either condition applies.
     *
     * @param capabilities - The capabilities object to mutate
     * @param mode         - The session mode controlling headless args
     */
    #buildChromeCapabilities(
        capabilities: WebdriverIO.Capabilities,
        mode: BrowserSessionStartOptions["mode"],
    ): void {
        const chromedriverPath = process.env["CHROMEDRIVER_PATH"];
        const chromePath       = process.env["CHROME_PATH"];

        if (chromedriverPath) {
            capabilities["wdio:chromedriverOptions"] = { "binary": chromedriverPath };
        }

        const chromeOptions: Record<string, unknown> = {};

        if (mode === "headless") {
            chromeOptions["args"] = ["--headless", "--disable-gpu", "--no-sandbox"];
        }

        if (chromePath) {
            chromeOptions["binary"] = chromePath;
        }

        if (Object.keys(chromeOptions).length > 0) {
            capabilities["goog:chromeOptions"] = chromeOptions;
        }
    }
}
