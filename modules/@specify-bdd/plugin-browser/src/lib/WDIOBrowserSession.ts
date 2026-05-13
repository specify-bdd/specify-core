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
     * When `selector` is omitted, the active tab is closed. Accepts a 1-based
     * ordinal index or a tab name. Closing the last tab in the session causes
     * the browser process to terminate; the driver is set to `null` without
     * calling `deleteSession()`.
     *
     * @param selector - A 1-based tab index or tab name; omit to close the active tab
     */
    async closeTab(selector?: number | string): Promise<void> {
        const targetTab = selector === undefined ? this.#activeTab : this.#findTab(selector);

        assert.ok(targetTab, new AssertionError({ "message": "No active tab to close." }));

        const isActive    = targetTab === this.#activeTab;
        const closedIndex = this.#tabs.indexOf(targetTab);

        if (!isActive) {
            // switch to target, close it, then switch back to the active tab
            await this.#driver.switchToWindow(targetTab.handle);
            await this.#driver.closeWindow();
            await this.#driver.switchToWindow(this.#activeTab!.handle);
        } else {
            await this.#driver.closeWindow();
        }

        this.#tabs.splice(closedIndex, 1);

        if (isActive) {
            // prefer the tab just before the closed one; fall back to the new
            // first tab if the closed tab was the first, or null if none remain
            this.#activeTab = this.#tabs[closedIndex - 1] ?? this.#tabs[0] ?? null;

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
     * Find a tab by 1-based ordinal index or by name.
     *
     * @param selector - A 1-based index or a tab name
     *
     * @throws AssertionError If no tab matches the selector
     */
    #findTab(selector: number | string): TabMeta {
        if (typeof selector === "number") {
            const tab = this.#tabs[selector - 1];

            assert.ok(tab, new AssertionError({ "message": `No tab at position ${selector}.` }));

            return tab;
        }

        const tab = this.#tabs.find((t) => t.name === selector);

        assert.ok(tab, new AssertionError({ "message": `No tab named "${selector}".` }));

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
            case "chrome": {
                const chromedriverPath = process.env["CHROMEDRIVER_PATH"];

                if (chromedriverPath) {
                    capabilities["wdio:chromedriverOptions"] = { "binary": chromedriverPath };
                }

                if (mode === "headless") {
                    capabilities["goog:chromeOptions"] = {
                        "args": ["--headless", "--disable-gpu", "--no-sandbox"],
                    };
                }

                break;
            }

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
}
