/**
 * WDIO Browser Session Module
 *
 * A WebdriverIO-backed implementation of the BrowserSession interface,
 * using WDIO's standalone mode to manage browser lifecycle.
 */

import assert from "node:assert/strict";

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
